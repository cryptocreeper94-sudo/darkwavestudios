import { useState } from "react";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Smartphone
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface EcosystemApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  url: string;
  category: string;
}

const ecosystemApps: EcosystemApp[] = [
  {
    id: "trust-layer",
    name: "Trust Layer",
    tagline: "The Coordinated Trust Layer",
    description: "Full Layer 1 Proof-of-Authority blockchain ecosystem with DeFi, identity verification, and transparent audit trails. Native Signal (SIG) token with 400ms block finality and 200K+ TPS. Wallet, DEX/swap, cross-chain bridge, staking, NFT marketplace, presale, explorer, DAO governance, and business tenant portals. 672,085 lines across 5 interconnected PWAs, 743 API endpoints, 289 database tables.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://dwsc.io",
    category: "core"
  },
  {
    id: "trust-shield",
    name: "Guardian Shield / TrustShield",
    tagline: "The World's First AI Agent Certification System",
    description: "Verify, certify, and protect autonomous AI agents across Security, Transparency, Reliability, and Compliance domains. Guardian Certification Program, continuous enterprise monitoring, public certification registry, and Guardian AI registry for autonomous agents.",
    image: "/ecosystem/trust-shield.png",
    url: "https://trustshield.tech",
    category: "security"
  },
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Where AI Meets Crypto Intelligence",
    description: "AI-driven cryptocurrency trading and analytics platform with predictive signals, quantitative analysis, and real-time crypto news.",
    image: "/ecosystem/pulse.png",
    url: "https://darkwavepulse.com",
    category: "trading"
  },
  {
    id: "strikeagent",
    name: "StrikeAgent",
    tagline: "Strike First. Strike Smart.",
    description: "Autonomous AI-powered asset discovery and trading system. Multi-chain scanning, safety scoring, and smart auto-trade capabilities.",
    image: "/ecosystem/strikeagent.png",
    url: "https://strikeagent.io",
    category: "trading"
  },
  {
    id: "orbit-staffing",
    name: "ORBIT Staffing OS",
    tagline: "The complete staffing solution that works while you sleep.",
    description: "Automated white-label staffing platform with worker onboarding, GPS-verified time tracking, payroll processing, and compliance management.",
    image: "/ecosystem/orbit-staffing.png",
    url: "https://orbitstaffing.io",
    category: "business"
  },
  {
    id: "orby-commander",
    name: "Orby Commander",
    tagline: "Unify your venue operations with one powerful command center.",
    description: "Comprehensive PWA for stadiums and arenas. Emergency command center, delivery tracking, inventory counting, and team communications.",
    image: "/ecosystem/orby-commander.png",
    url: "https://orbycommander.com",
    category: "business"
  },
  {
    id: "lot-ops-pro",
    name: "Lot Ops Pro",
    tagline: "Move Smarter. Track Better. Manage Everything.",
    description: "Mobile-first driver performance and workflow management for auto auctions, dealerships, and industrial operations.",
    image: "/ecosystem/lot-ops-pro.png",
    url: "https://lotopspro.com",
    category: "business"
  },
  {
    id: "brew-board",
    name: "Brew & Board Coffee",
    tagline: "Nashville's Premium B2B Coffee Concierge.",
    description: "B2B platform connecting Nashville businesses with premium local coffee shops and catering vendors. White-glove corporate catering.",
    image: "/ecosystem/brew-board.png",
    url: "https://brewandboardcoffee.replit.app",
    category: "business"
  },
  {
    id: "tradeworks-ai",
    name: "TradeWorks AI",
    tagline: "One Platform. Eight Trades. Infinite Possibilities.",
    description: "Mobile field tools with 85+ professional calculators, voice-to-estimate, and weather radar. 7 pages with dedicated PWA manifest. 11,231 lines of production code.",
    image: "/ecosystem/tradeworks-ai.png",
    url: "https://tradeworksai.io",
    category: "trades"
  },
  {
    id: "paint-pros",
    name: "PaintPros.io",
    tagline: "Your Gateway to the Complete Trade Business System",
    description: "Flagship trade services platform with estimating, CRM, crew management, marketing automation, payments, AI tools, customer portals, and weather system. 74 pages with 42,415 lines of frontend code plus 87,420-line shared backend powering TradeWorks AI, NashPaintPros, and TLID.io. 152,149 combined lines across 96 pages.",
    image: "/ecosystem/paint-pros.png",
    url: "https://paintpros.io",
    category: "trades"
  },
  {
    id: "nash-paint-pros",
    name: "NashPaintPros.io",
    tagline: "Nashville's Trusted Painting Professionals",
    description: "Ecosystem hub connecting 20+ platforms with affiliate tracking and lead generation. 4 pages with dedicated PWA manifest. 3,950 lines of production code.",
    image: "/ecosystem/nash-paint-pros.png",
    url: "https://nashpaintpros.io",
    category: "trades"
  },
  {
    id: "garagebot",
    name: "GarageBot",
    tagline: "Right Part. First Time. Every Engine.",
    description: "Auto parts aggregator unifying inventory from 68+ retailers across 16 categories. Buddy AI assistant, DIY repair guides, parts marketplace, and blockchain-verified vehicle passports. 86,000+ lines of source code, 422 API endpoints, 120+ database tables.",
    image: "/ecosystem/garagebot.png",
    url: "https://garagebot.io",
    category: "auto"
  },
  {
    id: "tl-driver-connect",
    name: "TL Driver Connect",
    tagline: "Nationwide Driver & Delivery Platform with Happy Eats",
    description: "Nationwide delivery, driver management, and food truck ordering platform with multi-tenant franchise architecture. 50 pages, 71 UI components, 147 API endpoints, 2 WebSocket servers, 41 database tables, and 55+ client routes. Features zone-based batch ordering, affiliate referral program, bilingual support, and franchise system. 22,900 lines of production TypeScript.",
    image: "/ecosystem/happy-eats.png",
    url: "https://happyeats.app",
    category: "auto"
  },
  {
    id: "vedasolus",
    name: "VedaSolus",
    tagline: "Ancient Wisdom. Modern Science. Your Wellness Journey.",
    description: "Holistic health platform bridging Eastern healing traditions with Western science. AI wellness coach, dosha analysis, and practitioner hub.",
    image: "/ecosystem/vedasolus.png",
    url: "https://vedasolus.io",
    category: "health"
  },
  {
    id: "tlid-io",
    name: "TLID.io",
    tagline: "Automated Marketing That Works While You Work",
    description: "Self-service automated advertising for any business type. 5-step onboarding, organic posting, and ad campaigns. 11 pages with dedicated PWA manifest. 7,133 lines of production code.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "/marketing",
    category: "business"
  },
  {
    id: "chronicles",
    name: "DarkWave Chronicles",
    tagline: "Not a Game — a Life.",
    description: "A parallel life simulation where you are YOU living across historical eras. 1 hour = 1 real hour, timezone-synced. Season 0 features 3 playable eras (Modern, Medieval, Wild West) with 15 factions, 75 hand-crafted situations, 9 NPCs with persistent relationship scores, 15 city zones, and 36 era-specific building templates. AI generates infinite daily situations personalized to your history. 16,003 lines of production code.",
    image: "/ecosystem/chronicles.jpg",
    url: "https://dwsc.io/chronicles",
    category: "gaming"
  },
  {
    id: "the-arcade",
    name: "The Arcade",
    tagline: "Play for Fun or Play to Win!",
    description: "Premium arcade games, provably fair sweepstakes, and classic card games. Features Orbit Crash multiplier game, Dragon's Fortune Slots, and a full arcade collection. Gold Coins & Sweeps Coins via Stripe, provably fair system, sweepstakes compliance, and a game developer portal. 5,276 lines of production code.",
    image: "/ecosystem/darkwave-games.png",
    url: "https://darkwavegames.io",
    category: "gaming"
  },
  {
    id: "chronochat",
    name: "ChronoChat",
    tagline: "Connect Across Timelines. Chat Beyond Eras.",
    description: "The community hub for the DarkWave ecosystem. Cross-era chat concept tied into Chronicles, community channels, messaging, and real-time engagement. Built to bridge all ecosystem users into one social layer.",
    image: "/ecosystem/chronochat.png",
    url: "https://dwsc.io/community",
    category: "social"
  },
  {
    id: "darkwave-studio",
    name: "DarkWave Studio",
    tagline: "Build on DarkWave Smart Chain.",
    description: "Browser-based integrated development environment for building on the DarkWave Smart Chain. Monaco-powered code editor, smart contract development, Docker container orchestration for sandboxed execution, JWT-authenticated sessions, resource enforcement, project management, and full developer portal. 7,006 lines of production code.",
    image: "/ecosystem/darkwave-studio.png",
    url: "https://dwsc.io/studio",
    category: "core"
  },
  {
    id: "trusthome",
    name: "TrustHome",
    tagline: "Every Transaction. Verified. Transparent. Trusted.",
    description: "White-label real estate platform for agents, buyers, sellers, inspectors, and brokers. Expo React Native (iOS/Android/Web) with 20 app screens and 21 reusable components. Voice AI assistant (STT/TTS/Chat via GPT-5.2), blockchain document vault, CRM with AI lead scoring, marketing hub, business suite with OCR expense tracking, MLS integration (10+ providers), Signal Chat, and 103 API endpoints across 6 database tables. 26,653 lines of production code. Woman-owned (WOSB eligible).",
    image: "/ecosystem/trusthome.png",
    url: "https://trusthome.replit.app",
    category: "real-estate"
  },
  {
    id: "trustvault",
    name: "TrustVault",
    tagline: "Your Media. Secured. Organized. Yours.",
    description: "Universal IP storage and media management platform for creators, families, and teams. Image editor with filters, drawing, stickers, and text overlays. Audio editor with 3-band EQ, reverb, and noise gate. Video editor with color grading and frame capture. Merge/combine tool for collages and concatenation. Spinny AI agent (GPT-5.1 + ElevenLabs TTS), 4 AI media tools, collections system, Signal Chat, 4-tier Stripe subscriptions, PWA installable, and TrustLayer SSO. 132 API endpoints across 26 database tables. 105,983 lines of production code.",
    image: "/ecosystem/trustvault.png",
    url: "https://trustvault.replit.app",
    category: "security"
  },
  {
    id: "guardian-scanner",
    name: "Guardian Scanner",
    tagline: "AI-Powered Token Analysis & Pulse Scoring",
    description: "Real-time multi-chain cryptocurrency token analysis scanner with Pulse predictive scoring. Honeypot detection, whale analysis, ML price predictions, and Strike Agent buy/watch/avoid recommendations. Covers Solana, Ethereum, BSC, Base, Arbitrum, Polygon, and more. Powered by DexScreener data with proprietary Guardian Score algorithm.",
    image: "/ecosystem/guardian-scanner.png",
    url: "https://dwsc.io/guardian-scanner",
    category: "trading"
  },
  {
    id: "signal-chat",
    name: "Signal Chat",
    tagline: "Connect Across Timelines",
    description: "Cross-app community messaging platform for the Trust Layer ecosystem. Real-time WebSocket chat, JWT SSO authentication, channel-based conversations, invite system, and user presence. The social backbone connecting all ecosystem apps.",
    image: "/ecosystem/signal-chat.png",
    url: "https://dwsc.io/signal-chat",
    category: "social"
  }
];

const categories = [
  { id: "core", name: "Core Platform", description: "The foundation of the DarkWave ecosystem" },
  { id: "trading", name: "Trading & Crypto", description: "AI-powered trading and blockchain tools" },
  { id: "business", name: "Business Operations", description: "Enterprise workflow and staffing solutions" },
  { id: "trades", name: "Trade Services", description: "Field service platforms for contractors" },
  { id: "auto", name: "Auto & Delivery", description: "Vehicle and food service platforms" },
  { id: "health", name: "Health & Wellness", description: "Holistic wellness solutions" },
  { id: "gaming", name: "Gaming", description: "Immersive gaming experiences" },
  { id: "real-estate", name: "Real Estate", description: "Property transaction and brokerage platforms" },
  { id: "social", name: "Social & Communication", description: "Community and messaging platforms" },
  { id: "smart-home", name: "Smart Home", description: "IoT and home automation platforms" }
];

function AppCarousel({ apps, categoryName }: { apps: EcosystemApp[], categoryName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % apps.length);
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + apps.length) % apps.length);
  };

  if (apps.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
          <h3 className="text-xl lg:text-2xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{categoryName}</h3>
        </div>
        {apps.length > 1 && (
          <div className="flex gap-2">
            <button 
              onClick={prev}
              className="w-12 h-12 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
              data-testid={`carousel-prev-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-primary/50 transition-all duration-300 shadow-lg"
              data-testid={`carousel-next-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex gap-4 lg:gap-5 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {apps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-full lg:w-[calc(33.333%-1rem)] rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              data-testid={`app-card-${app.id}`}
            >
              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-primary/30 hover:shadow-primary/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                  <img 
                    src={app.image} 
                    alt={app.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <div className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-primary/80 group-hover:border-primary transition-all duration-300">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-5 lg:p-5 relative">
                  <h4 className="font-display font-bold text-lg lg:text-base mb-1 group-hover:text-primary transition-colors duration-300">{app.name}</h4>
                  <p className="text-sm text-primary/80 mb-3 italic font-medium">"{app.tagline}"</p>
                  <p className="text-sm lg:text-xs text-muted-foreground line-clamp-3 lg:line-clamp-2 leading-relaxed">{app.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {apps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {apps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-gradient-to-r from-primary to-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Ecosystem() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Ecosystem - DarkWave Studios"
        description="Explore the complete DarkWave ecosystem. 23 connected applications across 12 production builds spanning trading, business operations, trade services, gaming, and more. Over 1.89 million lines of code."
        keywords="DarkWave ecosystem, trust layer, blockchain apps, trading platforms, business software"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Ecosystem", url: "https://darkwavestudios.io/ecosystem" }
        ]}
      />

      <div className="fixed inset-0 bg-background -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.5))] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Ecosystem</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/metrics"
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              data-testid="button-ecosystem-metrics"
            >
              Metrics
            </Link>
            <Link 
              href="/developers"
              className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              data-testid="button-developer-tools"
            >
              <span className="relative z-10">Developer Tools</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <section className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-semibold text-primary mb-8 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4" />
            {ecosystemApps.length} Connected Applications
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            The DarkWave{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Ecosystem</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            A complete suite of interconnected applications spanning trading, business operations, 
            trade services, and enterprise solutions. All powered by Trust Layer blockchain verification.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground mt-4">
            <Smartphone className="w-3.5 h-3.5 text-primary" />
            All apps are installable PWAs — download and add to your home screen on any device
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["/ecosystem/pulse.png", "/ecosystem/orbit-staffing.png", "/ecosystem/strikeagent.png", "/ecosystem/trust-layer-icon.png"].map((img, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-white/10">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground self-center">+{ecosystemApps.length - 4} more apps</span>
          </div>
        </section>

        <div className="space-y-12 lg:space-y-16">
          {categories.map((category) => {
            const categoryApps = ecosystemApps.filter(app => app.category === category.id);
            if (categoryApps.length === 0) return null;
            
            return (
              <section key={category.id}>
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <AppCarousel apps={categoryApps} categoryName={category.name} />
              </section>
            );
          })}
        </div>

        <section className="mt-20 lg:mt-32 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-accent/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
            <div className="relative p-10 lg:p-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Build With the Ecosystem
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                Access our developer tools, APIs, and Trust Layer widgets to build your own 
                applications within the DarkWave ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/developers"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                  data-testid="button-explore-dev-tools"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Developer Tools
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <a 
                  href="https://dwtl.io/guardian-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
                  data-testid="button-certify-agent"
                >
                  Certify Your AI Agent
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10 backdrop-blur-xl bg-background/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-muted-foreground">DarkWave Studios, LLC. All ecosystem applications are connected via Trust Layer.</p>
        </div>
      </footer>
    </div>
  );
}
