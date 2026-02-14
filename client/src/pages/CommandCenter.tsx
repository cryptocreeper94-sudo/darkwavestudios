import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Shield, LayoutDashboard, BarChart3, PenTool, Users,
  FileText, MessageSquare, Calendar, Mail, TrendingUp,
  Globe, Bot, Zap, Lock, Unlock, Eye, Sparkles, Terminal,
  Boxes, CreditCard, Search, Radio, Layers, FolderOpen,
  Megaphone, Store, Newspaper, ArrowLeft, Command, LogOut,
  ChevronRight
} from "lucide-react";

const ADMIN_KEY = "0424";

interface LaunchCard {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image: string;
  glowColor: string;
  badge?: string;
  featured?: boolean;
}

const glowMap: Record<string, string> = {
  "shadow-cyan-500/20": "0 10px 40px rgba(6,182,212,0.2)",
  "shadow-purple-500/20": "0 10px 40px rgba(168,85,247,0.2)",
  "shadow-amber-500/20": "0 10px 40px rgba(245,158,11,0.2)",
  "shadow-emerald-500/20": "0 10px 40px rgba(16,185,129,0.2)",
  "shadow-rose-500/20": "0 10px 40px rgba(244,63,94,0.2)",
  "shadow-sky-500/20": "0 10px 40px rgba(14,165,233,0.2)",
  "shadow-indigo-500/20": "0 10px 40px rgba(99,102,241,0.2)",
  "shadow-green-500/20": "0 10px 40px rgba(34,197,94,0.2)",
  "shadow-red-500/20": "0 10px 40px rgba(239,68,68,0.2)",
  "shadow-blue-500/20": "0 10px 40px rgba(59,130,246,0.2)",
  "shadow-yellow-500/20": "0 10px 40px rgba(234,179,8,0.2)",
  "shadow-pink-500/20": "0 10px 40px rgba(236,72,153,0.2)",
  "shadow-violet-500/20": "0 10px 40px rgba(139,92,246,0.2)",
  "shadow-slate-500/20": "0 10px 40px rgba(100,116,139,0.2)",
  "shadow-gray-500/20": "0 10px 40px rgba(107,114,128,0.2)",
};

interface CommandCategory {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  cards: LaunchCard[];
}

const categories: CommandCategory[] = [
  {
    title: "Business Operations",
    icon: <LayoutDashboard className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    description: "Your operational nerve center. Manage leads, track quotes, handle bookings, and monitor subscriber growth — everything that keeps the business running day-to-day.",
    cards: [
      {
        label: "Admin Dashboard",
        description: "Leads, quotes, bookings, subscribers — full CRM overview",
        href: "/admin",
        icon: <LayoutDashboard className="size-5" />,
        image: "/command/admin-dashboard.png",
        glowColor: "shadow-cyan-500/20",
        badge: "CRM",
        featured: true,
      },
      {
        label: "Analytics",
        description: "Page views, events, SEO keywords, real-time traffic",
        href: "/analytics",
        icon: <BarChart3 className="size-5" />,
        image: "/command/analytics.png",
        glowColor: "shadow-purple-500/20",
        badge: "Live",
      },
      {
        label: "Bookings",
        description: "Manage consultation bookings and calendar slots",
        href: "/book",
        icon: <Calendar className="size-5" />,
        image: "/command/bookings.png",
        glowColor: "shadow-amber-500/20",
      },
      {
        label: "Quote Requests",
        description: "View and manage incoming project quotes",
        href: "/quote",
        icon: <FileText className="size-5" />,
        image: "/command/quotes.png",
        glowColor: "shadow-emerald-500/20",
      },
    ],
  },
  {
    title: "Content & Marketing",
    icon: <PenTool className="size-4" />,
    gradient: "from-purple-500 to-pink-500",
    description: "Content creation and marketing automation tools. Write AI-powered blog posts, run marketing campaigns, and manage your brand's public content presence.",
    cards: [
      {
        label: "Blog Admin",
        description: "AI-powered blog generator with SEO optimization",
        href: "/blog/admin",
        icon: <PenTool className="size-5" />,
        image: "/command/blog-admin.png",
        glowColor: "shadow-purple-500/20",
        badge: "AI",
        featured: true,
      },
      {
        label: "Marketing Hub",
        description: "Automated campaigns, social posting, ad management",
        href: "/marketing",
        icon: <Megaphone className="size-5" />,
        image: "/command/marketing-hub.png",
        glowColor: "shadow-rose-500/20",
        badge: "Hub",
      },
      {
        label: "Blog (Public)",
        description: "View published posts as visitors see them",
        href: "/blog",
        icon: <Newspaper className="size-5" />,
        image: "/command/blog-public.png",
        glowColor: "shadow-sky-500/20",
      },
    ],
  },
  {
    title: "Ecosystem & Platform",
    icon: <Layers className="size-4" />,
    gradient: "from-emerald-500 to-teal-500",
    description: "The full DarkWave ecosystem. Browse all 23 connected applications, review codebase metrics, manage the widget marketplace, and access developer documentation.",
    cards: [
      {
        label: "Ecosystem",
        description: "All 23 connected applications with carousels",
        href: "/ecosystem",
        icon: <Globe className="size-5" />,
        image: "/command/ecosystem.png",
        glowColor: "shadow-indigo-500/20",
        badge: "23 Apps",
        featured: true,
      },
      {
        label: "Ecosystem Metrics",
        description: "Codebase breakdown, line counts, tech stacks",
        href: "/metrics",
        icon: <BarChart3 className="size-5" />,
        image: "/command/metrics.png",
        glowColor: "shadow-cyan-500/20",
        badge: "Stats",
      },
      {
        label: "Trust Layer Hub",
        description: "60 embeddable widgets with live previews & pricing",
        href: "/hub",
        icon: <Boxes className="size-5" />,
        image: "/command/trust-hub.png",
        glowColor: "shadow-amber-500/20",
        badge: "60 Widgets",
      },
      {
        label: "Developer Tools",
        description: "Pulse API docs, publications outreach, resources",
        href: "/developers",
        icon: <Terminal className="size-5" />,
        image: "/command/developers.png",
        glowColor: "shadow-green-500/20",
      },
    ],
  },
  {
    title: "Security & AI",
    icon: <Shield className="size-4" />,
    gradient: "from-red-500 to-orange-500",
    description: "AI-powered security tools and certification systems. Run Guardian scans, manage the agent registry, audit websites, and handle AI credit balances for pay-as-you-go features.",
    cards: [
      {
        label: "Guardian AI",
        description: "Agent certification — security, transparency, compliance",
        href: "/guardian-ai",
        icon: <Shield className="size-5" />,
        image: "/command/guardian-ai.png",
        glowColor: "shadow-red-500/20",
        badge: "Security",
        featured: true,
      },
      {
        label: "Guardian Registry",
        description: "Public certification registry for verified agents",
        href: "/guardian-ai-registry",
        icon: <Search className="size-5" />,
        image: "/command/guardian-registry.png",
        glowColor: "shadow-emerald-500/20",
      },
      {
        label: "Website Audit",
        description: "Free SEO and performance audit for lead generation",
        href: "/audit",
        icon: <Search className="size-5" />,
        image: "/command/website-audit.png",
        glowColor: "shadow-blue-500/20",
        badge: "Free Tool",
      },
      {
        label: "AI Credits",
        description: "Credit packages, Stripe purchases, transaction log",
        href: "/credits",
        icon: <Zap className="size-5" />,
        image: "/command/ai-credits.png",
        glowColor: "shadow-yellow-500/20",
      },
    ],
  },
  {
    title: "Payments & Commerce",
    icon: <CreditCard className="size-4" />,
    gradient: "from-yellow-500 to-amber-500",
    description: "Revenue and payment management. Process invoices through Stripe, manage service pricing tiers, and let prospects compare plans side-by-side.",
    cards: [
      {
        label: "Payment Portal",
        description: "Invoice payments, deposits, and Stripe checkout",
        href: "/payment",
        icon: <CreditCard className="size-5" />,
        image: "/command/payment.png",
        glowColor: "shadow-green-500/20",
        badge: "Stripe",
        featured: true,
      },
      {
        label: "Services & Pricing",
        description: "Starter, Growth, Enterprise service tiers",
        href: "/services",
        icon: <Store className="size-5" />,
        image: "/command/services.png",
        glowColor: "shadow-purple-500/20",
      },
      {
        label: "Compare Plans",
        description: "Side-by-side plan comparison for prospects",
        href: "/compare",
        icon: <Layers className="size-5" />,
        image: "/command/compare.png",
        glowColor: "shadow-sky-500/20",
      },
    ],
  },
  {
    title: "Communication & Community",
    icon: <MessageSquare className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    description: "Stay connected with clients and the community. Real-time WebSocket chat, customer support portal, and lead capture through contact forms.",
    cards: [
      {
        label: "Signal Chat",
        description: "Real-time WebSocket chat, channels, community",
        href: "/chat",
        icon: <Radio className="size-5" />,
        image: "/command/signal-chat.png",
        glowColor: "shadow-purple-500/20",
        badge: "Live",
        featured: true,
      },
      {
        label: "Support Center",
        description: "Customer support portal with FAQ and contact",
        href: "/support",
        icon: <MessageSquare className="size-5" />,
        image: "/command/support.png",
        glowColor: "shadow-cyan-500/20",
      },
      {
        label: "Contact",
        description: "Lead capture form for new client inquiries",
        href: "/contact",
        icon: <Mail className="size-5" />,
        image: "/command/contact.png",
        glowColor: "shadow-blue-500/20",
      },
    ],
  },
  {
    title: "Documents & Legal",
    icon: <FolderOpen className="size-4" />,
    gradient: "from-slate-400 to-gray-500",
    description: "All business documents, policies, and public-facing pages. Access the business plan, investor materials, legal policies, and compliance disclosures from one place.",
    cards: [
      {
        label: "Documents Vault",
        description: "Business plan, exec summary, roadmap, and more",
        href: "/documents",
        icon: <FolderOpen className="size-5" />,
        image: "/command/documents.png",
        glowColor: "shadow-slate-500/20",
        featured: true,
      },
      {
        label: "Mission",
        description: "Company mission statement and vision",
        href: "/mission",
        icon: <Sparkles className="size-5" />,
        image: "/command/mission.png",
        glowColor: "shadow-indigo-500/20",
      },
      {
        label: "Investors",
        description: "Investor relations and equity information",
        href: "/investors",
        icon: <TrendingUp className="size-5" />,
        image: "/command/investors.png",
        glowColor: "shadow-emerald-500/20",
      },
      {
        label: "Terms of Service",
        description: "Platform terms and conditions",
        href: "/terms",
        icon: <FileText className="size-5" />,
        image: "/command/terms.png",
        glowColor: "shadow-gray-500/20",
      },
      {
        label: "Privacy Policy",
        description: "Data privacy and collection policies",
        href: "/privacy",
        icon: <Lock className="size-5" />,
        image: "/command/privacy.png",
        glowColor: "shadow-gray-500/20",
      },
      {
        label: "Affiliate Disclosure",
        description: "FTC-compliant affiliate and partnership disclosures",
        href: "/affiliate-disclosure",
        icon: <FileText className="size-5" />,
        image: "/command/affiliate.png",
        glowColor: "shadow-amber-500/20",
      },
    ],
  },
  {
    title: "Creative Studio",
    icon: <Eye className="size-4" />,
    gradient: "from-pink-500 to-rose-500",
    description: "Creative and media tools. Edit images, audio, and video in TrustVault Studio, and access downloadable guides, templates, and educational resources.",
    cards: [
      {
        label: "TrustVault Studio",
        description: "Cross-app media editor — images, audio, video, merge",
        href: "/studio",
        icon: <Eye className="size-5" />,
        image: "/command/studio.png",
        glowColor: "shadow-pink-500/20",
        badge: "Studio",
        featured: true,
      },
      {
        label: "Resources",
        description: "Downloadable guides, templates, and educational content",
        href: "/resources",
        icon: <FolderOpen className="size-5" />,
        image: "/command/resources.png",
        glowColor: "shadow-violet-500/20",
      },
    ],
  },
];

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#070b16]">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-40 h-6 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="w-24 h-8 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 space-y-10">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-5 rounded bg-white/5 animate-pulse" />
                <div className="w-64 h-3 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="min-w-[280px] h-[200px] rounded-2xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaunchCardComponent({ card, index }: { card: LaunchCard; index: number }) {
  const [active, setActive] = useState(false);
  const glow = glowMap[card.glowColor] || "none";
  const cardStyle = active || card.featured
    ? { boxShadow: glow }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={card.href} data-testid={`command-${card.href.replace(/\//g, "-").slice(1)}`}>
        <div
          className={`group relative h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] border border-white/5 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
            card.featured ? "ring-1 ring-white/10" : ""
          }`}
          style={cardStyle}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          data-testid={`card-${card.href.replace(/\//g, "-").slice(1)}`}
        >
          <img
            src={card.image}
            alt={card.label}
            className="absolute inset-0 w-full h-full object-cover brightness-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

          {card.badge && (
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg">
                {card.badge}
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                {card.icon}
              </div>
              <h3 className="font-display font-bold text-[15px] text-white group-hover:text-white/90 transition-colors" data-testid={`text-label-${card.href.replace(/\//g, "-").slice(1)}`}>
                {card.label}
              </h3>
            </div>
            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
              {card.description}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-white/30 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Open</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CommandCenter() {
  const [authenticated, setAuthenticated] = useState(() => {
    try { return sessionStorage.getItem("dw_command_auth") === "true"; } catch { return false; }
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthenticated(true);
      sessionStorage.setItem("dw_command_auth", "true");
      setError("");
    } else {
      setError("Invalid access code");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("dw_command_auth");
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#070b16] text-white flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 lg:p-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <Command className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-center mb-2 text-white">
              Command Center
            </h1>
            <p className="text-sm text-white/40 text-center mb-8">
              Enter your access code to continue
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access code"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300"
                  data-testid="input-command-password"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                data-testid="button-command-login"
              >
                <Unlock className="w-4 h-4" />
                Access Command Center
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const totalFeatures = categories.reduce((sum, cat) => sum + cat.cards.length, 0);

  return (
    <div className="min-h-screen bg-[#070b16] text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16] -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.05),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display text-lg lg:text-xl font-bold text-white">Command Center</span>
                <p className="text-[10px] text-white/40 -mt-0.5 hidden lg:block">{totalFeatures} features &middot; {categories.length} categories</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-semibold">Owner</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 group"
              data-testid="button-command-logout"
            >
              <LogOut className="w-4 h-4 text-white/50 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-14 lg:mb-20"
        >
          <img
            src="/command/command-center.png"
            alt="Command Center"
            className="w-full h-48 lg:h-72 object-cover brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <h1 className="text-3xl lg:text-5xl font-display font-bold mb-2 text-white">
              Master <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-sm lg:text-base text-white/50 max-w-xl leading-relaxed">
              Every tool. Every page. One click away. {totalFeatures} features organized across {categories.length} categories.
            </p>
          </div>
        </motion.div>

        <div className="space-y-14 lg:space-y-20">
          {categories.map((category, catIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIndex * 0.08 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-white">{category.title}</h2>
                  <p className="text-xs lg:text-sm text-white/40 leading-relaxed mt-1.5 max-w-2xl">{category.description}</p>
                </div>
              </div>

              <div className="mt-6 lg:mt-8 pl-1">
                <Carousel
                  opts={{
                    align: "start",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-5">
                    {category.cards.map((card, cardIndex) => (
                      <CarouselItem
                        key={card.href}
                        className={`pl-5 basis-[300px] ${card.featured ? "lg:basis-[360px]" : "lg:basis-[320px]"}`}
                      >
                        <LaunchCardComponent card={card} index={cardIndex} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {category.cards.length > 3 && (
                    <>
                      <CarouselPrevious className="hidden lg:flex -left-3 top-1/2 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
                      <CarouselNext className="hidden lg:flex -right-3 top-1/2 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
                    </>
                  )}
                </Carousel>
              </div>
            </motion.section>
          ))}
        </div>

        <footer className="mt-20 lg:mt-32 pb-10 text-center">
          <p className="text-[11px] text-white/20">DarkWave Studios Command Center &middot; Owner Access Only</p>
        </footer>
      </main>
    </div>
  );
}
