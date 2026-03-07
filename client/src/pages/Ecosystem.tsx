import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Smartphone,
  X
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";

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
    id: "trust-hub",
    name: "Trust Layer Hub",
    tagline: "Your Blockchain Ecosystem Command Center",
    description: "The unified mobile command center for the Trust Layer protocol ecosystem — the single point of entry to 35 interconnected decentralized applications. Full-featured DeFi wallet supporting SIG ($0.01), Shells ($0.001), and stSIG with 5 staking pools (12%–38% APY). Liquid staking, DEX swaps, Plaid bank linking, Stripe business dashboard, encrypted WebSocket chat, multi-sig vaults, AI agent with voice synthesis, 3-tier news engine, and 5-tier affiliate program. Built with React Native + Expo SDK 54 for iOS, Android, and Web (PWA). 21,026 LOC, 93 files, 66 endpoints, 15 tables, 24 screens, 13 components, 17 hooks. Genesis application (TH-00000001). Free forever — dark-only cyber-glassmorphism design. 200K+ TPS, 400ms block finality.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://trusthub.tlid.io",
    category: "core"
  },
  {
    id: "trust-layer",
    name: "Trust Layer",
    tagline: "The Coordinated Trust Layer",
    description: "Full Layer 1 Proof-of-Authority blockchain ecosystem with DeFi, identity verification, and transparent audit trails. Native Signal (SIG) asset with 400ms block finality and 200K+ TPS. Wallet, DEX/swap, cross-chain bridge (5 chains), staking, NFT marketplace, presale, explorer, DAO governance, and business tenant portals. 243,958 lines across 555 files, 12 PWA manifests, 7 host-based domains, 749 API endpoints, 544 schema exports, 233 pages, 158 components.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://dwtl.io",
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
    url: "https://getorby.io",
    category: "business"
  },
  {
    id: "lot-ops-pro",
    name: "Lot Ops Pro",
    tagline: "Move Smarter. Track Better. Manage Everything.",
    description: "Mobile-first driver performance and workflow management for auto auctions, dealerships, and industrial operations.",
    image: "/ecosystem/lot-ops-pro.png",
    url: "https://lotopspro.io",
    category: "business"
  },
  {
    id: "brew-board",
    name: "Brew & Board Coffee",
    tagline: "Nashville's Premium B2B Coffee Concierge.",
    description: "B2B platform connecting businesses with premium local coffee shops and catering vendors. White label franchising available — Brew & Board Atlanta, Brew & Board Denver, or purchase a license for full self-branding. This is the working demo.",
    image: "/ecosystem/brew-board.png",
    url: "https://brewandboard.coffee",
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
    name: "PaintPros",
    tagline: "Your Gateway to the Complete Trade Business System",
    description: "Flagship trade services platform with estimating, CRM, crew management, marketing automation, payments, AI tools, customer portals, and weather system. 74 pages with 42,415 lines of frontend code plus 87,420-line shared backend powering TradeWorks AI, NashPaintPros, and TLID.io. 152,149 combined lines across 96 pages.",
    image: "/ecosystem/paint-pros.png",
    url: "https://paintpros.io",
    category: "trades"
  },
  {
    id: "nash-paint-pros",
    name: "Nashville Painting Professionals",
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
    description: "AI-powered parts aggregator unifying inventory from 93+ retailers across 20 categories. Buddy AI assistant with symptom diagnosis engine, DIY repair guides, VIN decoding, fleet management, TORQUE shop management OS, peer-to-peer parts marketplace, Signal Chat, weather radar, CDL directory, Shade Tree Mechanics community, 54 active affiliate partnerships, and Google AdSense monetization. 111,000+ lines of code, 50+ pages, 436+ API endpoints, 134 database tables, 58 React components. Full PWA with offline support.",
    image: "/ecosystem/garagebot.png",
    url: "https://garagebot.io",
    category: "auto"
  },
  {
    id: "torque",
    name: "TORQUE",
    tagline: "Shop Management OS powered by Trust Layer.",
    description: "Standalone PWA shop management platform within GarageBot. 5-step onboarding with Solana blockchain verification, 11 dashboard tabs covering work orders, appointments, customers, inventory, invoices, team, and reports. 15 business tool integrations (QuickBooks, ADP, Gusto, PartsTech, and more), ORBIT payroll sync, Marketing Hub with Meta/Facebook auto-posting and ad campaign management, and Partner API with API Key + Secret authentication and granular scopes. 5,475 lines across 10 files.",
    image: "/ecosystem/torque.png",
    url: "https://torque.tlid.io",
    category: "auto"
  },
  {
    id: "tl-driver-connect",
    name: "TL Driver Connect",
    tagline: "Everything a Driver Needs, One App",
    description: "All-in-one platform for commercial and everyday drivers. GPS mileage tracking with automatic trip logging, expense management with receipt OCR scanning, fuel finder (diesel/gas/EV sorted by proximity), CDL program directory, driver concierge service, real-time weather dashboard, and office suite with financial tracking. Trucker Talk and Signal Chat for driver community. Delivery network integration with Happy Eats for zone-based food truck order assignments. Shared codebase: 110,745 LOC, 611 files, 63 pages, 212 API endpoints, 48 database tables.",
    image: "/ecosystem/happy-eats.png",
    url: "https://tldriverconnect.com",
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
    url: "https://tlid.io",
    category: "business"
  },
  {
    id: "chronicles",
    name: "Chronicles",
    tagline: "Not a Game — a Life.",
    description: "A parallel life simulation where you are YOU living across historical eras. 1 hour = 1 real hour, timezone-synced. Season Zero with 3 eras (Modern, Medieval, Wild West), procedural ambient audio engine with 21 location soundscapes and day/night variations, daily life system with 30+ careers across 4 shifts and 5 ranks, faith & spiritual life, geographic travel, estate & interior customization, NPC system with AI chat, marketplace economy, voice system, and pets. 36,947 lines across 27 pages, 5 components, 9 server services.",
    image: "/ecosystem/chronicles.jpg",
    url: "https://yourlegacy.io",
    category: "gaming"
  },
  {
    id: "the-arcade",
    name: "The Arcade",
    tagline: "Play for Fun or Play to Win!",
    description: "12 provably fair blockchain games including Slots, Coinflip, Spades, Solitaire, Minesweeper, Galaga, Tetris, Snake, Pacman, Crash, Predictions, and Lottery. Gold Coins & Sweeps Coins via Stripe, cryptographic provably fair system, sweepstakes compliance, and a game developer portal.",
    image: "/ecosystem/darkwave-games.png",
    url: "https://darkwavegames.io",
    category: "gaming"
  },
  {
    id: "dwsc-studio",
    name: "DarkWave Studio",
    tagline: "Build on DWSC.",
    description: "Browser-based integrated development environment for building on DWSC. Monaco-powered code editor, smart contract development, Docker container orchestration for sandboxed execution, JWT-authenticated sessions, resource enforcement, project management, and full developer portal. 7,006 lines of production code.",
    image: "/ecosystem/darkwave-studio.png",
    url: "https://studio.tlid.io",
    category: "core"
  },
  {
    id: "trusthome",
    name: "TrustHome",
    tagline: "Every Transaction. Verified. Transparent. Trusted.",
    description: "White-label real estate platform for agents, buyers, sellers, inspectors, and brokers. Expo React Native (iOS/Android/Web) with 20 app screens and 21 reusable components. Voice AI assistant (STT/TTS/Chat via GPT-5.2), blockchain document vault, CRM with AI lead scoring, marketing hub, business suite with OCR expense tracking, MLS integration (10+ providers), Signal Chat, and 103 API endpoints across 6 database tables. 26,653 lines of production code. Woman-owned (WOSB eligible).",
    image: "/ecosystem/trusthome.png",
    url: "https://trusthome.tlid.io",
    category: "real-estate"
  },
  {
    id: "trustvault",
    name: "TrustVault",
    tagline: "Your Universal IP Storage & Creative Platform",
    description: "Professional-grade multi-tenant digital media vault and creative suite for families, creators, and teams. Full image editor (crop, filters, layers, watermark, eyedropper, drawing, stickers, AI auto-enhance, background removal, smart erase, voice-commanded editing), audio editor (trim, EQ, reverb, noise gate), video editor (trim, color grading, text overlays, frame capture, custom thumbnails), and merge/combine studio with 17 transition effects. 14 AI-powered tools including Smart Search, Auto-Tag, Caption Generator, Social Media Kit, Beat-Sync Video Maker, Style DNA, Thumbnail Ranker, Portfolio Generator, and Spinny AI agent (GPT-5.1 + ElevenLabs TTS). 4-tier Stripe subscriptions (Free/Personal $9.99/Pro $19.99/Studio $49.99), Signal Chat, AI Blog platform, and TrustLayer SSO. 46,697 lines of code, 172 files, 29 pages, 30 components, 156 API endpoints, 12 database tables.",
    image: "/ecosystem/trustvault.png",
    url: "https://trustvault.tlid.io",
    category: "security"
  },
  {
    id: "guardian-scanner",
    name: "Guardian Scanner",
    tagline: "AI Agent & URL Security Verification",
    description: "AI-powered security verification platform that scans and certifies both autonomous AI agents and websites/URLs across the crypto ecosystem. AI Agent Scanning & Certification verifies agents across four dimensions: Security, Transparency, Reliability, and Compliance — agents receive a Guardian trust score and can earn certification through the Guardian Certification Program (Assurance Lite and Guardian Premier tiers). All certified agents are listed on the public Guardian AI Registry. Website & URL Scanning checks any project URL, token website, DEX link, airdrop claim page, or Discord invite for phishing indicators, malicious redirects, impersonation patterns, and known scam domains. Guardian Shield subscribers receive continuous monitoring with real-time alerts when certified agents or scanned websites change behavior. Mobile-first PWA installable on any device.",
    image: "/ecosystem/guardian-scanner.png",
    url: "https://guardianscanner.tlid.io",
    category: "security"
  },
  {
    id: "signal-chat",
    name: "Signal Chat",
    tagline: "Connect Across Timelines",
    description: "Cross-app community messaging platform for the Trust Layer ecosystem. Real-time WebSocket chat, JWT SSO authentication, channel-based conversations, invite system, and user presence. The social backbone connecting all ecosystem apps.",
    image: "/ecosystem/signal-chat.png",
    url: "https://signalchat.tlid.io",
    category: "social"
  },
  {
    id: "the-void",
    name: "THE VOID",
    tagline: "Scream into the abyss. The abyss talks back.",
    description: "The world's first voice-first venting app — scream, rant, or whisper into 5 AI personalities (Smart-Ass, Calming, Therapist, Hype Man, Roast Master) powered by GPT-5.2 with real-time transcription. 20+ wellness tools including Emotional Voice Fingerprint (vocal biomarker analysis), Living Mood Portrait (generative AI art from emotions), Void Echo time capsules, Voice Journal, Zen Zone with guided breathing, Sleep Sounds mixer, Virtual Rage Room, crisis toolkit, Signal Chat, and gamification with streaks and achievements. Stripe subscriptions ($9.99/mo founders, $14.99/mo standard), affiliate program with blockchain-stamped Void IDs, and Capacitor-ready for native iOS/Android. 23,532 lines of code, 27 pages, 72 API endpoints, 20+ database tables.",
    image: "/projects/the-void.png",
    url: "https://intothevoid.app",
    category: "health"
  },
  {
    id: "guardian-screener",
    name: "Guardian Screener",
    tagline: "See the Market Before It Sees You",
    description: "AI-powered DEX screener with real-time monitoring across all major decentralized exchanges. Smart pattern detection, predictive analytics, rug pull and honeypot risk detection, whale concentration tracking, liquidity lock verification, and 24/7 security alerts. Multi-chain coverage across Solana, Ethereum, Base, BSC, Arbitrum, Polygon, and DWSC. Installable PWA. Part of the dwsc.io codebase.",
    image: "/projects/guardian-screener.png",
    url: "https://guardianscreener.tlid.io",
    category: "trading"
  },
  {
    id: "darkwave-academy",
    name: "DarkWave Academy",
    tagline: "Learn. Build. Certify.",
    description: "Education and certification platform for the Trust Layer ecosystem. 6 course tracks covering blockchain development, smart contract security, DeFi protocols, AI integration, full-stack development, and Trust Layer architecture. 3 certification tiers with Stripe-powered subscriptions. Installable PWA at academy.tlid.io.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://academy.tlid.io",
    category: "core"
  },
  {
    id: "happy-eats",
    name: "Happy Eats",
    tagline: "Your Favorite Food Trucks, Delivered",
    description: "Zone-based food delivery platform connecting food truck vendors and mobile commissaries with customers across Middle Tennessee. Multi-truck cart ordering, 11 delivery zones along the I-24/I-840 corridor, vendor self-service portal with menu management, AI-powered marketing toolkit with flyer creator and TLI d.io social posting, customer rewards and referral program, receipt scanning (OCR), Stripe live checkout, and franchise model with territory isolation. Shared codebase with TL Driver Connect: 110,745 LOC, 611 files, 63 pages, 212 API endpoints, 48 database tables.",
    image: "/emblems/happy-eats.png",
    url: "https://happyeats.app",
    category: "auto"
  },
  {
    id: "trust-book",
    name: "Trust Book",
    tagline: "Censorship-Free Publishing",
    description: "Premium ebook publishing and reading platform with AI narration, multi-format support, and blockchain-verified provenance. Features immersive e-reader with chapter navigation, OpenAI Nova HD AI narration, PDF/EPUB downloads, and the flagship title 'Through The Veil' — a 110,000-word investigative work spanning 54+ chapters across 15 volumes. Glassmorphism UI with Framer Motion animations.",
    image: "/emblems/trust-book.png",
    url: "https://trustbook.tlid.io",
    category: "core"
  },
  {
    id: "trust-golf",
    name: "Trust Golf",
    tagline: "Your Premium Golf Companion",
    description: "Premium mobile-first golf companion app with 45 courses (world-class + regional), AI swing analysis via GPT-4o vision with video playback (slow-motion 0.25x/0.5x/1x), USGA handicap system with auto-calculated index, hole-by-hole scorecards with real par/yardage data, GPS distance finder with satellite maps and Haversine calculation, exclusive tee time deals, AI-driven SEO blog, vendor/partner signup with Resend email, and self-hosted first-party analytics. Cinematic explorer with 3 AI-generated cycling videos, glass-morphism UI, React Native + Expo SDK 54, installable PWA. 17 features, 53+ API endpoints, 14,576 LOC across 61 files.",
    image: "/emblems/trust-golf.png",
    url: "https://trustgolf.app",
    category: "sports"
  },
  {
    id: "verdara",
    name: "Verdara",
    tagline: "The Ultimate Outdoor Recreation Super-App",
    description: "Comprehensive outdoor recreation platform featuring AI-powered species identification, trail mapping, trip planner, campground booking, marketplace, 125+ locations across 41 states, 18 activity categories, and 138+ features. Companion app Arbora provides standalone arborist CRM. 35,500 lines of code, 41 pages.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://verdara.tlid.io",
    category: "outdoor"
  },
  {
    id: "arbora",
    name: "Arbora",
    tagline: "Professional Arborist Management Platform",
    description: "Standalone arborist PWA built within the Verdara ecosystem. Full CRM with customer management, estimates, job scheduling, invoicing, crew management, and inventory tracking. Mobile-optimized field tools for on-site assessments. ~8,000 lines of code, 10 pages.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://arbora.tlid.io",
    category: "trades"
  },
  {
    id: "bomber",
    name: "Bomber",
    tagline: "Drop. Destroy. Dominate.",
    description: "Action arcade game in the Trust Layer gaming suite. Part of the Hallmark-verified ecosystem with blockchain-backed achievement records and SIG-denominated rewards. Installable PWA at bomber.tlid.io.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://bomber.tlid.io",
    category: "gaming"
  },
  {
    id: "trustgen",
    name: "TrustGen",
    tagline: "AI-Powered 3D Creation with Blockchain Provenance",
    description: "Premium browser-based 3D creation and code studio combining a full-featured 3D editor, AI model generation (Meshy.ai text-to-3D), integrated Studio IDE with Monaco editor and 9 project templates, auto-rigging engine, skeletal animation player, GPU particle system, post-processing pipeline (bloom, SSAO, DOF, chromatic aberration, film grain, color grading, vignette), animation timeline with keyframe easing, AI code assistant (GPT-4o), deploy to .trustgen.app, and blockchain-verified provenance. Stripe subscriptions (Free/Pro/Enterprise). 18,700 LOC, 62 files, 7 pages, 17 components, 20+ database tables, 50+ API endpoints.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://trustgen.tlid.io",
    category: "creative"
  },
  {
    id: "lume",
    name: "Lume",
    tagline: "The AI-Native Programming Language",
    description: "The first programming language where artificial intelligence is a syntax primitive — not a library import. Write 'ask', 'think', and 'generate' as keywords the same way you write 'if' or 'for'. Lume programs are alive: they monitor their own performance, heal themselves when errors occur, optimize their own bottlenecks, and evolve their behavior over time. 4-layer self-sustaining runtime (self-monitoring, self-healing, self-optimizing, self-evolving). Full toolchain: formatter, linter, REPL, watcher, source maps, IDE grammar. 219 passing tests across 6 milestones. 90% less code than Python for equivalent AI operations. 12,215 LOC, 41 files.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://lume-lang.org",
    category: "devtools"
  }
];

const categories = [
  { id: "core", name: "Core Platform", description: "The foundation of the Trust Layer ecosystem" },
  { id: "trading", name: "Trading & Crypto", description: "AI-powered trading and blockchain tools" },
  { id: "business", name: "Business Operations", description: "Enterprise workflow and staffing solutions" },
  { id: "trades", name: "Trade Services", description: "Field service platforms for contractors" },
  { id: "auto", name: "Auto & Delivery", description: "Vehicle and food service platforms" },
  { id: "health", name: "Health & Wellness", description: "Holistic wellness solutions" },
  { id: "gaming", name: "Gaming", description: "Immersive gaming experiences" },
  { id: "real-estate", name: "Real Estate", description: "Property transaction and brokerage platforms" },
  { id: "social", name: "Social & Communication", description: "Community and messaging platforms" },
  { id: "smart-home", name: "Smart Home", description: "IoT and home automation platforms" },
  { id: "sports", name: "Sports & Fitness", description: "Athletic performance and recreation platforms" },
  { id: "outdoor", name: "Outdoor & Recreation", description: "Nature, trails, and outdoor adventure platforms" },
  { id: "creative", name: "Creative Tools", description: "3D creation, media production, and AI-powered design" },
  { id: "devtools", name: "Developer Tools", description: "Programming languages, SDKs, and developer infrastructure" }
];

function AppDetailModal({ app, onClose }: { app: EcosystemApp; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" data-testid={`modal-${app.id}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <GlassCard glow className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl shadow-primary/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          data-testid="modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-video relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent z-10" />
          <img
            src={app.image}
            alt={app.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className="font-display font-bold text-2xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent" data-testid="modal-app-name">
              {app.name}
            </h2>
            <p className="text-sm text-primary/80 italic font-medium mt-1">"{app.tagline}"</p>
          </div>

          <p className="text-sm text-white/70 leading-relaxed" data-testid="modal-app-description">
            {app.description}
          </p>

          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
            data-testid="modal-visit-app"
          >
            <span>Visit {app.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </GlassCard>
    </div>
  );
}

function AppCarousel({ apps, categoryName }: { apps: EcosystemApp[], categoryName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedApp, setSelectedApp] = useState<EcosystemApp | null>(null);
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % apps.length);
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + apps.length) % apps.length);
  };

  if (apps.length === 0) return null;

  return (
    <div className="relative">
      {selectedApp && <AppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />}

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
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex-shrink-0 w-full lg:w-[calc(33.333%)] flex justify-center"
            >
            <button
              onClick={() => setSelectedApp(app)}
              className="w-[calc(100%-16px)] lg:w-[calc(100%-16px)] rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 text-left"
              data-testid={`app-card-${app.id}`}
            >
              <GlassCard variant="feature" className="relative rounded-2xl overflow-hidden shadow-2xl hover:border-primary/30 hover:shadow-primary/10 transition-all duration-500">
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
                </div>
                <div className="p-5 lg:p-5 relative">
                  <h4 className="font-display font-bold text-lg lg:text-base mb-1 group-hover:text-primary transition-colors duration-300">{app.name}</h4>
                  <p className="text-sm text-primary/80 mb-3 italic font-medium">"{app.tagline}"</p>
                  <p className="text-sm lg:text-xs text-muted-foreground line-clamp-3 lg:line-clamp-2 leading-relaxed">{app.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Tap for details</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </GlassCard>
            </button>
            </div>
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
        description="Explore the complete Trust Layer ecosystem. 27 connected applications spanning trading, business operations, trade services, gaming, education, and more. Over 1.6 million lines of code."
        keywords="Trust Layer ecosystem, blockchain apps, trading platforms, business software"
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between overflow-hidden">
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
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link 
              href="/metrics"
              className="px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs lg:text-sm font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300 whitespace-nowrap"
              data-testid="button-ecosystem-metrics"
            >
              Metrics
            </Link>
            <Link 
              href="/developers"
              className="group relative px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs lg:text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              data-testid="button-developer-tools"
            >
              <span className="relative z-10 hidden sm:inline">Developer Tools</span>
              <span className="relative z-10 sm:hidden">Dev Tools</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-semibold text-primary mb-8 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4" />
            {ecosystemApps.length} Connected Applications
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            The Trust Layer{" "}
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
        </motion.section>

        <div className="space-y-12 lg:space-y-16">
          {categories.map((category, catIndex) => {
            const categoryApps = ecosystemApps.filter(app => app.category === category.id);
            if (categoryApps.length === 0) return null;
            
            return (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: catIndex * 0.05 }}
              >
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <AppCarousel apps={categoryApps} categoryName={category.name} />
              </motion.section>
            );
          })}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-20 lg:mt-32 text-center"
        >
          <GlassCard glow className="relative rounded-3xl overflow-hidden p-10 lg:p-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Build With the Ecosystem
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                Access our developer tools, APIs, and Trust Layer widgets to build your own 
                applications within the Trust Layer ecosystem.
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
          </GlassCard>
        </motion.section>
      </main>

      <footer className="border-t border-white/5 py-10 backdrop-blur-xl bg-background/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-muted-foreground">DarkWave Studios, LLC. All ecosystem applications are connected via Trust Layer.</p>
        </div>
      </footer>
    </div>
  );
}
