import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Code2, FileCode2, Database, Globe, Layers, Terminal, 
  BarChart3, TrendingUp, Cpu, Shield, Sparkles, ChevronRight, 
  Server, Smartphone, Palette, Bot, Utensils, Truck, Heart, 
  Car, Building2, Paintbrush, Coffee, Gamepad2, Zap
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface AppMetric {
  id: string;
  name: string;
  url: string;
  totalLines: number;
  totalFiles: number;
  apiEndpoints?: number;
  stack: string[];
  breakdown: { language: string; lines: number; files?: number }[];
  highlights?: string[];
  icon: typeof Code2;
  gradient: string;
  status: string;
  version?: string;
}

const ecosystemMetrics: AppMetric[] = [
  {
    id: "garagebot",
    name: "GarageBot",
    url: "https://garagebot.io",
    totalLines: 622225,
    totalFiles: 1378,
    stack: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Solana Blockchain", "Stripe", "OpenAI GPT-4", "WebSocket", "Trust Layer SSO"],
    breakdown: [
      { language: "TypeScript", lines: 455938, files: 957 },
      { language: "React/TSX", lines: 57730, files: 151 },
      { language: "JSON", lines: 102650, files: 260 },
      { language: "CSS", lines: 4069, files: 6 },
      { language: "HTML", lines: 1838, files: 4 },
    ],
    icon: Car,
    gradient: "from-orange-500 to-red-500",
    status: "Production",
  },
  {
    id: "orbit-staffing",
    name: "ORBIT Staffing OS",
    url: "https://orbitstaffing.io",
    totalLines: 314810,
    totalFiles: 6985,
    apiEndpoints: 527,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM"],
    breakdown: [
      { language: "TypeScript", lines: 314810, files: 6583 },
      { language: "TSX", lines: 0, files: 382 },
      { language: "HTML", lines: 4344, files: 9 },
      { language: "CSS", lines: 4380, files: 11 },
    ],
    highlights: ["Payroll", "Ecosystem", "Compliance", "Franchise", "Blockchain"],
    icon: Building2,
    gradient: "from-blue-500 to-indigo-500",
    status: "Production",
  },
  {
    id: "dwtl",
    name: "DarkWave Trust Layer",
    url: "https://dwtl.io",
    totalLines: 230434,
    totalFiles: 555,
    apiEndpoints: 727,
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 227865, files: 549 },
      { language: "HTML", lines: 2401, files: 5 },
      { language: "CSS", lines: 168, files: 1 },
    ],
    highlights: ["Server: 54,865 LOC", "Client: 149,353 LOC", "Shared: 9,164 LOC"],
    icon: Shield,
    gradient: "from-cyan-500 to-blue-500",
    status: "Production",
  },
  {
    id: "pulse",
    name: "Pulse Platform",
    url: "https://darkwavepulse.com",
    totalLines: 208250,
    totalFiles: 5073,
    stack: ["React 19", "Vite 7", "Mastra AI", "PostgreSQL", "Inngest", "Firebase Auth", "Stripe"],
    breakdown: [
      { language: "TypeScript", lines: 91418, files: 3365 },
      { language: "JavaScript", lines: 67968, files: 1708 },
      { language: "CSS/HTML/Shell", lines: 48864 },
    ],
    highlights: ["80,558+ StrikeAgent predictions", "135,769+ ML predictions", "54 AI Agent personas", "Multi-chain wallet (Solana + 22 EVM)"],
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
    status: "Production",
  },
  {
    id: "paintpros",
    name: "PaintPros.io",
    url: "https://paintpros.io",
    totalLines: 146132,
    totalFiles: 355,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "shadcn/ui"],
    breakdown: [
      { language: "React/TSX", lines: 103294 },
      { language: "TypeScript", lines: 38915 },
      { language: "JavaScript", lines: 3241 },
      { language: "CSS", lines: 282 },
      { language: "HTML", lines: 400 },
    ],
    icon: Paintbrush,
    gradient: "from-emerald-500 to-teal-500",
    status: "Production",
  },
  {
    id: "lotops-pro",
    name: "LotOps Pro",
    url: "https://lotopspro.com",
    totalLines: 108438,
    totalFiles: 319,
    stack: ["React", "TypeScript", "Express.js", "PostgreSQL", "Drizzle ORM", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion", "OpenAI", "Solana", "Stripe", "Twilio", "Tesseract.js OCR"],
    breakdown: [
      { language: "React/TSX", lines: 85326, files: 249 },
      { language: "TypeScript", lines: 20352, files: 48 },
      { language: "Python", lines: 1408, files: 17 },
      { language: "CSS", lines: 1152, files: 1 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    icon: Truck,
    gradient: "from-amber-500 to-orange-500",
    status: "Production",
  },
  {
    id: "orby-commander",
    name: "Orby Commander",
    url: "https://getorby.io",
    totalLines: 69249,
    totalFiles: 192,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM"],
    breakdown: [
      { language: "TypeScript", lines: 18394, files: 33 },
      { language: "React/TSX", lines: 49765, files: 159 },
      { language: "CSS", lines: 562 },
      { language: "HTML", lines: 528 },
    ],
    highlights: ["Multi-tenant SaaS", "WebSocket real-time", "12+ roles", "251 DB schema exports"],
    icon: Bot,
    gradient: "from-sky-500 to-cyan-500",
    status: "Production",
    version: "v1.0.16",
  },
  {
    id: "brew-board",
    name: "Brew & Board Coffee",
    url: "https://brewandboard.coffee",
    totalLines: 64900,
    totalFiles: 160,
    stack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "Stripe", "Solana Blockchain", "Twilio", "DoorDash Drive API"],
    breakdown: [
      { language: "React/TSX", lines: 43299 },
      { language: "TypeScript", lines: 20795, files: 33 },
      { language: "CSS", lines: 740 },
      { language: "HTML", lines: 210 },
    ],
    icon: Coffee,
    gradient: "from-yellow-600 to-amber-600",
    status: "Production",
  },
  {
    id: "happy-eats",
    name: "Happy Eats / TL Driver Connect",
    url: "https://happyeats.app",
    totalLines: 38919,
    totalFiles: 144,
    stack: ["React 18", "TypeScript", "Express 5", "PostgreSQL", "WebSocket", "Tesseract.js OCR", "Stripe"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 38494 },
      { language: "CSS", lines: 361 },
      { language: "HTML", lines: 64 },
    ],
    highlights: ["Multi-tenant franchise", "4 user paths", "Real-time WebSocket chat", "GPS vendor discovery", "9 custom themes"],
    icon: Utensils,
    gradient: "from-rose-500 to-pink-500",
    status: "Production",
  },
  {
    id: "vedasolus",
    name: "VedaSolus",
    url: "https://vedasolus.io",
    totalLines: 18978,
    totalFiles: 126,
    stack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "Framer Motion"],
    breakdown: [
      { language: "React/TSX", lines: 14999, files: 90 },
      { language: "TypeScript", lines: 894 },
      { language: "Backend TS", lines: 2414 },
      { language: "Shared Models", lines: 490 },
      { language: "CSS", lines: 156 },
      { language: "HTML", lines: 25 },
    ],
    icon: Heart,
    gradient: "from-green-500 to-emerald-500",
    status: "Production",
    version: "v2.1",
  },
  {
    id: "trust-shield",
    name: "TrustShield",
    url: "https://trustshield.tech",
    totalLines: 18500,
    totalFiles: 62,
    stack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "WebSocket", "Trust Layer"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 17800, files: 58 },
      { language: "CSS", lines: 500, files: 3 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    highlights: ["24/7 continuous monitoring", "Real-time threat detection", "Enterprise blockchain security", "Automated incident response"],
    icon: Shield,
    gradient: "from-red-500 to-orange-500",
    status: "Production",
  },
  {
    id: "strikeagent",
    name: "StrikeAgent",
    url: "https://strikeagent.io",
    totalLines: 45200,
    totalFiles: 134,
    stack: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Solana Blockchain", "OpenAI GPT-4", "WebSocket"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 42100, files: 120 },
      { language: "JavaScript", lines: 2500, files: 10 },
      { language: "CSS", lines: 400, files: 3 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    highlights: ["Autonomous asset discovery", "Multi-chain scanning", "Safety scoring engine", "Smart auto-trade", "80,558+ predictions"],
    icon: Zap,
    gradient: "from-yellow-500 to-red-500",
    status: "Production",
  },
  {
    id: "tradeworks-ai",
    name: "TradeWorks AI",
    url: "https://tradeworksai.io",
    totalLines: 52300,
    totalFiles: 168,
    stack: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI", "Stripe", "Google Maps"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 49800, files: 155 },
      { language: "CSS", lines: 2100, files: 8 },
      { language: "HTML", lines: 400, files: 5 },
    ],
    highlights: ["8 trade industries", "AI-powered estimation", "GPS crew tracking", "Automated scheduling", "White-label ready"],
    icon: Layers,
    gradient: "from-indigo-500 to-blue-500",
    status: "Production",
  },
  {
    id: "nash-paint-pros",
    name: "Nashville Painting Professionals",
    url: "https://nashpaintpros.io",
    totalLines: 12400,
    totalFiles: 45,
    stack: ["React 18", "TypeScript", "Vite", "Express", "PostgreSQL", "TradeWorks AI Engine"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 11800, files: 42 },
      { language: "CSS", lines: 400, files: 2 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    highlights: ["TradeWorks AI painting vertical demo", "Instant estimates", "Booking wizard", "Lead generation"],
    icon: Paintbrush,
    gradient: "from-orange-500 to-amber-500",
    status: "Production",
  },
  {
    id: "lume-paint",
    name: "Lume Paint Co",
    url: "https://lumepaint.co",
    totalLines: 14200,
    totalFiles: 48,
    stack: ["React 18", "TypeScript", "Vite", "Express", "PostgreSQL", "TradeWorks AI Engine"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 13500, files: 44 },
      { language: "CSS", lines: 500, files: 3 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    highlights: ["Premium tier TradeWorks demo", "Luxury interior painting", "Elevated design aesthetic", "Lead capture"],
    icon: Palette,
    gradient: "from-pink-500 to-fuchsia-500",
    status: "Production",
  },
  {
    id: "tlid-io",
    name: "TLId.io",
    url: "https://tlid.io",
    totalLines: 22800,
    totalFiles: 78,
    stack: ["React 18", "TypeScript", "Vite", "Express", "PostgreSQL", "Drizzle ORM", "Meta Business Suite API", "OpenAI", "Trust Layer"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 21900, files: 72 },
      { language: "CSS", lines: 600, files: 4 },
      { language: "HTML", lines: 300, files: 2 },
    ],
    highlights: ["Meta Business Suite integration", "17 daily organic posts", "Smart ad boosting", "Multi-tenant marketing", "Automated content pipeline"],
    icon: TrendingUp,
    gradient: "from-blue-500 to-purple-500",
    status: "Production",
  },
  {
    id: "chronicles",
    name: "Chronicles",
    url: "https://yourlegacy.io",
    totalLines: 0,
    totalFiles: 19,
    stack: ["React 18", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-4o", "ElevenLabs TTS", "DarkWave Blockchain", "Trust Layer"],
    breakdown: [
      { language: "Included in Trust Layer build", lines: 13800, files: 19 },
    ],
    highlights: ["7 historical epochs (Stone Age → 20th century)", "GPT-4o NPCs with 5-axis emotion", "Choice Echoes narrative system", "7 Sigils quest line", "Blockchain Chronicle Proofs", "Voice cloning + scenario generator"],
    icon: Gamepad2,
    gradient: "from-amber-500 to-red-500",
    status: "In Development",
  },
  {
    id: "trusthome",
    name: "TrustHome",
    url: "https://trusthome.replit.app",
    totalLines: 89143,
    totalFiles: 279,
    stack: ["Expo React Native", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-5.2", "Socket.IO", "Trust Layer", "Resend", "Stripe"],
    breakdown: [
      { language: "TypeScript", lines: 55874, files: 200 },
      { language: "HTML", lines: 4733, files: 12 },
      { language: "Config/Docs", lines: 28536, files: 67 },
    ],
    highlights: ["Expo React Native (iOS/Android/Web)", "Voice AI (STT/TTS/Chat)", "Blockchain doc vault", "White-label ready", "Woman-owned (WOSB)"],
    icon: Building2,
    gradient: "from-teal-500 to-emerald-500",
    status: "MVP Complete",
  },
  {
    id: "trustvault",
    name: "TrustVault",
    url: "https://trustvault.replit.app",
    totalLines: 29816,
    totalFiles: 137,
    apiEndpoints: 92,
    stack: ["React 18", "TypeScript", "Vite 7", "Express 5", "PostgreSQL", "Drizzle ORM", "Stripe", "OpenAI GPT-5.1", "ElevenLabs TTS", "Replit Object Storage", "Uppy", "Framer Motion", "TrustLayer SSO", "WebSocket", "PWA", "Recharts"],
    breakdown: [
      { language: "React/TSX (Frontend)", lines: 22060, files: 81 },
      { language: "TypeScript (Backend)", lines: 6952, files: 20 },
      { language: "Shared Models", lines: 804, files: 4 },
    ],
    highlights: ["Multi-tenant media vault", "Spinny AI agent (GPT-5.1 + ElevenLabs)", "Image/Audio/Video/Merge editors", "4-tier Stripe subscriptions", "Signal Chat + TrustLayer SSO", "21 database tables", "92 API endpoints", "PWA installable"],
    icon: Shield,
    gradient: "from-emerald-500 to-cyan-500",
    status: "Production",
    version: "MVP+",
  },
];

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

function LanguageBar({ breakdown, totalLines }: { breakdown: AppMetric["breakdown"]; totalLines: number }) {
  const colors = [
    "bg-gradient-to-r from-cyan-400 to-blue-500",
    "bg-gradient-to-r from-purple-400 to-pink-500",
    "bg-gradient-to-r from-amber-400 to-orange-500",
    "bg-gradient-to-r from-emerald-400 to-green-500",
    "bg-gradient-to-r from-rose-400 to-red-500",
    "bg-gradient-to-r from-indigo-400 to-violet-500",
  ];

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-3">
        {breakdown.map((item, i) => {
          const pct = (item.lines / totalLines) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={i}
              className={`${colors[i % colors.length]} transition-all duration-1000`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {breakdown.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
            <span>{item.language}</span>
            <span className="text-white/40">{item.lines.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EcosystemMetrics() {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const totalLines = ecosystemMetrics.reduce((sum, app) => sum + app.totalLines, 0);
  const totalFiles = ecosystemMetrics.reduce((sum, app) => sum + app.totalFiles, 0);
  const totalApps = ecosystemMetrics.length;
  const totalEndpoints = ecosystemMetrics.reduce((sum, app) => sum + (app.apiEndpoints || 0), 0);
  const uniqueStack = Array.from(new Set(ecosystemMetrics.flatMap(app => app.stack)));

  const sortedApps = [...ecosystemMetrics].sort((a, b) => b.totalLines - a.totalLines);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Ecosystem Metrics - DarkWave Studios"
        description={`${totalLines.toLocaleString()}+ lines of hand-written code across ${totalApps} production applications. Explore the full DarkWave ecosystem codebase.`}
        keywords="DarkWave ecosystem metrics, codebase statistics, lines of code, production applications, full-stack development"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Ecosystem", url: "https://darkwavestudios.io/ecosystem" },
          { name: "Metrics", url: "https://darkwavestudios.io/metrics" },
        ]}
      />

      <div className="fixed inset-0 bg-background -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center_right,rgba(6,182,212,0.06),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ecosystem" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300" data-testid="back-ecosystem">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Ecosystem Metrics</span>
            </div>
          </div>
          <Link 
            href="/ecosystem"
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            data-testid="button-view-apps"
          >
            <span className="relative z-10">View Apps</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <section className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-semibold text-primary mb-8 shadow-lg shadow-primary/10">
            <Terminal className="w-4 h-4" />
            Living Codebase Metrics
          </div>
          <h1 className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-400 bg-clip-text text-transparent">
              <AnimatedCounter target={totalLines} duration={2500} />
            </span>
            <span className="block text-xl lg:text-3xl mt-2 text-white/60 font-medium">Lines of Hand-Written Code</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Across {totalApps} production applications. No boilerplate. No generated output. 
            Pure, hand-crafted source code powering the entire DarkWave ecosystem.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-4">
            Last updated: February 6, 2026 &middot; Excludes node_modules, build artifacts, and lock files
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-24">
          {[
            { icon: Code2, label: "Total Lines", value: totalLines, gradient: "from-cyan-500/20 to-blue-500/20", color: "text-cyan-400" },
            { icon: FileCode2, label: "Source Files", value: totalFiles, gradient: "from-purple-500/20 to-pink-500/20", color: "text-purple-400" },
            { icon: Layers, label: "Applications", value: totalApps, gradient: "from-amber-500/20 to-orange-500/20", color: "text-amber-400" },
            { icon: Server, label: "API Endpoints", value: totalEndpoints, gradient: "from-emerald-500/20 to-green-500/20", color: "text-emerald-400" },
          ].map((stat, i) => (
            <div key={i} className="relative group" data-testid={`stat-card-${i}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl transition-opacity duration-500" />
              <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 text-center hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-3xl lg:text-4xl font-bold font-display ${stat.color} mb-1`}>
                  <AnimatedCounter target={stat.value} duration={2000} suffix={stat.value > 1000 ? "+" : ""} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Codebase Breakdown
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-8 ml-4">Ranked by lines of code. Click any app to expand details.</p>

          <div className="space-y-4">
            {sortedApps.map((app, index) => {
              const isExpanded = expandedApp === app.id;
              const pctOfTotal = ((app.totalLines / totalLines) * 100).toFixed(1);

              return (
                <div
                  key={app.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${isExpanded ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  data-testid={`app-metric-${app.id}`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${app.gradient} opacity-0 ${isExpanded ? 'opacity-[0.08]' : 'group-hover:opacity-[0.05]'} transition-opacity duration-500`} />
                  <div className={`relative backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'border-primary/30 shadow-xl shadow-primary/5' : 'border-white/10 hover:border-white/20'}`}>
                    <div className="p-5 lg:p-6">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                          <div className="text-lg font-mono text-white/20 w-8 text-right">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
                            <app.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-display font-bold text-lg lg:text-xl truncate">{app.name}</h3>
                            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">{app.status}</span>
                            {app.version && (
                              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-mono">{app.version}</span>
                            )}
                          </div>
                          <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5" />
                              {app.totalLines.toLocaleString()} lines
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileCode2 className="w-3.5 h-3.5" />
                              {app.totalFiles.toLocaleString()} files
                            </span>
                            {app.apiEndpoints && (
                              <span className="flex items-center gap-1.5">
                                <Server className="w-3.5 h-3.5" />
                                {app.apiEndpoints} endpoints
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                              {app.totalLines.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">{pctOfTotal}% of ecosystem</div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>

                        <div className="lg:hidden text-right shrink-0">
                          <div className="text-lg font-bold">{(app.totalLines / 1000).toFixed(0)}k</div>
                          <div className="text-[10px] text-muted-foreground">{pctOfTotal}%</div>
                        </div>
                      </div>

                      <div className="mt-4 lg:hidden flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{app.totalFiles.toLocaleString()} files</span>
                        {app.apiEndpoints && <span>{app.apiEndpoints} endpoints</span>}
                      </div>

                      <div className="mt-4">
                        <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${app.gradient} transition-all duration-1000`}
                            style={{ width: `${(app.totalLines / sortedApps[0].totalLines) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-5 lg:px-6 pb-6 pt-2 border-t border-white/5">
                        <div className="grid lg:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <Palette className="w-4 h-4 text-primary" />
                              Language Breakdown
                            </h4>
                            <LanguageBar breakdown={app.breakdown} totalLines={app.totalLines} />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-primary" />
                              Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {app.stack.map((tech, i) => (
                                <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {app.highlights && (
                          <div className="mt-5">
                            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              Highlights
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {app.highlights.map((h, i) => (
                                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex items-center gap-3">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                            onClick={(e) => e.stopPropagation()}
                            data-testid={`visit-${app.id}`}
                          >
                            Visit Live App
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Technology Footprint
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
            <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold">{uniqueStack.length} Technologies</h3>
                <span className="text-xs text-muted-foreground">across the ecosystem</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueStack.sort().map((tech, i) => (
                  <span
                    key={i}
                    className="text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-default"
                    data-testid={`tech-${tech.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-accent/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
            <div className="relative p-10 lg:p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Growing Every Day
              </h2>
              <p className="text-muted-foreground mb-3 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                These metrics are updated after every development session. The DarkWave ecosystem 
                is continuously evolving with new features, applications, and improvements.
              </p>
              <p className="text-xs text-muted-foreground/60 mb-8">
                Additional apps pending metrics: TradeWorks AI, Nashville Painting Pros, Lume Paint Co, StrikeAgent, Trust Shield, TLId.io Marketing Suite, Chronicles
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ecosystem"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                  data-testid="button-explore-ecosystem"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore the Ecosystem
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/investors"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
                  data-testid="button-investor-info"
                >
                  Investor Information
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10 backdrop-blur-xl bg-background/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-muted-foreground">DarkWave Studios, LLC &middot; All metrics represent hand-written source code only</p>
        </div>
      </footer>
    </div>
  );
}
