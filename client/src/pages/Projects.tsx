import { Link } from "wouter";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { SignalPresaleBanner } from "@/components/SignalPresaleBanner";
import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";

import strikeAgentImg from "@/assets/ecosystem/strikeagent.png";
import pulseImg from "@/assets/ecosystem/pulse.png";
import orbitImg from "@/assets/ecosystem/orbitstaffing.png";
import orbyImg from "@/assets/ecosystem/getorby.png";
import garageBotImg from "@/assets/ecosystem/garagebot.png";
import brewBoardImg from "@/assets/ecosystem/brewandboard.png";
import lotOpsImg from "@/assets/ecosystem/lotopspro.png";
import nashPaintImg from "@/assets/ecosystem/nashpaintpros.png";
import paintProsImg from "@/assets/ecosystem/paintpros.png";
import tradeWorksImg from "@/assets/ecosystem/tradeworksai.png";
import trustLayerImg from "@/assets/ecosystem/trustlayer.jpg";
import trustShieldImg from "@/assets/ecosystem/trustshield.png";
import vedaSolusImg from "@/assets/ecosystem/vedasolus.png";
import happyEatsImg from "@/assets/ecosystem/happyeats.png";
import darkWaveImg from "@/assets/ecosystem/darkwavestudios.png";
import chroniclesImg from "@/assets/ecosystem/chronicles.jpg";
import darkwaveGamesImg from "@/assets/ecosystem/darkwave-games.png";
import darkwaveStudioImg from "@/assets/ecosystem/darkwave-studio.png";
import trustHomeImg from "@/assets/ecosystem/trusthome.png";
import trustVaultImg from "@/assets/ecosystem/trustvault.png";
import guardianScannerImg from "@/assets/ecosystem/guardian-scanner.png";
import signalChatImg from "@/assets/ecosystem/signal-chat.png";
import torqueImg from "@/assets/ecosystem/torque.png";
import trustLayerIconImg from "@/assets/ecosystem/trust-layer-icon.png";

const projects = [
  {
    id: 1,
    title: "Pulse",
    description: "AI-driven cryptocurrency trading and analytics platform. Predictive signals, quantitative analysis, StrikeAgent asset discovery, Pulse AI agent with 54 personas, portfolio tracking, and social trading with leaderboards.",
    tech: ["AI/ML", "Crypto", "Analytics", "Trading"],
    image: pulseImg,
    gradient: "from-purple-500/20 to-indigo-600/20",
    url: "https://darkwavepulse.com",
    category: "FinTech"
  },
  {
    id: 2,
    title: "StrikeAgent",
    description: "Autonomous AI-powered token discovery and trading system. 24/7 multi-chain scanning across 23+ blockchains, honeypot detection, safety scoring, smart auto-trade with configurable risk management and limit orders.",
    tech: ["AI Trading", "Multi-Chain", "Safety Engine", "Automation"],
    image: strikeAgentImg,
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://strikeagent.io",
    category: "FinTech"
  },
  {
    id: 3,
    title: "ORBIT Staffing OS",
    description: "Automated white-label staffing platform with worker onboarding, GPS-verified time tracking, payroll processing for W-2 and 1099 workers, automated invoicing, compliance engine, and franchise-ready multi-tenant architecture.",
    tech: ["HR Tech", "Payroll", "Compliance", "White-Label"],
    image: orbitImg,
    gradient: "from-emerald-500/20 to-teal-600/20",
    url: "https://orbitstaffing.io",
    category: "HR/Staffing"
  },
  {
    id: 4,
    title: "Orby Commander",
    description: "Venue operations command center for stadiums and arenas. Emergency response dashboard, delivery lifecycle tracking, 3-phase inventory counting, alcohol compliance monitoring, GPS-guided navigation, and 12+ specialized role dashboards.",
    tech: ["Operations", "GPS", "Compliance", "Real-time"],
    image: orbyImg,
    gradient: "from-orange-500/20 to-red-600/20",
    url: "https://getorby.io",
    category: "Operations"
  },
  {
    id: 5,
    title: "GarageBot",
    description: "AI-powered parts aggregator unifying inventory from 93+ retailers across 20 categories. Buddy AI assistant with symptom diagnosis engine, DIY repair guides, VIN decoding, fleet management, peer-to-peer parts marketplace, 54 affiliate partnerships, and Google AdSense monetization. 111,000+ lines, 436+ endpoints, 134 tables.",
    tech: ["Automotive", "AI Assistant", "Aggregation", "Blockchain"],
    image: garageBotImg,
    gradient: "from-slate-500/20 to-gray-600/20",
    url: "https://garagebot.io",
    category: "Automotive"
  },
  {
    id: 23,
    title: "TORQUE",
    description: "Shop Management OS — standalone PWA within GarageBot. 5-step onboarding wizard with Solana blockchain verification, 11 dashboard tabs (work orders, appointments, customers, inventory, invoices, team, reports, integrations), 15 business tool integrations, ORBIT payroll sync, and Partner API with key/secret auth. 5,475 lines across 10 files.",
    tech: ["Shop Management", "PWA", "Blockchain", "Integrations"],
    image: torqueImg,
    gradient: "from-zinc-500/20 to-slate-600/20",
    url: "https://torque.tlid.io",
    category: "Automotive"
  },
  {
    id: 6,
    title: "Lot Ops Pro",
    description: "Mobile-first driver performance and workflow management for auto auctions and dealerships. Real-time GPS routing, moves-per-hour tracking, OCR camera scanning, AI assistant, shift management, and blockchain-verified performance records.",
    tech: ["GPS", "OCR", "AI", "Mobile PWA"],
    image: lotOpsImg,
    gradient: "from-blue-500/20 to-sky-600/20",
    url: "https://lotopspro.io",
    category: "Logistics"
  },
  {
    id: 7,
    title: "Brew & Board Coffee",
    description: "B2B corporate coffee concierge platform. Calendar-based ordering, vendor discovery, real-time delivery tracking with driver GPS, virtual host for meetings, team management, and loyalty rewards. White label franchising available — Brew & Board Atlanta, etc., or license purchase for full self-branding. This is the working demo.",
    tech: ["B2B", "Delivery", "Ordering", "Loyalty"],
    image: brewBoardImg,
    gradient: "from-amber-600/20 to-orange-600/20",
    url: "https://brewandboard.coffee",
    category: "Hospitality"
  },
  {
    id: 8,
    title: "TradeWorks AI",
    description: "Mobile field tools with 85+ professional calculators, voice-to-estimate, and weather radar. 7 pages with dedicated PWA manifest. 11,231 lines of production code powered by PaintPros shared backend.",
    tech: ["AI Estimation", "Calculators", "Voice", "PWA"],
    image: tradeWorksImg,
    gradient: "from-green-500/20 to-emerald-600/20",
    url: "https://tradeworksai.io",
    category: "SaaS"
  },
  {
    id: 9,
    title: "Nashville Painting Professionals",
    description: "Ecosystem hub connecting 20+ platforms with affiliate tracking and lead generation. 4 pages with dedicated PWA manifest. 3,950 lines of production code powered by PaintPros shared backend.",
    tech: ["Estimation", "Room Visualizer", "Booking", "SEO"],
    image: nashPaintImg,
    gradient: "from-yellow-500/20 to-orange-600/20",
    url: "https://nashpaintpros.io",
    category: "Local Business"
  },
  {
    id: 11,
    title: "PaintPros",
    description: "Flagship trade services platform with estimating, CRM, crew management, marketing automation, payments, AI tools, customer portals, and weather system. 74 pages with shared backend powering 4 interconnected platforms. 129,835 lines of production code across 96 combined pages.",
    tech: ["CRM", "Estimating", "AI Tools", "Payments"],
    image: paintProsImg,
    gradient: "from-red-500/20 to-rose-600/20",
    url: "https://paintpros.io",
    category: "Marketing"
  },
  {
    id: 12,
    title: "Trust Layer",
    description: "Full Layer 1 Proof-of-Authority blockchain ecosystem. Native Signal (SIG) token, wallet, DEX/swap, cross-chain bridge, staking, NFT marketplace, presale, blockchain explorer, DAO governance, and business tenant portals. 672,085 lines across 5 PWAs, 743 endpoints, 289 tables.",
    tech: ["Blockchain", "DeFi", "5 PWAs", "289 Tables"],
    image: trustLayerIconImg,
    gradient: "from-indigo-500/20 to-purple-600/20",
    url: "https://dwtl.io",
    category: "Blockchain"
  },
  {
    id: 13,
    title: "Guardian Shield / TrustShield",
    description: "The world's first AI agent certification system. Verify, certify, and protect autonomous AI agents across Security, Transparency, Reliability, and Compliance domains. Guardian Certification Program, continuous enterprise monitoring, and public certification registry.",
    tech: ["AI Certification", "Security", "Compliance", "Registry"],
    image: trustShieldImg,
    gradient: "from-teal-500/20 to-cyan-600/20",
    url: "https://trustshield.tech",
    category: "Security"
  },
  {
    id: 14,
    title: "VedaSolus",
    description: "Holistic health platform bridging Ayurveda and Traditional Chinese Medicine with Western science. Dosha analysis, AI wellness coach, health tracking, practitioner hub, daily rituals, and community tribes.",
    tech: ["Health", "AI Coach", "Ayurveda", "Analytics"],
    image: vedaSolusImg,
    gradient: "from-emerald-500/20 to-green-600/20",
    url: "https://vedasolus.io",
    category: "Health"
  },
  {
    id: 15,
    title: "TL Driver Connect",
    description: "All-in-one driver services platform with GPS mileage tracking, expense management with receipt OCR, fuel finder (diesel/gas/EV), CDL program directory, driver concierge, weather dashboard, and office business suite. Delivery network integration with Happy Eats. Trucker Talk + Signal Chat community. Shared codebase with Happy Eats: 110,745 LOC, 611 files, 63 pages, 212 API endpoints, 48 tables.",
    tech: ["React 19", "Stripe Live", "GPS", "WebSocket"],
    image: happyEatsImg,
    gradient: "from-cyan-500/20 to-blue-500/20",
    url: "https://tldriverconnect.com",
    category: "Delivery"
  },
  {
    id: 16,
    title: "TLID.io",
    description: "Self-service automated advertising for any business type. 5-step onboarding, organic posting, and ad campaigns. 11 pages with dedicated PWA manifest. 7,133 lines of production code powered by PaintPros shared backend.",
    tech: ["Marketing", "Advertising", "Automation", "PWA"],
    image: trustLayerIconImg,
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://tlid.io",
    category: "Marketing"
  },
  {
    id: 17,
    title: "Chronicles",
    description: "A parallel life simulation with procedural ambient audio engine (21 soundscapes), daily life system (30+ careers, 4 shifts, 5 ranks), faith & spiritual life, geographic travel across 3 eras (Modern, Medieval, Wild West), estate customization, NPC AI chat, marketplace economy, and voice system. 36,947 lines across 27 pages and 9 server services.",
    tech: ["Life Sim", "Audio Engine", "AI NPCs", "30+ Careers"],
    image: chroniclesImg,
    gradient: "from-amber-500/20 to-red-600/20",
    url: "https://yourlegacy.io",
    category: "Gaming"
  },
  {
    id: 22,
    title: "The Arcade",
    description: "Premium arcade games, provably fair sweepstakes, and classic card games. Orbit Crash multiplier game, Dragon's Fortune Slots, full arcade collection with Gold Coins & Sweeps Coins via Stripe. Provably fair system and sweepstakes compliance. 5,276 lines of production code.",
    tech: ["Arcade", "Sweepstakes", "Stripe", "Canvas"],
    image: darkwaveGamesImg,
    gradient: "from-pink-500/20 to-rose-600/20",
    url: "https://darkwavegames.io",
    category: "Gaming"
  },
  {
    id: 24,
    title: "DarkWave Studio",
    description: "Browser-based IDE for building on DWSC. Monaco-powered code editor, smart contract development, Docker sandboxed execution, JWT-authenticated sessions, project management, and developer portal. 7,006 lines of production code.",
    tech: ["IDE", "Smart Contracts", "Docker", "DevTools"],
    image: darkwaveStudioImg,
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://studio.tlid.io",
    category: "DevTools"
  },
  {
    id: 18,
    title: "TrustHome",
    description: "White-label real estate platform built with Expo React Native for iOS, Android, and Web. 20 app screens and 21 reusable components. Voice AI assistant (GPT-5.2 + ElevenLabs), blockchain document vault, CRM with AI lead scoring, marketing hub, business suite with OCR expense tracking, MLS integration (10+ providers), and Signal Chat. 26,653 lines of code across 109 files with 103 API endpoints and 6 database tables. Woman-owned (WOSB eligible).",
    tech: ["Real Estate", "Voice AI", "Expo", "Blockchain"],
    image: trustHomeImg,
    gradient: "from-sky-500/20 to-indigo-600/20",
    url: "https://trusthome.tlid.io",
    category: "Real Estate"
  },
  {
    id: 19,
    title: "TrustVault",
    description: "Professional-grade multi-tenant digital media vault and creative suite with full image/audio/video/merge editors (17 transition effects), 14 AI-powered creative tools (Smart Search, Auto-Tag, Style DNA, Beat-Sync Video Maker, Portfolio Generator, Spinny AI agent with GPT-5.1 + ElevenLabs TTS), layer panel, watermark tool, eyedropper, voice-commanded editing, 4-tier Stripe subscriptions, Signal Chat, AI Blog, and TrustLayer SSO. 46,697 lines of code, 172 files, 156 API endpoints, 12 database tables.",
    tech: ["14 AI Tools", "Media Editors", "Stripe", "PWA"],
    image: trustVaultImg,
    gradient: "from-emerald-500/20 to-cyan-600/20",
    url: "https://trustvault.tlid.io",
    category: "Media"
  },
  {
    id: 20,
    title: "Guardian Scanner",
    description: "AI-powered security verification platform that scans and certifies autonomous AI agents and websites/URLs across the crypto ecosystem. Verifies agents across Security, Transparency, Reliability, and Compliance with Guardian trust scores and certification tiers (Assurance Lite and Guardian Premier). URL scanning detects phishing, malicious redirects, impersonation, and scam domains. Public registry of certified agents. Guardian Shield continuous monitoring with real-time alerts. Mobile-first PWA.",
    tech: ["AI Certification", "URL Scanner", "Registry", "PWA"],
    image: guardianScannerImg,
    gradient: "from-green-500/20 to-emerald-600/20",
    url: "https://guardianscanner.tlid.io",
    category: "FinTech"
  },
  {
    id: 21,
    title: "Signal Chat",
    description: "Cross-app community messaging platform for the Trust Layer ecosystem. Real-time WebSocket chat, JWT SSO authentication, channel-based conversations, invite system, and user presence. The social backbone connecting all 35 ecosystem apps.",
    tech: ["WebSocket", "JWT SSO", "Real-time", "Community"],
    image: signalChatImg,
    gradient: "from-purple-500/20 to-pink-600/20",
    url: "https://signalchat.tlid.io",
    category: "Social"
  },
  {
    id: 25,
    title: "THE VOID",
    description: "The world's first voice-first venting app with 5 AI personalities (GPT-5.2), Emotional Voice Fingerprint analysis, Living Mood Portrait (generative AI art), Void Echo time capsules, 20+ wellness tools including Zen Zone, Sleep Sounds, Virtual Rage Room, and crisis toolkit. Stripe subscriptions, blockchain Void IDs, Signal Chat, and Capacitor-ready for native iOS/Android. 23,532 lines of code, 27 pages, 72 API endpoints, 20+ database tables.",
    tech: ["GPT-5.2", "Voice AI", "Stripe", "PWA"],
    image: "/projects/the-void.png",
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://intothevoid.app",
    category: "Wellness"
  },
  {
    id: 26,
    title: "Guardian Screener",
    description: "AI-powered DEX screener built for traders who refuse to fly blind. Real-time monitoring across all major decentralized exchanges with smart pattern detection, predictive analytics, rug pull and honeypot risk detection, whale concentration tracking, liquidity lock verification, and 24/7 security alerts. Multi-chain coverage across Solana, Ethereum, Base, BSC, Arbitrum, Polygon, and DWSC. Part of the dwsc.io codebase.",
    tech: ["AI Analytics", "Multi-Chain", "Real-time", "PWA"],
    image: "/projects/guardian-screener.png",
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://guardianscreener.tlid.io",
    category: "Trading"
  },
  {
    id: 30,
    title: "Happy Eats",
    description: "Zone-based food delivery platform for food truck vendors and mobile commissaries across Middle Tennessee. Multi-truck cart ordering, 11 delivery zones (I-24/I-840 corridor), vendor self-service portal, AI marketing toolkit with flyer creator and TLI d.io social posting, customer rewards program, receipt scanning OCR, Stripe live checkout, and franchise model. Shared codebase with TL Driver Connect: 110,745 LOC, 611 files, 63 pages, 212 API endpoints, 48 tables.",
    tech: ["React 19", "Stripe Live", "AI", "Franchise"],
    image: "/emblems/happy-eats.png",
    gradient: "from-orange-500/20 to-red-500/20",
    url: "https://happyeats.app",
    category: "Food"
  },
  {
    id: 31,
    title: "Trust Book",
    description: "Censorship-free ebook publishing and reading platform with AI narration via OpenAI Nova HD, multi-format downloads (PDF/EPUB), and blockchain-verified provenance. Features immersive full-screen e-reader with chapter/volume navigation, progress tracking, and the flagship title 'Through The Veil' — 110,000 words, 54+ chapters, 15 volumes. Premium glassmorphism UI. 9,861 lines of code, 4 files, 5 API endpoints.",
    tech: ["OpenAI TTS", "E-Reader", "PWA", "Blockchain"],
    image: "/emblems/trust-book.png",
    gradient: "from-cyan-500/20 to-purple-500/20",
    url: "https://trustbook.tlid.io",
    category: "Publishing"
  },
  {
    id: 32,
    title: "Trust Golf",
    description: "Premium mobile-first golf companion with 45 courses, AI swing analysis (GPT-4o vision + video playback), USGA handicap system, GPS distance finder with satellite maps, hole-by-hole scorecards, exclusive deals, AI SEO blog, vendor portal, and self-hosted analytics. Cinematic explorer with 3 cycling AI videos, glass-morphism UI, React Native + Expo SDK 54, PWA + iOS/Android ready. 17 features, 14,576 LOC, 61 files, 53+ API endpoints.",
    tech: ["React Native", "Expo SDK 54", "GPT-4o", "GPS"],
    image: "/emblems/trust-golf.png",
    gradient: "from-emerald-600/20 to-green-500/20",
    url: "https://trustgolf.app",
    category: "Sports"
  },
  {
    id: 34,
    title: "TrustGen",
    description: "Premium browser-based 3D creation and code studio. Full 3D editor with OrbitControls, scene hierarchy, PBR material editor, transform gizmos, and 5 light types with shadow mapping. AI model generation via Meshy.ai (800 char prompts). Studio IDE with Monaco editor, 9 project templates, AI code assistant (GPT-4o), command palette, file tree, multi-tab editing, hot apply to viewport, and deploy to .trustgen.app. Auto-rigging engine with skeleton generation, skeletal animation player, GPU particle system, post-processing pipeline (7 FX), and keyframe animation timeline with easing curves. Blockchain hallmarks, Stripe subscriptions, Signal Chat, Twilio SMS. 18,700 LOC, 62 files, 7 pages, 17 components, 20+ database tables, 50+ API endpoints.",
    tech: ["Three.js", "Meshy.ai", "Monaco Editor", "React 18", "Stripe"],
    image: "/ecosystem/trust-layer-icon.png",
    gradient: "from-purple-500/20 to-cyan-600/20",
    url: "https://trustgen.tlid.io",
    category: "Creative Tools"
  },
  {
    id: 35,
    title: "Lume",
    description: "The first AI-native programming language where artificial intelligence is a syntax primitive. 'ask', 'think', and 'generate' are keywords — not library calls. 4-layer self-sustaining runtime: self-monitoring (function metrics, AI call stats, memory dashboards), self-healing (retry, circuit breakers, model fallback chains), self-optimizing (bottleneck detection, mutation log, rollback), self-evolving (pattern learning, cost analysis, evolution decisions). Full toolchain: lume run, build, test, fmt, lint, repl, watch, ast, tokens. 15 lint rules with suggested fixes. Interactive REPL with multi-line support. Custom VS Code grammar. 219 passing tests across 6 milestones, 100% pass rate. 90% less code than Python for equivalent AI operations. 12,215 LOC, 41 files, MIT license.",
    tech: ["Node.js", "AI Syntax", "Self-Sustaining Runtime", "Vite + React 19"],
    image: "/ecosystem/trust-layer-icon.png",
    gradient: "from-cyan-500/20 to-teal-600/20",
    url: "https://lume-lang.org",
    category: "Developer Tools"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Portfolio - 35 Web Applications & Ecosystem"
        description="Explore 35 web applications built by DarkWave Studios. From AI trading platforms to staffing systems, venue operations to blockchain infrastructure - see our work in action."
        keywords="web development portfolio, live web apps, case studies, AI applications, e-commerce development, SaaS examples, blockchain apps"
        type="website"
        url="https://darkwavestudios.com/projects"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Portfolio", url: "https://darkwavestudios.com/projects" }
        ]}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text" data-testid="link-home">
            DarkWave Studios
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="link-services">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-primary" data-testid="link-projects">Projects</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="link-about">About</Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="link-compare">Compare</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold" data-testid="link-get-quote">
              Get Quote
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary" data-testid="link-back" aria-label="Back to home">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4" data-testid="text-projects-heading">
            Our <span className="gradient-text">Ecosystem</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-projects-subtitle">
            35 live applications powering real businesses. From AI trading platforms to staffing systems, venue operations to blockchain infrastructure.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {projects.map((project) => (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              data-testid={`project-card-${project.id}`}
              aria-label={`${project.title} - ${project.category}`}
            >
              <GlassCard variant="feature" className="rounded-xl md:rounded-2xl p-3 md:p-6 hover-lift group cursor-pointer h-full">
              <div className={`w-full h-24 md:h-36 rounded-lg md:rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-2 md:mb-4 relative overflow-hidden`}>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" data-testid={`img-project-${project.id}`} />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ExternalLink className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" aria-hidden="true" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-primary font-semibold" data-testid={`text-project-category-${project.id}`}>{project.category}</span>
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </div>
              
              <h3 className="text-sm md:text-xl font-bold font-display mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-project-title-${project.id}`}>{project.title}</h3>
              <p className="text-muted-foreground text-[10px] md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-3" data-testid={`text-project-desc-${project.id}`}>{project.description}</p>
              
              <div className="flex flex-wrap gap-1 md:gap-2">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span key={i} className="px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] rounded-full bg-primary/10 text-primary" data-testid={`text-project-tech-${project.id}-${i}`}>
                    {tech}
                  </span>
                ))}
              </div>
              </GlassCard>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <GlassCard glow className="rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4" data-testid="text-cta-heading">
              Want Something <span className="gradient-text">Like This?</span>
            </h2>
            <p className="text-muted-foreground mb-6" data-testid="text-cta-description">
              Every project is custom-built from scratch. Tell us about your vision and we'll bring it to life.
            </p>
            <Link 
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold"
              data-testid="button-start-project"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </GlassCard>
        </motion.div>
      </main>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-8">
        <SignalPresaleBanner variant="compact" />
      </div>

      <Footer />
    </div>
  );
}
