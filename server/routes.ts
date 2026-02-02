import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertSubscriberSchema, insertQuoteRequestSchema, insertPulseRequestSchema, insertBookingSchema, insertTestimonialSchema, insertPaymentSchema, insertPageViewSchema, insertAnalyticsEventSchema, insertSeoKeywordSchema, insertBlogPostSchema, insertDocumentSchema, insertEcosystemAppSchema, insertCodeSnippetSchema, insertSnippetCategorySchema, insertEcosystemLogSchema } from "@shared/schema";
import crypto from "crypto";
import { notifyNewLead, notifyNewQuote, notifyNewBooking, notifyNewPulseRequest } from "./sms";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { getOrbitClient, syncPaymentToOrbit } from "./orbitClient";
import { z } from "zod";
import OpenAI from "openai";
import widgetRoutes from "./widgets/widget-routes";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "0424";

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-admin-key"] || req.query.adminKey;
  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ success: false, error: "Unauthorized - Admin access required" });
  }
  next();
};

// Validation schemas for payment routes
const paymentCheckoutSchema = z.object({
  planType: z.enum(["starter", "growth", "scale", "custom_landing", "custom_business", "custom_ecommerce", "custom_saas"]),
  customerName: z.string().min(1, "Name is required").max(100),
  customerEmail: z.string().email("Valid email required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// Service plans configuration
const SERVICE_PLANS = {
  starter: { name: "Starter Plan", price: 99, priceId: "starter_monthly" },
  growth: { name: "Growth Plan", price: 199, priceId: "growth_monthly" },
  scale: { name: "Scale Plan", price: 399, priceId: "scale_monthly" },
  custom_landing: { name: "Custom Landing Page", price: 997, priceId: "landing_page" },
  custom_business: { name: "Business Website", price: 1997, priceId: "business_site" },
  custom_ecommerce: { name: "E-Commerce Platform", price: 3997, priceId: "ecommerce" },
  custom_saas: { name: "SaaS Application", price: 4997, priceId: "saas_app" },
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============ LEADS / CONTACT FORM ============
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      
      notifyNewLead(data.name, data.email, data.projectType || undefined);
      
      res.status(201).json({ success: true, lead });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, leads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/leads/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const lead = await storage.updateLeadStatus(req.params.id, status);
      if (!lead) {
        return res.status(404).json({ success: false, error: "Lead not found" });
      }
      res.json({ success: true, lead });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ NEWSLETTER SUBSCRIBERS ============
  app.post("/api/subscribers", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(data);
      res.status(201).json({ success: true, subscriber });
    } catch (error: any) {
      if (error.message?.includes("unique")) {
        res.status(400).json({ success: false, error: "Email already subscribed" });
      } else {
        res.status(400).json({ success: false, error: error.message });
      }
    }
  });

  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json({ success: true, subscribers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/subscribers/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      await storage.unsubscribe(email);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ QUOTE REQUESTS ============
  app.post("/api/quotes", async (req, res) => {
    try {
      const data = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(data);
      
      notifyNewQuote(data.name, data.projectType, data.estimatedCost?.toString() || "TBD");
      
      res.status(201).json({ success: true, quote });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuoteRequests();
      res.json({ success: true, quotes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/quotes/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const quote = await storage.updateQuoteStatus(req.params.id, status);
      if (!quote) {
        return res.status(404).json({ success: false, error: "Quote not found" });
      }
      res.json({ success: true, quote });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ PULSE ACCESS REQUESTS ============
  app.post("/api/pulse-requests", async (req, res) => {
    try {
      const data = insertPulseRequestSchema.parse(req.body);
      const request = await storage.createPulseRequest(data);
      
      notifyNewPulseRequest(data.companyName, data.tier, data.useCase);
      
      res.status(201).json({ success: true, request });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/pulse-requests", async (req, res) => {
    try {
      const requests = await storage.getPulseRequests();
      res.json({ success: true, requests });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/pulse-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const request = await storage.updatePulseRequestStatus(req.params.id, status);
      if (!request) {
        return res.status(404).json({ success: false, error: "Request not found" });
      }
      res.json({ success: true, request });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ BOOKINGS ============
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      
      const dateStr = new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      notifyNewBooking(data.name, dateStr, data.timeSlot);
      
      res.status(201).json({ success: true, booking });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json({ success: true, bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }
      res.json({ success: true, booking });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ TESTIMONIALS ============
  app.post("/api/testimonials", async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json({ success: true, testimonial });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const approvedOnly = req.query.approved === "true";
      const testimonials = await storage.getTestimonials(approvedOnly);
      res.json({ success: true, testimonials });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/testimonials/:id/approve", async (req, res) => {
    try {
      const testimonial = await storage.approveTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ success: false, error: "Testimonial not found" });
      }
      res.json({ success: true, testimonial });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ BLOG POSTS ============
  app.get("/api/blog", async (req, res) => {
    try {
      const publishedOnly = req.query.published === "true";
      const posts = await storage.getBlogPosts(publishedOnly);
      res.json({ success: true, posts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ CASE STUDIES ============
  app.get("/api/case-studies", async (req, res) => {
    try {
      const publishedOnly = req.query.published === "true";
      const studies = await storage.getCaseStudies(publishedOnly);
      res.json({ success: true, studies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const study = await storage.getCaseStudy(req.params.slug);
      if (!study) {
        return res.status(404).json({ success: false, error: "Case study not found" });
      }
      res.json({ success: true, study });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ DASHBOARD STATS ============
  app.get("/api/stats", async (req, res) => {
    try {
      const [leads, quotes, bookings, subscribers] = await Promise.all([
        storage.getLeads(),
        storage.getQuoteRequests(),
        storage.getBookings(),
        storage.getSubscribers()
      ]);

      const newLeads = leads.filter(l => l.status === "new").length;
      const pendingQuotes = quotes.filter(q => q.status === "pending").length;
      const upcomingBookings = bookings.filter(b => b.status === "pending").length;

      res.json({
        success: true,
        stats: {
          totalLeads: leads.length,
          newLeads,
          totalQuotes: quotes.length,
          pendingQuotes,
          totalBookings: bookings.length,
          upcomingBookings,
          totalSubscribers: subscribers.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ STRIPE PAYMENTS ============
  app.post("/api/payments/stripe/create-checkout", async (req, res) => {
    try {
      // Validate request body
      const validationResult = paymentCheckoutSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          success: false, 
          error: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const { planType, customerName, customerEmail, successUrl, cancelUrl } = validationResult.data;
      const plan = SERVICE_PLANS[planType];

      // Get Stripe client
      let stripe;
      try {
        stripe = await getUncachableStripeClient();
      } catch (stripeError) {
        console.error("Failed to initialize Stripe client:", stripeError);
        return res.status(500).json({ success: false, error: "Payment service unavailable" });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: planType.startsWith("custom_") ? "payment" : "subscription",
        customer_email: customerEmail,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `DarkWave Studios - ${plan.name}`,
            },
            unit_amount: plan.price * 100,
            ...(planType.startsWith("custom_") ? {} : { recurring: { interval: "month" as const } }),
          },
          quantity: 1,
        }],
        success_url: successUrl || `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.origin}/payment/cancel`,
        metadata: {
          planType,
          customerName,
        },
      });

      // Store payment record
      const payment = await storage.createPayment({
        customerName,
        customerEmail,
        amount: plan.price.toString(),
        planType,
        planName: plan.name,
        paymentMethod: "stripe",
        stripeSessionId: session.id,
      });

      res.json({ 
        success: true, 
        sessionId: session.id, 
        url: session.url,
        paymentId: payment.id 
      });
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      // Don't expose internal Stripe errors
      res.status(500).json({ success: false, error: "Failed to create checkout session" });
    }
  });

  // ============ COINBASE COMMERCE PAYMENTS ============
  app.post("/api/payments/coinbase/create-charge", async (req, res) => {
    try {
      // Validate request body
      const validationResult = paymentCheckoutSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          success: false, 
          error: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const coinbaseApiKey = process.env.COINBASE_COMMERCE_API_KEY;
      if (!coinbaseApiKey) {
        return res.status(500).json({ success: false, error: "Crypto payments not configured" });
      }

      const { planType, customerName, customerEmail } = validationResult.data;
      const plan = SERVICE_PLANS[planType];

      // Create Coinbase Commerce charge
      const response = await fetch("https://api.commerce.coinbase.com/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CC-Api-Key": coinbaseApiKey,
          "X-CC-Version": "2018-03-22",
        },
        body: JSON.stringify({
          name: plan.name,
          description: `DarkWave Studios - ${plan.name}`,
          pricing_type: "fixed_price",
          local_price: {
            amount: plan.price.toString(),
            currency: "USD",
          },
          metadata: {
            customer_name: customerName,
            customer_email: customerEmail,
            plan_type: planType,
          },
          redirect_url: `${req.headers.origin}/payment/success`,
          cancel_url: `${req.headers.origin}/payment/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create Coinbase charge");
      }

      const chargeData = await response.json();
      const charge = chargeData.data;

      // Store payment record
      const payment = await storage.createPayment({
        customerName,
        customerEmail,
        amount: plan.price.toString(),
        planType,
        planName: plan.name,
        paymentMethod: "coinbase",
        coinbaseChargeId: charge.id,
        coinbaseChargeCode: charge.code,
      });

      res.json({ 
        success: true, 
        chargeId: charge.id,
        chargeCode: charge.code,
        hostedUrl: charge.hosted_url,
        paymentId: payment.id 
      });
    } catch (error: any) {
      console.error("Coinbase Commerce error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Coinbase Webhook
  app.post("/api/webhooks/coinbase", async (req: Request, res: Response) => {
    try {
      const event = req.body;
      
      if (event.event?.type === "charge:confirmed" || event.event?.type === "charge:resolved") {
        const chargeId = event.event.data?.id;
        if (chargeId) {
          const payment = await storage.getPaymentByCoinbaseCharge(chargeId);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, "completed", new Date());
            
            // Sync completed payment to ORBIT for bookkeeping
            await syncPaymentToOrbit({
              id: payment.id,
              customerName: payment.customerName,
              customerEmail: payment.customerEmail,
              amount: payment.amount,
              planType: payment.planType,
              planName: payment.planName,
              paymentMethod: payment.paymentMethod,
              stripePaymentIntentId: payment.stripePaymentIntentId,
              coinbaseChargeId: chargeId,
            });
          }
        }
      } else if (event.event?.type === "charge:failed" || event.event?.type === "charge:expired") {
        const chargeId = event.event.data?.id;
        if (chargeId) {
          const payment = await storage.getPaymentByCoinbaseCharge(chargeId);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, "failed");
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Coinbase webhook error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cart checkout with Stripe (multiple items)
  app.post("/api/payments/stripe/cart-checkout", async (req, res) => {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Cart is empty" });
      }

      const stripe = await getUncachableStripeClient();
      if (!stripe) {
        return res.status(500).json({ success: false, error: "Payment system not configured" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      
      const lineItems = items.map((item: { id: string; name: string; price: number; type: string }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: `DarkWave ${item.type === "widget" ? "Widget" : "Snippet"} - One-time purchase`,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/hub`,
        metadata: {
          items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, type: i.type }))),
        },
      });

      res.json({ success: true, url: session.url });
    } catch (error: any) {
      console.error("Stripe cart checkout error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Cart checkout with Coinbase Commerce (multiple items)
  app.post("/api/payments/coinbase/cart-checkout", async (req, res) => {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Cart is empty" });
      }

      const coinbaseApiKey = process.env.COINBASE_COMMERCE_API_KEY;
      if (!coinbaseApiKey) {
        return res.status(500).json({ success: false, error: "Coinbase Commerce not configured" });
      }

      const total = items.reduce((sum: number, item: { price: number }) => sum + item.price, 0);
      const itemNames = items.map((i: { name: string }) => i.name).join(", ");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const response = await fetch("https://api.commerce.coinbase.com/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CC-Api-Key": coinbaseApiKey,
          "X-CC-Version": "2018-03-22",
        },
        body: JSON.stringify({
          name: "DarkWave Hub Purchase",
          description: `Widgets & Snippets: ${itemNames}`,
          pricing_type: "fixed_price",
          local_price: {
            amount: total.toString(),
            currency: "USD",
          },
          metadata: {
            items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, type: i.type }))),
          },
          redirect_url: `${baseUrl}/payment-success`,
          cancel_url: `${baseUrl}/hub`,
        }),
      });

      const data = await response.json();
      
      if (data.data?.hosted_url) {
        res.json({ success: true, url: data.data.hosted_url });
      } else {
        res.status(500).json({ success: false, error: "Failed to create Coinbase charge" });
      }
    } catch (error: any) {
      console.error("Coinbase cart checkout error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get payments list (for admin)
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json({ success: true, payments });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get Stripe config for frontend
  app.get("/api/payments/config", async (req, res) => {
    try {
      const stripePublishableKey = await getStripePublishableKey();
      res.json({
        stripePublishableKey,
        coinbaseEnabled: !!process.env.COINBASE_COMMERCE_API_KEY,
        plans: SERVICE_PLANS,
      });
    } catch (error) {
      res.json({
        stripePublishableKey: null,
        coinbaseEnabled: !!process.env.COINBASE_COMMERCE_API_KEY,
        plans: SERVICE_PLANS,
      });
    }
  });

  // ============ ANALYTICS - PAGE VIEWS ============
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const data = insertPageViewSchema.parse(req.body);
      const view = await storage.createPageView(data);
      res.status(201).json({ success: true, view });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/analytics/pageviews", requireAdminAuth, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const views = await storage.getPageViews(days);
      res.json({ success: true, views });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/analytics/stats", requireAdminAuth, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = await storage.getPageViewStats(days);
      const events = await storage.getAnalyticsEvents(days);
      
      const eventCounts: Record<string, number> = {};
      events.forEach(e => {
        eventCounts[e.name] = (eventCounts[e.name] || 0) + 1;
      });

      res.json({ 
        success: true, 
        stats: {
          ...stats,
          totalEvents: events.length,
          eventBreakdown: eventCounts
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ ANALYTICS - EVENTS ============
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const data = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.createAnalyticsEvent(data);
      res.status(201).json({ success: true, event });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/analytics/events", requireAdminAuth, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const events = await storage.getAnalyticsEvents(days);
      res.json({ success: true, events });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ SEO KEYWORDS (Protected) ============
  app.get("/api/seo/keywords", requireAdminAuth, async (req, res) => {
    try {
      const keywords = await storage.getSeoKeywords();
      res.json({ success: true, keywords });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/seo/keywords", requireAdminAuth, async (req, res) => {
    try {
      const data = insertSeoKeywordSchema.parse(req.body);
      const keyword = await storage.createSeoKeyword(data);
      res.status(201).json({ success: true, keyword });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/seo/keywords/:id", requireAdminAuth, async (req, res) => {
    try {
      const keyword = await storage.updateSeoKeyword(req.params.id, req.body);
      if (!keyword) {
        return res.status(404).json({ success: false, error: "Keyword not found" });
      }
      res.json({ success: true, keyword });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/seo/keywords/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteSeoKeyword(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ AI BLOG GENERATION (Protected) ============
  app.post("/api/blog/generate", requireAdminAuth, async (req, res) => {
    try {
      const { topic, keywords, tone = "professional" } = req.body;

      if (!topic) {
        return res.status(400).json({ success: false, error: "Topic is required" });
      }

      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are an expert SEO content writer for DarkWave Studios, a premium web development agency. 
Write engaging, informative blog posts that:
- Target the provided keywords naturally
- Follow ${tone} tone
- Include proper headings (H2, H3)
- Are optimized for search engines
- Provide actionable value to readers
- Are 800-1200 words long
Return JSON with: title, slug (url-friendly), excerpt (150 chars), content (markdown), tags (array), category`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Write a blog post about: ${topic}\nTarget keywords: ${keywords?.join(", ") || "web development, agency"}` }
        ],
        response_format: { type: "json_object" },
      });

      const blogData = JSON.parse(response.choices[0].message.content || "{}");
      
      res.json({ success: true, blog: blogData });
    } catch (error: any) {
      console.error("AI blog generation error:", error);
      res.status(500).json({ success: false, error: "Failed to generate blog post" });
    }
  });

  app.post("/api/blog", requireAdminAuth, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json({ success: true, post });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ DOCUMENTS (Public read, Protected write) ============
  app.get("/api/documents", async (req, res) => {
    try {
      const docs = await storage.getDocuments();
      res.json({ success: true, documents: docs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/documents/:slug", async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.slug);
      if (!doc) {
        return res.status(404).json({ success: false, error: "Document not found" });
      }
      res.json({ success: true, document: doc });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/documents/category/:category", async (req, res) => {
    try {
      const docs = await storage.getDocumentsByCategory(req.params.category);
      res.json({ success: true, documents: docs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/documents", requireAdminAuth, async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      const doc = await storage.createDocument(data);
      res.status(201).json({ success: true, document: doc });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/documents/:id", requireAdminAuth, async (req, res) => {
    try {
      const data = insertDocumentSchema.partial().parse(req.body);
      const doc = await storage.updateDocument(req.params.id, data);
      if (!doc) {
        return res.status(404).json({ success: false, error: "Document not found" });
      }
      res.json({ success: true, document: doc });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/documents/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ TRUST LAYER HUB / ECOSYSTEM ============

  // Ecosystem Status (public - for app verification)
  app.get("/api/ecosystem/status", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      const appName = req.headers["x-app-name"] as string;

      if (!apiKey || !appName) {
        return res.json({
          connected: false,
          hubName: "DarkWave Trust Layer Hub",
          message: "Missing X-API-Key or X-App-Name headers"
        });
      }

      const app = await storage.getEcosystemAppByApiKey(apiKey);
      if (!app || app.appName !== appName) {
        return res.json({
          connected: false,
          hubName: "DarkWave Trust Layer Hub",
          message: "Invalid credentials or app not registered"
        });
      }

      await storage.updateEcosystemAppLastSync(app.id);
      await storage.createEcosystemLog({
        appId: app.id,
        appName: app.appName,
        action: "status_check",
        status: "success"
      });

      res.json({
        connected: true,
        hubName: "DarkWave Trust Layer Hub",
        appName: app.displayName,
        permissions: app.permissions || [],
        isVerified: app.isVerified,
        lastSync: app.lastSync
      });
    } catch (error: any) {
      res.status(500).json({ connected: false, error: error.message });
    }
  });

  // Get Hub Stats (public)
  app.get("/api/ecosystem/stats", async (req, res) => {
    try {
      const stats = await storage.getEcosystemStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // List Connected Apps (public info only)
  app.get("/api/ecosystem/apps", async (req, res) => {
    try {
      const apps = await storage.getEcosystemApps();
      const publicApps = apps.filter(a => a.isActive).map(app => ({
        id: app.id,
        appName: app.appName,
        displayName: app.displayName,
        description: app.description,
        logoUrl: app.logoUrl,
        isVerified: app.isVerified,
        createdAt: app.createdAt
      }));
      res.json({ success: true, apps: publicApps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Register New App (admin)
  app.post("/api/ecosystem/apps", requireAdminAuth, async (req, res) => {
    try {
      const apiKey = crypto.randomBytes(32).toString("hex");
      const apiSecret = crypto.randomBytes(48).toString("hex");
      
      const data = insertEcosystemAppSchema.parse({
        ...req.body,
        apiKey,
        apiSecret
      });
      
      const app = await storage.createEcosystemApp(data);
      
      await storage.createEcosystemLog({
        appId: app.id,
        appName: app.appName,
        action: "app_registered",
        status: "success"
      });

      res.status(201).json({ 
        success: true, 
        app,
        credentials: { apiKey, apiSecret }
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Update App (admin)
  app.patch("/api/ecosystem/apps/:id", requireAdminAuth, async (req, res) => {
    try {
      const app = await storage.updateEcosystemApp(req.params.id, req.body);
      if (!app) {
        return res.status(404).json({ success: false, error: "App not found" });
      }
      res.json({ success: true, app });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Delete App (admin)
  app.delete("/api/ecosystem/apps/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteEcosystemApp(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ CODE SNIPPETS ============

  // Get All Snippets (public)
  app.get("/api/ecosystem/snippets", async (req, res) => {
    try {
      const category = req.query.category as string;
      let snippets;
      if (category) {
        snippets = await storage.getCodeSnippetsByCategory(category);
      } else {
        snippets = await storage.getCodeSnippets(true);
      }
      res.json({ success: true, snippets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get Single Snippet
  app.get("/api/ecosystem/snippets/:id", async (req, res) => {
    try {
      const snippet = await storage.getCodeSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ success: false, error: "Snippet not found" });
      }
      res.json({ success: true, snippet });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get Full Widget Code from file
  app.get("/api/ecosystem/widget-code/:widgetName", async (req, res) => {
    try {
      const { widgetName } = req.params;
      const validWidgets = [
        'tl-analytics', 'tl-booking', 'tl-chat', 'tl-crew-tracker',
        'tl-crm', 'tl-estimator', 'tl-lead-capture', 'tl-proposal',
        'tl-reviews', 'tl-seo', 'tl-shared', 'tl-weather'
      ];
      
      if (!validWidgets.includes(widgetName)) {
        return res.status(404).json({ success: false, error: "Widget not found" });
      }
      
      const fs = await import('fs/promises');
      const path = await import('path');
      const widgetPath = path.join(process.cwd(), 'client', 'public', 'widgets', `${widgetName}.js`);
      const code = await fs.readFile(widgetPath, 'utf-8');
      
      res.json({ success: true, widgetName, code, lines: code.split('\n').length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create Snippet (admin or authenticated app)
  app.post("/api/ecosystem/snippets", requireAdminAuth, async (req, res) => {
    try {
      const data = insertCodeSnippetSchema.parse(req.body);
      const snippet = await storage.createCodeSnippet(data);
      
      await storage.createEcosystemLog({
        appId: data.authorAppId || undefined,
        appName: data.authorName || "Admin",
        action: "snippet_created",
        resourceType: "snippet",
        resourceId: snippet.id,
        status: "success"
      });

      res.status(201).json({ success: true, snippet });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Update Snippet
  app.patch("/api/ecosystem/snippets/:id", requireAdminAuth, async (req, res) => {
    try {
      const snippet = await storage.updateCodeSnippet(req.params.id, req.body);
      if (!snippet) {
        return res.status(404).json({ success: false, error: "Snippet not found" });
      }
      res.json({ success: true, snippet });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Download Snippet (increments counter)
  app.post("/api/ecosystem/snippets/:id/download", async (req, res) => {
    try {
      const snippet = await storage.getCodeSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ success: false, error: "Snippet not found" });
      }
      await storage.incrementSnippetDownloads(req.params.id);
      res.json({ success: true, code: snippet.code, language: snippet.language });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Like Snippet
  app.post("/api/ecosystem/snippets/:id/like", async (req, res) => {
    try {
      await storage.incrementSnippetLikes(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete Snippet
  app.delete("/api/ecosystem/snippets/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteCodeSnippet(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ SNIPPET CATEGORIES ============

  app.get("/api/ecosystem/categories", async (req, res) => {
    try {
      const categories = await storage.getSnippetCategories();
      res.json({ success: true, categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ecosystem/categories", requireAdminAuth, async (req, res) => {
    try {
      const data = insertSnippetCategorySchema.parse(req.body);
      const category = await storage.createSnippetCategory(data);
      res.status(201).json({ success: true, category });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // ============ ECOSYSTEM LOGS ============

  app.get("/api/ecosystem/logs", requireAdminAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getEcosystemLogs(limit);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ ORBIT INTEGRATION WEBHOOKS ============

  // Webhook receiver for ORBIT Hub events
  app.post("/api/orbit/webhook", async (req, res) => {
    try {
      const signature = req.headers["x-ecosystem-signature"] as string;
      const rawBody = JSON.stringify(req.body);
      
      // Verify signature using HMAC-SHA256
      const orbitSecret = process.env.ORBIT_API_SECRET;
      if (!orbitSecret) {
        return res.status(500).json({ success: false, error: "ORBIT secret not configured" });
      }

      const computedSignature = crypto
        .createHmac("sha256", orbitSecret)
        .update(rawBody)
        .digest("hex");

      // Use timing-safe comparison
      if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
        await storage.createEcosystemLog({
          appName: "ORBIT Hub",
          action: "webhook_received",
          status: "failed",
          metadata: JSON.stringify({ error: "Invalid signature" })
        });
        return res.status(401).json({ success: false, error: "Invalid signature" });
      }

      const event = req.body;
      
      // Log the webhook event
      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: `webhook_${event.event}`,
        status: "success",
        metadata: JSON.stringify(event.payload)
      });

      // Handle different event types
      switch (event.event) {
        case "snippet.created":
        case "snippet.updated":
          // Sync snippet from ORBIT
          console.log(`ORBIT snippet sync: ${event.event}`, event.payload);
          break;
        
        case "app.registered":
          // New app registered in ecosystem
          console.log(`ORBIT app registered:`, event.payload);
          break;
        
        case "blockchain.anchored":
          // Blockchain verification complete
          console.log(`ORBIT blockchain anchored:`, event.payload);
          break;
        
        default:
          console.log(`Unknown ORBIT event: ${event.event}`);
      }

      res.json({ success: true, received: event.event });
    } catch (error: any) {
      console.error("ORBIT webhook error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ORBIT connection test endpoint
  app.get("/api/orbit/status", async (req, res) => {
    try {
      const orbitKey = process.env.ORBIT_API_KEY;
      const orbitSecret = process.env.ORBIT_API_SECRET;
      const orbitBaseUrl = process.env.ORBIT_ECOSYSTEM_URL || "https://orbitstaffing.io/api/ecosystem";
      
      if (!orbitKey || !orbitSecret) {
        return res.json({
          connected: false,
          message: "ORBIT credentials not configured"
        });
      }

      // Try to connect to ORBIT
      const response = await fetch(`${orbitBaseUrl}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": orbitKey,
          "X-API-Secret": orbitSecret,
          "X-App-Name": "DarkWaveStudios"
        }
      });

      if (response.ok) {
        const data = await response.json();
        await storage.createEcosystemLog({
          appName: "ORBIT Hub",
          action: "connection_test",
          status: "success"
        });
        res.json({
          connected: true,
          hubName: data.hubName || "ORBIT Staffing Ecosystem Hub",
          appName: data.appName || "DarkWaveStudios",
          permissions: data.permissions || [],
          lastSync: data.lastSync,
          message: "Successfully connected to ORBIT Hub"
        });
      } else {
        res.json({
          connected: false,
          message: `ORBIT connection failed: ${response.status}`
        });
      }
    } catch (error: any) {
      res.json({
        connected: false,
        message: `ORBIT connection error: ${error.message}`
      });
    }
  });

  // Get snippets from ORBIT Hub (public - for Trust Layer Hub UI)
  app.get("/api/orbit/snippets", async (req, res) => {
    try {
      const orbitKey = process.env.ORBIT_API_KEY;
      const orbitSecret = process.env.ORBIT_API_SECRET;
      const orbitBaseUrl = process.env.ORBIT_ECOSYSTEM_URL || "https://orbitstaffing.io/api/ecosystem";
      
      if (!orbitKey || !orbitSecret) {
        return res.status(503).json({ success: false, error: "ORBIT credentials not configured" });
      }

      const category = req.query.category as string;
      const url = category 
        ? `${orbitBaseUrl}/snippets?category=${encodeURIComponent(category)}`
        : `${orbitBaseUrl}/snippets`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": orbitKey,
          "X-API-Secret": orbitSecret,
          "X-App-Name": "DarkWaveStudios"
        }
      });

      if (!response.ok) {
        throw new Error(`ORBIT fetch failed: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Sync snippets from ORBIT Hub
  app.post("/api/orbit/sync-snippets", requireAdminAuth, async (req, res) => {
    try {
      const orbitKey = process.env.ORBIT_API_KEY;
      const orbitSecret = process.env.ORBIT_API_SECRET;
      const orbitBaseUrl = process.env.ORBIT_ECOSYSTEM_URL || "https://orbitstaffing.io/api/ecosystem";
      
      if (!orbitKey || !orbitSecret) {
        return res.status(400).json({ success: false, error: "ORBIT credentials not configured" });
      }

      const response = await fetch(`${orbitBaseUrl}/snippets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": orbitKey,
          "X-API-Secret": orbitSecret,
          "X-App-Name": "DarkWaveStudios"
        }
      });

      if (!response.ok) {
        throw new Error(`ORBIT sync failed: ${response.status}`);
      }

      const data = await response.json();
      
      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "snippets_synced",
        status: "success",
        metadata: JSON.stringify({ count: data.snippets?.length || 0 })
      });

      res.json({
        success: true,
        message: "Snippets synced from ORBIT Hub",
        count: data.snippets?.length || 0
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Push snippet to ORBIT Hub
  app.post("/api/orbit/push-snippet", requireAdminAuth, async (req, res) => {
    try {
      const orbitKey = process.env.ORBIT_API_KEY;
      const orbitSecret = process.env.ORBIT_API_SECRET;
      const orbitBaseUrl = process.env.ORBIT_ECOSYSTEM_URL || "https://orbitstaffing.io/api/ecosystem";
      
      if (!orbitKey || !orbitSecret) {
        return res.status(400).json({ success: false, error: "ORBIT credentials not configured" });
      }

      const response = await fetch(`${orbitBaseUrl}/snippets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": orbitKey,
          "X-API-Secret": orbitSecret,
          "X-App-Name": "DarkWaveStudios"
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        throw new Error(`ORBIT push failed: ${response.status}`);
      }

      const data = await response.json();
      
      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "snippet_pushed",
        status: "success",
        resourceType: "snippet",
        metadata: JSON.stringify(req.body)
      });

      res.json({ success: true, result: data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Request blockchain verification via ORBIT
  app.post("/api/orbit/anchor", requireAdminAuth, async (req, res) => {
    try {
      const orbitKey = process.env.ORBIT_API_KEY;
      const orbitSecret = process.env.ORBIT_API_SECRET;
      const orbitBaseUrl = process.env.ORBIT_ECOSYSTEM_URL || "https://orbitstaffing.io/api/ecosystem";
      
      if (!orbitKey || !orbitSecret) {
        return res.status(400).json({ success: false, error: "ORBIT credentials not configured" });
      }

      const { recordType, recordId, data } = req.body;
      
      // Generate SHA-256 hash of the data
      const dataHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");

      // Note: blockchain anchor uses different base URL structure
      const blockchainUrl = orbitBaseUrl.replace('/api/ecosystem', '/api/blockchain');
      const response = await fetch(`${blockchainUrl}/anchor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": orbitKey,
          "X-API-Secret": orbitSecret,
          "X-App-Name": "DarkWave Studios"
        },
        body: JSON.stringify({ recordType, recordId, dataHash })
      });

      if (!response.ok) {
        throw new Error(`ORBIT anchor failed: ${response.status}`);
      }

      const result = await response.json();
      
      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "blockchain_anchor_requested",
        status: "success",
        resourceType: recordType,
        resourceId: recordId,
        metadata: JSON.stringify({ dataHash, batchId: result.batchId })
      });

      res.json({ success: true, ...result, dataHash });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ ORBIT FINANCIAL SYNC ============

  // Get financial statement from ORBIT
  app.get("/api/orbit/financial-statement", requireAdminAuth, async (req, res) => {
    try {
      const period = req.query.period as string || new Date().toISOString().slice(0, 7);
      const orbitClient = getOrbitClient();
      const statement = await orbitClient.getFinancialStatement(period);
      
      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "financial_statement_fetched",
        status: "success",
        metadata: JSON.stringify({ period, totalRevenue: statement.totalRevenue })
      });

      res.json({ success: true, statement });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Sync contractor payment to ORBIT (1099 tracking)
  app.post("/api/orbit/contractor-payment", requireAdminAuth, async (req, res) => {
    try {
      const { payeeId, payeeName, payeeEmail, amount, description, category } = req.body;

      if (!payeeId || !payeeName || !payeeEmail || !amount) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields: payeeId, payeeName, payeeEmail, amount" 
        });
      }

      const orbitClient = getOrbitClient();
      const result = await orbitClient.syncContractorPayment({
        payeeId,
        payeeName,
        payeeEmail,
        amount: parseFloat(amount),
        paymentDate: new Date().toISOString().slice(0, 10),
        description: description || "Contractor services",
        sourceApp: "DarkWave Studios",
        category: category || "contractor-services"
      });

      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "contractor_payment_synced",
        status: "success",
        metadata: JSON.stringify({ 
          payeeId, 
          amount, 
          ytdTotal: result.ytdTotal,
          requiresForm1099: result.requiresForm1099 
        })
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Manual sync of a payment to ORBIT
  app.post("/api/orbit/sync-payment/:paymentId", requireAdminAuth, async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.paymentId);
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }

      await syncPaymentToOrbit({
        id: payment.id,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        amount: payment.amount,
        planType: payment.planType,
        planName: payment.planName,
        paymentMethod: payment.paymentMethod,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        coinbaseChargeId: payment.coinbaseChargeId,
      });

      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "payment_manually_synced",
        status: "success",
        resourceType: "payment",
        resourceId: payment.id
      });

      res.json({ success: true, message: "Payment synced to ORBIT" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Bulk sync all completed payments to ORBIT
  app.post("/api/orbit/sync-all-payments", requireAdminAuth, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      const completedPayments = payments.filter(p => p.status === "completed");
      
      let synced = 0;
      let failed = 0;

      for (const payment of completedPayments) {
        try {
          await syncPaymentToOrbit({
            id: payment.id,
            customerName: payment.customerName,
            customerEmail: payment.customerEmail,
            amount: payment.amount,
            planType: payment.planType,
            planName: payment.planName,
            paymentMethod: payment.paymentMethod,
            stripePaymentIntentId: payment.stripePaymentIntentId,
            coinbaseChargeId: payment.coinbaseChargeId,
          });
          synced++;
        } catch {
          failed++;
        }
      }

      await storage.createEcosystemLog({
        appName: "ORBIT Hub",
        action: "bulk_payment_sync",
        status: "success",
        metadata: JSON.stringify({ synced, failed, total: completedPayments.length })
      });

      res.json({ 
        success: true, 
        message: `Synced ${synced} payments to ORBIT`,
        synced,
        failed,
        total: completedPayments.length
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ TRUST LAYER WIDGET API ============
  app.use("/api/widgets", widgetRoutes);

  return httpServer;
}
