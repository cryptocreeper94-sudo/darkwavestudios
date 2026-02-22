import { db } from "./db";
import { chatChannels, chatUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { hashPassword, generateTrustLayerId } from "./trustlayer-sso";

const ECOSYSTEM_CHANNELS = [
  { name: "general", description: "Ecosystem-wide discussion", category: "ecosystem", isDefault: true },
  { name: "announcements", description: "Official updates from Trust Layer ecosystem", category: "ecosystem", isDefault: true },
];

const APP_CHANNELS = [
  { name: "darkwavestudios-support", description: "DarkWave Studios customer support", category: "app-support", isDefault: false },
  { name: "garagebot-support", description: "GarageBot customer support", category: "app-support", isDefault: false },
  { name: "tlid-marketing", description: "TLId Marketing Suite support", category: "app-support", isDefault: false },
  { name: "guardian-ai", description: "Guardian AI certification discussion", category: "app-support", isDefault: false },
];

export async function seedChatChannels() {
  try {
    const existing = await db.select().from(chatChannels);
    if (existing.length > 0) {
      console.log(`[Chat Seed] Found ${existing.length} existing channels, skipping seed`);
    } else {
      const allChannels = [...ECOSYSTEM_CHANNELS, ...APP_CHANNELS];
      for (const ch of allChannels) {
        await db.insert(chatChannels).values(ch).onConflictDoNothing();
      }
      console.log(`[Chat Seed] Created ${allChannels.length} channels`);
    }

    const existingBot = await db.select().from(chatUsers).where(eq(chatUsers.username, "signalbot"));
    if (existingBot.length === 0) {
      const botPasswordHash = await hashPassword("SignalBot!2024");
      await db.insert(chatUsers).values({
        username: "signalbot",
        email: "signalbot@trustlayer.io",
        passwordHash: botPasswordHash,
        displayName: "SignalBot",
        avatarColor: "#10b981",
        role: "bot",
        trustLayerId: generateTrustLayerId(),
      });
      console.log("[Chat Seed] Created SignalBot user");
    }

    const ecosystemMembers = [
      { firstName: "Kathy", lastName: "Nguyen", email: "kathy@happyeats.io", password: "HappyEats@2025", pin: "7724", trustLayerId: "tl-kathy-he01", ecosystemApp: "Happy Eats" },
      { firstName: "Marcus", lastName: "Chen", email: "marcus@trusthome.io", password: "TrustHome@2025", pin: "4419", trustLayerId: "tl-marc-th01", ecosystemApp: "TrustHome" },
      { firstName: "Devon", lastName: "Park", email: "devon@signal.dw", password: "Signal@2025", pin: "8832", trustLayerId: "tl-devn-sg01", ecosystemApp: "Signal" },
    ];

    for (const m of ecosystemMembers) {
      const [existing] = await db.select().from(chatUsers).where(eq(chatUsers.email, m.email));
      if (!existing) {
        const passwordHash = await hashPassword(m.password);
        const pinHash = await hashPassword(m.pin);
        await db.insert(chatUsers).values({
          username: `${m.firstName.toLowerCase()}-${m.lastName.toLowerCase()}`,
          email: m.email,
          passwordHash,
          displayName: `${m.firstName} ${m.lastName}`,
          avatarColor: ["#ec4899", "#3b82f6", "#8b5cf6"][ecosystemMembers.indexOf(m)],
          role: "member",
          trustLayerId: m.trustLayerId,
          ecosystemPinHash: pinHash,
          ecosystemApp: m.ecosystemApp,
        });
        console.log(`[Chat Seed] Created ecosystem member: ${m.firstName} ${m.lastName} (${m.ecosystemApp})`);
      }
    }
  } catch (error) {
    console.error("[Chat Seed] Error:", error);
  }
}
