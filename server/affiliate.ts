import { db } from "./db";
import { eq, and, sql, desc } from "drizzle-orm";
import {
  users,
  affiliateReferrals,
  affiliateCommissions,
  trustStamps,
} from "@shared/schema";
import { createHash, randomBytes } from "crypto";

interface TierInfo {
  name: string;
  rate: number;
  minReferrals: number;
}

const TIERS: TierInfo[] = [
  { name: "diamond", rate: 0.20, minReferrals: 50 },
  { name: "platinum", rate: 0.175, minReferrals: 30 },
  { name: "gold", rate: 0.15, minReferrals: 15 },
  { name: "silver", rate: 0.125, minReferrals: 5 },
  { name: "base", rate: 0.10, minReferrals: 0 },
];

const ECOSYSTEM_REGISTRY = [
  { app: "Trust Layer Hub", domain: "trusthub.tlid.io", prefix: "TH" },
  { app: "Trust Layer (L1)", domain: "dwtl.io", prefix: "TL" },
  { app: "TrustHome", domain: "trusthome.tlid.io", prefix: "TR" },
  { app: "TrustVault", domain: "trustvault.tlid.io", prefix: "TV" },
  { app: "TLID.io", domain: "tlid.io", prefix: "TI" },
  { app: "THE VOID", domain: "thevoid.tlid.io", prefix: "VO" },
  { app: "Signal Chat", domain: "signalchat.tlid.io", prefix: "SC" },
  { app: "DarkWave Studio", domain: "darkwavestudio.tlid.io", prefix: "DS" },
  { app: "Guardian Shield", domain: "guardianshield.tlid.io", prefix: "GS" },
  { app: "Guardian Scanner", domain: "guardianscanner.tlid.io", prefix: "GN" },
  { app: "Guardian Screener", domain: "guardianscreener.tlid.io", prefix: "GR" },
  { app: "TradeWorks AI", domain: "tradeworks.tlid.io", prefix: "TW" },
  { app: "StrikeAgent", domain: "strikeagent.tlid.io", prefix: "SA" },
  { app: "Pulse", domain: "pulse.tlid.io", prefix: "PU" },
  { app: "Chronicles", domain: "chronicles.tlid.io", prefix: "CH" },
  { app: "The Arcade", domain: "thearcade.tlid.io", prefix: "AR" },
  { app: "Bomber", domain: "bomber.tlid.io", prefix: "BO" },
  { app: "Trust Golf", domain: "trustgolf.tlid.io", prefix: "TG" },
  { app: "ORBIT Staffing OS", domain: "orbit.tlid.io", prefix: "OR" },
  { app: "Orby Commander", domain: "orby.tlid.io", prefix: "OC" },
  { app: "GarageBot", domain: "garagebot.tlid.io", prefix: "GB" },
  { app: "Lot Ops Pro", domain: "lotops.tlid.io", prefix: "LO" },
  { app: "TORQUE", domain: "torque.tlid.io", prefix: "TQ" },
  { app: "TL Driver Connect", domain: "driverconnect.tlid.io", prefix: "DC" },
  { app: "VedaSolus", domain: "vedasolus.tlid.io", prefix: "VS" },
  { app: "Verdara", domain: "verdara.tlid.io", prefix: "VD" },
  { app: "Arbora", domain: "arbora.tlid.io", prefix: "AB" },
  { app: "PaintPros", domain: "paintpros.tlid.io", prefix: "PP" },
  { app: "Nashville Painting Professionals", domain: "nashvillepainting.tlid.io", prefix: "NP" },
  { app: "Trust Book", domain: "trustbook.tlid.io", prefix: "TB" },
  { app: "DarkWave Academy", domain: "darkwaveacademy.tlid.io", prefix: "DA" },
  { app: "Happy Eats", domain: "happyeats.tlid.io", prefix: "HE" },
  { app: "Brew & Board Coffee", domain: "brewandboard.tlid.io", prefix: "BB" },
  { app: "TrustGen", domain: "trustgen.tlid.io", prefix: "TN" },
  { app: "Lume", domain: "lume-lang.org", prefix: "LM" },
];

function buildCrossPlatformLinks(hash: string) {
  return ECOSYSTEM_REGISTRY
    .filter(e => e.prefix !== "DS")
    .map(e => ({ app: e.app, domain: e.domain, prefix: e.prefix, url: `https://${e.domain}/ref/${hash}` }));
}

export function calculateTier(convertedCount: number): TierInfo {
  for (const tier of TIERS) {
    if (convertedCount >= tier.minReferrals) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

export async function getAffiliateDashboard(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw new Error("User not found");
  }

  const allReferrals = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.referrerId, userId))
    .orderBy(desc(affiliateReferrals.createdAt));

  const allCommissions = await db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.referrerId, userId))
    .orderBy(desc(affiliateCommissions.createdAt));

  const totalReferrals = allReferrals.length;
  const convertedCount = allReferrals.filter((r) => r.status === "converted").length;
  const tier = calculateTier(convertedCount);

  const pendingEarnings = allCommissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const paidEarnings = allCommissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const referralLink = user.uniqueHash
    ? `https://darkwavestudio.tlid.io/ref/${user.uniqueHash}`
    : null;

  const crossPlatformLinks = user.uniqueHash
    ? buildCrossPlatformLinks(user.uniqueHash)
    : [];

  return {
    userId,
    tier,
    totalReferrals,
    convertedCount,
    pendingEarnings: pendingEarnings.toFixed(2),
    paidEarnings: paidEarnings.toFixed(2),
    referralLink,
    crossPlatformLinks,
    recentReferrals: allReferrals.slice(0, 10),
    recentCommissions: allCommissions.slice(0, 10),
  };
}

export async function getAffiliateLink(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.uniqueHash) {
    const hash = randomBytes(8).toString("hex");
    await db.update(users).set({ uniqueHash: hash }).where(eq(users.id, userId));
    return {
      referralLink: `https://darkwavestudio.tlid.io/ref/${hash}`,
      uniqueHash: hash,
      crossPlatformLinks: buildCrossPlatformLinks(hash),
    };
  }

  return {
    referralLink: `https://darkwavestudio.tlid.io/ref/${user.uniqueHash}`,
    uniqueHash: user.uniqueHash,
    crossPlatformLinks: buildCrossPlatformLinks(user.uniqueHash),
  };
}

export async function trackReferral(referralHash: string, platform: string = "darkwave-studio") {
  const [referrer] = await db
    .select()
    .from(users)
    .where(eq(users.uniqueHash, referralHash));

  if (!referrer) {
    throw new Error("Invalid referral link");
  }

  const [referral] = await db
    .insert(affiliateReferrals)
    .values({
      referrerId: referrer.id,
      referralHash,
      platform,
    })
    .returning();

  return referral;
}

export async function convertReferral(referralId: number, referredUserId: string) {
  const [updated] = await db
    .update(affiliateReferrals)
    .set({
      status: "converted",
      referredUserId,
      convertedAt: new Date(),
    })
    .where(eq(affiliateReferrals.id, referralId))
    .returning();

  return updated;
}

export async function createCommission(
  referralId: number,
  referrerId: string,
  transactionAmount: number
) {
  const allReferrals = await db
    .select()
    .from(affiliateReferrals)
    .where(
      and(
        eq(affiliateReferrals.referrerId, referrerId),
        eq(affiliateReferrals.status, "converted")
      )
    );

  const tier = calculateTier(allReferrals.length);
  const commissionAmount = (transactionAmount * tier.rate).toFixed(2);

  const [commission] = await db
    .insert(affiliateCommissions)
    .values({
      referrerId,
      referralId,
      amount: commissionAmount,
      currency: "SIG",
      tier: tier.name,
    })
    .returning();

  return commission;
}

export async function requestPayout(userId: string) {
  const pendingCommissions = await db
    .select()
    .from(affiliateCommissions)
    .where(
      and(
        eq(affiliateCommissions.referrerId, userId),
        eq(affiliateCommissions.status, "pending")
      )
    );

  const totalPending = pendingCommissions.reduce(
    (sum, c) => sum + parseFloat(c.amount),
    0
  );

  if (totalPending < 10) {
    throw new Error(
      `Minimum payout is 10 SIG. Current pending balance: ${totalPending.toFixed(2)} SIG`
    );
  }

  const commissionIds = pendingCommissions.map((c) => c.id);

  for (const id of commissionIds) {
    await db
      .update(affiliateCommissions)
      .set({ status: "processing" })
      .where(eq(affiliateCommissions.id, id));
  }

  const stampPayload = JSON.stringify({
    type: "payout_request",
    userId,
    amount: totalPending.toFixed(2),
    currency: "SIG",
    commissionCount: commissionIds.length,
    requestedAt: new Date().toISOString(),
  });

  const dataHash = createHash("sha256").update(stampPayload).digest("hex");
  const txHash = "0x" + randomBytes(32).toString("hex");
  const blockHeight = String(Math.floor(1000000 + Math.random() * 9000000));

  await db.insert(trustStamps).values({
    userId,
    category: "payout_request",
    data: stampPayload,
    dataHash,
    txHash,
    blockHeight,
  });

  return {
    success: true,
    amount: totalPending.toFixed(2),
    currency: "SIG",
    commissionsProcessing: commissionIds.length,
    message: `Payout of ${totalPending.toFixed(2)} SIG is being processed`,
  };
}
