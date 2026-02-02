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
  }
];

const categories = [
  { id: "core", name: "Core Platform", description: "The foundation of the DarkWave ecosystem" },
  { id: "trading", name: "Trading & Crypto", description: "AI-powered trading and blockchain tools" },
  { id: "business", name: "Business Operations", description: "Enterprise workflow and staffing solutions" },
  { id: "trades", name: "Trade Services", description: "Field service platforms for contractors" },
  { id: "auto", name: "Auto & Delivery", description: "Vehicle and food service platforms" },
  { id: "health", name: "Health & Wellness", description: "Holistic wellness solutions" }
];

function AppCarousel({ apps, categoryName }: { apps: EcosystemApp[], categoryName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, apps.length - visibleCount + 1));
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, apps.length - visibleCount + 1)) % Math.max(1, apps.length - visibleCount + 1));
  };

  if (apps.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-display font-bold">{categoryName}</h3>
        {apps.length > visibleCount && (
          <div className="flex gap-2">
            <button 
              onClick={prev}
              className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              data-testid={`carousel-prev-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={next}
              className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              data-testid={`carousel-next-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount + 1.5)}%)` }}
        >
          {apps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[calc(33.333%-1rem)] min-w-[280px] glass rounded-xl overflow-hidden group hover:bg-white/10 transition-all duration-300"
              data-testid={`app-card-${app.id}`}
            >
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={app.image} 
                  alt={app.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-display font-bold text-sm lg:text-base">{app.name}</h4>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-xs text-primary mb-2 italic">"{app.tagline}"</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{app.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Ecosystem() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Ecosystem - DarkWave Studios"
        description="Explore the complete DarkWave ecosystem. 16+ connected applications spanning trading, business operations, trade services, and more."
        keywords="DarkWave ecosystem, trust layer, blockchain apps, trading platforms, business software"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Ecosystem", url: "https://darkwavestudios.io/ecosystem" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-display text-lg lg:text-xl font-bold">Ecosystem</span>
            </div>
          </div>
          <Link 
            href="/developers"
            className="btn-glow bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            data-testid="button-developer-tools"
          >
            Developer Tools
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <section className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            16+ Connected Applications
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            The DarkWave <span className="gradient-text">Ecosystem</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base">
            A complete suite of interconnected applications spanning trading, business operations, 
            trade services, and enterprise solutions. All powered by Trust Layer blockchain verification.
          </p>
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

        <section className="mt-16 lg:mt-24 text-center">
          <div className="glass rounded-2xl p-8 lg:p-12">
            <h2 className="text-xl lg:text-2xl font-display font-bold mb-4">
              Build With the Ecosystem
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm">
              Access our developer tools, APIs, and Trust Layer widgets to build your own 
              applications within the DarkWave ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/developers"
                className="btn-glow bg-primary text-white px-6 py-3 rounded-lg font-semibold"
                data-testid="button-explore-dev-tools"
              >
                Explore Developer Tools
              </Link>
              <a 
                href="https://dwsc.io/guardian-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                data-testid="button-certify-agent"
              >
                Certify Your AI Agent
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center text-xs text-muted-foreground">
          <p>DarkWave Studios, LLC. All ecosystem applications are connected via Trust Layer.</p>
        </div>
      </footer>
    </div>
  );
}
