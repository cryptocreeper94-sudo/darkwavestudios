import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertSubscriberSchema, insertQuoteRequestSchema, insertBookingSchema, insertTestimonialSchema, insertPaymentSchema } from "@shared/schema";
import { notifyNewLead, notifyNewQuote, notifyNewBooking } from "./sms";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-04-30.basil" as any })
  : null;

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
      if (!stripe) {
        return res.status(500).json({ success: false, error: "Stripe not configured" });
      }

      const { planType, customerName, customerEmail, successUrl, cancelUrl } = req.body;
      const plan = SERVICE_PLANS[planType as keyof typeof SERVICE_PLANS];
      
      if (!plan) {
        return res.status(400).json({ success: false, error: "Invalid plan type" });
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
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Stripe Webhook
  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return res.status(500).json({ error: "Stripe webhook not configured" });
    }

    let event: Stripe.Event;
    try {
      // Use rawBody from express middleware for webhook signature verification
      const rawBody = (req as any).rawBody as Buffer;
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const payment = await storage.getPaymentByStripeSession(session.id);
        if (payment) {
          await storage.updatePaymentStatus(payment.id, "completed", new Date());
          if (session.payment_intent) {
            await storage.updatePaymentStripeIntent(payment.id, session.payment_intent as string);
          }
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const payment = await storage.getPaymentByStripeSession(session.id);
        if (payment) {
          await storage.updatePaymentStatus(payment.id, "failed");
        }
        break;
      }
    }

    res.json({ received: true });
  });

  // ============ COINBASE COMMERCE PAYMENTS ============
  app.post("/api/payments/coinbase/create-charge", async (req, res) => {
    try {
      const coinbaseApiKey = process.env.COINBASE_COMMERCE_API_KEY;
      if (!coinbaseApiKey) {
        return res.status(500).json({ success: false, error: "Coinbase Commerce not configured" });
      }

      const { planType, customerName, customerEmail } = req.body;
      const plan = SERVICE_PLANS[planType as keyof typeof SERVICE_PLANS];
      
      if (!plan) {
        return res.status(400).json({ success: false, error: "Invalid plan type" });
      }

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
  app.get("/api/payments/config", (req, res) => {
    res.json({
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
      coinbaseEnabled: !!process.env.COINBASE_COMMERCE_API_KEY,
      plans: SERVICE_PLANS,
    });
  });

  return httpServer;
}
