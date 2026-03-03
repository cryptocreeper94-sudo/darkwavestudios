import { createHash, randomBytes } from "crypto";
import { db } from "./db";
import { hallmarks, trustStamps, hallmarkCounter } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function simulatedTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

function simulatedBlockHeight(): string {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

export async function generateHallmark(params: {
  userId?: string;
  appId?: string;
  appName?: string;
  productName?: string;
  releaseType?: string;
  metadata?: string;
}) {
  const result = await db
    .insert(hallmarkCounter)
    .values({ id: "ds-master", currentSequence: "1" })
    .onConflictDoUpdate({
      target: hallmarkCounter.id,
      set: {
        currentSequence: sql`(CAST(${hallmarkCounter.currentSequence} AS integer) + 1)::text`,
      },
    })
    .returning();

  const sequence = parseInt(result[0].currentSequence, 10);
  const thId = `DS-${String(sequence).padStart(8, "0")}`;

  const payload = JSON.stringify({
    thId,
    appId: params.appId,
    appName: params.appName,
    productName: params.productName,
    releaseType: params.releaseType,
    metadata: params.metadata,
    timestamp: new Date().toISOString(),
  });

  const dataHash = sha256(payload);
  const txHash = simulatedTxHash();
  const blockHeight = simulatedBlockHeight();
  const verificationUrl = `https://darkwavestudios.io/hallmark/${thId}/verify`;

  const [hallmark] = await db
    .insert(hallmarks)
    .values({
      thId,
      userId: params.userId ?? null,
      appId: params.appId ?? null,
      appName: params.appName ?? null,
      productName: params.productName ?? null,
      releaseType: params.releaseType ?? null,
      metadata: params.metadata ?? null,
      dataHash,
      txHash,
      blockHeight,
      verificationUrl,
      hallmarkId: sequence,
    })
    .returning();

  return hallmark;
}

export async function createTrustStamp(params: {
  userId?: string;
  category: string;
  data?: string;
}) {
  const payload = JSON.stringify({
    category: params.category,
    data: params.data,
    timestamp: new Date().toISOString(),
  });

  const dataHash = sha256(payload);
  const txHash = simulatedTxHash();
  const blockHeight = simulatedBlockHeight();

  const [stamp] = await db
    .insert(trustStamps)
    .values({
      userId: params.userId ?? null,
      category: params.category,
      data: params.data ?? null,
      dataHash,
      txHash,
      blockHeight,
    })
    .returning();

  return stamp;
}

export async function seedGenesisHallmark() {
  const existing = await db
    .select()
    .from(hallmarks)
    .where(eq(hallmarks.thId, "DS-00000001"))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db
    .insert(hallmarkCounter)
    .values({ id: "ds-master", currentSequence: "0" })
    .onConflictDoUpdate({
      target: hallmarkCounter.id,
      set: { currentSequence: "0" },
    });

  const genesisMetadata = JSON.stringify({
    ecosystem: "Trust Layer",
    version: "1.0.0",
    domain: "darkwavestudio.tlid.io",
    operator: "DarkWave Studios LLC",
    chain: "Trust Layer Blockchain",
    consensus: "Proof of Trust",
    launchDate: "2026-08-23T00:00:00.000Z",
    nativeAsset: "SIG",
    utilityToken: "Shells",
    parentApp: "Trust Layer Hub",
    parentGenesis: "TH-00000001",
  });

  return generateHallmark({
    appId: "darkwave-studio-genesis",
    appName: "DarkWave Studio",
    productName: "Genesis Block",
    releaseType: "genesis",
    metadata: genesisMetadata,
  });
}

export async function verifyHallmark(hallmarkId: string) {
  const [hallmark] = await db
    .select()
    .from(hallmarks)
    .where(eq(hallmarks.thId, hallmarkId))
    .limit(1);

  if (!hallmark) {
    return { verified: false, hallmark: null };
  }

  return { verified: true, hallmark };
}
