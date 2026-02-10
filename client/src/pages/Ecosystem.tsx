import { useState } from "react";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Sparkles
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
    id: "darkwave-studios",
    name: "DarkWave Studios",
    tagline: "Build Bold. Scale Fast. Trust Everything.",
    description: "Full-service web development agency and blockchain-verified development ecosystem. Custom web apps, AI integration, and enterprise solutions.",
    image: "/ecosystem/darkwave-studios.png",
    url: "https://darkwavestudios.io",
    category: "core"
  },
  {
    id: "trust-layer",
    name: "DarkWave Trust Layer",
    tagline: "The Trust Infrastructure for the AI Economy",
    description: "High-performance Layer 1 Proof-of-Authority blockchain providing verified identity, AI agent certification, and transparent audit trails.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://dwsc.io",
    category: "core"
  },
  {
    id: "trust-shield",
    name: "TrustShield",
    tagline: "Guardian Shield Security",
    description: "24/7 continuous security monitoring for enterprise blockchain operations. Real-time threat detection and response.",
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
    url: "https://dwsc.io/pulse",
    category: "trading"
  },
  {
    id: "strikeagent",
    name: "StrikeAgent",
    tagline: "Strike First. Strike Smart.",
    description: "Autonomous AI-powered token discovery and trading system. Multi-chain scanning, safety scoring, and smart auto-trade capabilities.",
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
    description: "Comprehensive field toolkit for 8 trade industries. AI-powered estimation, GPS crew tracking, and automated scheduling.",
    image: "/ecosystem/tradeworks-ai.png",
    url: "https://tradeworksai.io",
    category: "trades"
  },
  {
    id: "paint-pros",
    name: "PaintPros.io",
    tagline: "Your Gateway to the Complete Trade Business System",
    description: "Lead generation and marketing hub for TradeWorks AI. Connects contractors to the 8-trade field toolkit and Trust Layer ecosystem.",
    image: "/ecosystem/paint-pros.png",
    url: "https://paintpros.io",
    category: "trades"
  },
  {
    id: "nash-paint-pros",
    name: "Nashville Painting Professionals",
    tagline: "Nashville's Trusted Painting Professionals",
    description: "Live demo for TradeWorks AI painting vertical. Fully functional business site with instant estimates and booking wizard.",
    image: "/ecosystem/nash-paint-pros.png",
    url: "https://nashpaintpros.io",
    category: "trades"
  },
  {
    id: "lume-paint",
    name: "Lume Paint Co",
    tagline: "Illuminate Your Space with Luxury",
    description: "Premium tier live demo for TradeWorks AI painting vertical. Luxury interior painting with elevated design aesthetic.",
    image: "/ecosystem/lume-paint.png",
    url: "https://lumepaint.co",
    category: "trades"
  },
  {
    id: "garagebot",
    name: "GarageBot",
    tagline: "Right Part. First Time. Every Engine.",
    description: "Auto parts aggregator unifying inventory from 40+ retailers. VIN decoding, AI assistant, and blockchain-verified vehicle passports.",
    image: "/ecosystem/garagebot.png",
    url: "https://garagebot.io",
    category: "auto"
  },
  {
    id: "happy-eats",
    name: "Happy Eats",
    tagline: "Food Truck Delivery Platform",
    description: "White-label food truck and delivery platform. Vendor portal, order management, and franchise system with multi-tenant support.",
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
    name: "TLId.io",
    tagline: "Automated Marketing That Works While You Work",
    description: "TrustLayer Marketing automation platform with Meta Business Suite integration. 17 daily organic posts, smart ad boosting, multi-tenant support.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "/marketing",
    category: "business"
  },
  {
    id: "chronicles",
    name: "Chronicles",
    tagline: "You Are the Character. History Is the World.",
    description: "Historically-grounded AI life simulation spanning 7 epochs from the Stone Age to the 20th century. GPT-4o NPCs with 5-axis emotion, Choice Echoes narrative system, faction politics, the 7 Sigils, estate building, voice cloning, and blockchain Chronicle Proofs. No moral judgment, no end state — persistent world where every choice echoes forward.",
    image: "/ecosystem/chronicles.jpg",
    url: "https://yourlegacy.io",
    category: "gaming"
  },
  {
    id: "trusthome",
    name: "TrustHome",
    tagline: "Every Transaction. Verified. Transparent. Trusted.",
    description: "White-label real estate platform and central hub for agents, buyers, sellers, inspectors, and mortgage brokers. Unified transaction timelines, blockchain-verified document vault, AI voice assistant, CRM, and marketing suite. Woman-owned (WOSB eligible).",
    image: "/ecosystem/trusthome.png",
    url: "https://trusthome.replit.app",
    category: "real-estate"
  },
  {
    id: "trustvault",
    name: "Trust Vault",
    tagline: "Your Media. Secured. Organized. Yours.",
    description: "Universal IP storage and media management platform. Multi-tenant media vault with video/audio/image/document upload, editing suite, collections, Spinny AI agent, Signal Chat, Stripe subscriptions, and TrustLayer SSO. Central content vault for the DarkWave ecosystem.",
    image: "/ecosystem/trust-layer-icon.png",
    url: "https://trustvault.replit.app",
    category: "security"
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
        description="Explore the complete DarkWave ecosystem. 20 connected applications across 12 production builds spanning trading, business operations, trade services, gaming, and more. Over 2.08 million lines of code."
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
            18 Connected Applications
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            The DarkWave{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Ecosystem</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            A complete suite of interconnected applications spanning trading, business operations, 
            trade services, and enterprise solutions. All powered by Trust Layer blockchain verification.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["/ecosystem/pulse.png", "/ecosystem/orbit-staffing.png", "/ecosystem/strikeagent.png", "/ecosystem/trust-layer-icon.png"].map((img, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-white/10">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground self-center">+14 more apps</span>
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
                  href="https://dwsc.io/guardian-ai"
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
