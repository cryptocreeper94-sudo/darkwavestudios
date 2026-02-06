import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, Hash, Send, Users, ChevronLeft, MessageSquare, Wifi, WifiOff } from "lucide-react";
import { Link } from "wouter";

interface ChatChannel {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isDefault: boolean | null;
}

interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarColor: string;
  role: string;
  content: string;
  replyToId: string | null;
  createdAt: string;
}

interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  role: string;
}

export default function SignalChat() {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: channelsData } = useQuery<{ success: boolean; channels: ChatChannel[] }>({
    queryKey: ["/api/chat/channels"],
    enabled: !!currentUser,
  });

  const channels = channelsData?.channels || [];
  const ecosystemChannels = channels.filter(c => c.category === "ecosystem");
  const appChannels = channels.filter(c => c.category === "app-support");

  useEffect(() => {
    if (channels.length > 0 && !activeChannel) {
      const defaultChannel = channels.find(c => c.name === "general") || channels[0];
      setActiveChannel(defaultChannel);
    }
  }, [channels, activeChannel]);

  const connectWebSocket = useCallback(() => {
    if (!currentUser || !activeChannel) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        type: "join",
        userId: currentUser.id,
        channelId: activeChannel.id,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "history":
          setMessages(data.messages);
          break;
        case "message":
          setMessages(prev => [...prev, data]);
          break;
        case "typing":
          if (data.userId !== currentUser.id) {
            setTypingUsers(prev => {
              if (prev.includes(data.username)) return prev;
              return [...prev, data.username];
            });
            setTimeout(() => {
              setTypingUsers(prev => prev.filter(u => u !== data.username));
            }, 3000);
          }
          break;
        case "presence":
          setOnlineCount(data.onlineCount);
          break;
        case "user_joined":
        case "user_left":
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        if (currentUser && activeChannel) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = () => {
      setConnected(false);
    };
  }, [currentUser, activeChannel]);

  useEffect(() => {
    if (currentUser && activeChannel) {
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentUser, activeChannel?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchChannel = (channel: ChatChannel) => {
    setActiveChannel(channel);
    setMessages([]);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "switch_channel",
        channelId: channel.id,
      }));
    }
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "message",
      content: messageInput.trim(),
    }));
    setMessageInput("");
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  const handleLogin = async () => {
    if (!usernameInput.trim() || !displayNameInput.trim()) return;
    try {
      const res = await fetch("/api/chat/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim().toLowerCase().replace(/\s+/g, "-"),
          displayName: displayNameInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" data-testid="text-chat-title">Signal Chat</h1>
                <p className="text-xs text-cyan-400/70">Trust Layer Ecosystem</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">Join the ecosystem chat. Choose a display name to get started.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Username</label>
                <input
                  data-testid="input-chat-username"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  placeholder="e.g. sarah-k"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Display Name</label>
                <input
                  data-testid="input-chat-displayname"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  placeholder="e.g. Sarah K."
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button
                data-testid="button-chat-join"
                onClick={handleLogin}
                disabled={!usernameInput.trim() || !displayNameInput.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Join Chat
              </button>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors" data-testid="link-back-home">
                Back to DarkWave Studios
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a1a] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0f0f2a] border-b border-white/10">
        <button
          data-testid="button-toggle-sidebar"
          className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-white" data-testid="text-header-title">Signal Chat</h1>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-cyan-400/70">Trust Layer Ecosystem</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1">
              {connected ? (
                <><Wifi className="w-3 h-3 text-green-400" /><span className="text-green-400" data-testid="text-connection-status">Connected</span></>
              ) : (
                <><WifiOff className="w-3 h-3 text-red-400" /><span className="text-red-400" data-testid="text-connection-status">Reconnecting...</span></>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-300" data-testid="text-online-count">{onlineCount} online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-bold" style={{ background: currentUser.avatarColor }}>
              {getInitials(currentUser.displayName)}
            </div>
            <span className="text-xs text-gray-300" data-testid="text-current-user">{currentUser.displayName}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} lg:w-56 flex-shrink-0 transition-all duration-300 bg-[#0d0d24] border-r border-white/10 flex flex-col`}>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {ecosystemChannels.length > 0 && (
              <>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/60 px-2 pt-2 pb-1" data-testid="text-section-ecosystem">Ecosystem</div>
                {ecosystemChannels.map(ch => (
                  <button
                    key={ch.id}
                    data-testid={`button-channel-${ch.name}`}
                    onClick={() => switchChannel(ch)}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-all ${
                      activeChannel?.id === ch.id
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))}
              </>
            )}
            {appChannels.length > 0 && (
              <>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400/60 px-2 pt-4 pb-1" data-testid="text-section-support">App Support</div>
                {appChannels.map(ch => (
                  <button
                    key={ch.id}
                    data-testid={`button-channel-${ch.name}`}
                    onClick={() => switchChannel(ch)}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-all ${
                      activeChannel?.id === ch.id
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="p-3 border-t border-white/10">
            <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors" data-testid="link-back-home-sidebar">
              <ChevronLeft className="w-3 h-3" />
              Back to DarkWave Studios
            </Link>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Channel Header */}
          {activeChannel && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0f0f2a]/50 border-b border-white/10">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white" data-testid="text-active-channel">{activeChannel.name}</span>
              {activeChannel.description && (
                <>
                  <span className="text-gray-600">|</span>
                  <span className="text-xs text-gray-500">{activeChannel.description}</span>
                </>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" data-testid="container-messages">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-600 text-xs mt-1">Be the first to say something in #{activeChannel?.name}</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const showHeader = i === 0 || messages[i - 1].userId !== msg.userId ||
                new Date(msg.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() > 300000;
              return (
                <div key={msg.id} className={`group hover:bg-white/[0.02] rounded-lg px-2 ${showHeader ? "pt-3" : "pt-0.5"}`} data-testid={`message-${msg.id}`}>
                  {showHeader ? (
                    <div className="flex gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white font-bold shadow-md"
                        style={{ background: msg.avatarColor }}
                      >
                        {msg.role === "bot" ? "🤖" : getInitials(msg.username)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${msg.role === "bot" ? "text-green-400" : "text-white"}`}>{msg.username}</span>
                          {msg.role === "bot" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">BOT</span>
                          )}
                          {msg.role === "admin" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium">ADMIN</span>
                          )}
                          <span className="text-[11px] text-gray-500">{formatTime(msg.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-0.5 break-words">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-9 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 break-words">{msg.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {typingUsers.length > 0 && (
              <div className="px-2 pt-1">
                <span className="text-xs text-cyan-400/60 animate-pulse" data-testid="text-typing-indicator">
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 bg-[#0d0d24]/50">
            <div className="flex gap-2">
              <input
                data-testid="input-chat-message"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-500/40 focus:outline-none transition-colors"
                placeholder={`Message #${activeChannel?.name || "general"}...`}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                data-testid="button-send-message"
                onClick={sendMessage}
                disabled={!messageInput.trim() || !connected}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
