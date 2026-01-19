import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertSubscriberSchema, insertQuoteRequestSchema, insertBookingSchema, insertTestimonialSchema } from "@shared/schema";
import { notifyNewLead, notifyNewQuote, notifyNewBooking } from "./sms";

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

  return httpServer;
}
