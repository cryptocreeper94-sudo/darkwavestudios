import { verifyToken } from "./trustlayer-sso";

const TRUSTVAULT_BASE_URL = "https://trustvault.replit.app";
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(userId);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function trustVaultFetch(
  path: string,
  token: string,
  options: { method?: string; body?: any } = {}
) {
  const decoded = verifyToken(token);
  if (!decoded) {
    return { ok: false, status: 401, data: { error: "Invalid or expired token" } };
  }

  if (!checkRateLimit(decoded.userId)) {
    return { ok: false, status: 429, data: { error: "Rate limit exceeded (60 req/min)" } };
  }

  try {
    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (options.body && options.method !== "GET") {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const url = `${TRUSTVAULT_BASE_URL}${path}`;
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => ({}));

    return { ok: response.ok, status: response.status, data };
  } catch (error: any) {
    console.error("[TrustVault Client]", error.message);
    return { ok: false, status: 502, data: { error: "Failed to connect to TrustVault" } };
  }
}

export async function getCapabilities() {
  try {
    const response = await fetch(`${TRUSTVAULT_BASE_URL}/api/studio/capabilities`);
    const data = await response.json();
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, data: { error: "TrustVault unavailable" } };
  }
}

const VALID_WEBHOOK_EVENTS = ["render.started", "render.complete", "render.failed"];

export function validateWebhookPayload(body: any): { valid: boolean; error?: string } {
  if (!body.event || !body.projectId || !body.userId || !body.trustLayerId) {
    return { valid: false, error: "Missing required fields" };
  }
  if (!VALID_WEBHOOK_EVENTS.includes(body.event)) {
    return { valid: false, error: `Invalid event type: ${body.event}` };
  }
  return { valid: true };
}

interface WebhookEvent {
  event: string;
  projectId: string;
  status: string;
  downloadUrl?: string;
  userId: string;
  trustLayerId: string;
  timestamp: string;
}

const webhookEvents: WebhookEvent[] = [];

export function storeWebhookEvent(event: WebhookEvent) {
  webhookEvents.unshift(event);
  if (webhookEvents.length > 100) webhookEvents.pop();
}

export function getWebhookEvents(userId?: string): WebhookEvent[] {
  if (userId) return webhookEvents.filter(e => e.userId === userId);
  return [...webhookEvents];
}
