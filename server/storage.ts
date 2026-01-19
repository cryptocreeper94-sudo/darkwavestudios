import { 
  users, leads, subscribers, blogPosts, testimonials, caseStudies, quoteRequests, bookings, payments,
  pageViews, analyticsEvents, seoKeywords, conversations, messages,
  type User, type InsertUser,
  type Lead, type InsertLead,
  type Subscriber, type InsertSubscriber,
  type BlogPost, type InsertBlogPost,
  type Testimonial, type InsertTestimonial,
  type CaseStudy, type InsertCaseStudy,
  type QuoteRequest, type InsertQuoteRequest,
  type Booking, type InsertBooking,
  type Payment, type InsertPayment,
  type PageView, type InsertPageView,
  type AnalyticsEvent, type InsertAnalyticsEvent,
  type SeoKeyword, type InsertSeoKeyword,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLeadStatus(id: string, status: string): Promise<Lead | undefined>;

  // Subscribers
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  unsubscribe(email: string): Promise<void>;

  // Blog Posts
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  // Testimonials
  getTestimonials(approvedOnly?: boolean): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: string): Promise<Testimonial | undefined>;

  // Case Studies
  getCaseStudies(publishedOnly?: boolean): Promise<CaseStudy[]>;
  getCaseStudy(slug: string): Promise<CaseStudy | undefined>;
  createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, study: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined>;

  // Quote Requests
  getQuoteRequests(): Promise<QuoteRequest[]>;
  createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest>;
  updateQuoteStatus(id: string, status: string): Promise<QuoteRequest | undefined>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Payments
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByStripeSession(sessionId: string): Promise<Payment | undefined>;
  getPaymentByCoinbaseCharge(chargeId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, completedAt?: Date): Promise<Payment | undefined>;
  updatePaymentStripeIntent(id: string, paymentIntentId: string): Promise<Payment | undefined>;

  // Analytics - Page Views
  getPageViews(days?: number): Promise<PageView[]>;
  createPageView(view: InsertPageView): Promise<PageView>;
  getPageViewStats(days?: number): Promise<{totalViews: number; uniqueVisitors: number; topPages: {path: string; views: number}[]}>;

  // Analytics - Events
  getAnalyticsEvents(days?: number): Promise<AnalyticsEvent[]>;
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;

  // SEO Keywords
  getSeoKeywords(): Promise<SeoKeyword[]>;
  createSeoKeyword(keyword: InsertSeoKeyword): Promise<SeoKeyword>;
  updateSeoKeyword(id: string, data: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined>;
  deleteSeoKeyword(id: string): Promise<void>;

  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;

  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated || undefined;
  }

  // Subscribers
  async getSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers).where(eq(subscribers.subscribed, true)).orderBy(desc(subscribers.createdAt));
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSub] = await db.insert(subscribers).values(subscriber).returning();
    return newSub;
  }

  async unsubscribe(email: string): Promise<void> {
    await db.update(subscribers).set({ subscribed: false }).where(eq(subscribers.email, email));
  }

  // Blog Posts
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Testimonials
  async getTestimonials(approvedOnly = false): Promise<Testimonial[]> {
    if (approvedOnly) {
      return db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(desc(testimonials.createdAt));
    }
    return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async approveTestimonial(id: string): Promise<Testimonial | undefined> {
    const [updated] = await db.update(testimonials).set({ approved: true }).where(eq(testimonials.id, id)).returning();
    return updated || undefined;
  }

  // Case Studies
  async getCaseStudies(publishedOnly = false): Promise<CaseStudy[]> {
    if (publishedOnly) {
      return db.select().from(caseStudies).where(eq(caseStudies.published, true)).orderBy(desc(caseStudies.createdAt));
    }
    return db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));
  }

  async getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
    const [study] = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug));
    return study || undefined;
  }

  async createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy> {
    const [newStudy] = await db.insert(caseStudies).values(study).returning();
    return newStudy;
  }

  async updateCaseStudy(id: string, study: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    const [updated] = await db.update(caseStudies).set(study).where(eq(caseStudies.id, id)).returning();
    return updated || undefined;
  }

  // Quote Requests
  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  }

  async createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newQuote] = await db.insert(quoteRequests).values(quote).returning();
    return newQuote;
  }

  async updateQuoteStatus(id: string, status: string): Promise<QuoteRequest | undefined> {
    const [updated] = await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id)).returning();
    return updated || undefined;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return db.select().from(bookings).orderBy(desc(bookings.date));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updated || undefined;
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByStripeSession(sessionId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.stripeSessionId, sessionId));
    return payment || undefined;
  }

  async getPaymentByCoinbaseCharge(chargeId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.coinbaseChargeId, chargeId));
    return payment || undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePaymentStatus(id: string, status: string, completedAt?: Date): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set({ status, completedAt }).where(eq(payments.id, id)).returning();
    return updated || undefined;
  }

  async updatePaymentStripeIntent(id: string, paymentIntentId: string): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set({ stripePaymentIntentId: paymentIntentId }).where(eq(payments.id, id)).returning();
    return updated || undefined;
  }

  // Analytics - Page Views
  async getPageViews(days = 30): Promise<PageView[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return db.select().from(pageViews).where(gte(pageViews.createdAt, since)).orderBy(desc(pageViews.createdAt));
  }

  async createPageView(view: InsertPageView): Promise<PageView> {
    const [newView] = await db.insert(pageViews).values(view).returning();
    return newView;
  }

  async getPageViewStats(days = 30): Promise<{totalViews: number; uniqueVisitors: number; topPages: {path: string; views: number}[]}> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const views = await db.select().from(pageViews).where(gte(pageViews.createdAt, since));
    const uniqueVisitorIds = new Set(views.map(v => v.visitorId).filter(Boolean));
    
    const pageViewCounts: Record<string, number> = {};
    views.forEach(v => {
      pageViewCounts[v.path] = (pageViewCounts[v.path] || 0) + 1;
    });
    
    const topPages = Object.entries(pageViewCounts)
      .map(([path, viewCount]) => ({ path, views: viewCount }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      totalViews: views.length,
      uniqueVisitors: uniqueVisitorIds.size,
      topPages
    };
  }

  // Analytics - Events
  async getAnalyticsEvents(days = 30): Promise<AnalyticsEvent[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return db.select().from(analyticsEvents).where(gte(analyticsEvents.createdAt, since)).orderBy(desc(analyticsEvents.createdAt));
  }

  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }

  // SEO Keywords
  async getSeoKeywords(): Promise<SeoKeyword[]> {
    return db.select().from(seoKeywords).orderBy(desc(seoKeywords.createdAt));
  }

  async createSeoKeyword(keyword: InsertSeoKeyword): Promise<SeoKeyword> {
    const [newKeyword] = await db.insert(seoKeywords).values(keyword).returning();
    return newKeyword;
  }

  async updateSeoKeyword(id: string, data: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined> {
    const [updated] = await db.update(seoKeywords).set({ ...data, updatedAt: new Date() }).where(eq(seoKeywords.id, id)).returning();
    return updated || undefined;
  }

  async deleteSeoKeyword(id: string): Promise<void> {
    await db.delete(seoKeywords).where(eq(seoKeywords.id, id));
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createConversation(title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: string): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
