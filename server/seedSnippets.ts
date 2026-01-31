import { db } from "./db";
import { codeSnippets } from "@shared/schema";
import { sql } from "drizzle-orm";

const SEED_SNIPPETS = [
  {
    id: "4a48e46e-8298-48d1-8c19-94007130a489",
    title: "useLocalStorage Hook",
    description: "React hook for persistent state management with localStorage. Automatically syncs state across tabs and handles SSR gracefully.",
    code: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}`,
    language: "typescript",
    category: "hooks",
    tags: ["react", "hooks", "localStorage", "state management", "typescript"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  },
  {
    id: "6d410b0a-acdc-46f0-b6e8-02abf0f71386",
    title: "useDebounce Hook",
    description: "Debounce any rapidly changing value. Perfect for search inputs, form validation, and API calls.",
    code: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    language: "typescript",
    category: "hooks",
    tags: ["react", "hooks", "debounce", "performance", "search"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  },
  {
    id: "58318e30-cdf9-4c75-a19e-30215b691f3e",
    title: "TrustLayer Analytics Widget",
    description: "Complete analytics tracking system with real-time dashboards, heatmaps, session recording, and conversion tracking.",
    code: `<!-- TrustLayer Analytics Embed -->
<script src="https://tlid.io/widgets/tl-analytics.js"></script>
<script>
  TrustLayer.init({
    siteId: "YOUR_SITE_ID",
    trackPageViews: true,
    trackClicks: true,
    trackForms: true,
    heatmaps: true,
    sessionRecording: false,
    gdprCompliant: true
  });
</script>`,
    language: "javascript",
    category: "utilities",
    tags: ["analytics", "tracking", "heatmaps", "embed", "widget"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "9.00"
  },
  {
    id: "f742d35f-eb3d-4ed5-8884-aacbcbe8f681",
    title: "Trade Estimator Widget",
    description: "AI-powered instant job pricing calculator for contractors. Handles measurements, materials, labor rates.",
    code: `<!-- Trade Estimator Embed -->
<script src="https://tlid.io/widgets/tl-estimator.js"></script>
<div id="tl-estimator"></div>
<script>
  TrustLayer.Estimator.init({
    containerId: "tl-estimator",
    tradeType: "painting",
    laborRate: 45,
    materialsMarkup: 1.3,
    minimumJob: 500,
    currency: "USD",
    showBreakdown: true,
    collectLeadInfo: true,
    webhookUrl: "https://your-api.com/estimates"
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["estimator", "calculator", "contractor", "pricing", "AI"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "49.00"
  },
  {
    id: "6b26355f-8d07-4883-834e-f5a5825f71c1",
    title: "Booking Widget",
    description: "Smart appointment scheduling with calendar sync, automated reminders, and buffer time management.",
    code: `<!-- Booking Widget Embed -->
<script src="https://tlid.io/widgets/tl-booking.js"></script>
<div id="tl-booking"></div>
<script>
  TrustLayer.Booking.init({
    containerId: "tl-booking",
    calendarSync: ["google", "outlook"],
    availability: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" }
    },
    bufferTime: 30,
    reminderEmails: true,
    webhookUrl: "https://your-api.com/bookings"
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["booking", "calendar", "scheduling", "appointments", "automation"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "29.00"
  },
  {
    id: "c9f8e7d6-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
    title: "Lead Capture Widget",
    description: "High-converting lead capture forms with smart validation, multi-step flows, and CRM integration.",
    code: `<!-- Lead Capture Widget -->
<script src="https://tlid.io/widgets/tl-lead-capture.js"></script>
<div id="tl-lead-form"></div>
<script>
  TrustLayer.LeadCapture.init({
    containerId: "tl-lead-form",
    formType: "multi-step",
    fields: ["name", "email", "phone", "service", "budget"],
    validation: { email: true, phone: true },
    crmSync: "hubspot",
    webhookUrl: "https://your-api.com/leads"
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["lead capture", "forms", "CRM", "conversion", "marketing"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "19.00"
  },
  {
    id: "d0e1f2a3-b4c5-6d7e-8f9g-0a1b2c3d4e5f",
    title: "Review Display Widget",
    description: "Aggregate and display reviews from Google, Yelp, and Facebook with star ratings and testimonial cards.",
    code: `<!-- Review Widget Embed -->
<script src="https://tlid.io/widgets/tl-reviews.js"></script>
<div id="tl-reviews"></div>
<script>
  TrustLayer.Reviews.init({
    containerId: "tl-reviews",
    sources: ["google", "yelp", "facebook"],
    displayStyle: "carousel",
    minRating: 4,
    maxReviews: 10,
    autoRotate: true,
    showBadge: true
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["reviews", "testimonials", "social proof", "Google", "reputation"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "19.00"
  },
  {
    id: "e1f2a3b4-c5d6-7e8f-9g0h-1a2b3c4d5e6f",
    title: "SEO Manager Widget",
    description: "On-page SEO analyzer with meta tag optimization, structured data generator, and keyword tracking.",
    code: `<!-- SEO Manager Widget -->
<script src="https://tlid.io/widgets/tl-seo.js"></script>
<script>
  TrustLayer.SEO.init({
    siteId: "YOUR_SITE_ID",
    autoFix: true,
    trackKeywords: ["nashville web design", "web developer"],
    generateSchema: true,
    optimizeMeta: true
  });
  
  // Get SEO report
  const report = TLSEO.audit();
  console.log("SEO Score:", report.score);
</script>`,
    language: "javascript",
    category: "utilities",
    tags: ["SEO", "meta tags", "structured data", "keywords", "optimization"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "29.00"
  },
  {
    id: "f2a3b4c5-d6e7-8f9g-0h1i-2a3b4c5d6e7f",
    title: "Live Chat Widget",
    description: "Real-time customer chat with AI-powered auto-responses, file sharing, and CRM integration.",
    code: `<!-- Live Chat Widget -->
<script src="https://tlid.io/widgets/tl-chat.js"></script>
<script>
  TrustLayer.Chat.init({
    siteId: "YOUR_SITE_ID",
    position: "bottom-right",
    greeting: "Hi! How can we help you today?",
    aiResponses: true,
    offlineForm: true,
    fileSharing: true,
    crmSync: "hubspot"
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["chat", "live chat", "customer support", "AI", "communication"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "29.00"
  },
  {
    id: "a3b4c5d6-e7f8-9g0h-1i2j-3a4b5c6d7e8f",
    title: "Proposal Builder Widget",
    description: "Generate professional proposals with e-signature, payment integration, and automated follow-ups.",
    code: `<!-- Proposal Builder -->
<script src="https://tlid.io/widgets/tl-proposals.js"></script>
<script>
  TrustLayer.Proposals.init({
    templates: ["service-agreement", "project-quote"],
    branding: {
      logo: "https://yoursite.com/logo.png",
      primaryColor: "#8B0000",
      companyName: "Your Company"
    },
    eSignature: true,
    paymentIntegration: "stripe",
    depositPercent: 50
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["proposals", "quotes", "e-signature", "contracts", "invoicing"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "39.00"
  },
  {
    id: "8bca9779-a493-4d66-a286-372c1b4fbc16",
    title: "Crew Tracker / GPS Clock-In",
    description: "GPS-verified time tracking for field teams with geofencing and automatic timesheet generation.",
    code: `<!-- Crew Tracker -->
<script src="https://tlid.io/widgets/tl-crew.js"></script>
<script>
  TrustLayer.CrewTracker.init({
    companyId: "YOUR_COMPANY_ID",
    requireGPS: true,
    requirePhoto: true,
    geofenceRadius: 100,
    jobSites: [
      { name: "123 Main St", lat: 36.1627, lng: -86.7816 }
    ],
    overtimeThreshold: 40,
    webhookUrl: "https://your-api.com/timesheets"
  });
</script>`,
    language: "javascript",
    category: "utilities",
    tags: ["time tracking", "GPS", "clock-in", "field service", "payroll"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "29.00"
  },
  {
    id: "4dc94c3d-8080-4b0b-9689-1ad2e42d5122",
    title: "CRM Pipeline Manager",
    description: "Visual sales pipeline with drag-and-drop stages, automated follow-ups, and revenue forecasting.",
    code: `<!-- CRM Pipeline -->
<script src="https://tlid.io/widgets/tl-crm.js"></script>
<div id="tl-pipeline"></div>
<script>
  TrustLayer.CRM.init({
    containerId: "tl-pipeline",
    stages: [
      { name: "Lead", color: "#6B7280" },
      { name: "Quoted", color: "#F59E0B" },
      { name: "Negotiation", color: "#3B82F6" },
      { name: "Won", color: "#10B981" },
      { name: "Lost", color: "#EF4444" }
    ],
    automations: {
      moveToQuoted: { trigger: "proposal_sent" },
      followUpReminder: { days: 3, stage: "Quoted" }
    }
  });
</script>`,
    language: "javascript",
    category: "components",
    tags: ["CRM", "sales pipeline", "leads", "deals", "automation"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "49.00"
  },
  {
    id: "356fa5a1-b36a-4f89-8ccf-10e2c931c285",
    title: "Weather-Based Scheduling",
    description: "Smart scheduling widget that checks weather forecasts and suggests optimal work days.",
    code: `<!-- Weather Widget -->
<script src="https://tlid.io/widgets/tl-weather.js"></script>
<div id="tl-weather"></div>
<script>
  TrustLayer.Weather.init({
    containerId: "tl-weather",
    location: "Nashville, TN",
    forecastDays: 10,
    workConditions: {
      minTemp: 40,
      maxTemp: 95,
      maxWindSpeed: 20,
      noRain: true
    },
    calendarIntegration: true
  });
</script>`,
    language: "javascript",
    category: "utilities",
    tags: ["weather", "scheduling", "outdoor", "contractor", "forecasting"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "9.00"
  },
  {
    id: "1b31a80c-a3da-43f0-b8ab-702e187724fe",
    title: "AI Chat Widget Component",
    description: "Drop-in AI chatbot component with streaming responses. Works with OpenAI, Anthropic, or any API.",
    code: `import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export function AIChatWidget({ apiEndpoint, placeholder = "Ask anything...", systemPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage], systemPrompt }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (/* JSX component */);
}`,
    language: "typescript",
    category: "components",
    tags: ["react", "AI", "chatbot", "OpenAI", "component", "widget"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "29.00"
  },
  {
    id: "a563d34e-b9da-4193-9695-f81f416d40d8",
    title: "Stripe Payment Button",
    description: "Ready-to-use Stripe checkout button with loading states and error handling.",
    code: `import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

export function StripePaymentButton({ priceId, mode = "payment", label = "Pay Now" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
      {loading ? "Processing..." : label}
    </button>
  );
}`,
    language: "typescript",
    category: "components",
    tags: ["react", "Stripe", "payments", "checkout", "e-commerce"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: true,
    price: "19.00"
  },
  {
    id: "b5092898-5c9d-4f73-a0e7-4cec1a345b61",
    title: "API Rate Limiter Middleware",
    description: "Production-ready rate limiting for Express APIs. Prevents abuse with configurable limits.",
    code: `import { Request, Response, NextFunction } from "express";

const requestCounts = new Map();

export function rateLimit(config = {}) {
  const { windowMs = 60000, maxRequests = 100, message = "Too many requests" } = config;

  return (req, res, next) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: message });
    }

    record.count++;
    next();
  };
}`,
    language: "typescript",
    category: "api",
    tags: ["express", "middleware", "rate-limiting", "security", "API"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  },
  {
    id: "7da4182e-cc36-4e85-a148-1e47232b72ff",
    title: "JWT Auth Middleware",
    description: "Complete JWT authentication middleware for Express with token verification and role-based access.",
    code: `import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ ...payload, type: "refresh" }, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}`,
    language: "typescript",
    category: "auth",
    tags: ["express", "JWT", "authentication", "middleware", "security"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  },
  {
    id: "055c0d8a-b188-40b4-948d-f89bb7d76d1b",
    title: "Glass Card Component",
    description: "Beautiful glass-morphism card component with customizable blur, opacity, and border effects.",
    code: `import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export function GlassCard({ children, className = "", blur = "lg", hover = true }: GlassCardProps) {
  const blurValues = { sm: "backdrop-blur-sm", md: "backdrop-blur-md", lg: "backdrop-blur-lg", xl: "backdrop-blur-xl" };

  return (
    <div className={\`
      relative overflow-hidden rounded-2xl bg-white/5
      \${blurValues[blur]} border border-white/10
      \${hover ? "transition-all hover:bg-white/10 hover:-translate-y-1" : ""}
      \${className}
    \`}>
      {children}
    </div>
  );
}`,
    language: "typescript",
    category: "components",
    tags: ["react", "UI", "glass-morphism", "card", "tailwind"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  },
  {
    id: "e06c3ad3-ecb9-4d93-ae0a-3874745cc032",
    title: "Copy to Clipboard Button",
    description: "Accessible copy-to-clipboard button with visual feedback and keyboard support.",
    code: `import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text, label = "Copy", timeout = 2000 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copied!" : label}
    </button>
  );
}`,
    language: "typescript",
    category: "utilities",
    tags: ["react", "clipboard", "utility", "button", "UX"],
    authorName: "DarkWave Studios",
    version: "1.0.0",
    isPublic: true,
    isPremium: false,
    price: null
  }
];

export async function seedSnippets() {
  try {
    const existingCount = await db.select({ count: sql<number>`count(*)` }).from(codeSnippets);
    const count = Number(existingCount[0]?.count || 0);
    
    if (count > 0) {
      console.log(`[Seed] Found ${count} existing snippets, skipping seed`);
      return;
    }

    console.log('[Seed] No snippets found, seeding database...');
    
    for (const snippet of SEED_SNIPPETS) {
      await db.insert(codeSnippets).values({
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        category: snippet.category,
        tags: snippet.tags,
        authorName: snippet.authorName,
        version: snippet.version,
        downloads: 0,
        likes: 0,
        isPublic: snippet.isPublic,
        isPremium: snippet.isPremium,
        price: snippet.price
      }).onConflictDoNothing();
    }

    console.log(`[Seed] Successfully seeded ${SEED_SNIPPETS.length} snippets`);
  } catch (error) {
    console.error('[Seed] Error seeding snippets:', error);
  }
}
