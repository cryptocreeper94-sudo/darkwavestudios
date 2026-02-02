import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Code2, 
  Download, 
  Heart, 
  ExternalLink, 
  Search, 
  Shield, 
  Zap, 
  Globe, 
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Layers,
  Box,
  Terminal,
  Sparkles,
  Lock,
  Activity,
  Menu,
  X,
  Eye,
  Calculator,
  UserPlus,
  Star,
  Calendar,
  BarChart3,
  MessageCircle,
  Users,
  MapPin,
  FileText,
  TrendingUp,
  Cloud,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface EcosystemApp {
  id: string;
  appName: string;
  displayName: string;
  description: string;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  authorName: string;
  version: string;
  downloads: number;
  likes: number;
  isPublic: boolean;
  isPremium: boolean;
  price: string | null;
}

interface HubStats {
  totalApps: number;
  totalSnippets: number;
  totalDownloads: number;
}

const categories = [
  { id: "all", name: "All", icon: Layers },
  { id: "components", name: "Components", icon: Box },
  { id: "utilities", name: "Utilities", icon: Terminal },
  { id: "hooks", name: "Hooks", icon: Code2 },
  { id: "api", name: "API", icon: Globe },
  { id: "auth", name: "Auth", icon: Lock },
];

const widgetsList = [
  { 
    id: "estimator", name: "Trade Estimator", icon: Calculator, containerId: "demo-estimator", color: "#3b82f6", 
    description: "Instant project pricing calculator for trades", price: 149, priceId: "price_widget_estimator",
    fullDescription: "Give your customers instant, accurate project estimates. This AI-powered calculator handles square footage, materials, labor rates, and profit margins automatically. Perfect for painters, roofers, landscapers, and contractors.",
    features: ["Square footage calculator", "Material cost estimation", "Labor hour calculation", "Profit margin controls", "Lead capture integration", "PDF estimate generation", "CRM webhook sync"],
    requirements: ["React 18+ or vanilla JS", "Works with any website", "No backend required"],
    includes: ["Full source code", "Step-by-step setup guide", "Customization documentation", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "lead-capture", name: "Lead Capture", icon: UserPlus, containerId: "demo-lead-capture", color: "#8b5cf6", 
    description: "Convert visitors into qualified leads", price: 99, priceId: "price_widget_lead_capture",
    fullDescription: "Turn website visitors into qualified leads with smart forms that adapt to user behavior. Multi-step forms, conditional logic, and instant notifications help you never miss an opportunity.",
    features: ["Multi-step form wizard", "Conditional field logic", "Email & SMS notifications", "CRM integration ready", "Spam protection built-in", "Mobile-optimized design", "A/B testing support"],
    requirements: ["Any website or React app", "Optional: Email service for notifications"],
    includes: ["Full source code", "Setup documentation", "Integration examples", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "reviews", name: "Review Display", icon: Star, containerId: "demo-reviews", color: "#10b981", 
    description: "Showcase customer testimonials", price: 79, priceId: "price_widget_reviews",
    fullDescription: "Build trust instantly by showcasing your best customer reviews. Pulls from Google, Yelp, and Facebook or use your own testimonials. Beautiful carousel and grid layouts included.",
    features: ["Google/Yelp/Facebook sync", "Star rating display", "Photo testimonials", "Carousel & grid layouts", "Schema markup for SEO", "Filter by rating", "Moderation dashboard"],
    requirements: ["Any website", "Optional: API keys for review platforms"],
    includes: ["Full source code", "Platform integration guide", "Styling customization docs", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "booking", name: "Booking Calendar", icon: Calendar, containerId: "demo-booking", color: "#f59e0b", 
    description: "Schedule appointments seamlessly", price: 129, priceId: "price_widget_booking",
    fullDescription: "Let customers book appointments 24/7 without the back-and-forth. Syncs with Google Calendar, handles time zones, sends reminders, and prevents double-bookings automatically.",
    features: ["Real-time availability", "Google Calendar sync", "Automatic reminders", "Time zone detection", "Buffer time between appointments", "Service duration settings", "Deposit collection ready"],
    requirements: ["React or vanilla JS", "Optional: Google Calendar API", "Optional: Stripe for deposits"],
    includes: ["Full source code", "Calendar integration guide", "Reminder setup docs", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "analytics", name: "Analytics Dashboard", icon: BarChart3, containerId: "demo-analytics", color: "#6366f1", 
    description: "Track website performance metrics", price: 199, priceId: "price_widget_analytics",
    fullDescription: "Privacy-focused analytics that gives you the insights you need without compromising visitor privacy. Real-time dashboards, conversion tracking, and heatmaps - no cookies required.",
    features: ["Real-time visitor tracking", "Page view analytics", "Click heatmaps", "Conversion funnels", "Custom event tracking", "GDPR/CCPA compliant", "No cookies required"],
    requirements: ["Any website", "Node.js backend for data storage"],
    includes: ["Frontend widget code", "Backend API code", "Database schema", "Dashboard UI", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "chat", name: "Live Chat", icon: MessageCircle, containerId: "demo-chat", color: "#ec4899", 
    description: "Real-time customer support widget", price: 149, priceId: "price_widget_chat",
    fullDescription: "Engage visitors in real-time with a beautiful chat widget. AI-powered auto-responses handle common questions while you're away. Full conversation history and team inbox included.",
    features: ["Real-time messaging", "AI auto-responses", "Offline message capture", "File sharing", "Typing indicators", "Team inbox", "Mobile app notifications"],
    requirements: ["React or vanilla JS", "WebSocket-capable backend", "Optional: OpenAI for AI responses"],
    includes: ["Chat widget code", "Backend server code", "Admin dashboard UI", "AI integration guide", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "crm", name: "CRM Pipeline", icon: Users, containerId: "demo-crm", color: "#14b8a6", 
    description: "Manage customer relationships", price: 249, priceId: "price_widget_crm",
    fullDescription: "Visual sales pipeline built for service businesses. Drag-and-drop deal management, automated follow-ups, and revenue forecasting. Stop losing leads and start closing more deals.",
    features: ["Kanban pipeline view", "Drag-and-drop deals", "Automated stage transitions", "Follow-up reminders", "Email integration", "Calendar sync", "Revenue forecasting", "Win/loss analytics"],
    requirements: ["React frontend", "Node.js/Express backend", "PostgreSQL database"],
    includes: ["Complete CRM frontend", "Backend API", "Database migrations", "Email templates", "Setup walkthrough", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "crew-tracker", name: "Crew Tracker", icon: MapPin, containerId: "demo-crew-tracker", color: "#f97316", 
    description: "GPS clock-in for field teams", price: 179, priceId: "price_widget_crew_tracker",
    fullDescription: "Know where your team is and track hours accurately with GPS-verified time tracking. Geofencing ensures clock-ins only happen on job sites. Export timesheets directly to payroll.",
    features: ["GPS clock-in/out", "Photo verification", "Geofencing by job site", "Real-time location", "Break reminders", "Overtime calculations", "Timesheet export", "Payroll integration"],
    requirements: ["React Native or web app", "Node.js backend", "Mobile device with GPS"],
    includes: ["Web dashboard code", "Mobile-ready components", "Backend API", "Payroll export templates", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "proposal", name: "Proposal Builder", icon: FileText, containerId: "demo-proposal", color: "#8b5cf6", 
    description: "Create professional proposals", price: 199, priceId: "price_widget_proposal",
    fullDescription: "Create stunning proposals in minutes, not hours. Customizable templates, dynamic pricing tables, e-signature capture, and Stripe integration for instant deposits.",
    features: ["Customizable templates", "Dynamic pricing tables", "E-signature capture", "Stripe payment integration", "Deposit collection", "Expiration tracking", "Client portal", "Automated follow-ups"],
    requirements: ["React frontend", "Node.js backend", "Stripe account for payments"],
    includes: ["Proposal builder UI", "Template system", "E-signature integration", "Backend API", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "seo", name: "SEO Manager", icon: TrendingUp, containerId: "demo-seo", color: "#22c55e", 
    description: "Optimize search visibility", price: 149, priceId: "price_widget_seo",
    fullDescription: "Audit your website's SEO health and get actionable recommendations. Track keyword rankings, monitor competitors, and generate schema markup automatically.",
    features: ["On-page SEO audit", "Keyword rank tracking", "Competitor monitoring", "Schema markup generator", "Meta tag optimizer", "Core Web Vitals check", "Weekly email reports"],
    requirements: ["Any website", "Node.js for backend features", "Optional: Google Search Console API"],
    includes: ["Audit tool code", "Tracking dashboard", "Schema generators", "Report templates", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "weather", name: "Weather Scheduling", icon: Cloud, containerId: "demo-weather", color: "#0ea5e9", 
    description: "Weather-aware job scheduling", price: 99, priceId: "price_widget_weather",
    fullDescription: "Never get caught in the rain again. Automatically checks weather forecasts and alerts you to reschedule outdoor jobs. Integrates with your calendar and notifies affected customers.",
    features: ["7-day weather forecasts", "Automatic delay alerts", "Customer notifications", "Calendar integration", "Weather threshold settings", "Job site locations", "Reschedule suggestions"],
    requirements: ["Any website or app", "Weather API key (free tier available)"],
    includes: ["Weather widget code", "Notification system", "Calendar integration", "Setup guide", "30-day email support", "Lifetime updates"]
  },
  { 
    id: "pulse", name: "Pulse", icon: Activity, containerId: "demo-pulse", color: "#ef4444", 
    description: "AI predictive quant system with 65%+ accuracy", price: 499, priceId: "price_1SwJOePCLBtdVWVNUZOlCId8",
    fullDescription: "Pulse is our flagship AI predictive system with a verified 65-70% win rate across 100,000+ predictions. Harness institutional-grade quant intelligence for trading, forecasting, and data-driven decision making. Every prediction is hashed to DarkWave Smart Chain for immutable verification.",
    features: ["65-70% verified win rate", "100,000+ prediction track record", "Real-time market signals", "Multi-asset analysis", "Blockchain-verified predictions", "1-day & 7-day forecasts", "Confidence scoring", "API access included", "Historical backtesting"],
    requirements: ["API integration capability", "Secure server environment recommended"],
    includes: ["Pulse widget code", "Full API documentation", "Prediction endpoints", "Webhook integration", "Historical data access", "Priority email support", "Lifetime updates", "Trust Shield certification"]
  },
  { 
    id: "pulse-pro", name: "Pulse Pro API", icon: Zap, containerId: "demo-pulse-pro", color: "#f59e0b", 
    description: "Unlimited API access to Pulse predictions", price: 1499, priceId: "price_1SwJOfPCLBtdVWVNJICDoloi",
    fullDescription: "Full programmatic access to DarkWave Pulse with unlimited API calls. Build your own applications, trading bots, or analytics dashboards powered by our 65%+ accurate predictive engine. Includes backtesting suite and custom model training.",
    features: ["Unlimited API calls", "All Pulse Basic features", "Custom prediction parameters", "Backtesting suite", "Bulk historical data export", "Custom webhooks", "Rate limit: 1000/min", "Multi-exchange support", "Advanced analytics dashboard"],
    requirements: ["Developer knowledge", "Server for API integration", "API authentication handling"],
    includes: ["Complete API access", "SDK libraries (JS, Python)", "Backtesting tools", "Trading bot templates", "Dedicated support channel", "1-hour onboarding call", "Lifetime updates"]
  },
  { 
    id: "pulse-enterprise", name: "Pulse Enterprise", icon: Shield, containerId: "demo-pulse-enterprise", color: "#8b5cf6", 
    description: "White-label quant system for institutions", price: 3999, priceId: "price_1SwJOfPCLBtdVWVNEGp2zZUu",
    fullDescription: "Deploy DarkWave Pulse under your own brand. Full white-label rights, dedicated infrastructure, custom model training, and SLA-backed uptime. Perfect for funds, brokerages, and fintech platforms seeking institutional-grade predictive intelligence.",
    features: ["All Pulse Pro features", "White-label rights", "Custom branding", "Dedicated infrastructure", "Custom model training", "99.9% SLA uptime", "Priority 24/7 support", "Compliance documentation", "On-premise deployment option"],
    requirements: ["Enterprise infrastructure", "Legal entity for licensing", "Technical integration team"],
    includes: ["Full source code license", "White-label kit", "Dedicated account manager", "Custom integration support", "Quarterly strategy calls", "SLA agreement", "Compliance package"]
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "widget" | "snippet";
}

interface WidgetInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  containerId: string;
  color: string;
  description: string;
  price: number;
  priceId: string;
  fullDescription: string;
  features: string[];
  requirements: string[];
  includes: string[];
}

// Widget name mapping for full code lookup
const WIDGET_MAP: Record<string, string> = {
  "TrustLayer Analytics Widget": "tl-analytics",
  "Trade Estimator Widget": "tl-estimator",
  "Booking Widget": "tl-booking",
  "Lead Capture Widget": "tl-lead-capture",
  "Review Display Widget": "tl-reviews",
  "SEO Manager Widget": "tl-seo",
  "Live Chat Widget": "tl-chat",
  "Proposal Builder Widget": "tl-proposal",
  "Crew Tracker / GPS Clock-In": "tl-crew-tracker",
  "CRM Pipeline Manager": "tl-crm",
  "Weather-Based Scheduling": "tl-weather",
};

export default function TrustLayerHub() {
  const [apps, setApps] = useState<EcosystemApp[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [stats, setStats] = useState<HubStats>({ totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [codeModal, setCodeModal] = useState<{ open: boolean; title: string; code: string; lines: number; loading: boolean }>({
    open: false,
    title: "",
    code: "",
    lines: 0,
    loading: false
  });
  const [selectedWidget, setSelectedWidget] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const addToCart = (item: CartItem) => {
    if (!cart.find(c => c.id === item.id)) {
      setCart(prev => [...prev, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (method: "stripe" | "coinbase") => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    
    try {
      const endpoint = method === "stripe" 
        ? "/api/payments/stripe/cart-checkout"
        : "/api/payments/coinbase/cart-checkout";
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      
      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const openFullCode = async (snippetTitle: string) => {
    const widgetName = WIDGET_MAP[snippetTitle];
    if (!widgetName) {
      return;
    }
    
    setCodeModal({ open: true, title: snippetTitle, code: "", lines: 0, loading: true });
    
    try {
      const res = await fetch(`/api/ecosystem/widget-code/${widgetName}`);
      const data = await res.json();
      if (data.success) {
        setCodeModal({ open: true, title: snippetTitle, code: data.code, lines: data.lines, loading: false });
      } else {
        setCodeModal(prev => ({ ...prev, loading: false, code: "// Error loading code" }));
      }
    } catch (err) {
      setCodeModal(prev => ({ ...prev, loading: false, code: "// Error loading code" }));
    }
  };

  const copyFullCode = async () => {
    await navigator.clipboard.writeText(codeModal.code);
    setCopiedId("modal");
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/ecosystem/apps").then(r => r.json()),
      fetch("/api/ecosystem/snippets").then(r => r.json()),
      fetch("/api/ecosystem/stats").then(r => r.json())
    ]).then(([appsData, snippetsData, statsData]) => {
      setApps(appsData.apps || []);
      setSnippets(snippetsData.snippets || []);
      setStats(statsData.stats || { totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Load live widget previews - ALL 11 widgets
  useEffect(() => {
    const loadWidgets = () => {
      // All widget configurations
      const widgetConfigs = [
        { name: 'tl-estimator', container: 'demo-estimator', color: '#3b82f6', extra: { 'data-trade': 'painting' } },
        { name: 'tl-lead-capture', container: 'demo-lead-capture', color: '#8b5cf6' },
        { name: 'tl-reviews', container: 'demo-reviews', color: '#10b981' },
        { name: 'tl-booking', container: 'demo-booking', color: '#f59e0b' },
        { name: 'tl-analytics', container: 'demo-analytics', color: '#6366f1' },
        { name: 'tl-chat', container: 'demo-chat', color: '#ec4899' },
        { name: 'tl-crm', container: 'demo-crm', color: '#14b8a6' },
        { name: 'tl-crew-tracker', container: 'demo-crew-tracker', color: '#f97316' },
        { name: 'tl-proposal', container: 'demo-proposal', color: '#8b5cf6' },
        { name: 'tl-seo', container: 'demo-seo', color: '#22c55e' },
        { name: 'tl-weather', container: 'demo-weather', color: '#0ea5e9' },
      ];
      
      // Clear existing widget content
      widgetConfigs.forEach(({ container }) => {
        const el = document.getElementById(container);
        if (el) el.innerHTML = '';
      });
      
      // Remove any existing widget scripts and styles
      document.querySelectorAll('script[data-widget-demo]').forEach(s => s.remove());
      document.querySelectorAll('style[id^="tl-"]').forEach(s => s.remove());
      
      // Load all widgets
      widgetConfigs.forEach(({ name, container, color, extra }) => {
        const script = document.createElement('script');
        script.src = `/widgets/${name}.js`;
        script.setAttribute('data-widget-demo', 'true');
        script.setAttribute('data-container', container);
        script.setAttribute('data-primary-color', color);
        if (extra) {
          Object.entries(extra).forEach(([key, value]) => {
            script.setAttribute(key, value);
          });
        }
        document.body.appendChild(script);
      });
    };
    
    // Delay slightly to ensure containers are mounted
    const timer = setTimeout(loadWidgets, 500);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    fetch(`/api/ecosystem/snippets/${id}/download`, { method: "POST" });
  };

  const likeSnippet = (id: string) => {
    fetch(`/api/ecosystem/snippets/${id}/like`, { method: "POST" });
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Trust Layer Hub - Code Marketplace & Developer Ecosystem"
        description="DarkWave Trust Layer Hub - Share, discover, and sync code snippets across all connected applications. The premium marketplace for verified widgets and components."
        keywords="code marketplace, developer hub, code snippets, widgets, DarkWave Trust Layer, blockchain verified code"
        type="website"
        url="https://darkwavestudios.com/hub"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Trust Layer Hub", url: "https://darkwavestudios.com/hub" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,200,255,0.1),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base lg:text-xl gradient-text" data-testid="text-hub-title">Trust Layer Hub</h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">DarkWave Ecosystem</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-projects">Portfolio</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-services">Services</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold" data-testid="link-contact">
              Get Started
            </Link>
          </nav>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-white/10 px-4 py-4">
            <nav className="flex flex-col gap-3">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-projects-mobile">Portfolio</Link>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-services-mobile">Services</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold text-center" data-testid="link-contact-mobile">Get Started</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* BENTO GRID SECTION 1: Hero + Stats - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {/* Hero Card - 3-col mobile / 8-col desktop */}
          <div className="col-span-3 lg:col-span-8">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-8 gradient-border relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
              <div className="absolute top-0 right-0 w-48 lg:w-96 h-48 lg:h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-primary/20 text-primary text-[10px] lg:text-xs font-semibold mb-2 lg:mb-4" data-testid="badge-blockchain-verified">
                  <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  Blockchain Verified
                </div>
                <h2 className="text-xl lg:text-4xl font-bold font-display mb-2 lg:mb-4" data-testid="text-hero-title">
                  The Developer <span className="gradient-text">Marketplace</span>
                </h2>
                <p className="text-muted-foreground text-xs lg:text-base max-w-xl mb-3 lg:mb-6 line-clamp-2 lg:line-clamp-none" data-testid="text-hero-description">
                  Share, discover, and sync code snippets across all connected DarkWave applications.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  <a href="#snippets" className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold" data-testid="button-browse-snippets">
                    Browse <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 glass px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold hover:bg-white/10 transition-colors" data-testid="button-connect-app">
                    Connect App
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - 3-col mobile / 4-col desktop */}
          <div className="col-span-3 lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-apps">16</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-apps">Live Apps</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-snippets">19</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-snippets">Snippets</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-widgets">11</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-widgets">Widgets</div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 2: Connected Apps - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        {apps.length > 0 && (
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
            <div className="col-span-3 lg:col-span-12">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-apps-title">
                    Connected <span className="gradient-text">Apps</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] lg:text-sm text-muted-foreground">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-green-400 animate-pulse" />
                    <span data-testid="text-active-apps">{apps.length} Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="glass rounded-lg lg:rounded-xl p-2 lg:p-4 hover-lift group cursor-pointer"
                      data-testid={`app-card-${app.id}`}
                    >
                      <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs lg:text-lg flex-shrink-0">
                          {app.logoUrl ? (
                            <img src={app.logoUrl} alt={app.displayName} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            app.displayName.charAt(0)
                          )}
                        </div>
                        {app.isVerified && (
                          <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                        )}
                      </div>
                      <h4 className="font-bold font-display text-[10px] lg:text-sm group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-app-name-${app.id}`}>{app.displayName}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENTO GRID SECTION 3: Search + Categories - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section id="snippets" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6 scroll-mt-24">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 mb-3 lg:mb-4">
                <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-snippets-title">
                  Code <span className="gradient-text">Snippets</span>
                </h3>
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 lg:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "glass hover:bg-white/10"
                      }`}
                      data-testid={`button-category-${cat.id}`}
                    >
                      <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 4: Snippets Grid - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 animate-pulse">
                  <div className="h-4 lg:h-6 bg-white/10 rounded w-1/2 mb-2 lg:mb-4" />
                  <div className="h-3 lg:h-4 bg-white/10 rounded w-full mb-1 lg:mb-2" />
                  <div className="h-16 lg:h-24 bg-white/10 rounded" />
                </div>
              ))}
            </>
          ) : filteredSnippets.length > 0 ? (
            <>
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 gradient-border hover-lift group"
                  data-testid={`snippet-${snippet.id}`}
                >
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5 lg:mb-1">
                        <h4 className="font-bold font-display text-sm lg:text-lg truncate" data-testid={`text-snippet-title-${snippet.id}`}>{snippet.title}</h4>
                        {snippet.isPremium && (
                          <span className="px-1.5 lg:px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[8px] lg:text-[10px] font-semibold flex-shrink-0" data-testid={`badge-premium-${snippet.id}`}>
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] lg:text-sm text-muted-foreground line-clamp-1 lg:line-clamp-2" data-testid={`text-snippet-description-${snippet.id}`}>{snippet.description}</p>
                    </div>
                    <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-md lg:rounded-lg bg-primary/20 text-primary text-[8px] lg:text-xs font-mono ml-2 flex-shrink-0" data-testid={`text-snippet-language-${snippet.id}`}>
                      {snippet.language}
                    </span>
                  </div>

                  <div className="relative mb-2 lg:mb-4">
                    <pre className="bg-black/40 rounded-lg lg:rounded-xl p-2 lg:p-4 overflow-x-auto text-[10px] lg:text-xs font-mono text-gray-300 max-h-20 lg:max-h-32">
                      <code>{snippet.code.slice(0, 200)}{snippet.code.length > 200 ? "..." : ""}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(snippet.id, snippet.code)}
                      className="absolute top-1.5 lg:top-2 right-1.5 lg:right-2 p-1.5 lg:p-2 rounded-md lg:rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      data-testid={`button-copy-${snippet.id}`}
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                    </button>
                  </div>

                  <div className="hidden lg:flex flex-wrap gap-1.5 mb-3" data-testid={`container-snippet-tags-${snippet.id}`}>
                    {snippet.tags?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-foreground" data-testid={`tag-${snippet.id}-${i}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-sm text-muted-foreground">
                      <span className="flex items-center gap-0.5 lg:gap-1" data-testid={`text-snippet-downloads-${snippet.id}`}>
                        <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.downloads}
                      </span>
                      <button
                        onClick={() => likeSnippet(snippet.id)}
                        className="flex items-center gap-0.5 lg:gap-1 hover:text-red-400 transition-colors"
                        data-testid={`button-like-${snippet.id}`}
                      >
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.likes}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {WIDGET_MAP[snippet.title] && (
                        <button
                          onClick={() => openFullCode(snippet.title)}
                          className="text-[8px] lg:text-xs px-2 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                          data-testid={`button-view-full-${snippet.id}`}
                        >
                          View Full Code
                        </button>
                      )}
                      <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid={`text-snippet-author-${snippet.id}`}>
                        by <span className="text-primary">{snippet.authorName || "DarkWave"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-3 lg:col-span-12 glass-card rounded-xl lg:rounded-2xl p-6 lg:p-12 text-center" data-testid="empty-state-snippets">
              <Code2 className="w-10 h-10 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-2 lg:mb-4 opacity-50" />
              <h4 className="text-base lg:text-xl font-bold font-display mb-1 lg:mb-2" data-testid="text-empty-title">No Snippets Yet</h4>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6" data-testid="text-empty-description">
                Be the first to share code with the DarkWave ecosystem.
              </p>
              <Link 
                href="/contact"
                className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold"
                data-testid="button-contribute"
              >
                Contribute <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* WIDGET STOREFRONT - Compact Tab/Carousel Interface */}
        <section className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-6 gradient-border mb-4 lg:mb-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <h3 className="font-display font-bold text-sm lg:text-xl" data-testid="text-live-preview-title">Widget Storefront</h3>
              <span className="hidden lg:inline px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-semibold">{widgetsList.length} LIVE WIDGETS</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedWidget((prev) => (prev - 1 + widgetsList.length) % widgetsList.length)}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all"
                data-testid="widget-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setSelectedWidget((prev) => (prev + 1) % widgetsList.length)}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all"
                data-testid="widget-next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Widget Selector Tabs - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {widgetsList.map((widget, index) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  onClick={() => setSelectedWidget(index)}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedWidget === index
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                  data-testid={`widget-tab-${widget.id}`}
                >
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">{widget.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Selected Widget Preview */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Widget Info */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${widgetsList[selectedWidget].color}20` }}
                >
                  {(() => {
                    const Icon = widgetsList[selectedWidget].icon;
                    return <Icon className="w-6 h-6" style={{ color: widgetsList[selectedWidget].color }} />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold font-display text-lg lg:text-xl">{widgetsList[selectedWidget].name}</h4>
                    <div className="text-xl lg:text-2xl font-bold text-primary">${widgetsList[selectedWidget].price}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] font-semibold">LIVE DEMO</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{widgetsList[selectedWidget].description}</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => addToCart({ 
                    id: widgetsList[selectedWidget].id, 
                    name: widgetsList[selectedWidget].name, 
                    price: widgetsList[selectedWidget].price,
                    type: "widget"
                  })}
                  className={`btn-glow inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    cart.find(c => c.id === widgetsList[selectedWidget].id)
                      ? "bg-green-600 text-white"
                      : "bg-primary text-white"
                  }`}
                  data-testid={`add-to-cart-${widgetsList[selectedWidget].id}`}
                >
                  {cart.find(c => c.id === widgetsList[selectedWidget].id) ? (
                    <><Check className="w-4 h-4" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart - ${widgetsList[selectedWidget].price}</>
                  )}
                </button>
                <button className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">
                  <Code2 className="w-4 h-4" /> View Source
                </button>
              </div>
            </div>
            
            {/* Widget Preview Container */}
            <div className="order-1 lg:order-2 bg-white rounded-xl overflow-hidden text-gray-800" style={{ minHeight: '320px' }}>
              {/* Trade Estimator Demo */}
              {widgetsList[selectedWidget].id === "estimator" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-gray-900">Project Estimator</div>
                    <div className="text-xs text-gray-500">Get instant pricing</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between text-sm"><span>Project Type</span><select className="border rounded px-2 py-1 text-xs"><option>Interior Painting</option></select></div>
                    <div className="flex justify-between text-sm"><span>Square Feet</span><input type="number" className="border rounded px-2 py-1 w-20 text-xs" value="1500" readOnly /></div>
                    <div className="flex justify-between text-sm"><span>Rooms</span><input type="number" className="border rounded px-2 py-1 w-20 text-xs" value="4" readOnly /></div>
                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                      <div className="text-xs text-blue-600 mb-1">Estimated Total</div>
                      <div className="text-2xl font-bold text-blue-700">$2,450</div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold mt-3">Get Full Quote</button>
                </div>
              )}
              {/* Lead Capture Demo */}
              {widgetsList[selectedWidget].id === "lead-capture" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-gray-900">Get a Free Consultation</div>
                    <div className="text-xs text-gray-500">We'll get back to you within 24 hours</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Your Name" defaultValue="John Smith" />
                    <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email Address" defaultValue="john@email.com" />
                    <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Phone Number" defaultValue="(555) 123-4567" />
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none" rows={2} placeholder="Tell us about your project"></textarea>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold mt-3">Submit Request</button>
                </div>
              )}
              {/* Reviews Demo */}
              {widgetsList[selectedWidget].id === "reviews" && (
                <div className="p-4 h-full">
                  <div className="text-center mb-3">
                    <div className="text-lg font-bold text-gray-900">Customer Reviews</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500">{"★★★★★".split("").map((s,i)=><span key={i}>{s}</span>)} <span className="text-gray-500 text-sm ml-1">4.9 (127 reviews)</span></div>
                  </div>
                  <div className="space-y-3">
                    {[{name:"Sarah M.", text:"Excellent work! Transformed our kitchen.", rating:5},{name:"Mike R.", text:"Professional team, on time and on budget.", rating:5},{name:"Lisa T.", text:"Highly recommend for any painting project.", rating:5}].map((r,i)=>(
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{r.name}</span>
                          <span className="text-yellow-500 text-xs">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Booking Demo */}
              {widgetsList[selectedWidget].id === "booking" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="text-center mb-3">
                    <div className="text-lg font-bold text-gray-900">Book an Appointment</div>
                    <div className="text-xs text-gray-500">Select a date and time</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
                    {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} className="text-gray-400">{d}</div>)}
                    {[...Array(31)].map((_,i)=><div key={i} className={`p-1 rounded ${i===14?"bg-amber-500 text-white":i>14&&i<18?"bg-amber-100":"hover:bg-gray-100"}`}>{i+1}</div>)}
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {["9:00 AM","10:30 AM","2:00 PM","4:30 PM"].map((t,i)=><button key={i} className={`px-3 py-1 rounded text-xs ${i===1?"bg-amber-500 text-white":"border hover:bg-gray-50"}`}>{t}</button>)}
                  </div>
                  <button className="w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold mt-auto">Confirm Booking</button>
                </div>
              )}
              {/* Analytics Demo */}
              {widgetsList[selectedWidget].id === "analytics" && (
                <div className="p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-900">Analytics</div>
                    <select className="text-xs border rounded px-2 py-1"><option>Last 7 days</option></select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-indigo-50 rounded-lg p-2 text-center"><div className="text-lg font-bold text-indigo-600">2,847</div><div className="text-[10px] text-gray-500">Visitors</div></div>
                    <div className="bg-green-50 rounded-lg p-2 text-center"><div className="text-lg font-bold text-green-600">4.2%</div><div className="text-[10px] text-gray-500">Conv Rate</div></div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center"><div className="text-lg font-bold text-purple-600">$12.4k</div><div className="text-[10px] text-gray-500">Revenue</div></div>
                  </div>
                  <div className="h-24 flex items-end gap-1">
                    {[40,65,45,80,60,90,75].map((h,i)=><div key={i} className="flex-1 bg-indigo-500 rounded-t" style={{height:`${h}%`}}></div>)}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d}>{d}</span>)}</div>
                </div>
              )}
              {/* Chat Demo */}
              {widgetsList[selectedWidget].id === "chat" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">AI</div>
                    <div><div className="font-semibold text-sm">Support Chat</div><div className="text-[10px] text-green-500">● Online</div></div>
                  </div>
                  <div className="flex-1 space-y-2 overflow-auto">
                    <div className="flex gap-2"><div className="bg-gray-100 rounded-lg p-2 text-xs max-w-[80%]">Hi! How can I help you today?</div></div>
                    <div className="flex gap-2 justify-end"><div className="bg-pink-500 text-white rounded-lg p-2 text-xs max-w-[80%]">I need a quote for my project</div></div>
                    <div className="flex gap-2"><div className="bg-gray-100 rounded-lg p-2 text-xs max-w-[80%]">I'd be happy to help! What type of project are you looking for?</div></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input className="flex-1 border rounded-full px-3 py-2 text-xs" placeholder="Type a message..." />
                    <button className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">→</button>
                  </div>
                </div>
              )}
              {/* CRM Demo */}
              {widgetsList[selectedWidget].id === "crm" && (
                <div className="p-4 h-full">
                  <div className="text-lg font-bold text-gray-900 mb-3">Sales Pipeline</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[{stage:"Lead",color:"bg-gray-200",items:["ABC Corp","XYZ Inc"]},{stage:"Quoted",color:"bg-amber-100",items:["Smith Home"]},{stage:"Won",color:"bg-green-100",items:["Johnson Proj"]}].map((s,i)=>(
                      <div key={i} className="min-w-[100px] flex-shrink-0">
                        <div className={`${s.color} rounded-t-lg px-2 py-1 text-xs font-semibold`}>{s.stage}</div>
                        <div className="border border-t-0 rounded-b-lg p-1 space-y-1 min-h-[100px]">
                          {s.items.map((item,j)=><div key={j} className="bg-white border rounded p-1.5 text-[10px] shadow-sm">{item}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Crew Tracker Demo */}
              {widgetsList[selectedWidget].id === "crew-tracker" && (
                <div className="p-4 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">Crew Status</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">3 Active</span>
                  </div>
                  <div className="space-y-2">
                    {[{name:"Mike Johnson",status:"On Site",location:"123 Main St",time:"8:32 AM"},{name:"Sarah Williams",status:"In Transit",location:"456 Oak Ave",time:"9:15 AM"},{name:"Tom Brown",status:"On Break",location:"789 Pine Rd",time:"10:00 AM"}].map((c,i)=>(
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">{c.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div className="flex-1"><div className="text-sm font-semibold">{c.name}</div><div className="text-[10px] text-gray-500">{c.location}</div></div>
                        <div className="text-right"><div className={`text-[10px] px-2 py-0.5 rounded-full ${c.status==="On Site"?"bg-green-100 text-green-700":c.status==="In Transit"?"bg-blue-100 text-blue-700":"bg-gray-200 text-gray-600"}`}>{c.status}</div><div className="text-[10px] text-gray-400 mt-0.5">{c.time}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Proposal Demo */}
              {widgetsList[selectedWidget].id === "proposal" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="text-lg font-bold text-gray-900 mb-3">Proposal Builder</div>
                  <div className="border rounded-lg p-3 mb-3 flex-1">
                    <div className="flex justify-between text-sm mb-2"><span className="font-semibold">Kitchen Renovation</span><span className="text-purple-600 font-bold">$8,500</span></div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between"><span>Cabinet Painting</span><span>$2,500</span></div>
                      <div className="flex justify-between"><span>Wall Painting</span><span>$1,800</span></div>
                      <div className="flex justify-between"><span>Ceiling Work</span><span>$1,200</span></div>
                      <div className="flex justify-between"><span>Materials</span><span>$3,000</span></div>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between text-sm font-semibold"><span>Total</span><span>$8,500</span></div>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold">Send Proposal</button>
                </div>
              )}
              {/* SEO Demo */}
              {widgetsList[selectedWidget].id === "seo" && (
                <div className="p-4 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">SEO Score</div>
                    <div className="text-2xl font-bold text-green-600">85<span className="text-sm text-gray-400">/100</span></div>
                  </div>
                  <div className="space-y-2">
                    {[{label:"Meta Tags",score:95,color:"bg-green-500"},{label:"Page Speed",score:78,color:"bg-amber-500"},{label:"Mobile",score:92,color:"bg-green-500"},{label:"Keywords",score:75,color:"bg-amber-500"}].map((s,i)=>(
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1"><span>{s.label}</span><span>{s.score}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${s.color}`} style={{width:`${s.score}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-2 bg-amber-50 rounded-lg text-xs text-amber-700">3 issues found. <span className="underline cursor-pointer">View details</span></div>
                </div>
              )}
              {/* Weather Demo */}
              {widgetsList[selectedWidget].id === "weather" && (
                <div className="p-4 h-full">
                  <div className="text-lg font-bold text-gray-900 mb-3">Weather Schedule</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[{day:"Mon",icon:"☀️",temp:"72°",status:"Good"},{day:"Tue",icon:"🌤",temp:"68°",status:"Good"},{day:"Wed",icon:"🌧",temp:"55°",status:"Delay"},{day:"Thu",icon:"☀️",temp:"70°",status:"Good"},{day:"Fri",icon:"☀️",temp:"74°",status:"Good"}].map((d,i)=>(
                      <div key={i} className={`min-w-[60px] text-center p-2 rounded-lg ${d.status==="Delay"?"bg-red-50 border-red-200":"bg-sky-50"} border`}>
                        <div className="text-xs font-semibold">{d.day}</div>
                        <div className="text-2xl my-1">{d.icon}</div>
                        <div className="text-sm font-bold">{d.temp}</div>
                        <div className={`text-[10px] mt-1 ${d.status==="Delay"?"text-red-600":"text-green-600"}`}>{d.status}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-sky-50 rounded-lg text-xs text-sky-700">Wednesday rain expected - consider rescheduling outdoor work.</div>
                </div>
              )}
              {/* Pulse Demo */}
              {widgetsList[selectedWidget].id === "pulse" && (
                <div className="p-4 h-full bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">Pulse</div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-green-700 font-semibold">LIVE</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                      <div className="text-xl font-bold text-green-600">67.3%</div>
                      <div className="text-[10px] text-gray-500">Win Rate</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                      <div className="text-xl font-bold text-blue-600">103.2K</div>
                      <div className="text-[10px] text-gray-500">Predictions</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                      <div className="text-xl font-bold text-purple-600">94.1%</div>
                      <div className="text-[10px] text-gray-500">Confidence</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[{asset:"BTC/USD",signal:"LONG",conf:89,time:"2m ago"},{asset:"ETH/USD",signal:"SHORT",conf:76,time:"8m ago"},{asset:"SOL/USD",signal:"LONG",conf:92,time:"12m ago"}].map((s,i)=>(
                      <div key={i} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{s.asset}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${s.signal==="LONG"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{s.signal}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-700">{s.conf}%</div>
                          <div className="text-[9px] text-gray-400">{s.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center text-white text-[8px]">⛓</div>
                    <span>Predictions verified on DarkWave Smart Chain</span>
                  </div>
                </div>
              )}
              {/* Pulse Pro API Demo */}
              {widgetsList[selectedWidget].id === "pulse-pro" && (
                <div className="p-4 h-full bg-gradient-to-br from-amber-50 to-yellow-50 font-mono text-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-gray-900">Pulse API Console</div>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-[10px] font-semibold">PRO</span>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 text-green-400 overflow-x-auto">
                    <div className="text-[10px] mb-1 text-gray-500"># GET /api/v1/pulse/predict</div>
                    <div className="text-[10px]">{"{"}</div>
                    <div className="text-[10px] pl-3">"asset": "BTC/USD",</div>
                    <div className="text-[10px] pl-3">"signal": "LONG",</div>
                    <div className="text-[10px] pl-3">"confidence": 0.89,</div>
                    <div className="text-[10px] pl-3">"timestamp": "2026-02-02T09:15:00Z",</div>
                    <div className="text-[10px] pl-3">"hash": "0x7f3a9c..."</div>
                    <div className="text-[10px]">{"}"}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="text-lg font-bold text-amber-600">∞</div>
                      <div className="text-[10px] text-gray-500">API Calls</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="text-lg font-bold text-amber-600">1000/m</div>
                      <div className="text-[10px] text-gray-500">Rate Limit</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-gray-600">SDK available: JavaScript, Python, Go</div>
                </div>
              )}
              {/* Pulse Enterprise Demo */}
              {widgetsList[selectedWidget].id === "pulse-enterprise" && (
                <div className="p-4 h-full bg-gradient-to-br from-purple-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">Enterprise Suite</div>
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-[10px] font-semibold">WHITE-LABEL</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                    <div className="text-xs text-gray-500 mb-1">Your Brand Here</div>
                    <div className="h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded flex items-center justify-center text-white text-sm font-bold">ACME PREDICTIONS™</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white rounded-lg p-2 shadow-sm text-center">
                      <div className="text-green-600 font-bold">99.9%</div>
                      <div className="text-[10px] text-gray-500">SLA Uptime</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm text-center">
                      <div className="text-purple-600 font-bold">24/7</div>
                      <div className="text-[10px] text-gray-500">Priority Support</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-600">
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> Custom model training</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> Dedicated infrastructure</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> Compliance documentation</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> On-premise deployment</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Widget Pagination Dots (Mobile) */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {widgetsList.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedWidget(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === selectedWidget ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'
                }`}
                data-testid={`widget-dot-${index}`}
              />
            ))}
          </div>

          {/* Detailed Widget Info Panel */}
          <div className="mt-6 glass-card rounded-2xl p-4 lg:p-6 gradient-border" data-testid="widget-info-panel">
            {/* Trust Badge Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-white/10" data-testid="trust-badges">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold" data-testid="badge-trust-shield">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified by Trust Shield</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold" data-testid="badge-guardian-shield">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected by Guardian Shield</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold" data-testid="badge-blockchain">
                <FileText className="w-3.5 h-3.5" />
                <span>Blockchain Registered</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-4">
              <h4 className="font-bold text-sm text-primary mb-2">About This Widget</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {widgetsList[selectedWidget].fullDescription}
              </p>
            </div>

            {/* Features, Requirements, Includes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Features */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Features
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Requirements
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Included */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  What's Included
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust & Security Footer */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-primary">DarkWave Smart Chain Verified</div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Every purchase is hashed to the DarkWave blockchain. Your transaction hash is stored in your account for permanent verification. Check authenticity anytime at trustshield.tech
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-white/5 font-mono">SHA-256 Secured</span>
                  <span className="px-2 py-1 rounded bg-white/5 font-mono">Immutable Record</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 6: CTA - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-12 gradient-border text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <div className="relative z-10">
                <h3 className="text-lg lg:text-3xl font-bold font-display mb-2 lg:mb-4" data-testid="text-cta-title">
                  Join the <span className="gradient-text">Trust Layer</span>
                </h3>
                <p className="text-xs lg:text-base text-muted-foreground max-w-2xl mx-auto mb-4 lg:mb-8 line-clamp-2 lg:line-clamp-none">
                  Connect your app to the DarkWave ecosystem. Share code, sync data, and leverage blockchain-verified integrations.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-lg"
                    data-testid="button-apply-access"
                  >
                    Apply for Access <Zap className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  </Link>
                  <a 
                    href="#"
                    className="inline-flex items-center gap-1.5 lg:gap-2 glass px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-sm hover:bg-white/10 transition-colors"
                    data-testid="button-docs"
                  >
                    Docs <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-6 lg:mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="font-display font-bold text-sm lg:text-base gradient-text" data-testid="text-footer-brand">Trust Layer Hub</span>
          </div>
          <div className="text-muted-foreground text-[10px] lg:text-sm" data-testid="text-footer-tagline">Powered by DarkWave Trust Layer Blockchain</div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
          data-testid="floating-cart-button"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {cart.length}
          </span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50" data-testid="cart-drawer">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-white/10 flex flex-col">
            <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">Your Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-semibold">{cart.length} items</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 lg:p-6 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between" data-testid={`cart-item-${item.id}`}>
                  <div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">${item.price}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 lg:p-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${cartTotal}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleCheckout("stripe")}
                  disabled={checkoutLoading}
                  className="w-full btn-glow bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="checkout-stripe"
                >
                  {checkoutLoading ? "Processing..." : <><Zap className="w-4 h-4" /> Pay with Card</>}
                </button>
                <button
                  onClick={() => handleCheckout("coinbase")}
                  disabled={checkoutLoading}
                  className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  data-testid="checkout-coinbase"
                >
                  {checkoutLoading ? "Processing..." : <><Shield className="w-4 h-4" /> Pay with Crypto</>}
                </button>
              </div>
              
              <p className="text-[10px] text-muted-foreground text-center">
                Secure checkout powered by Stripe & Coinbase Commerce
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Code Modal */}
      {codeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="modal-full-code">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setCodeModal(prev => ({ ...prev, open: false }))}
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="font-bold font-display text-lg">{codeModal.title}</h3>
                <p className="text-sm text-muted-foreground">{codeModal.lines} lines of code</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyFullCode}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm"
                  data-testid="button-copy-full"
                >
                  {copiedId === "modal" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCodeModal(prev => ({ ...prev, open: false }))}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {codeModal.loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto text-xs lg:text-sm font-mono text-gray-300 leading-relaxed">
                  <code>{codeModal.code}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
