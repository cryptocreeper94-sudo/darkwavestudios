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
  Trash2
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
  { id: "estimator", name: "Trade Estimator", icon: Calculator, containerId: "demo-estimator", color: "#3b82f6", description: "Instant project pricing calculator for trades", price: 149, priceId: "price_widget_estimator" },
  { id: "lead-capture", name: "Lead Capture", icon: UserPlus, containerId: "demo-lead-capture", color: "#8b5cf6", description: "Convert visitors into qualified leads", price: 99, priceId: "price_widget_lead_capture" },
  { id: "reviews", name: "Review Display", icon: Star, containerId: "demo-reviews", color: "#10b981", description: "Showcase customer testimonials", price: 79, priceId: "price_widget_reviews" },
  { id: "booking", name: "Booking Calendar", icon: Calendar, containerId: "demo-booking", color: "#f59e0b", description: "Schedule appointments seamlessly", price: 129, priceId: "price_widget_booking" },
  { id: "analytics", name: "Analytics Dashboard", icon: BarChart3, containerId: "demo-analytics", color: "#6366f1", description: "Track website performance metrics", price: 199, priceId: "price_widget_analytics" },
  { id: "chat", name: "Live Chat", icon: MessageCircle, containerId: "demo-chat", color: "#ec4899", description: "Real-time customer support widget", price: 149, priceId: "price_widget_chat" },
  { id: "crm", name: "CRM Pipeline", icon: Users, containerId: "demo-crm", color: "#14b8a6", description: "Manage customer relationships", price: 249, priceId: "price_widget_crm" },
  { id: "crew-tracker", name: "Crew Tracker", icon: MapPin, containerId: "demo-crew-tracker", color: "#f97316", description: "GPS clock-in for field teams", price: 179, priceId: "price_widget_crew_tracker" },
  { id: "proposal", name: "Proposal Builder", icon: FileText, containerId: "demo-proposal", color: "#8b5cf6", description: "Create professional proposals", price: 199, priceId: "price_widget_proposal" },
  { id: "seo", name: "SEO Manager", icon: TrendingUp, containerId: "demo-seo", color: "#22c55e", description: "Optimize search visibility", price: 149, priceId: "price_widget_seo" },
  { id: "weather", name: "Weather Scheduling", icon: Cloud, containerId: "demo-weather", color: "#0ea5e9", description: "Weather-aware job scheduling", price: 99, priceId: "price_widget_weather" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "widget" | "snippet";
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
              <span className="hidden lg:inline px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-semibold">11 LIVE WIDGETS</span>
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
            <div className="order-1 lg:order-2 bg-white rounded-xl overflow-hidden" style={{ minHeight: '320px' }}>
              <div id={widgetsList[selectedWidget].containerId} className="w-full h-full" />
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
