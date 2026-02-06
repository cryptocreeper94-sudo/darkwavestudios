import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { db } from "./db";
import { chatMessages, chatUsers, chatChannels } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

const MAX_MESSAGE_LENGTH = 2000;

interface ChatClient {
  ws: WebSocket;
  userId: string;
  username: string;
  avatarColor: string;
  role: string;
  channelId: string;
}

const clients: Map<WebSocket, ChatClient> = new Map();

async function fetchHistory(channelId: string) {
  const rows = await db
    .select({
      id: chatMessages.id,
      channelId: chatMessages.channelId,
      userId: chatMessages.userId,
      content: chatMessages.content,
      replyToId: chatMessages.replyToId,
      createdAt: chatMessages.createdAt,
      username: chatUsers.displayName,
      avatarColor: chatUsers.avatarColor,
      role: chatUsers.role,
    })
    .from(chatMessages)
    .leftJoin(chatUsers, eq(chatMessages.userId, chatUsers.id))
    .where(eq(chatMessages.channelId, channelId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(50);

  return rows.reverse().map(r => ({
    id: r.id,
    channelId: r.channelId,
    userId: r.userId,
    username: r.username || "Unknown",
    avatarColor: r.avatarColor || "#06b6d4",
    role: r.role || "member",
    content: r.content,
    replyToId: r.replyToId,
    createdAt: r.createdAt,
  }));
}

export function setupChatWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/chat" });

  wss.on("connection", (ws) => {
    ws.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        await handleMessage(ws, msg, wss);
      } catch (e) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
      }
    });

    ws.on("close", async () => {
      const client = clients.get(ws);
      if (client) {
        clients.delete(ws);
        const stillConnected = Array.from(clients.values()).some(c => c.userId === client.userId);
        if (!stillConnected) {
          await db.update(chatUsers)
            .set({ isOnline: false, lastSeen: new Date() })
            .where(eq(chatUsers.id, client.userId));
        }
        broadcastToChannel(wss, client.channelId, {
          type: "user_left",
          userId: client.userId,
          username: client.username,
        }, ws);
        broadcastPresence(wss);
      }
    });
  });

  return wss;
}

async function handleMessage(ws: WebSocket, msg: any, wss: WebSocketServer) {
  switch (msg.type) {
    case "join": {
      const { userId, channelId } = msg;
      if (!userId || !channelId) {
        ws.send(JSON.stringify({ type: "error", message: "userId and channelId required" }));
        return;
      }

      const [user] = await db.select().from(chatUsers).where(eq(chatUsers.id, userId));
      if (!user) {
        ws.send(JSON.stringify({ type: "error", message: "User not found" }));
        return;
      }

      const [channel] = await db.select().from(chatChannels).where(eq(chatChannels.id, channelId));
      if (!channel) {
        ws.send(JSON.stringify({ type: "error", message: "Channel not found" }));
        return;
      }

      await db.update(chatUsers)
        .set({ isOnline: true, lastSeen: new Date() })
        .where(eq(chatUsers.id, userId));

      clients.set(ws, {
        ws, userId,
        username: user.displayName,
        avatarColor: user.avatarColor,
        role: user.role,
        channelId,
      });

      const messages = await fetchHistory(channelId);
      ws.send(JSON.stringify({ type: "history", messages }));

      broadcastToChannel(wss, channelId, {
        type: "user_joined",
        userId,
        username: user.displayName,
      }, ws);

      broadcastPresence(wss);
      break;
    }

    case "switch_channel": {
      const client = clients.get(ws);
      if (!client || !msg.channelId) return;

      const [channel] = await db.select().from(chatChannels).where(eq(chatChannels.id, msg.channelId));
      if (!channel) {
        ws.send(JSON.stringify({ type: "error", message: "Channel not found" }));
        return;
      }

      client.channelId = msg.channelId;
      const messages = await fetchHistory(msg.channelId);
      ws.send(JSON.stringify({ type: "history", messages }));
      broadcastPresence(wss);
      break;
    }

    case "message": {
      const client = clients.get(ws);
      if (!client) return;

      const content = typeof msg.content === "string" ? msg.content.trim() : "";
      if (!content || content.length > MAX_MESSAGE_LENGTH) {
        ws.send(JSON.stringify({ type: "error", message: `Message must be 1-${MAX_MESSAGE_LENGTH} characters` }));
        return;
      }

      const [saved] = await db.insert(chatMessages).values({
        channelId: client.channelId,
        userId: client.userId,
        content,
        replyToId: msg.replyToId || null,
      }).returning();

      const outgoing = {
        type: "message",
        id: saved.id,
        channelId: saved.channelId,
        userId: client.userId,
        username: client.username,
        avatarColor: client.avatarColor,
        role: client.role,
        content: saved.content,
        replyToId: saved.replyToId,
        createdAt: saved.createdAt,
      };

      broadcastToChannel(wss, client.channelId, outgoing);
      break;
    }

    case "typing": {
      const client = clients.get(ws);
      if (!client) return;
      broadcastToChannel(wss, client.channelId, {
        type: "typing",
        userId: client.userId,
        username: client.username,
      }, ws);
      break;
    }
  }
}

function broadcastToChannel(wss: WebSocketServer, channelId: string, data: any, exclude?: WebSocket) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.channelId === channelId && client.ws !== exclude && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  });
}

function broadcastPresence(wss: WebSocketServer) {
  const uniqueUserIds = new Set<string>();
  const channelUsers: Record<string, string[]> = {};

  clients.forEach((client) => {
    uniqueUserIds.add(client.userId);
    if (!channelUsers[client.channelId]) channelUsers[client.channelId] = [];
    if (!channelUsers[client.channelId].includes(client.username)) {
      channelUsers[client.channelId].push(client.username);
    }
  });

  const payload = JSON.stringify({
    type: "presence",
    onlineCount: uniqueUserIds.size,
    channelUsers,
  });

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  });
}
