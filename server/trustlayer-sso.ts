import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { chatUsers, PASSWORD_REGEX } from "@shared/schema";
import { eq } from "drizzle-orm";

import crypto from "crypto";

function getJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (!getJwtSecret._fallback) {
    getJwtSecret._fallback = crypto.randomBytes(64).toString("hex");
    console.warn("[Trust Layer SSO] No JWT_SECRET env var set, using generated secret (tokens will not survive restarts)");
  }
  return getJwtSecret._fallback;
}
getJwtSecret._fallback = "" as string;

const JWT_SECRET = getJwtSecret();
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 capital letter" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 special character" };
  }
  return { valid: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTrustLayerId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `tl-${timestamp}-${random}`;
}

export function generateToken(userId: string, trustLayerId: string): string {
  return jwt.sign(
    { userId, trustLayerId, iss: "trust-layer-sso" },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): { userId: string; trustLayerId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, trustLayerId: decoded.trustLayerId };
  } catch {
    return null;
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  displayName: string
) {
  const validation = validatePassword(password);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email address" };
  }

  const [existingUsername] = await db.select().from(chatUsers).where(eq(chatUsers.username, username));
  if (existingUsername) {
    return { success: false, error: "Username already taken" };
  }

  const [existingEmail] = await db.select().from(chatUsers).where(eq(chatUsers.email, email));
  if (existingEmail) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await hashPassword(password);
  const trustLayerId = generateTrustLayerId();
  const colors = ["#ec4899", "#3b82f6", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444", "#10b981", "#f97316"];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const [user] = await db.insert(chatUsers).values({
    username,
    email,
    passwordHash,
    displayName,
    avatarColor,
    trustLayerId,
  }).returning();

  const token = generateToken(user.id, trustLayerId);

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarColor: user.avatarColor,
      role: user.role,
      trustLayerId: user.trustLayerId,
    },
    token,
  };
}

export async function loginUser(username: string, password: string) {
  const [user] = await db.select().from(chatUsers).where(eq(chatUsers.username, username));
  if (!user) {
    return { success: false, error: "Invalid username or password" };
  }

  const validPw = await verifyPassword(password, user.passwordHash);
  if (!validPw) {
    return { success: false, error: "Invalid username or password" };
  }

  await db.update(chatUsers)
    .set({ isOnline: true, lastSeen: new Date() })
    .where(eq(chatUsers.id, user.id));

  const token = generateToken(user.id, user.trustLayerId || "");

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarColor: user.avatarColor,
      role: user.role,
      trustLayerId: user.trustLayerId,
    },
    token,
  };
}

export async function authenticateToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const [user] = await db.select().from(chatUsers).where(eq(chatUsers.id, decoded.userId));
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    avatarColor: user.avatarColor,
    role: user.role,
    trustLayerId: user.trustLayerId,
  };
}
