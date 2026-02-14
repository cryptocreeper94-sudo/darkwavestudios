import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Shield, LayoutDashboard, BarChart3, PenTool, Users, FileText,
  MessageSquare, Calendar, Mail, TrendingUp, Globe, Bot, Zap,
  ChevronRight, Lock, Unlock, Eye, Sparkles, Terminal, Boxes,
  CreditCard, Search, Radio, Layers, FolderOpen, Megaphone,
  Store, Newspaper, Settings, ArrowLeft, Command
} from "lucide-react";

const ADMIN_KEY = "0424";

interface CommandItem {
  title: string;
  description: string;
  route: string;
  icon: typeof LayoutDashboard;
  gradient: string;
  badge?: string;
}

interface CommandCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof LayoutDashboard;
  gradient: string;
  items: CommandItem[];
}

const commandCategories: CommandCategory[] = [
  {
    id: "business",
    title: "Business Operations",
    description: "Leads, quotes, bookings, and client management",
    icon: LayoutDashboard,
    gradient: "from-cyan-500 to-blue-600",
    items: [
      {
        title: "Admin Dashboard",
        description: "Leads, quotes, bookings, subscribers — full CRM overview",
        route: "/admin",
        icon: LayoutDashboard,
        gradient: "from-cyan-500/20 to-blue-600/20",
        badge: "CRM"
      },
      {
        title: "Analytics",
        description: "Page views, events, SEO keywords, real-time traffic dashboard",
        route: "/analytics",
        icon: BarChart3,
        gradient: "from-purple-500/20 to-pink-600/20",
        badge: "Live"
      },
      {
        title: "Bookings",
        description: "Manage consultation bookings and calendar",
        route: "/book",
        icon: Calendar,
        gradient: "from-amber-500/20 to-orange-600/20"
      },
      {
        title: "Quote Requests",
        description: "View and manage incoming project quotes",
        route: "/quote",
        icon: FileText,
        gradient: "from-emerald-500/20 to-teal-600/20"
      },
    ]
  },
  {
    id: "content",
    title: "Content & Marketing",
    description: "Blog, marketing automation, and outreach",
    icon: PenTool,
    gradient: "from-purple-500 to-pink-600",
    items: [
      {
        title: "Blog Admin",
        description: "AI-powered blog generator with SEO optimization and tone selection",
        route: "/blog/admin",
        icon: PenTool,
        gradient: "from-purple-500/20 to-pink-600/20",
        badge: "AI"
      },
      {
        title: "Marketing Hub",
        description: "Automated campaigns, social posting, and ad management",
        route: "/marketing",
        icon: Megaphone,
        gradient: "from-rose-500/20 to-red-600/20",
        badge: "Hub"
      },
      {
        title: "Blog (Public)",
        description: "View published blog posts as visitors see them",
        route: "/blog",
        icon: Newspaper,
        gradient: "from-sky-500/20 to-cyan-600/20"
      },
    ]
  },
  {
    id: "ecosystem",
    title: "Ecosystem & Platform",
    description: "Apps, metrics, widgets, and developer tools",
    icon: Layers,
    gradient: "from-emerald-500 to-teal-600",
    items: [
      {
        title: "Ecosystem",
        description: "All 22 connected applications with carousels and images",
        route: "/ecosystem",
        icon: Globe,
        gradient: "from-indigo-500/20 to-purple-600/20",
        badge: "22 Apps"
      },
      {
        title: "Ecosystem Metrics",
        description: "Codebase breakdown, line counts, tech stacks per app",
        route: "/metrics",
        icon: BarChart3,
        gradient: "from-cyan-500/20 to-blue-600/20",
        badge: "Stats"
      },
      {
        title: "Trust Layer Hub",
        description: "50 embeddable widgets with live previews and pricing",
        route: "/hub",
        icon: Boxes,
        gradient: "from-amber-500/20 to-orange-600/20",
        badge: "50 Widgets"
      },
      {
        title: "Developer Tools",
        description: "Pulse API docs, publications outreach, and developer resources",
        route: "/developers",
        icon: Terminal,
        gradient: "from-green-500/20 to-emerald-600/20"
      },
    ]
  },
  {
    id: "security",
    title: "Security & AI",
    description: "Guardian AI certification, scanning, and credits",
    icon: Shield,
    gradient: "from-red-500 to-orange-600",
    items: [
      {
        title: "Guardian AI",
        description: "AI agent certification system — security, transparency, compliance",
        route: "/guardian-ai",
        icon: Shield,
        gradient: "from-red-500/20 to-orange-600/20",
        badge: "Security"
      },
      {
        title: "Guardian Registry",
        description: "Public certification registry for verified AI agents",
        route: "/guardian-ai-registry",
        icon: Search,
        gradient: "from-emerald-500/20 to-green-600/20"
      },
      {
        title: "Website Audit",
        description: "Free SEO and performance audit tool for lead generation",
        route: "/audit",
        icon: Search,
        gradient: "from-blue-500/20 to-indigo-600/20",
        badge: "Free Tool"
      },
      {
        title: "AI Credits",
        description: "Credit packages, Stripe purchases, and transaction log",
        route: "/credits",
        icon: Zap,
        gradient: "from-yellow-500/20 to-amber-600/20"
      },
    ]
  },
  {
    id: "commerce",
    title: "Payments & Commerce",
    description: "Stripe integration, payments, and pricing",
    icon: CreditCard,
    gradient: "from-yellow-500 to-amber-600",
    items: [
      {
        title: "Payment Portal",
        description: "Invoice payments, project deposits, and Stripe checkout",
        route: "/payment",
        icon: CreditCard,
        gradient: "from-green-500/20 to-emerald-600/20",
        badge: "Stripe"
      },
      {
        title: "Services & Pricing",
        description: "Service packages, starter/growth/enterprise tiers",
        route: "/services",
        icon: Store,
        gradient: "from-purple-500/20 to-violet-600/20"
      },
      {
        title: "Compare Plans",
        description: "Side-by-side plan comparison for prospects",
        route: "/compare",
        icon: Layers,
        gradient: "from-sky-500/20 to-blue-600/20"
      },
    ]
  },
  {
    id: "communication",
    title: "Communication & Community",
    description: "Chat, support, and community engagement",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-600",
    items: [
      {
        title: "Signal Chat",
        description: "Real-time WebSocket chat, channels, and community messaging",
        route: "/chat",
        icon: Radio,
        gradient: "from-purple-500/20 to-pink-600/20",
        badge: "Live"
      },
      {
        title: "Support Center",
        description: "Customer support portal with FAQ and contact options",
        route: "/support",
        icon: MessageSquare,
        gradient: "from-cyan-500/20 to-teal-600/20"
      },
      {
        title: "Contact",
        description: "Lead capture form for new client inquiries",
        route: "/contact",
        icon: Mail,
        gradient: "from-blue-500/20 to-indigo-600/20"
      },
    ]
  },
  {
    id: "documents",
    title: "Documents & Legal",
    description: "Business docs, policies, and public pages",
    icon: FolderOpen,
    gradient: "from-slate-500 to-gray-600",
    items: [
      {
        title: "Documents Vault",
        description: "Business plan, executive summary, roadmap, and more",
        route: "/documents",
        icon: FolderOpen,
        gradient: "from-slate-500/20 to-gray-600/20"
      },
      {
        title: "Mission",
        description: "Company mission statement and vision",
        route: "/mission",
        icon: Sparkles,
        gradient: "from-indigo-500/20 to-purple-600/20"
      },
      {
        title: "Investors",
        description: "Investor relations and equity information",
        route: "/investors",
        icon: TrendingUp,
        gradient: "from-emerald-500/20 to-teal-600/20"
      },
      {
        title: "Terms of Service",
        description: "Platform terms and conditions",
        route: "/terms",
        icon: FileText,
        gradient: "from-gray-500/20 to-slate-600/20"
      },
      {
        title: "Privacy Policy",
        description: "Data privacy and collection policies",
        route: "/privacy",
        icon: Lock,
        gradient: "from-gray-500/20 to-slate-600/20"
      },
      {
        title: "Affiliate Disclosure",
        description: "FTC-compliant affiliate and partnership disclosures",
        route: "/affiliate-disclosure",
        icon: FileText,
        gradient: "from-amber-500/20 to-yellow-600/20"
      },
    ]
  },
  {
    id: "creative",
    title: "Creative Studio",
    description: "Media editing and creative tools",
    icon: Eye,
    gradient: "from-pink-500 to-rose-600",
    items: [
      {
        title: "TrustVault Studio",
        description: "Cross-app media editor — images, audio, video, and merge tools",
        route: "/studio",
        icon: Eye,
        gradient: "from-pink-500/20 to-rose-600/20",
        badge: "Studio"
      },
      {
        title: "Resources",
        description: "Downloadable guides, templates, and educational content",
        route: "/resources",
        icon: FolderOpen,
        gradient: "from-violet-500/20 to-purple-600/20"
      },
    ]
  },
];

export default function CommandCenter() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid access code");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="fixed inset-0 bg-background -z-20" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)] -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)] -z-10" />

        <div className="w-full max-w-md mx-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="relative p-8 lg:p-10 border border-white/10 rounded-3xl">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                <Command className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-center mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Command Center
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Enter your access code to continue
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access code"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
                    data-testid="input-command-password"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  data-testid="button-command-login"
                >
                  <Unlock className="w-4 h-4" />
                  Access Command Center
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalFeatures = commandCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 bg-background -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center_right,rgba(6,182,212,0.06),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Command Center</span>
                <p className="text-[10px] text-muted-foreground -mt-0.5 hidden lg:block">{totalFeatures} features across {commandCategories.length} categories</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-semibold">Owner Access</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="relative rounded-2xl overflow-hidden mb-10 lg:mb-14">
          <img
            src="/ecosystem/command-center.png"
            alt="Command Center"
            className="w-full h-40 lg:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <h1 className="text-2xl lg:text-4xl font-display font-bold mb-1">
              Master <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Everything you need, one click away. {totalFeatures} features organized across {commandCategories.length} categories.
            </p>
          </div>
        </div>

        <div className="space-y-10 lg:space-y-14">
          {commandCategories.map((category) => (
            <section key={category.id}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-display font-bold">{category.title}</h2>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => (
                  <Link
                    key={item.route}
                    href={item.route}
                    className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                    data-testid={`command-${item.route.replace(/\//g, '-').slice(1)}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                    <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} border border-white/10 flex items-center justify-center`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary font-semibold border border-primary/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base mb-1 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 lg:mt-24 pb-8 text-center">
          <p className="text-xs text-muted-foreground/50">DarkWave Studios Command Center &middot; Owner Access Only</p>
        </footer>
      </main>
    </div>
  );
}
