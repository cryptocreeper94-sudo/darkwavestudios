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
  Home, Sparkles, TrendingUp, Mail, Store, Layers,
  FileText, Globe, BarChart3, Boxes, Terminal, Shield,
  Search, Zap, Radio, MessageSquare, Newspaper, Eye,
  FolderOpen, Lock, Calendar, Compass, ChevronRight
} from "lucide-react";

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

interface ExploreCategory {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  cards: LaunchCard[];
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

const categories: ExploreCategory[] = [
  {
    title: "Home & About",
    icon: <Home className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    description: "Start here. Visit the main site, learn about the mission, see who's behind DarkWave Studios, or get in touch with the team directly.",
    cards: [
      {
        label: "Homepage",
        description: "The main DarkWave Studios site — services, portfolio, and more",
        href: "/",
        icon: <Home className="size-5" />,
        image: "/command/homepage.png",
        glowColor: "shadow-cyan-500/20",
        badge: "Start Here",
        featured: true,
      },
      {
        label: "Mission",
        description: "What drives us and where we're heading",
        href: "/mission",
        icon: <Sparkles className="size-5" />,
        image: "/command/mission.png",
        glowColor: "shadow-indigo-500/20",
      },
      {
        label: "Investors",
        description: "Equity information and growth trajectory",
        href: "/investors",
        icon: <TrendingUp className="size-5" />,
        image: "/command/investors.png",
        glowColor: "shadow-emerald-500/20",
      },
      {
        label: "Contact Us",
        description: "Reach out — tell us about your project",
        href: "/contact",
        icon: <Mail className="size-5" />,
        image: "/command/contact.png",
        glowColor: "shadow-blue-500/20",
      },
    ],
  },
  {
    title: "Services",
    icon: <Store className="size-4" />,
    gradient: "from-purple-500 to-pink-500",
    description: "See what we build and what it costs. Compare plans, request a custom quote, or book a free consultation call to discuss your project.",
    cards: [
      {
        label: "Services & Pricing",
        description: "Starter, Growth, and Enterprise packages",
        href: "/services",
        icon: <Store className="size-5" />,
        image: "/command/services.png",
        glowColor: "shadow-purple-500/20",
        featured: true,
      },
      {
        label: "Compare Plans",
        description: "Side-by-side feature comparison across tiers",
        href: "/compare",
        icon: <Layers className="size-5" />,
        image: "/command/compare.png",
        glowColor: "shadow-sky-500/20",
      },
      {
        label: "Get a Quote",
        description: "Tell us what you need — we'll estimate the cost",
        href: "/quote",
        icon: <FileText className="size-5" />,
        image: "/command/quotes.png",
        glowColor: "shadow-amber-500/20",
      },
      {
        label: "Book a Call",
        description: "Schedule a free consultation to talk through your project",
        href: "/book",
        icon: <Calendar className="size-5" />,
        image: "/command/book-call.png",
        glowColor: "shadow-emerald-500/20",
        badge: "Free",
      },
    ],
  },
  {
    title: "Platform & Ecosystem",
    icon: <Globe className="size-4" />,
    gradient: "from-emerald-500 to-teal-500",
    description: "Explore the full DarkWave ecosystem — 22 interconnected apps, a portfolio of live projects, and detailed codebase metrics across 1.89M+ lines of code.",
    cards: [
      {
        label: "Ecosystem",
        description: "All 22 connected applications in one view",
        href: "/ecosystem",
        icon: <Globe className="size-5" />,
        image: "/command/ecosystem.png",
        glowColor: "shadow-indigo-500/20",
        badge: "22 Apps",
        featured: true,
      },
      {
        label: "Projects",
        description: "Portfolio of live sites and applications we've built",
        href: "/projects",
        icon: <FolderOpen className="size-5" />,
        image: "/command/projects.png",
        glowColor: "shadow-cyan-500/20",
      },
      {
        label: "Ecosystem Metrics",
        description: "Codebase stats — line counts, tech stacks, breakdowns",
        href: "/metrics",
        icon: <BarChart3 className="size-5" />,
        image: "/command/metrics.png",
        glowColor: "shadow-purple-500/20",
        badge: "Stats",
      },
    ],
  },
  {
    title: "Tools & Widgets",
    icon: <Boxes className="size-4" />,
    gradient: "from-amber-500 to-orange-500",
    description: "Access free tools and the widget marketplace. Run a website audit, scan AI agents for security, browse 50 embeddable widgets, or explore the developer API.",
    cards: [
      {
        label: "Trust Layer Hub",
        description: "50 embeddable widgets with live previews and pricing",
        href: "/hub",
        icon: <Boxes className="size-5" />,
        image: "/command/trust-hub.png",
        glowColor: "shadow-amber-500/20",
        badge: "50 Widgets",
        featured: true,
      },
      {
        label: "Website Audit",
        description: "Free SEO and performance scan for any website",
        href: "/audit",
        icon: <Search className="size-5" />,
        image: "/command/website-audit.png",
        glowColor: "shadow-blue-500/20",
        badge: "Free",
      },
      {
        label: "Guardian AI",
        description: "AI agent security scanner and certification",
        href: "/guardian-ai",
        icon: <Shield className="size-5" />,
        image: "/command/guardian-ai.png",
        glowColor: "shadow-red-500/20",
        badge: "Security",
      },
      {
        label: "AI Credits",
        description: "Purchase credits for AI-powered features",
        href: "/credits",
        icon: <Zap className="size-5" />,
        image: "/command/ai-credits.png",
        glowColor: "shadow-yellow-500/20",
      },
      {
        label: "Developer Tools",
        description: "Pulse API docs, publications directory, and resources",
        href: "/developers",
        icon: <Terminal className="size-5" />,
        image: "/command/developers.png",
        glowColor: "shadow-green-500/20",
      },
    ],
  },
  {
    title: "Community",
    icon: <Radio className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    description: "Join the conversation. Chat in real-time, read the latest blog posts, get support, browse resources, or create in the media studio.",
    cards: [
      {
        label: "Signal Chat",
        description: "Real-time community chat with channels",
        href: "/chat",
        icon: <Radio className="size-5" />,
        image: "/command/signal-chat.png",
        glowColor: "shadow-purple-500/20",
        badge: "Live",
        featured: true,
      },
      {
        label: "Blog",
        description: "Articles on web development, AI, and tech",
        href: "/blog",
        icon: <Newspaper className="size-5" />,
        image: "/command/blog-public.png",
        glowColor: "shadow-sky-500/20",
      },
      {
        label: "Support Center",
        description: "FAQ, help articles, and contact options",
        href: "/support",
        icon: <MessageSquare className="size-5" />,
        image: "/command/support.png",
        glowColor: "shadow-cyan-500/20",
      },
      {
        label: "Resources",
        description: "Guides, templates, and educational downloads",
        href: "/resources",
        icon: <FolderOpen className="size-5" />,
        image: "/command/resources.png",
        glowColor: "shadow-violet-500/20",
      },
      {
        label: "TrustVault Studio",
        description: "Media editor — images, audio, video, and merges",
        href: "/studio",
        icon: <Eye className="size-5" />,
        image: "/command/studio.png",
        glowColor: "shadow-pink-500/20",
        badge: "Studio",
      },
    ],
  },
  {
    title: "Legal",
    icon: <FileText className="size-4" />,
    gradient: "from-slate-400 to-gray-500",
    description: "Transparency matters. Review our terms, privacy practices, and affiliate disclosures.",
    cards: [
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
        description: "How we handle and protect your data",
        href: "/privacy",
        icon: <Lock className="size-5" />,
        image: "/command/privacy.png",
        glowColor: "shadow-gray-500/20",
      },
      {
        label: "Affiliate Disclosure",
        description: "FTC-compliant partnership and affiliate information",
        href: "/affiliate-disclosure",
        icon: <FileText className="size-5" />,
        image: "/command/affiliate.png",
        glowColor: "shadow-amber-500/20",
      },
    ],
  },
];

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#070b16]">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-36 h-6 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="w-28 h-9 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 space-y-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-5 rounded bg-white/5 animate-pulse" />
                <div className="w-72 h-3 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="min-w-[280px] h-[220px] rounded-2xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExploreCard({ card, index }: { card: LaunchCard; index: number }) {
  const [active, setActive] = useState(false);
  const glow = glowMap[card.glowColor] || "none";
  const cardStyle = active || card.featured ? { boxShadow: glow } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={card.href} data-testid={`explore-link-${card.href.replace(/\//g, "-").slice(1) || "home"}`}>
        <div
          className={`group relative h-[220px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] border border-white/5 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
            card.featured ? "ring-1 ring-white/10" : ""
          }`}
          style={cardStyle}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          data-testid={`explore-card-${card.href.replace(/\//g, "-").slice(1) || "home"}`}
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
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg">
                {card.badge}
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                {card.icon}
              </div>
              <h3 className="font-display font-bold text-sm text-white group-hover:text-white/90 transition-colors" data-testid={`explore-label-${card.href.replace(/\//g, "-").slice(1) || "home"}`}>
                {card.label}
              </h3>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
              {card.description}
            </p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-white/30 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Go</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Explore() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  const totalDestinations = categories.reduce((sum, cat) => sum + cat.cards.length, 0);

  return (
    <div className="min-h-screen bg-[#070b16] text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16] -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.06),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b16]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg lg:text-xl font-bold text-white">Explore</span>
              <p className="text-[10px] text-white/40 -mt-0.5 hidden lg:block">{totalDestinations} destinations &middot; {categories.length} categories</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm text-white/70 hover:text-white"
            data-testid="explore-go-home"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-10 lg:mb-14"
        >
          <img
            src="/command/explore-hero.png"
            alt="Explore DarkWave Studios"
            className="w-full h-40 lg:h-56 object-cover brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <h1 className="text-2xl lg:text-4xl font-display font-bold mb-1 text-white">
              Where do you want to <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">go?</span>
            </h1>
            <p className="text-sm text-white/50 max-w-xl">
              {totalDestinations} destinations across {categories.length} categories. Everything DarkWave Studios has to offer, one click away.
            </p>
          </div>
        </motion.div>

        <div className="space-y-10 lg:space-y-14">
          {categories.map((category, catIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIndex * 0.08 }}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-display font-bold text-white">{category.title}</h2>
                  <p className="text-xs text-white/40 leading-relaxed mt-1 max-w-2xl">{category.description}</p>
                </div>
              </div>

              <div className="mt-5 pl-1">
                <Carousel
                  opts={{
                    align: "start",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {category.cards.map((card, cardIndex) => (
                      <CarouselItem
                        key={card.href}
                        className={`pl-4 basis-[280px] ${card.featured ? "lg:basis-[320px]" : ""}`}
                      >
                        <ExploreCard card={card} index={cardIndex} />
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

        <footer className="mt-16 lg:mt-24 pb-8 text-center space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
            data-testid="explore-footer-home"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <div className="flex items-center justify-center gap-4 text-[11px] text-white/30">
            <Link href="/developers" className="hover:text-white/60 transition-colors" data-testid="explore-footer-developers">
              Developer Portal
            </Link>
            <span className="text-white/10">|</span>
            <Link href="/command" className="hover:text-white/60 transition-colors" data-testid="explore-footer-command">
              Owner Portal
            </Link>
          </div>
          <p className="text-[11px] text-white/20">DarkWave Studios &middot; Full-Service Web Agency</p>
        </footer>
      </main>
    </div>
  );
}
