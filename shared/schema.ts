import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact Form Leads
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  budget: text("budget"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  status: text("status").default("new"),
  source: text("source").default("contact_form"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Newsletter Subscribers
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  subscribed: true,
  createdAt: true,
});
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  author: text("author").default("Jason"),
  category: text("category"),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5),
  image: text("image"),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  approved: true,
  createdAt: true,
});
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Case Studies
export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  client: text("client").notNull(),
  industry: text("industry"),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  testimonialQuote: text("testimonial_quote"),
  coverImage: text("cover_image"),
  gallery: text("gallery").array(),
  technologies: text("technologies").array(),
  metrics: text("metrics"),
  projectUrl: text("project_url"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
});
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;

// Quote Requests (from calculator)
export const quoteRequests = pgTable("quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type").notNull(),
  features: text("features").array(),
  timeline: text("timeline"),
  budget: text("budget"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  description: text("description"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

// Pulse API Access Requests
export const pulseRequests = pgTable("pulse_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  tier: text("tier").notNull(), // basic, pro, enterprise
  useCase: text("use_case").notNull(), // trading, analytics, forecasting, etc.
  expectedVolume: text("expected_volume"), // predictions per day/month
  integrationNeeds: text("integration_needs"), // API, webhook, white-label, etc.
  currentTools: text("current_tools"), // what they currently use
  timeline: text("timeline"), // when they need it
  budgetRange: text("budget_range"),
  additionalNotes: text("additional_notes"),
  status: text("status").default("new"), // new, contacted, qualified, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPulseRequestSchema = createInsertSchema(pulseRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertPulseRequest = z.infer<typeof insertPulseRequestSchema>;
export type PulseRequest = typeof pulseRequests.$inferSelect;

// Calendar Bookings
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  date: timestamp("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  type: text("type").default("discovery_call"),
  notes: text("notes"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("usd"),
  planType: text("plan_type").notNull(), // starter, growth, scale, custom
  planName: text("plan_name").notNull(),
  paymentMethod: text("payment_method").notNull(), // stripe, coinbase
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  coinbaseChargeId: text("coinbase_charge_id"),
  coinbaseChargeCode: text("coinbase_charge_code"),
  status: text("status").default("pending"), // pending, completed, failed, refunded
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  status: true,
  createdAt: true,
  completedAt: true,
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Analytics Page Views
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: text("path").notNull(),
  title: text("title"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  visitorId: text("visitor_id"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

// Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category"),
  label: text("label"),
  value: decimal("value", { precision: 10, scale: 2 }),
  sessionId: text("session_id"),
  visitorId: text("visitor_id"),
  path: text("path"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// SEO Keywords
export const seoKeywords = pgTable("seo_keywords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyword: text("keyword").notNull(),
  volume: integer("volume"),
  difficulty: integer("difficulty"),
  position: integer("position"),
  url: text("url"),
  clicks: integer("clicks"),
  impressions: integer("impressions"),
  ctr: decimal("ctr", { precision: 5, scale: 2 }),
  tracked: boolean("tracked").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSeoKeywordSchema = createInsertSchema(seoKeywords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSeoKeyword = z.infer<typeof insertSeoKeywordSchema>;
export type SeoKeyword = typeof seoKeywords.$inferSelect;

// AI Chat Conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// AI Chat Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Documents (Business Plan, Executive Summary, Roadmap)
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// ============ TRUST LAYER HUB ============

// Ecosystem Apps - Registered applications in the hub
export const ecosystemApps = pgTable("ecosystem_apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appName: text("app_name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  baseUrl: text("base_url"),
  logoUrl: text("logo_url"),
  permissions: text("permissions").array().default(sql`'{}'::text[]`),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEcosystemAppSchema = createInsertSchema(ecosystemApps).omit({
  id: true,
  isActive: true,
  isVerified: true,
  lastSync: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertEcosystemApp = z.infer<typeof insertEcosystemAppSchema>;
export type EcosystemApp = typeof ecosystemApps.$inferSelect;

// Code Snippets - Shared code and widgets
export const codeSnippets = pgTable("code_snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  language: text("language").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  authorAppId: varchar("author_app_id"),
  authorName: text("author_name"),
  version: text("version").default("1.0.0"),
  downloads: integer("downloads").default(0),
  likes: integer("likes").default(0),
  isPublic: boolean("is_public").default(true),
  isPremium: boolean("is_premium").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({
  id: true,
  downloads: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type CodeSnippet = typeof codeSnippets.$inferSelect;

// Snippet Categories
export const snippetCategories = pgTable("snippet_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  order: integer("order").default(0),
});

export const insertSnippetCategorySchema = createInsertSchema(snippetCategories).omit({
  id: true,
});
export type InsertSnippetCategory = z.infer<typeof insertSnippetCategorySchema>;
export type SnippetCategory = typeof snippetCategories.$inferSelect;

// Ecosystem Sync Logs
export const ecosystemLogs = pgTable("ecosystem_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appId: varchar("app_id"),
  appName: text("app_name"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: varchar("resource_id"),
  status: text("status").default("success"),
  message: text("message"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEcosystemLogSchema = createInsertSchema(ecosystemLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertEcosystemLog = z.infer<typeof insertEcosystemLogSchema>;
export type EcosystemLog = typeof ecosystemLogs.$inferSelect;

// ============ MARKETING HUB ============

// Marketing Posts for content library
export const marketingPosts = pgTable("marketing_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull().default('darkwave'),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  hashtags: text("hashtags").array(),
  imageFilename: varchar("image_filename", { length: 255 }),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMarketingPostSchema = createInsertSchema(marketingPosts).omit({
  id: true,
  usageCount: true,
  lastUsedAt: true,
  createdAt: true,
});
export type InsertMarketingPost = z.infer<typeof insertMarketingPostSchema>;
export type MarketingPost = typeof marketingPosts.$inferSelect;

// Marketing Images library
export const marketingImages = pgTable("marketing_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull().default('darkwave'),
  filename: varchar("filename", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMarketingImageSchema = createInsertSchema(marketingImages).omit({
  id: true,
  usageCount: true,
  lastUsedAt: true,
  createdAt: true,
});
export type InsertMarketingImage = z.infer<typeof insertMarketingImageSchema>;
export type MarketingImage = typeof marketingImages.$inferSelect;

// Meta (Facebook/Instagram) Integration
export const metaIntegrations = pgTable("meta_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull().unique(),
  facebookPageId: varchar("facebook_page_id", { length: 100 }),
  facebookPageName: varchar("facebook_page_name", { length: 255 }),
  facebookPageAccessToken: text("facebook_page_access_token"),
  facebookConnected: boolean("facebook_connected").default(false),
  instagramAccountId: varchar("instagram_account_id", { length: 100 }),
  instagramUsername: varchar("instagram_username", { length: 100 }),
  instagramConnected: boolean("instagram_connected").default(false),
  twitterApiKey: varchar("twitter_api_key", { length: 255 }),
  twitterApiSecret: varchar("twitter_api_secret", { length: 255 }),
  twitterAccessToken: varchar("twitter_access_token", { length: 255 }),
  twitterAccessTokenSecret: varchar("twitter_access_token_secret", { length: 255 }),
  twitterUsername: varchar("twitter_username", { length: 100 }),
  twitterConnected: boolean("twitter_connected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMetaIntegrationSchema = createInsertSchema(metaIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMetaIntegration = z.infer<typeof insertMetaIntegrationSchema>;
export type MetaIntegration = typeof metaIntegrations.$inferSelect;

// Scheduled Posts tracking
export const scheduledPosts = pgTable("scheduled_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  scheduledFor: timestamp("scheduled_for").notNull(),
  postedAt: timestamp("posted_at"),
  externalPostId: varchar("external_post_id", { length: 100 }),
  status: varchar("status", { length: 20 }).default('pending'),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({
  id: true,
  postedAt: true,
  externalPostId: true,
  error: true,
  createdAt: true,
});
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;

// Marketing Suite Subscriptions
export const marketingSubscriptions = pgTable("marketing_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  plan: varchar("plan", { length: 20 }).notNull(), // starter, professional, enterprise
  status: varchar("status", { length: 20 }).default('active'), // active, cancelled, past_due
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
  postsPerDay: integer("posts_per_day").default(7),
  platforms: text("platforms").array().default(sql`ARRAY['facebook', 'instagram']`),
  aiContentEnabled: boolean("ai_content_enabled").default(false),
  adBoostingEnabled: boolean("ad_boosting_enabled").default(false),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMarketingSubscriptionSchema = createInsertSchema(marketingSubscriptions).omit({
  id: true,
  status: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMarketingSubscription = z.infer<typeof insertMarketingSubscriptionSchema>;
export type MarketingSubscription = typeof marketingSubscriptions.$inferSelect;

// Post Analytics
export const postAnalytics = pgTable("post_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  postId: varchar("post_id", { length: 100 }),
  platform: varchar("platform", { length: 20 }).notNull(),
  externalPostId: varchar("external_post_id", { length: 100 }),
  impressions: integer("impressions").default(0),
  reach: integer("reach").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  clicks: integer("clicks").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const insertPostAnalyticsSchema = createInsertSchema(postAnalytics).omit({
  id: true,
  recordedAt: true,
});
export type InsertPostAnalytics = z.infer<typeof insertPostAnalyticsSchema>;
export type PostAnalytics = typeof postAnalytics.$inferSelect;

// Signal Chat - Ecosystem Communication
export const chatChannels = pgTable("chat_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull().default("ecosystem"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatChannelSchema = createInsertSchema(chatChannels).omit({
  id: true,
  createdAt: true,
});
export type InsertChatChannel = z.infer<typeof insertChatChannelSchema>;
export type ChatChannel = typeof chatChannels.$inferSelect;

export const chatUsers = pgTable("chat_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  avatarColor: text("avatar_color").notNull().default("#06b6d4"),
  role: text("role").notNull().default("member"),
  trustLayerId: text("trust_layer_id").unique(),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  adFreeSubscription: boolean("ad_free_subscription").default(false),
  adFreeExpiresAt: timestamp("ad_free_expires_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatUserSchema = createInsertSchema(chatUsers).omit({
  id: true,
  isOnline: true,
  lastSeen: true,
  createdAt: true,
  trustLayerId: true,
  adFreeSubscription: true,
  adFreeExpiresAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});
export type InsertChatUser = z.infer<typeof insertChatUserSchema>;
export type ChatUser = typeof chatUsers.$inferSelect;

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
export const PASSWORD_REQUIREMENTS = "Minimum 8 characters, at least 1 capital letter and 1 special character";

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  replyToId: varchar("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Guardian AI Scans
export const guardianScans = pgTable("guardian_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentName: text("agent_name").notNull(),
  agentUrl: text("agent_url").notNull(),
  contactEmail: text("contact_email"),
  scanType: text("scan_type").default("quick"),
  status: text("status").default("pending"),
  securityScore: integer("security_score"),
  transparencyScore: integer("transparency_score"),
  reliabilityScore: integer("reliability_score"),
  complianceScore: integer("compliance_score"),
  overallScore: integer("overall_score"),
  grade: text("grade"),
  findings: text("findings"),
  recommendations: text("recommendations"),
  riskLevel: text("risk_level"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuardianScanSchema = createInsertSchema(guardianScans).omit({
  id: true,
  createdAt: true,
});
export type InsertGuardianScan = z.infer<typeof insertGuardianScanSchema>;
export type GuardianScan = typeof guardianScans.$inferSelect;

// Widget & Snippet Purchases
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripeSessionId: text("stripe_session_id"),
  coinbaseChargeId: text("coinbase_charge_id"),
  customerEmail: text("customer_email").notNull(),
  items: text("items").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending"),
  downloadToken: text("download_token").notNull(),
  downloadCount: integer("download_count").default(0),
  paymentMethod: text("payment_method").default("stripe"),
  createdAt: timestamp("created_at").defaultNow(),
  fulfilledAt: timestamp("fulfilled_at"),
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  fulfilledAt: true,
});
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;
