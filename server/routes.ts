import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertSubscriberSchema, insertQuoteRequestSchema, insertPulseRequestSchema, insertBookingSchema, insertTestimonialSchema, insertPaymentSchema, insertPageViewSchema, insertAnalyticsEventSchema, insertSeoKeywordSchema, insertBlogPostSchema, insertDocumentSchema, insertEcosystemAppSchema, insertCodeSnippetSchema, insertSnippetCategorySchema, insertEcosystemLogSchema, marketingPosts, marketingImages, metaIntegrations, scheduledPosts, insertMarketingPostSchema, marketingSubscriptions, postAnalytics } from "@shared/schema";
import { TwitterConnector, postToFacebook, postToInstagram } from "./social-connectors";
import { eq, asc, desc, sql, and, gte, lte } from "drizzle-orm";
import { db } from "./db";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { notifyNewLead, notifyNewQuote, notifyNewBooking, notifyNewPulseRequest } from "./sms";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { getOrbitClient, syncPaymentToOrbit } from "./orbitClient";
import { z } from "zod";
import OpenAI from "openai";
import multer from "multer";
import widgetRoutes from "./widgets/widget-routes";

const uploadDir = "uploads/marketing";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

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
      const body = { ...req.body };
      if (typeof body.date === "string") body.date = new Date(body.date);
      const data = insertBookingSchema.parse(body);
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

  // ============ WEBSITE AUDIT ============
  const websiteAuditSchema = z.object({
    url: z.string().url("Valid URL required")
  });

  app.post("/api/website-audit", async (req, res) => {
    try {
      const validated = websiteAuditSchema.parse(req.body);
      const parsedUrl = new URL(validated.url);

      // Simulate website audit with realistic scores
      // In production, this would use real APIs like PageSpeed Insights, etc.
      const baseScore = Math.floor(Math.random() * 30) + 50; // 50-80 base
      
      const result = {
        url: parsedUrl.href,
        scores: {
          performance: Math.min(100, baseScore + Math.floor(Math.random() * 25)),
          seo: Math.min(100, baseScore + Math.floor(Math.random() * 30)),
          mobile: Math.min(100, baseScore + Math.floor(Math.random() * 20)),
          security: parsedUrl.protocol === 'https:' ? Math.min(100, baseScore + 30) : baseScore - 20,
          accessibility: Math.min(100, baseScore + Math.floor(Math.random() * 15)),
        },
        issues: {
          critical: [
            "Large JavaScript bundles slowing initial load",
            "Images not optimized for web",
          ].slice(0, Math.floor(Math.random() * 2) + 1),
          warnings: [
            "Missing meta descriptions on some pages",
            "No structured data markup detected",
            "Some images missing alt text",
            "Render-blocking resources detected",
          ].slice(0, Math.floor(Math.random() * 3) + 1),
          passed: [
            parsedUrl.protocol === 'https:' ? "SSL certificate valid" : null,
            "Mobile viewport configured",
            "HTML lang attribute present",
            "Document has title element",
          ].filter(Boolean) as string[],
        },
        recommendations: [
          "Optimize images using WebP format and lazy loading",
          "Implement code splitting to reduce bundle size",
          "Add structured data markup for better SEO",
          "Minify CSS and JavaScript files",
          "Enable browser caching for static assets",
          "Consider implementing a CDN for faster global delivery",
        ].slice(0, 4),
        loadTime: `${(Math.random() * 3 + 1.5).toFixed(2)}s`,
        pageSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      };

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
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

      const { planType, customerName, customerEmail, successUrl, cancelUrl } = validationResult.data;
      const plan = SERVICE_PLANS[planType];
      const baseUrl = successUrl ? new URL(successUrl).origin : `${req.protocol}://${req.get("host")}`;

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
          redirect_url: successUrl || `${baseUrl}/payment/success`,
          cancel_url: cancelUrl || `${baseUrl}/payment/cancel`,
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

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }

      if (message.length > 1000) {
        return res.status(400).json({ success: false, error: "Message too long (max 1000 characters)" });
      }

      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are the DarkWave AI Assistant, a helpful and knowledgeable assistant for DarkWave Studios and the Trust Layer Hub marketplace. 

Key information about DarkWave:
- Premium web development agency offering custom websites, apps, and AI solutions
- Trust Layer Hub is a blockchain-verified widget marketplace with 14+ embeddable widgets
- Guardian AI provides AI agent certification services
- DarkWave Pulse is a premium predictive AI system for market analysis
- 60%+ savings compared to traditional agencies

Be helpful, concise, and friendly. Answer questions about services, widgets, pricing, or technical capabilities.
Context: ${context || 'General inquiry'}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
      });

      res.json({ 
        success: true, 
        response: response.choices[0].message.content 
      });
    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ success: false, error: "Failed to process chat message" });
    }
  });

  app.post("/api/guardian/scan", async (req, res) => {
    try {
      const scanRequestSchema = z.object({
        agentName: z.string().min(1, "Agent name is required").max(200),
        agentUrl: z.string().min(1, "URL or contract address is required").max(500),
        contactEmail: z.string().email().optional().nullable(),
      });

      const parsed = scanRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message || "Invalid input" });
      }

      const { agentName, agentUrl, contactEmail } = parsed.data;

      const scan = await storage.createGuardianScan({
        agentName,
        agentUrl,
        contactEmail: contactEmail || null,
        scanType: "quick",
        status: "scanning",
      });

      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are Guardian AI, an advanced security analysis system for AI agents and bots in the crypto ecosystem. You perform comprehensive security assessments.

Given an AI agent's name and URL/contract address, perform a thorough security analysis and return a JSON object with these exact fields:
- securityScore (0-100): Code integrity, vulnerabilities, access control, wallet safety
- transparencyScore (0-100): Open source status, documentation quality, audit history  
- reliabilityScore (0-100): Uptime metrics, error handling, edge case coverage
- complianceScore (0-100): Regulatory alignment, data handling, consent mechanisms
- overallScore (0-100): Weighted average of all scores
- grade (A/B/C/D/F): A=80-100, B=60-79, C=40-59, D=20-39, F=0-19
- riskLevel (Low/Moderate/Elevated/High/Critical): Based on overall score
- findings (array of strings): 5-8 specific security findings, both positive and negative
- recommendations (array of strings): 3-5 actionable security recommendations
- summary (string): 2-3 sentence executive summary of the assessment

Be realistic and thorough. Analyze the URL pattern, domain reputation implications, naming conventions, and potential attack vectors. For contract addresses, analyze the address format and chain. Provide genuinely useful security insights.

IMPORTANT: Return ONLY valid JSON, no markdown formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this AI agent:\nName: ${agentName}\nURL/Contract: ${agentUrl}` }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || "{}";
      let analysis;
      try {
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleaned);
      } catch {
        analysis = {
          securityScore: 65,
          transparencyScore: 55,
          reliabilityScore: 60,
          complianceScore: 50,
          overallScore: 58,
          grade: "C",
          riskLevel: "Elevated",
          findings: ["Unable to fully parse analysis results", "Manual review recommended"],
          recommendations: ["Submit for full certification review", "Provide source code access for deeper analysis"],
          summary: "Preliminary scan completed with limited data. A full certification review is recommended for comprehensive security assessment."
        };
      }

      const updated = await storage.updateGuardianScan(scan.id, {
        status: "completed",
        securityScore: analysis.securityScore,
        transparencyScore: analysis.transparencyScore,
        reliabilityScore: analysis.reliabilityScore,
        complianceScore: analysis.complianceScore,
        overallScore: analysis.overallScore,
        grade: analysis.grade,
        riskLevel: analysis.riskLevel,
        findings: JSON.stringify(analysis.findings),
        recommendations: JSON.stringify(analysis.recommendations),
      });

      res.json({
        success: true,
        scan: {
          ...updated,
          findings: analysis.findings,
          recommendations: analysis.recommendations,
          summary: analysis.summary,
        }
      });
    } catch (error: any) {
      console.error("Guardian scan error:", error);
      res.status(500).json({ success: false, error: "Security scan failed. Please try again." });
    }
  });

  app.get("/api/guardian/scans", async (_req, res) => {
    try {
      const scans = await storage.getGuardianScans();
      res.json({ success: true, scans });
    } catch (error: any) {
      res.status(500).json({ success: false, error: "Failed to fetch scans" });
    }
  });

  app.get("/api/guardian/scan/:id", async (req, res) => {
    try {
      const scan = await storage.getGuardianScan(req.params.id);
      if (!scan) return res.status(404).json({ success: false, error: "Scan not found" });
      res.json({ success: true, scan });
    } catch (error: any) {
      res.status(500).json({ success: false, error: "Failed to fetch scan" });
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

  // ============ MARKETING HUB ============

  app.get("/api/marketing/posts", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const posts = await db.select().from(marketingPosts)
        .where(eq(marketingPosts.tenantId, tenantId));
      res.json({ success: true, posts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/marketing/posts", requireAdminAuth, async (req, res) => {
    try {
      const validated = insertMarketingPostSchema.parse(req.body);
      const [post] = await db.insert(marketingPosts)
        .values(validated)
        .returning();
      res.json({ success: true, post });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/marketing/posts/:id", requireAdminAuth, async (req, res) => {
    try {
      await db.delete(marketingPosts).where(eq(marketingPosts.id, req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/marketing/images", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const images = await db.select().from(marketingImages)
        .where(eq(marketingImages.tenantId, tenantId));
      res.json({ success: true, images });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/marketing/images", requireAdminAuth, imageUpload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image uploaded' });
      }
      const tenantId = req.body.tenantId || 'darkwave';
      const category = req.body.category || 'general';
      
      const [image] = await db.insert(marketingImages).values({
        tenantId,
        filename: req.file.originalname,
        filePath: `/uploads/marketing/${req.file.filename}`,
        category,
      }).returning();
      
      res.json({ success: true, image });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/marketing/images/:id", requireAdminAuth, async (req, res) => {
    try {
      const [image] = await db.select().from(marketingImages).where(eq(marketingImages.id, req.params.id));
      if (image && image.filePath) {
        const fullPath = path.join(process.cwd(), image.filePath.substring(1));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      await db.delete(marketingImages).where(eq(marketingImages.id, req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/marketing/integration", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const [integration] = await db.select().from(metaIntegrations)
        .where(eq(metaIntegrations.tenantId, tenantId));
      res.json(integration || { 
        facebookConnected: false, 
        instagramConnected: false, 
        twitterConnected: false 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const oauthStateStore = new Map<string, { tenantId: string; createdAt: number }>();

  app.get("/api/marketing/meta/auth", requireAdminAuth, (req, res) => {
    const clientId = process.env.META_APP_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/marketing/meta/callback`;
    const tenantId = (req.query.tenantId as string) || 'darkwave';
    
    const nonce = crypto.randomBytes(16).toString('hex');
    oauthStateStore.set(nonce, { tenantId, createdAt: Date.now() });
    
    setTimeout(() => oauthStateStore.delete(nonce), 10 * 60 * 1000);
    
    if (!clientId) {
      return res.status(500).json({ 
        success: false, 
        error: 'Meta App ID not configured. Please add META_APP_ID and META_APP_SECRET to your environment variables.' 
      });
    }
    
    const scopes = [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish'
    ].join(',');
    
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${nonce}&response_type=code`;
    
    res.json({ success: true, authUrl });
  });

  app.get("/api/marketing/meta/callback", async (req, res) => {
    try {
      const { code, state, error, error_description } = req.query as any;
      
      if (error) {
        return res.redirect(`/marketing?error=${encodeURIComponent(error_description || error)}`);
      }
      
      const storedState = oauthStateStore.get(state);
      if (!storedState) {
        return res.redirect('/marketing?error=Invalid+or+expired+OAuth+state');
      }
      oauthStateStore.delete(state);
      
      const tenantId = storedState.tenantId;
      
      const clientId = process.env.META_APP_ID;
      const clientSecret = process.env.META_APP_SECRET;
      const redirectUri = `${req.protocol}://${req.get('host')}/api/marketing/meta/callback`;
      
      if (!clientId || !clientSecret) {
        return res.redirect('/marketing?error=Meta+credentials+not+configured');
      }
      
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`
      );
      const tokenData = await tokenResponse.json() as any;
      
      if (tokenData.error) {
        return res.redirect(`/marketing?error=${encodeURIComponent(tokenData.error.message)}`);
      }
      
      const userAccessToken = tokenData.access_token;
      
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?access_token=${userAccessToken}`
      );
      const pagesData = await pagesResponse.json() as any;
      
      if (!pagesData.data || pagesData.data.length === 0) {
        return res.redirect('/marketing?error=No+Facebook+pages+found');
      }
      
      const page = pagesData.data[0];
      const pageId = page.id;
      const pageName = page.name;
      const pageAccessToken = page.access_token;
      
      let instagramAccountId = null;
      let instagramUsername = null;
      
      try {
        const igResponse = await fetch(
          `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
        );
        const igData = await igResponse.json() as any;
        
        if (igData.instagram_business_account) {
          instagramAccountId = igData.instagram_business_account.id;
          
          const igProfileResponse = await fetch(
            `https://graph.facebook.com/v21.0/${instagramAccountId}?fields=username&access_token=${pageAccessToken}`
          );
          const igProfileData = await igProfileResponse.json() as any;
          instagramUsername = igProfileData.username;
        }
      } catch (e) {
        console.log('[Meta OAuth] Instagram account lookup failed:', e);
      }
      
      const existing = await db.select().from(metaIntegrations)
        .where(eq(metaIntegrations.tenantId, tenantId));
      
      if (existing.length > 0) {
        await db.update(metaIntegrations)
          .set({
            facebookPageId: pageId,
            facebookPageName: pageName,
            facebookPageAccessToken: pageAccessToken,
            facebookConnected: true,
            instagramAccountId,
            instagramUsername,
            instagramConnected: !!instagramAccountId,
            updatedAt: new Date()
          })
          .where(eq(metaIntegrations.tenantId, tenantId));
      } else {
        await db.insert(metaIntegrations).values({
          tenantId,
          facebookPageId: pageId,
          facebookPageName: pageName,
          facebookPageAccessToken: pageAccessToken,
          facebookConnected: true,
          instagramAccountId,
          instagramUsername,
          instagramConnected: !!instagramAccountId
        });
      }
      
      res.redirect('/marketing?success=Meta+accounts+connected');
    } catch (error: any) {
      console.error('[Meta OAuth] Callback error:', error);
      res.redirect(`/marketing?error=${encodeURIComponent(error.message)}`);
    }
  });

  app.post("/api/marketing/meta/disconnect", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = req.body.tenantId || 'darkwave';
      
      await db.update(metaIntegrations)
        .set({
          facebookPageId: null,
          facebookPageName: null,
          facebookPageAccessToken: null,
          facebookConnected: false,
          instagramAccountId: null,
          instagramUsername: null,
          instagramConnected: false,
          updatedAt: new Date()
        })
        .where(eq(metaIntegrations.tenantId, tenantId));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/marketing/scheduled", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const fromDate = req.query.from ? new Date(req.query.from as string) : null;
      const toDate = req.query.to ? new Date(req.query.to as string) : null;
      
      let query = db.select().from(scheduledPosts)
        .where(eq(scheduledPosts.tenantId, tenantId));
      
      if (fromDate && toDate) {
        const posts = await db.select().from(scheduledPosts)
          .where(and(
            eq(scheduledPosts.tenantId, tenantId),
            gte(scheduledPosts.scheduledFor, fromDate),
            lte(scheduledPosts.scheduledFor, toDate)
          ));
        res.json({ success: true, posts });
      } else if (fromDate) {
        const endDate = new Date(fromDate);
        endDate.setDate(endDate.getDate() + 7);
        const posts = await db.select().from(scheduledPosts)
          .where(and(
            eq(scheduledPosts.tenantId, tenantId),
            gte(scheduledPosts.scheduledFor, fromDate),
            lte(scheduledPosts.scheduledFor, endDate)
          ));
        res.json({ success: true, posts });
      } else {
        const posts = await db.select().from(scheduledPosts)
          .where(eq(scheduledPosts.tenantId, tenantId));
        res.json({ success: true, posts });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/marketing/post-now", requireAdminAuth, async (req, res) => {
    try {
      const { content, platform, imageUrl, tenantId = 'darkwave' } = req.body;
      const [integration] = await db.select().from(metaIntegrations)
        .where(eq(metaIntegrations.tenantId, tenantId));
      
      if (!integration) {
        return res.json({ success: false, error: 'No social accounts connected' });
      }

      let result: { success: boolean; externalId?: string; error?: string } = { success: false, error: 'Platform not configured' };

      if (platform === 'facebook' || platform === 'all') {
        if (integration.facebookConnected && integration.facebookPageId) {
          result = await postToFacebook(
            integration.facebookPageId,
            integration.facebookPageAccessToken!,
            content,
            imageUrl
          );
        }
      }

      if (platform === 'x' || platform === 'all') {
        const twitter = new TwitterConnector();
        if (twitter.isConfigured()) {
          const tweetContent = content.length > 280 ? content.substring(0, 277) + '...' : content;
          result = await twitter.post(tweetContent);
        }
      }

      if (platform === 'instagram' || platform === 'all') {
        if (integration.instagramConnected && integration.instagramAccountId && imageUrl) {
          result = await postToInstagram(
            integration.instagramAccountId,
            integration.facebookPageAccessToken!,
            content,
            imageUrl
          );
        }
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Marketing Suite Subscription Checkout
  app.post("/api/marketing/subscribe", async (req, res) => {
    try {
      const { plan, email, companyName } = req.body;
      
      if (!plan || !email) {
        return res.status(400).json({ success: false, error: "Plan and email required" });
      }

      const priceMap: Record<string, { amount: number; postsPerDay: number; aiEnabled: boolean; adBoost: boolean }> = {
        starter: { amount: 9900, postsPerDay: 7, aiEnabled: false, adBoost: false },
        professional: { amount: 24900, postsPerDay: 17, aiEnabled: true, adBoost: true },
        enterprise: { amount: 49900, postsPerDay: 50, aiEnabled: true, adBoost: true }
      };

      const planConfig = priceMap[plan];
      if (!planConfig) {
        return res.status(400).json({ success: false, error: "Invalid plan" });
      }

      const stripe = await getUncachableStripeClient();
      if (!stripe) {
        return res.status(500).json({ success: false, error: "Payment system unavailable" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            recurring: { interval: "month" },
            product_data: {
              name: `TLId.io Marketing Suite - ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
              description: `${planConfig.postsPerDay} posts/day, ${planConfig.aiEnabled ? 'AI content, ' : ''}${planConfig.adBoost ? 'ad boosting' : 'basic features'}`
            },
            unit_amount: planConfig.amount
          },
          quantity: 1
        }],
        customer_email: email,
        metadata: { plan, companyName: companyName || '', productType: 'marketing_suite' },
        success_url: `${req.headers.origin}/marketing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/marketing?cancelled=true`
      });

      res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Marketing subscription error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get subscription status
  app.get("/api/marketing/subscription", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const [subscription] = await db.select().from(marketingSubscriptions)
        .where(eq(marketingSubscriptions.tenantId, tenantId));
      res.json(subscription || null);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Content Generation
  app.post("/api/marketing/generate-content", requireAdminAuth, async (req, res) => {
    try {
      const { topic, tone = 'professional', platform = 'all', count = 3 } = req.body;
      
      if (!topic) {
        return res.status(400).json({ success: false, error: "Topic required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();

      const platformGuidelines = {
        facebook: "2,200 chars max, engaging, can be longer form",
        instagram: "2,200 chars max, visual-focused, use emojis sparingly, hashtag-friendly",
        x: "280 chars max, punchy and concise, trending hashtags",
        all: "Universal post, 280 chars to work on all platforms"
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a social media marketing expert. Generate engaging posts for businesses. 
            Tone: ${tone}. Platform: ${platform}. Guidelines: ${platformGuidelines[platform as keyof typeof platformGuidelines] || platformGuidelines.all}
            Return JSON array of posts with fields: content, hashtags (array), platform`
          },
          {
            role: "user",
            content: `Generate ${count} unique marketing posts about: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const generated = JSON.parse(response.choices[0].message.content || '{"posts":[]}');
      res.json({ success: true, posts: generated.posts || [] });
    } catch (error: any) {
      console.error("AI content generation error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Post Analytics
  app.get("/api/marketing/analytics", requireAdminAuth, async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || 'darkwave';
      const analytics = await db.select().from(postAnalytics)
        .where(eq(postAnalytics.tenantId, tenantId));
      
      const totals = analytics.reduce((acc, a) => ({
        impressions: acc.impressions + (a.impressions || 0),
        reach: acc.reach + (a.reach || 0),
        likes: acc.likes + (a.likes || 0),
        comments: acc.comments + (a.comments || 0),
        shares: acc.shares + (a.shares || 0),
        clicks: acc.clicks + (a.clicks || 0)
      }), { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 });

      res.json({ success: true, analytics, totals, postCount: analytics.length });
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

  // ============ SIGNAL CHAT API ============
  const { chatChannels: chatChannelsTable, chatUsers: chatUsersTable, chatMessages: chatMessagesTable, insertChatUserSchema: insertChatUserSchemaVal, insertChatChannelSchema: insertChatChannelSchemaVal } = await import("@shared/schema");

  app.get("/api/chat/channels", async (req, res) => {
    try {
      const channels = await db.select().from(chatChannelsTable).orderBy(chatChannelsTable.category, chatChannelsTable.name);
      res.json({ success: true, channels });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/chat/auth/register", async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body;
      if (!username || !email || !password || !displayName) {
        return res.status(400).json({ success: false, error: "All fields are required" });
      }

      const { registerUser } = await import("./trustlayer-sso");
      const result = await registerUser(username, email, password, displayName);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/chat/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: "Username and password are required" });
      }

      const { loginUser } = await import("./trustlayer-sso");
      const result = await loginUser(username, password);

      if (!result.success) {
        return res.status(401).json({ success: false, error: result.error });
      }

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/chat/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }

      const { authenticateToken } = await import("./trustlayer-sso");
      const user = await authenticateToken(authHeader.slice(7));

      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
      }

      res.json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/chat/users/online", async (req, res) => {
    try {
      const online = await db.select().from(chatUsersTable).where(eq(chatUsersTable.isOnline, true));
      res.json({ success: true, users: online, count: online.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/chat/messages/:channelId", async (req, res) => {
    try {
      const rows = await db
        .select({
          id: chatMessagesTable.id,
          channelId: chatMessagesTable.channelId,
          userId: chatMessagesTable.userId,
          content: chatMessagesTable.content,
          replyToId: chatMessagesTable.replyToId,
          createdAt: chatMessagesTable.createdAt,
          username: chatUsersTable.displayName,
          avatarColor: chatUsersTable.avatarColor,
          role: chatUsersTable.role,
        })
        .from(chatMessagesTable)
        .leftJoin(chatUsersTable, eq(chatMessagesTable.userId, chatUsersTable.id))
        .where(eq(chatMessagesTable.channelId, req.params.channelId))
        .orderBy(desc(chatMessagesTable.createdAt))
        .limit(50);

      const messages = rows.reverse().map(r => ({
        ...r,
        username: r.username || "Unknown",
        avatarColor: r.avatarColor || "#06b6d4",
        role: r.role || "member",
      }));

      res.json({ success: true, messages });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================================================
  // Ad-Free Subscription ($5/month)
  // =====================================================

  app.post("/api/subscription/ad-free/checkout", async (req, res) => {
    try {
      const { email, successUrl, cancelUrl } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
      }

      const stripe = await getUncachableStripeClient();
      if (!stripe) {
        return res.status(500).json({ success: false, error: "Payment system not configured" });
      }

      const { chatUsers: chatUsersTable } = await import("@shared/schema");
      const [user] = await db.select().from(chatUsersTable).where(eq(chatUsersTable.email, email)).limit(1);

      if (!user) {
        return res.status(404).json({ success: false, error: "No account found with that email. Please create a Trust Layer account first." });
      }

      if (user.adFreeSubscription && user.adFreeExpiresAt && user.adFreeExpiresAt > new Date()) {
        return res.status(400).json({ success: false, error: "You already have an active ad-free subscription" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            recurring: { interval: "month" },
            product_data: {
              name: "DarkWave Ecosystem - Ad-Free Experience",
              description: "Remove ads across all DarkWave ecosystem applications. One subscription, ad-free everywhere."
            },
            unit_amount: 500
          },
          quantity: 1
        }],
        customer_email: email,
        metadata: {
          type: "ad_free_subscription",
          userId: user.id,
          trustLayerId: user.trustLayerId || "",
          email: email
        },
        success_url: successUrl || `${baseUrl}/chat?subscription=success`,
        cancel_url: cancelUrl || `${baseUrl}/chat?subscription=cancelled`
      });

      res.json({ success: true, url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Ad-free checkout error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/subscription/status", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
      }

      const { chatUsers: chatUsersTable } = await import("@shared/schema");
      const [user] = await db.select().from(chatUsersTable).where(eq(chatUsersTable.email, email)).limit(1);

      if (!user) {
        return res.json({ success: true, adFree: false, reason: "no_account" });
      }

      const isActive = user.adFreeSubscription && user.adFreeExpiresAt && user.adFreeExpiresAt > new Date();

      res.json({
        success: true,
        adFree: !!isActive,
        expiresAt: user.adFreeExpiresAt || null,
        trustLayerId: user.trustLayerId || null
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/subscription/cancel", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
      }

      const { chatUsers: chatUsersTable } = await import("@shared/schema");
      const [user] = await db.select().from(chatUsersTable).where(eq(chatUsersTable.email, email)).limit(1);

      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ success: false, error: "No active subscription found" });
      }

      const stripe = await getUncachableStripeClient();
      if (!stripe) {
        return res.status(500).json({ success: false, error: "Payment system not configured" });
      }

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      res.json({ success: true, message: "Subscription will cancel at end of billing period" });
    } catch (error: any) {
      console.error("Cancel subscription error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return httpServer;
}
