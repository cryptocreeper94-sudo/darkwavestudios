import { Link } from "wouter";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { SignalPresaleBanner } from "@/components/SignalPresaleBanner";

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

const projects = [
  {
    id: 1,
    title: "Pulse",
    description: "AI-driven cryptocurrency trading and analytics platform. Predictive signals, quantitative analysis, StrikeAgent asset discovery, DarkWave-V2 AI agent with 54 personas, portfolio tracking, and social trading with leaderboards.",
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
    url: "https://orbycommander.com",
    category: "Operations"
  },
  {
    id: 5,
    title: "GarageBot",
    description: "Auto parts aggregator unifying inventory from 68+ retailers across 16 categories. Buddy AI assistant, DIY repair guides, parts marketplace, CDL directory, insurance comparison, and blockchain-verified vehicle passport. 86,000+ lines, 422 endpoints, 120+ tables.",
    tech: ["Automotive", "AI Assistant", "Aggregation", "Blockchain"],
    image: garageBotImg,
    gradient: "from-slate-500/20 to-gray-600/20",
    url: "https://garagebot.io",
    category: "Automotive"
  },
  {
    id: 6,
    title: "Lot Ops Pro",
    description: "Mobile-first driver performance and workflow management for auto auctions and dealerships. Real-time GPS routing, moves-per-hour tracking, OCR camera scanning, AI assistant, shift management, and blockchain-verified performance records.",
    tech: ["GPS", "OCR", "AI", "Mobile PWA"],
    image: lotOpsImg,
    gradient: "from-blue-500/20 to-sky-600/20",
    url: "https://lotopspro.com",
    category: "Logistics"
  },
  {
    id: 7,
    title: "Brew & Board Coffee",
    description: "B2B corporate coffee concierge platform for Nashville. Calendar-based ordering, vendor discovery, real-time delivery tracking with driver GPS, virtual host for meetings, team management, and loyalty rewards program.",
    tech: ["B2B", "Delivery", "Ordering", "Loyalty"],
    image: brewBoardImg,
    gradient: "from-amber-600/20 to-orange-600/20",
    url: "https://brewandboardcoffee.replit.app",
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
    title: "NashPaintPros.io",
    description: "Ecosystem hub connecting 20+ platforms with affiliate tracking and lead generation. 4 pages with dedicated PWA manifest. 3,950 lines of production code powered by PaintPros shared backend.",
    tech: ["Estimation", "Room Visualizer", "Booking", "SEO"],
    image: nashPaintImg,
    gradient: "from-yellow-500/20 to-orange-600/20",
    url: "https://nashpaintpros.io",
    category: "Local Business"
  },
  {
    id: 11,
    title: "PaintPros.io",
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
    image: trustLayerImg,
    gradient: "from-indigo-500/20 to-purple-600/20",
    url: "https://dwsc.io",
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
    description: "Nationwide delivery, driver management, and food truck ordering platform. 50 pages, 71 UI components, 147 API endpoints, 2 WebSocket servers, 41 database tables, and 55+ client routes. Multi-tenant franchise model with bilingual support. 22,900 lines of production TypeScript across 171 files.",
    tech: ["Delivery", "PWA", "WebSocket", "AI"],
    image: happyEatsImg,
    gradient: "from-yellow-500/20 to-amber-600/20",
    url: "https://happyeats.app",
    category: "Delivery"
  },
  {
    id: 16,
    title: "TLID.io",
    description: "Self-service automated advertising for any business type. 5-step onboarding, organic posting, and ad campaigns. 11 pages with dedicated PWA manifest. 7,133 lines of production code powered by PaintPros shared backend.",
    tech: ["Marketing", "Advertising", "Automation", "PWA"],
    image: darkWaveImg,
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://tlid.io",
    category: "Marketing"
  },
  {
    id: 17,
    title: "DarkWave Chronicles",
    description: "A parallel life simulation where you are YOU living across historical eras. 1 hour = 1 real hour, timezone-synced. 3 playable eras (Modern, Medieval, Wild West), 15 factions, 75 situations, 9 NPCs with persistent relationship scores, AI-generated infinite daily situations, voice interaction, and estate building.",
    tech: ["Life Sim", "AI NPCs", "Voice", "Real-time"],
    image: trustLayerImg,
    gradient: "from-amber-500/20 to-red-600/20",
    url: "https://yourlegacy.io",
    category: "Gaming"
  },
  {
    id: 22,
    title: "The Arcade",
    description: "Premium arcade games, provably fair sweepstakes, and classic card games. Orbit Crash multiplier game, Dragon's Fortune Slots, full arcade collection with Gold Coins & Sweeps Coins via Stripe. Provably fair system and sweepstakes compliance. 5,276 lines of production code.",
    tech: ["Arcade", "Sweepstakes", "Stripe", "Canvas"],
    image: trustLayerImg,
    gradient: "from-pink-500/20 to-rose-600/20",
    url: "https://darkwavegames.io",
    category: "Gaming"
  },
  {
    id: 24,
    title: "DarkWave Studio",
    description: "Browser-based IDE for building on the DarkWave Smart Chain. Monaco-powered code editor, smart contract development, Docker sandboxed execution, JWT-authenticated sessions, project management, and developer portal. 7,006 lines of production code.",
    tech: ["IDE", "Smart Contracts", "Docker", "DevTools"],
    image: trustLayerImg,
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://dwsc.io/studio",
    category: "DevTools"
  },
  {
    id: 18,
    title: "TrustHome",
    description: "White-label real estate platform built with Expo React Native for iOS, Android, and Web. 20 app screens and 21 reusable components. Voice AI assistant (GPT-5.2 + ElevenLabs), blockchain document vault, CRM with AI lead scoring, marketing hub, business suite with OCR expense tracking, MLS integration (10+ providers), and Signal Chat. 26,653 lines of code across 109 files with 103 API endpoints and 6 database tables. Woman-owned (WOSB eligible).",
    tech: ["Real Estate", "Voice AI", "Expo", "Blockchain"],
    image: trustLayerImg,
    gradient: "from-sky-500/20 to-indigo-600/20",
    url: "https://trusthome.replit.app",
    category: "Real Estate"
  },
  {
    id: 19,
    title: "TrustVault",
    description: "Universal IP storage and media management platform. Image/audio/video/merge editors, Spinny AI agent (GPT-5.1 + ElevenLabs TTS), 4 AI media tools, collections system, Signal Chat, 4-tier Stripe subscriptions, multi-tenant family vault, and PWA. 105,983 lines of code across 187 files with 132 API endpoints and 26 database tables.",
    tech: ["Media Vault", "AI Agent", "Editors", "PWA"],
    image: trustLayerImg,
    gradient: "from-emerald-500/20 to-cyan-600/20",
    url: "https://trustvault.replit.app",
    category: "Media"
  },
  {
    id: 20,
    title: "Guardian Scanner",
    description: "AI-powered cryptocurrency token analysis scanner with Pulse predictive scoring. Real-time multi-chain safety checks, honeypot detection, whale analysis, ML price predictions, and Strike Agent buy/watch/avoid recommendations. Covers 12 chains including Solana, Ethereum, BSC, Base, Arbitrum, and Polygon.",
    tech: ["AI Analysis", "Multi-Chain", "ML Predictions", "Safety"],
    image: trustLayerImg,
    gradient: "from-green-500/20 to-emerald-600/20",
    url: "https://dwsc.io/guardian-scanner",
    category: "FinTech"
  },
  {
    id: 21,
    title: "Signal Chat",
    description: "Cross-app community messaging platform for the Trust Layer ecosystem. Real-time WebSocket chat, JWT SSO authentication, channel-based conversations, invite system, and user presence. The social backbone connecting all 22 ecosystem apps.",
    tech: ["WebSocket", "JWT SSO", "Real-time", "Community"],
    image: trustLayerImg,
    gradient: "from-purple-500/20 to-pink-600/20",
    url: "https://dwsc.io",
    category: "Social"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Portfolio - 22 Web Applications & Ecosystem"
        description="Explore 22 web applications built by DarkWave Studios. From AI trading platforms to staffing systems, venue operations to blockchain infrastructure - see our work in action."
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

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4" data-testid="text-projects-heading">
            Our <span className="gradient-text">Ecosystem</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-projects-subtitle">
            20 live applications powering real businesses. From AI trading platforms to staffing systems, venue operations to blockchain infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 gradient-border hover-lift group cursor-pointer"
              data-testid={`project-card-${project.id}`}
              aria-label={`${project.title} - ${project.category}`}
            >
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
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border max-w-3xl mx-auto">
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
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-8">
        <SignalPresaleBanner variant="compact" />
      </div>

      <Footer />
    </div>
  );
}
