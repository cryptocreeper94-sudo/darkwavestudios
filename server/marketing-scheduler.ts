import { db } from "./db";
import { scheduledPosts, marketingPosts, metaIntegrations, marketingSubscriptions } from "@shared/schema";
import { eq, lte, and, gte, sql } from "drizzle-orm";
import { TwitterConnector, postToFacebook, postToInstagram } from "./social-connectors";

const POST_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function generatePostSlots(postsPerDay: number): { hour: number; minute: number }[] {
  const slots: { hour: number; minute: number }[] = [];
  const hoursAvailable = POST_HOURS.length;
  
  if (postsPerDay <= hoursAvailable) {
    const selectedHours = POST_HOURS.slice(0, postsPerDay);
    for (const hour of selectedHours) {
      slots.push({ hour, minute: Math.floor(Math.random() * 30) });
    }
  } else {
    const postsPerHour = Math.ceil(postsPerDay / hoursAvailable);
    for (const hour of POST_HOURS) {
      for (let i = 0; i < postsPerHour && slots.length < postsPerDay; i++) {
        const minute = Math.floor((60 / postsPerHour) * i) + Math.floor(Math.random() * 10);
        slots.push({ hour, minute: Math.min(minute, 59) });
      }
    }
  }
  return slots;
}

async function getRandomPost(tenantId: string): Promise<{ content: string; imageFilename: string | null } | null> {
  const posts = await db.select()
    .from(marketingPosts)
    .where(and(
      eq(marketingPosts.tenantId, tenantId),
      eq(marketingPosts.isActive, true)
    ));
  
  if (posts.length === 0) return null;
  
  const post = posts[Math.floor(Math.random() * posts.length)];
  
  await db.update(marketingPosts)
    .set({ 
      usageCount: sql`${marketingPosts.usageCount} + 1`,
      lastUsedAt: new Date()
    })
    .where(eq(marketingPosts.id, post.id));

  return { content: post.content, imageFilename: post.imageFilename };
}

async function executePost(tenantId: string, platform: string, content: string, imageUrl?: string): Promise<{ success: boolean; externalId?: string; error?: string }> {
  const [integration] = await db.select()
    .from(metaIntegrations)
    .where(eq(metaIntegrations.tenantId, tenantId));

  if (!integration) {
    return { success: false, error: "No integration configured" };
  }

  if (platform === 'facebook' && integration.facebookConnected && integration.facebookPageId) {
    return await postToFacebook(
      integration.facebookPageId,
      integration.facebookPageAccessToken!,
      content,
      imageUrl
    );
  }

  if (platform === 'x' && integration.twitterConnected) {
    const twitter = new TwitterConnector();
    if (twitter.isConfigured()) {
      const truncated = content.length > 280 ? content.substring(0, 277) + '...' : content;
      return await twitter.post(truncated);
    }
  }

  if (platform === 'instagram' && integration.instagramConnected && integration.instagramAccountId && imageUrl) {
    return await postToInstagram(
      integration.instagramAccountId,
      integration.facebookPageAccessToken!,
      content,
      imageUrl
    );
  }

  return { success: false, error: `Platform ${platform} not connected` };
}

async function processScheduledPosts(): Promise<void> {
  const now = new Date();
  
  const pendingPosts = await db.select()
    .from(scheduledPosts)
    .where(and(
      lte(scheduledPosts.scheduledFor, now),
      eq(scheduledPosts.status, 'pending')
    ));

  for (const post of pendingPosts) {
    try {
      const result = await executePost(post.tenantId, post.platform, post.content, post.imageUrl || undefined);
      
      await db.update(scheduledPosts)
        .set({
          status: result.success ? 'posted' : 'failed',
          postedAt: result.success ? new Date() : null,
          externalPostId: result.externalId || null,
          error: result.error || null
        })
        .where(eq(scheduledPosts.id, post.id));

      console.log(`[Scheduler] Post ${post.id} - ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.error || result.externalId}`);
    } catch (error: any) {
      await db.update(scheduledPosts)
        .set({ status: 'failed', error: error.message })
        .where(eq(scheduledPosts.id, post.id));
      console.error(`[Scheduler] Post ${post.id} error:`, error.message);
    }
  }
}

async function generateDailyPosts(): Promise<void> {
  const subscriptions = await db.select()
    .from(marketingSubscriptions)
    .where(eq(marketingSubscriptions.status, 'active'));

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const currentHour = now.getHours();

  for (const sub of subscriptions) {
    const existingToday = await db.select()
      .from(scheduledPosts)
      .where(and(
        eq(scheduledPosts.tenantId, sub.tenantId),
        gte(scheduledPosts.scheduledFor, today),
        lte(scheduledPosts.scheduledFor, tomorrow)
      ));

    if (existingToday.length > 0) {
      console.log(`[Scheduler] ${sub.tenantId} already has ${existingToday.length} posts scheduled today, skipping`);
      continue;
    }

    const slots = generatePostSlots(sub.postsPerDay || 7);
    const futureSlots = slots.filter(s => s.hour > currentHour);
    const platforms = (sub.platforms || ['facebook', 'x']) as string[];

    for (const slot of futureSlots) {
      const scheduledFor = new Date(today);
      scheduledFor.setHours(slot.hour, slot.minute, 0, 0);

      const post = await getRandomPost(sub.tenantId);
      if (!post) continue;

      for (const platform of platforms) {
        if (platform === 'instagram' && !post.imageFilename) {
          continue;
        }

        await db.insert(scheduledPosts).values({
          tenantId: sub.tenantId,
          platform,
          content: post.content,
          imageUrl: post.imageFilename,
          scheduledFor,
          status: 'pending'
        });
      }
    }

    console.log(`[Scheduler] Generated ${futureSlots.length} post slots for ${sub.tenantId}`);
  }

  console.log(`[Scheduler] Daily generation complete for ${subscriptions.length} subscriptions`);
}

let schedulerInterval: NodeJS.Timeout | null = null;
let dailyInterval: NodeJS.Timeout | null = null;

export function startMarketingScheduler(): void {
  if (schedulerInterval) return;

  console.log('[Scheduler] Marketing scheduler started');

  schedulerInterval = setInterval(async () => {
    try {
      await processScheduledPosts();
    } catch (error) {
      console.error('[Scheduler] Error processing posts:', error);
    }
  }, 60000);

  dailyInterval = setInterval(async () => {
    try {
      await generateDailyPosts();
    } catch (error) {
      console.error('[Scheduler] Error generating daily posts:', error);
    }
  }, 3600000);

  processScheduledPosts();
  generateDailyPosts();
}

export function stopMarketingScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  if (dailyInterval) {
    clearInterval(dailyInterval);
    dailyInterval = null;
  }
  console.log('[Scheduler] Marketing scheduler stopped');
}
