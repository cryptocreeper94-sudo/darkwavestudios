import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { AdUnit, AdFreeBanner } from "@/components/AdUnit";
import { useAdFreeStatus } from "@/hooks/useAdFreeStatus";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { haptic } from "@/lib/haptics";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  DollarSign, 
  Rocket, 
  Code2, 
  Layers, 
  Smartphone,
  Globe,
  Database,
  Palette,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  Users,
  Menu,
  X,
  Terminal,
  ExternalLink,
  Shield,
  Search,
  PenTool,
  Wrench,
  Send,
  Headphones,
  Quote
} from "lucide-react";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Newsletter from "@/components/Newsletter";
import { SignalPresaleBanner } from "@/components/SignalPresaleBanner";
import { FAQSchema } from "@/components/SEOHead";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import webDevImg from "@assets/generated_images/web_development_workspace.png";
import supportImg from "@assets/generated_images/support_headset_desk.png";
import domainImg from "@assets/generated_images/domain_hosting_servers.png";
import designImg from "@assets/generated_images/design_branding_workspace.png";
import appDevImg from "@assets/generated_images/app_development_devices.png";
import maintenanceImg from "@assets/generated_images/maintenance_gears_circuits.png";
import cardStudioIdeImg from "@/assets/images/card-studio-ide.png";
import cardDevelopersHubImg from "@/assets/images/card-developers-hub.png";
import cardAuditToolImg from "@/assets/images/card-audit-tool.png";
import cardResourcesImg from "@/assets/images/card-resources.png";
import processDiscoveryImg from "@/assets/images/process-discovery.png";
import processDesignImg from "@/assets/images/process-design.png";
import processBuildImg from "@/assets/images/process-build.png";
import processLaunchImg from "@/assets/images/process-launch.png";
import processSupportImg from "@/assets/images/process-support.png";

const projects = [
  {
    id: 1,
    title: "Trust Layer",
    description: "Layer 1 blockchain providing verified identity and AI agent certification",
    tech: ["Blockchain", "Identity", "AI"],
    image: "/ecosystem/trust-layer-icon.png",
    gradient: "from-purple-500/20 to-pink-600/20",
    url: "https://dwsc.io"
  },
  {
    id: 3,
    title: "TrustShield",
    description: "24/7 continuous security monitoring for enterprise blockchain operations",
    tech: ["Security", "Monitoring", "Enterprise"],
    image: "/ecosystem/trust-shield.png",
    gradient: "from-emerald-500/20 to-teal-600/20",
    url: "https://trustshield.tech"
  },
  {
    id: 4,
    title: "Pulse",
    description: "AI-driven cryptocurrency trading and analytics with predictive signals",
    tech: ["AI", "Trading", "Analytics"],
    image: "/ecosystem/pulse.png",
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://darkwavepulse.com"
  },
  {
    id: 5,
    title: "Strike Agent",
    description: "Autonomous AI-powered asset discovery and trading system",
    tech: ["AI", "Trading", "Multi-chain"],
    image: "/ecosystem/strikeagent.png",
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://strikeagent.io"
  },
  {
    id: 6,
    title: "ORBIT Staffing",
    description: "Automated staffing platform with GPS tracking and payroll processing",
    tech: ["HR Tech", "Payroll", "GPS"],
    image: "/ecosystem/orbit-staffing.png",
    gradient: "from-orange-500/20 to-red-600/20",
    url: "https://orbitstaffing.io"
  },
  {
    id: 7,
    title: "Orby Commander",
    description: "Venue operations PWA with emergency command center and team comms",
    tech: ["Operations", "PWA", "Venues"],
    image: "/ecosystem/orby-commander.png",
    gradient: "from-amber-500/20 to-orange-600/20",
    url: "https://orbycommander.com"
  },
  {
    id: 8,
    title: "Lot Ops Pro",
    description: "Driver performance and workflow management for auto auctions",
    tech: ["Automotive", "Workflow", "GPS"],
    image: "/ecosystem/lot-ops-pro.png",
    gradient: "from-blue-500/20 to-indigo-600/20",
    url: "https://lotopspro.com"
  },
  {
    id: 9,
    title: "Brew & Board",
    description: "Nashville's premium B2B coffee and catering concierge platform",
    tech: ["Delivery", "B2B", "Catering"],
    image: "/ecosystem/brew-board.png",
    gradient: "from-lime-500/20 to-green-600/20",
    url: "https://brewandboardcoffee.replit.app"
  },
  {
    id: 10,
    title: "TradeWorks AI",
    description: "Field toolkit for 8 trade industries with AI estimation and scheduling",
    tech: ["AI", "Trades", "Estimation"],
    image: "/ecosystem/tradeworks-ai.png",
    gradient: "from-teal-500/20 to-cyan-600/20",
    url: "https://tradeworksai.io"
  },
  {
    id: 11,
    title: "PaintPros.io",
    description: "Lead generation hub connecting contractors to Trust Layer ecosystem",
    tech: ["SaaS", "Leads", "Marketing"],
    image: "/ecosystem/paint-pros.png",
    gradient: "from-rose-500/20 to-pink-600/20",
    url: "https://paintpros.io"
  },
  {
    id: 12,
    title: "Nashville Paint Pros",
    description: "Live demo for TradeWorks AI with instant estimates and booking",
    tech: ["Painting", "Estimates", "Booking"],
    image: "/ecosystem/nash-paint-pros.png",
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://nashpaintpros.io"
  },
  {
    id: 13,
    title: "Lume Paint Co",
    description: "Premium tier luxury interior painting with elevated design aesthetic",
    tech: ["Luxury", "Design", "Premium"],
    image: "/ecosystem/lume-paint.png",
    gradient: "from-amber-500/20 to-yellow-600/20",
    url: "https://lumepaint.co"
  },
  {
    id: 14,
    title: "GarageBot",
    description: "Auto parts aggregator with VIN decoding and AI repair assistant",
    tech: ["AI", "Automotive", "E-commerce"],
    image: "/ecosystem/garagebot.png",
    gradient: "from-red-500/20 to-orange-600/20",
    url: "https://garagebot.io"
  },
  {
    id: 15,
    title: "TL Driver Connect",
    description: "Multi-tenant delivery and driver management platform with 108 API endpoints and 33 database tables",
    tech: ["Delivery", "PWA", "AI", "WebSocket"],
    image: "/ecosystem/happy-eats.png",
    gradient: "from-green-500/20 to-emerald-600/20",
    url: "https://happyeats.app"
  },
  {
    id: 16,
    title: "VedaSolus",
    description: "Holistic wellness platform bridging Eastern and Western healing",
    tech: ["Health", "AI", "Wellness"],
    image: "/ecosystem/vedasolus.png",
    gradient: "from-teal-500/20 to-cyan-600/20",
    url: "https://vedasolus.io"
  },
  {
    id: 17,
    title: "Chronicles",
    description: "Immersive blockchain gaming experience — build your legacy in a dynamic world of strategy and adventure",
    tech: ["Gaming", "Blockchain", "Strategy"],
    image: "/ecosystem/trust-layer-icon.png",
    gradient: "from-amber-500/20 to-red-600/20",
    url: "https://yourlegacy.io"
  },
  {
    id: 18,
    title: "TrustHome",
    description: "White-label real estate platform with Voice AI, CRM, blockchain doc vault, and 90+ API endpoints",
    tech: ["Real Estate", "Voice AI", "CRM", "PWA"],
    image: "/ecosystem/trusthome.png",
    gradient: "from-sky-500/20 to-indigo-600/20",
    url: "https://trusthome.replit.app"
  },
  {
    id: 19,
    title: "TrustVault",
    description: "Multi-tenant media vault with image/audio/video editors, Spinny AI agent, and 4-tier subscriptions",
    tech: ["Media", "AI", "Editors", "PWA"],
    image: "/ecosystem/trustvault.png",
    gradient: "from-emerald-500/20 to-cyan-600/20",
    url: "https://trustvault.replit.app"
  }
];

const services = [
  {
    icon: Globe,
    title: "Custom Web Development",
    description: "From simple business sites to complex web applications — built exactly how you envision it. No templates, no compromises.",
    image: webDevImg
  },
  {
    icon: MessageSquare,
    title: "Unlimited Support",
    description: "Forget 1 hour per month. Get responsive, ongoing support whenever you need it. Your success is our priority.",
    image: supportImg
  },
  {
    icon: Database,
    title: "Domain & Hosting",
    description: "Full-service domain registration and hosting setup. We handle the technical stuff so you don't have to.",
    image: domainImg
  },
  {
    icon: Palette,
    title: "Design & Branding",
    description: "Modern, professional designs that reflect your brand identity and convert visitors into customers.",
    image: designImg
  },
  {
    icon: Code2,
    title: "App Development",
    description: "Full-stack applications with databases, user accounts, payments, and everything your business needs to operate.",
    image: appDevImg
  },
  {
    icon: Layers,
    title: "Maintenance & Updates",
    description: "Keep your site secure, fast, and up-to-date. We're your ongoing technology partner, not just a one-time vendor.",
    image: maintenanceImg
  }
];

const faqs = [
  {
    question: "How are you different from traditional agencies?",
    answer: "Traditional agencies charge $40,000+ for websites, then limit you to 1 hour of support per month at $200/hour. We don't operate that way. You get direct access to your developer, responsive support when you need it, and pricing that doesn't require a second mortgage."
  },
  {
    question: "What kind of support do you actually provide?",
    answer: "Real support. Need a quick change? Text me. Have a question about your site? I'll respond same-day. Want to discuss new features? Let's hop on a call. No ticket systems, no waiting weeks, no nickel-and-diming for every small request."
  },
  {
    question: "How can you charge so much less?",
    answer: "No downtown office. No layers of project managers. No bloated team. You work directly with the person building your project. Every dollar goes toward actual development, not overhead. Simple math."
  },
  {
    question: "Can you really build what the big agencies build?",
    answer: "Look at the portfolio above — those are all live, functional applications handling real users and real transactions. AI trading platforms, staffing systems, e-commerce, blockchain apps. If they can build it, so can we. Usually faster."
  },
  {
    question: "What about domains and hosting?",
    answer: "We handle everything. Domain registration, DNS setup, hosting configuration, SSL certificates — the full package. You don't need to juggle multiple vendors or figure out the technical details yourself."
  },
  {
    question: "How fast can you deliver?",
    answer: "Most websites launch in 2-4 weeks. Complex applications take 4-8 weeks. You'll see working demos every week so you can guide the direction. No surprises at the end."
  }
];

function AnimatedElement({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div 
      ref={elRef}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0);
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const processSteps = [
    { icon: Search, label: "Discovery", desc: "We learn your business, goals, and users. Through in-depth conversations we map out your vision, target audience, and success metrics.", color: "from-cyan-500 to-blue-500", image: processDiscoveryImg },
    { icon: PenTool, label: "Design", desc: "Wireframes, mockups, and visual direction. We create interactive prototypes so you can see and feel your product before a single line of code is written.", color: "from-purple-500 to-pink-500", image: processDesignImg },
    { icon: Wrench, label: "Build", desc: "Full-stack development with weekly demos. You see real progress every week and guide the direction as we build your product.", color: "from-orange-500 to-red-500", image: processBuildImg },
    { icon: Send, label: "Launch", desc: "Deployment, testing, and go-live. We handle everything — hosting, domain setup, performance optimization, and a smooth launch day.", color: "from-green-500 to-emerald-500", image: processLaunchImg },
    { icon: Headphones, label: "Support", desc: "Ongoing maintenance and updates. We don't disappear after launch. Bug fixes, feature additions, and performance monitoring — we're here for the long run.", color: "from-yellow-500 to-orange-500", image: processSupportImg },
  ];

  const nextProcessStep = () => setCurrentProcessStep((prev) => (prev + 1) % processSteps.length);
  const prevProcessStep = () => setCurrentProcessStep((prev) => (prev - 1 + processSteps.length) % processSteps.length);
  const { isAdFree, loading: adLoading, startCheckout } = useAdFreeStatus();

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const visibleProjects = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(projects[(currentProject + i) % projects.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FAQSchema faqs={faqs} />
      <div className="fixed inset-0 bg-background pointer-events-none" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/10">
          {/* Mobile Header */}
          <div className="lg:hidden max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-display text-base font-semibold gradient-text" data-testid="logo-mobile">
              DarkWave Studios
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-background/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto z-50">
              <div className="max-w-7xl mx-auto px-4 py-4 pb-20 flex flex-col gap-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider py-2">Work</div>
                <Link 
                  href="/projects" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-projects-mobile"
                >
                  Portfolio
                </Link>
                <Link 
                  href="/services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-services-mobile"
                >
                  Services
                </Link>
                
                <div className="text-xs text-muted-foreground uppercase tracking-wider py-2 mt-2">Pricing</div>
                <Link 
                  href="/quote" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-quote-mobile"
                >
                  Get a Quote
                </Link>
                <Link 
                  href="/payment" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-pricing-mobile"
                >
                  Plans & Pricing
                </Link>
                <Link 
                  href="/compare" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-compare-mobile"
                >
                  Compare
                </Link>
                
                <Link 
                  href="/developers" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-muted-foreground hover:text-primary uppercase tracking-wider py-2 mt-2 block"
                  data-testid="nav-developers-mobile"
                >
                  Developers
                </Link>
                <Link 
                  href="/ecosystem" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-ecosystem-mobile"
                >
                  Ecosystem
                </Link>
                <Link 
                  href="/hub" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-hub-mobile"
                >
                  Trust Layer Hub
                </Link>
                <Link 
                  href="/guardian-ai" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-guardian-mobile"
                >
                  Guardian AI
                </Link>
                <a 
                  href="https://trustshield.tech" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3 flex items-center gap-2"
                  data-testid="nav-shield-mobile"
                >
                  Guardian Shield
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://dwtl.io/studio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3 flex items-center gap-2"
                  data-testid="nav-studio-mobile"
                >
                  Studio IDE
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <div className="text-xs text-muted-foreground uppercase tracking-wider py-2 mt-2">Resources</div>
                <Link 
                  href="/blog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-blog-mobile"
                >
                  Blog
                </Link>
                <Link 
                  href="/resources" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-resources-mobile"
                >
                  Free Resources
                </Link>
                <Link 
                  href="/chat" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-chat-mobile"
                >
                  Signal Chat
                </Link>

                <div className="text-xs text-muted-foreground uppercase tracking-wider py-2 mt-2">Company</div>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-about-mobile"
                >
                  About Us
                </Link>
                <Link 
                  href="/mission" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-mission-mobile"
                >
                  Our Mission
                </Link>
                <Link 
                  href="/investors" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-investors-mobile"
                >
                  Investors
                </Link>
                <Link 
                  href="/book" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-book-mobile"
                >
                  Book a Call
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-3"
                  data-testid="nav-contact-link-mobile"
                >
                  Contact
                </Link>
                
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-glow bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium text-center mt-4"
                  data-testid="nav-contact-mobile"
                >
                  Start Your Project
                </Link>
              </div>
            </div>
          )}
          
          {/* Desktop Header */}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-2.5 items-center justify-between">
            <Link href="/" className="font-display text-lg font-semibold gradient-text" data-testid="logo">
              DarkWave Studios
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-projects">Portfolio</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-services">Services</Link>
              <Link href="/payment" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-pricing">Pricing</Link>
              <Link href="/developers" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-developers">Developers</Link>
              <Link href="/ecosystem" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-ecosystem">Ecosystem</Link>
              <Link href="/guardian-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-guardian">Guardian AI</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-about">About</Link>
              <a 
                href="https://dwtl.io/studio" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium"
                data-testid="nav-studio"
              >
                Studio IDE
              </a>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 lg:px-6 pt-20 pb-16 lg:pt-16 lg:pb-16">
          
          {/* BENTO GRID SECTION 1: Hero + Stats - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-3 mb-4 lg:mb-6">
            {/* Main Hero - 3-col mobile / 8-col desktop */}
            <AnimatedElement delay={100} className="col-span-3 lg:col-span-8 lg:row-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-10 relative overflow-hidden h-full min-h-[180px] lg:min-h-[400px] flex flex-col justify-center">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 lg:gap-2 bg-primary/10 border border-primary/20 rounded-full px-2 lg:px-4 py-1 lg:py-2 mb-3 lg:mb-6">
                    <span className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] lg:text-sm font-medium text-primary">Full-Service Web Agency</span>
                  </div>
                  
                  <h1 className="text-xl lg:text-6xl font-bold font-display leading-tight mb-2 lg:mb-4" data-testid="hero-title">
                    Agency Quality.
                    <br />
                    <span className="gradient-text text-glow-primary">Without the Agency Price.</span>
                  </h1>
                  
                  <p className="text-xs lg:text-lg text-muted-foreground max-w-xl mb-3 lg:mb-6 leading-relaxed hidden lg:block" data-testid="hero-description">
                    Custom websites, web applications, and ongoing support — all with direct access to your developer. 
                    No gatekeepers. No limits on support. Just results.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <Link 
                      href="/contact"
                      onClick={() => haptic("medium")}
                      className="btn-glow btn-press ripple-effect inline-flex items-center gap-1 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-base font-semibold animate-pulse-glow"
                      data-testid="hero-cta-primary"
                    >
                      Start Project
                      <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5" />
                    </Link>
                    <Link 
                      href="/projects"
                      onClick={() => haptic("light")}
                      className="inline-flex items-center gap-1 glass px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-base font-semibold hover:bg-white/10 transition-colors btn-press"
                      data-testid="hero-cta-secondary"
                    >
                      View Work
                    </Link>
                  </div>
                </div>
                
                              </div>
            </AnimatedElement>

            {/* Stat 1 - Lines of Code - 1 col mobile */}
            <AnimatedElement delay={200} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift h-full flex flex-col justify-center" data-testid="stat-code">
                <Code2 className="w-5 h-5 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display text-foreground">2.04M+</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Lines of Code</div>
              </div>
            </AnimatedElement>

            {/* Stat 2 - Live Apps - 1 col mobile */}
            <AnimatedElement delay={250} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift h-full flex flex-col justify-center" data-testid="stat-apps">
                <Rocket className="w-5 h-5 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display text-foreground">20</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Live Apps</div>
              </div>
            </AnimatedElement>

            {/* Stat 3 - Uptime - 1 col mobile */}
            <AnimatedElement delay={300} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift h-full flex flex-col justify-center" data-testid="stat-uptime">
                <Zap className="w-5 h-5 lg:w-8 lg:h-8 text-green-400 mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display text-green-400">99.9%</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Uptime</div>
              </div>
            </AnimatedElement>

            {/* Stat 4 - Satisfaction - hidden on mobile, shown on desktop */}
            <AnimatedElement delay={350} className="hidden lg:block lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift h-full flex flex-col justify-center" data-testid="stat-satisfaction">
                <Star className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display text-foreground">100%</div>
                <div className="text-muted-foreground text-sm">Satisfaction</div>
              </div>
            </AnimatedElement>
          </section>

          <AdUnit slot="1234567890" format="horizontal" isAdFree={isAdFree} loading={adLoading} className="my-3 lg:my-4" />

          {/* STUDIO IDE FEATURED SECTION */}
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-3 mb-4 lg:mb-6">
            <AnimatedElement delay={100} className="col-span-3 lg:col-span-8">
              <a 
                href="https://dwtl.io/studio" 
                target="_blank"
                rel="noopener noreferrer"
                className="block glass-card rounded-xl lg:rounded-2xl relative overflow-hidden group hover-lift h-full border border-white/10"
                data-testid="studio-ide-card"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundImage: `url(${cardStudioIdeImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
                <div className="relative z-10 p-4 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Terminal className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-2 lg:mb-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[10px] lg:text-xs font-medium text-green-400">Now Available</span>
                    </div>
                    <h3 className="text-lg lg:text-2xl font-bold font-display mb-1 lg:mb-2">
                      DarkWave <span className="text-primary">Studio IDE</span>
                    </h3>
                    <p className="text-muted-foreground text-xs lg:text-sm max-w-xl">
                      AI-powered development environment with modern tools and seamless deployment.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    Launch
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </AnimatedElement>

            <AnimatedElement delay={150} className="col-span-3 lg:col-span-4">
              <Link 
                href="/hub" 
                className="block glass-card rounded-xl lg:rounded-2xl relative overflow-hidden group hover-lift h-full border border-white/10"
                data-testid="trust-layer-card"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundImage: `url(${cardDevelopersHubImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/40" />
                <div className="relative z-10 p-4 lg:p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-3">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-base lg:text-lg font-bold font-display mb-1">
                      Trust Layer Developers Hub
                    </h3>
                    <p className="text-muted-foreground text-[10px] lg:text-sm">
                      Developer ecosystem & verified code.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-xs mt-3">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </AnimatedElement>
          </section>

          {/* FREE TOOLS SECTION */}
          <section className="grid grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-3 mb-4 lg:mb-6">
            <AnimatedElement delay={100} className="col-span-1 lg:col-span-6">
              <Link 
                href="/audit" 
                className="block glass-card rounded-xl lg:rounded-2xl relative overflow-hidden group hover-lift h-full border border-primary/20"
                data-testid="free-audit-card"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:opacity-55 transition-opacity"
                  style={{ backgroundImage: `url(${cardAuditToolImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/40" />
                <div className="relative z-10 p-4 lg:p-6 h-full flex flex-col justify-between min-h-[100px] lg:min-h-[140px]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 mb-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-[9px] lg:text-xs font-medium text-green-400">Free Tool</span>
                    </div>
                    <h3 className="text-sm lg:text-lg font-bold font-display mb-1">
                      Website Audit Tool
                    </h3>
                    <p className="text-muted-foreground text-[10px] lg:text-sm hidden lg:block">
                      Get instant analysis of your site's performance, SEO, and security.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium text-xs lg:text-sm mt-2">
                    Try Free <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </AnimatedElement>

            <AnimatedElement delay={150} className="col-span-1 lg:col-span-6">
              <Link 
                href="/resources" 
                className="block glass-card rounded-xl lg:rounded-2xl relative overflow-hidden group hover-lift h-full border border-white/10"
                data-testid="resources-card"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:opacity-55 transition-opacity"
                  style={{ backgroundImage: `url(${cardResourcesImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/40" />
                <div className="relative z-10 p-4 lg:p-6 h-full flex flex-col justify-between min-h-[100px] lg:min-h-[140px]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 mb-2">
                      <span className="text-[9px] lg:text-xs font-medium text-primary">Downloads</span>
                    </div>
                    <h3 className="text-sm lg:text-lg font-bold font-display mb-1">
                      Free Resources
                    </h3>
                    <p className="text-muted-foreground text-[10px] lg:text-sm hidden lg:block">
                      Checklists, templates, and guides to build better websites.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium text-xs lg:text-sm mt-2">
                    Download <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </AnimatedElement>
          </section>

          {/* BENTO GRID SECTION 2: Projects Carousel + Value Props - 3-COL MOBILE */}
          <ScrollReveal animation="fade-in"><section id="projects" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-3 mb-4 lg:mb-6 scroll-mt-24">
            {/* Projects Carousel - 3-col mobile / 8-col desktop */}
            <div className="col-span-3 lg:col-span-8">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border h-full">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h2 className="text-base lg:text-2xl font-bold font-display" data-testid="projects-title">
                    Built to <span className="gradient-text">Perform</span>
                  </h2>
                  <div className="flex items-center gap-1.5 lg:gap-3">
                    <button
                      onClick={prevProject}
                      className="glass w-7 h-7 lg:w-10 lg:h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                      data-testid="carousel-prev"
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <span className="text-muted-foreground text-[10px] lg:text-sm">
                      <span className="text-primary font-bold">{currentProject + 1}</span>/{projects.length}
                    </span>
                    <button
                      onClick={nextProject}
                      className="glass w-7 h-7 lg:w-10 lg:h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                      data-testid="carousel-next"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 lg:gap-5">
                  {visibleProjects().map((project, index) => (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`${project.id}-${currentProject}`}
                      className={`glass rounded-lg lg:rounded-xl p-2 lg:p-5 hover-lift relative overflow-hidden group cursor-pointer transition-all duration-300 block ${
                        index === 0 ? 'ring-1 lg:ring-2 ring-primary/50' : ''
                      }`}
                      data-testid={`project-card-${project.id}`}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                      <div className="relative z-10">
                        <h3 className="text-[10px] lg:text-lg font-bold font-display mb-0.5 lg:mb-1 line-clamp-1 mt-4 lg:mt-8">{project.title}</h3>
                        <p className="text-muted-foreground text-[8px] lg:text-xs mb-1 lg:mb-3 line-clamp-2 hidden lg:block">{project.description}</p>
                        <div className="hidden lg:flex flex-wrap gap-1 mb-3">
                          {project.tech.map((tech) => (
                            <span key={tech} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{tech}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-0.5 lg:gap-1 text-primary text-[8px] lg:text-xs font-medium group-hover:gap-1 lg:group-hover:gap-2 transition-all">
                          View <ArrowRight className="w-2 h-2 lg:w-3 lg:h-3" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="flex justify-center gap-1.5 mt-4">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProject(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentProject ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      data-testid={`carousel-dot-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Value Props - Side by side on mobile */}
            <div className="col-span-3 lg:col-span-4 grid grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-2 lg:gap-3">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 hover-lift gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative z-10">
                  <MessageSquare className="w-6 h-6 lg:w-10 lg:h-10 text-primary mb-1 lg:mb-3" />
                  <h3 className="text-xs lg:text-xl font-bold font-display mb-0.5 lg:mb-2">Real Support</h3>
                  <p className="text-muted-foreground text-[9px] lg:text-sm hidden lg:block">Not 1 hour per month. Responsive, ongoing support whenever you need it.</p>
                </div>
              </div>
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 hover-lift gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative z-10">
                  <Zap className="w-6 h-6 lg:w-10 lg:h-10 text-accent mb-1 lg:mb-3" />
                  <h3 className="text-xs lg:text-xl font-bold font-display mb-0.5 lg:mb-2">AI-Powered</h3>
                  <p className="text-muted-foreground text-[9px] lg:text-sm hidden lg:block">Modern apps with AI features — not $40k brochure sites.</p>
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          <AdUnit slot="2345678901" format="horizontal" isAdFree={isAdFree} loading={adLoading} className="my-3 lg:my-4" />

          {/* BENTO GRID SECTION 3: Services + Pricing */}
          <ScrollReveal animation="fade-in" delay={100}><section id="services" className="mb-4 lg:mb-6 scroll-mt-24">
            {/* Mobile: Pricing + Services Carousel */}
            <div className="lg:hidden space-y-2">
              {/* Compact Pricing Bar */}
              <div className="glass-card rounded-xl p-3 gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-[8px] text-muted-foreground">Agency</div>
                      <div className="text-sm font-bold line-through text-muted-foreground">$50k+</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <div className="text-center">
                      <div className="text-[8px] text-primary">DarkWave</div>
                      <div className="text-lg font-bold font-display gradient-text">60% Less</div>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-semibold"
                    data-testid="pricing-cta-mobile"
                  >
                    Quote
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Services Carousel for Mobile */}
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                  <div className="flex gap-2" style={{ width: 'max-content' }}>
                    {services.map((service) => (
                      <div
                        key={service.title}
                        className="glass-card rounded-xl p-3 gradient-border relative overflow-hidden group flex-shrink-0"
                        style={{ width: '140px', height: '100px' }}
                        data-testid={`service-${service.title.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center opacity-40"
                          style={{ backgroundImage: `url(${service.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                        <div className="relative z-10 h-full flex flex-col justify-end">
                          <div className="w-6 h-6 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-1">
                            <service.icon className="w-3 h-3 text-primary" />
                          </div>
                          <h3 className="text-[10px] font-bold font-display text-white leading-tight">{service.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Desktop: Original Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-3">
              {/* Pricing Card - 4-col desktop */}
              <div className="lg:col-span-4 row-span-2">
                <div className="glass-card rounded-2xl p-8 gradient-border h-full relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
                  <div className="relative z-10 text-center">
                    <div className="text-sm text-muted-foreground mb-2">Agency Price</div>
                    <div className="text-4xl font-bold line-through text-muted-foreground mb-6">$50,000+</div>
                    <div className="text-sm text-primary mb-2">DarkWave Price</div>
                    <div className="text-6xl font-bold font-display gradient-text mb-2">60%+</div>
                    <div className="text-2xl font-display gradient-text mb-6">Less</div>
                    <ul className="text-left space-y-3 mb-6">
                      {[
                        "Direct developer access",
                        "Weekly demos",
                        "No hidden fees",
                        "Modern stack"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="btn-glow inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold w-full"
                      data-testid="pricing-cta"
                    >
                      Get Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Services Grid - Desktop */}
              {services.map((service) => (
                <div key={service.title} className="lg:col-span-4">
                  <div
                    className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden group h-full min-h-[200px]"
                    data-testid={`service-${service.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:glow-primary transition-shadow">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold font-display mb-2 text-white">{service.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section></ScrollReveal>

          {/* SIGNAL PRESALE BANNER */}
          <ScrollReveal animation="fade-in">
            <SignalPresaleBanner variant="full" className="my-3 lg:my-5" />
          </ScrollReveal>

          {/* OUR PROCESS CAROUSEL */}
          <ScrollReveal animation="fade-in"><section className="mb-4 lg:mb-6">
            <div className="text-center mb-3 lg:mb-4">
              <h2 className="text-xl lg:text-3xl font-bold font-display mb-1" data-testid="text-process-heading">
                How We <span className="gradient-text">Work</span>
              </h2>
              <p className="text-muted-foreground text-xs lg:text-sm max-w-xl mx-auto">From first conversation to launch day and beyond — here's what working with us looks like.</p>
            </div>

            <div className="glass-card rounded-xl lg:rounded-2xl overflow-hidden gradient-border">
              <div className="relative">
                <div className="relative h-48 lg:h-72 overflow-hidden">
                  <img
                    src={processSteps[currentProcessStep].image}
                    alt={processSteps[currentProcessStep].label}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/60 to-transparent" />

                  <div className="absolute top-3 left-3 lg:top-4 lg:left-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${processSteps[currentProcessStep].color} flex items-center justify-center shadow-lg`}>
                      {(() => { const Icon = processSteps[currentProcessStep].icon; return <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />; })()}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-[10px] lg:text-xs font-bold text-white/70">Step {currentProcessStep + 1} of {processSteps.length}</span>
                  </div>
                </div>

                <div className="p-4 lg:p-6 -mt-8 relative z-10">
                  <div className="text-[10px] lg:text-xs font-bold text-white/40 mb-1">0{currentProcessStep + 1}</div>
                  <h3 className="text-lg lg:text-2xl font-bold font-display text-foreground mb-2">{processSteps[currentProcessStep].label}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{processSteps[currentProcessStep].desc}</p>
                </div>

                <div className="flex items-center justify-between px-4 pb-4 lg:px-6 lg:pb-6">
                  <div className="flex gap-1.5">
                    {processSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentProcessStep(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentProcessStep
                            ? `w-6 bg-gradient-to-r ${processSteps[i].color}`
                            : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                        data-testid={`process-dot-${i}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={prevProcessStep}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      data-testid="button-process-prev"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextProcessStep}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      data-testid="button-process-next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          {/* TESTIMONIALS CAROUSEL */}
          <ScrollReveal animation="fade-in"><section className="mb-4 lg:mb-6">
            <div className="text-center mb-3 lg:mb-4">
              <h2 className="text-xl lg:text-3xl font-bold font-display mb-1" data-testid="text-testimonials-heading">
                What Our <span className="gradient-text">Users Say</span>
              </h2>
              <p className="text-muted-foreground text-xs lg:text-sm max-w-xl mx-auto">Real people using real products built by DarkWave Studios.</p>
            </div>
            {(() => {
              const testimonials = [
                {
                  name: "Avery B.",
                  role: "Product User",
                  quote: "I use several of the apps in the ecosystem daily. The design is clean, everything just works, and new features keep showing up. It's honestly impressive how much is built into these platforms.",
                  color: "#8b5cf6",
                  rating: 5,
                },
                {
                  name: "Kathy G.",
                  role: "Owner, HappyEats.app",
                  quote: "DarkWave built HappyEats from the ground up and it's been running smoothly since day one. The whole process was straightforward — they understood what I needed and delivered exactly that.",
                  color: "#06b6d4",
                  rating: 5,
                },
                {
                  name: "Matthew K.",
                  role: "Founder, Validitor",
                  quote: "Working with DarkWave on Validitor has been a great experience. The technical quality is top-notch and the turnaround time is faster than any agency I've worked with before.",
                  color: "#10b981",
                  rating: 5,
                },
                {
                  name: "Shandora",
                  role: "Signal Founding Member",
                  quote: "I've been with Signal since the beginning. The platform keeps evolving and the community tools they've built make it easy to stay connected. You can tell real thought goes into every feature.",
                  color: "#f59e0b",
                  rating: 5,
                },
                {
                  name: "Madeline A.",
                  role: "Product User",
                  quote: "The apps are intuitive and well-designed. I'm not a tech person at all, but everything is easy to navigate. It's clear that a lot of care goes into the user experience.",
                  color: "#ec4899",
                  rating: 5,
                },
              ];
              const getVisible = () => {
                const visible = [];
                for (let i = 0; i < 3; i++) {
                  visible.push({ ...testimonials[(currentTestimonial + i) % testimonials.length], idx: i });
                }
                return visible;
              };
              return (
                <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
                    {getVisible().map((t, i) => (
                      <div key={`${currentTestimonial}-${i}`} className={`glass rounded-lg lg:rounded-xl p-3 lg:p-5 flex flex-col ${i > 0 ? 'hidden lg:flex' : ''}`} data-testid={`testimonial-card-${i}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
                            style={{ background: t.color }}
                          >
                            {t.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{t.name}</div>
                            <div className="text-[10px] lg:text-xs text-muted-foreground">{t.role}</div>
                          </div>
                          <div className="flex gap-0.5 ml-auto">
                            {Array.from({ length: t.rating }).map((_, s) => (
                              <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed flex-1">"{t.quote}"</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentTestimonial ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        data-testid={`testimonial-dot-${index}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </section></ScrollReveal>

          {/* TRUSTED BY / ECOSYSTEM MARQUEE */}
          <ScrollReveal animation="fade-in"><section className="mb-4 lg:mb-6">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-4 gradient-border overflow-hidden">
              <div className="text-center mb-2">
                <p className="text-[10px] lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Powering 20 Production Applications</p>
              </div>
              <div className="relative">
                <div className="flex animate-marquee gap-6 lg:gap-10">
                  {[
                    { name: "Trust Layer", gradient: "from-cyan-400 to-blue-500" },
                    { name: "Guardian AI", gradient: "from-green-400 to-emerald-500" },
                    { name: "Signal Chat", gradient: "from-purple-400 to-pink-500" },
                    { name: "StrikeAgent", gradient: "from-red-400 to-orange-500" },
                    { name: "TL Driver Connect", gradient: "from-yellow-400 to-orange-500" },
                    { name: "TradeWorks AI", gradient: "from-blue-400 to-indigo-500" },
                    { name: "Validitor", gradient: "from-emerald-400 to-teal-500" },
                    { name: "TrustVault", gradient: "from-violet-400 to-purple-500" },
                    { name: "TrustShield", gradient: "from-amber-400 to-red-500" },
                    { name: "Chronicles", gradient: "from-pink-400 to-rose-500" },
                    { name: "Trust Layer", gradient: "from-cyan-400 to-blue-500" },
                    { name: "Guardian AI", gradient: "from-green-400 to-emerald-500" },
                    { name: "Signal Chat", gradient: "from-purple-400 to-pink-500" },
                    { name: "StrikeAgent", gradient: "from-red-400 to-orange-500" },
                    { name: "TL Driver Connect", gradient: "from-yellow-400 to-orange-500" },
                    { name: "TradeWorks AI", gradient: "from-blue-400 to-indigo-500" },
                    { name: "Validitor", gradient: "from-emerald-400 to-teal-500" },
                    { name: "TrustVault", gradient: "from-violet-400 to-purple-500" },
                    { name: "TrustShield", gradient: "from-amber-400 to-red-500" },
                    { name: "Chronicles", gradient: "from-pink-400 to-rose-500" },
                  ].map((brand, i) => (
                    <div key={i} className="flex items-center gap-2 flex-shrink-0" data-testid={`brand-logo-${i}`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${brand.gradient}`} />
                      <span className="text-xs lg:text-sm font-display font-semibold text-foreground/50 whitespace-nowrap">{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          {/* BENTO GRID SECTION 4: FAQ + CTA - TRUE 3-COL MOBILE */}
          <ScrollReveal animation="scale-in"><section id="faq" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-3 scroll-mt-24">
            {/* FAQ - Full width on mobile, 7-col desktop */}
            <div className="col-span-3 lg:col-span-7">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
                <h2 className="text-base lg:text-2xl font-bold font-display mb-2 lg:mb-4" data-testid="faq-title">
                  <span className="gradient-text">FAQ</span>
                </h2>
                <Accordion type="single" collapsible className="space-y-1.5 lg:space-y-3">
                  {faqs.slice(0, 4).map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="glass rounded-lg lg:rounded-xl border-0 overflow-hidden"
                      data-testid={`faq-item-${index}`}
                    >
                      <AccordionTrigger className="px-3 lg:px-4 py-2.5 lg:py-4 text-left font-display font-semibold text-sm lg:text-base hover:no-underline hover:text-primary transition-colors [&>svg]:w-4 [&>svg]:h-4 lg:[&>svg]:w-4 lg:[&>svg]:h-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-3 lg:px-4 pb-3 lg:pb-4 text-muted-foreground text-xs lg:text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* CTA - Full width on mobile below FAQ, 5-col desktop */}
            <div className="col-span-3 lg:col-span-5" id="contact">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-8 gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                <div className="relative z-10 flex items-center gap-3 lg:block lg:text-center">
                  <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-primary lg:mx-auto lg:mb-4 flex-shrink-0" />
                  <div className="flex-1 lg:block">
                    <h2 className="text-sm lg:text-2xl font-bold font-display mb-0.5 lg:mb-2" data-testid="contact-title">
                      Let's <span className="gradient-text">Talk</span>
                    </h2>
                    <p className="text-muted-foreground text-[9px] lg:text-sm hidden lg:block lg:mb-4">
                      Free consultation. No commitment required.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-1 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-bold text-xs lg:text-lg animate-pulse-glow hover:scale-105 transition-transform lg:w-full justify-center"
                    data-testid="contact-cta"
                  >
                    Get Quote
                    <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust Signal - hidden on mobile */}
            <div className="hidden lg:block lg:col-span-5 lg:col-start-8">
              <div className="glass-card rounded-2xl p-5 gradient-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-display">Direct Communication</div>
                    <p className="text-muted-foreground text-sm">Work directly with the developer — no middlemen, no delays.</p>
                  </div>
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          {/* BUILD YOUR OWN - STUDIO IDE CTA */}
          <ScrollReveal animation="fade-in"><section className="mt-4 lg:mt-6 mb-4 lg:mb-6">
            <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-10 gradient-border relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${cardStudioIdeImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    <Terminal className="w-3 h-3" />
                    For Developers
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold font-display mb-4">
                    Build Your Own Website with <span className="text-primary">Studio IDE</span>
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base mb-6">
                    Prefer to code it yourself? Our cloud-based development environment gives you professional-grade tools, 
                    AI assistance, and one-click deployment. Build, test, and ship faster than ever.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Cloud-based IDE - code from anywhere",
                      "AI-powered code assistance",
                      "One-click deployments",
                      "Built-in database & hosting",
                      "Real-time collaboration"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://dwtl.io/studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold"
                    data-testid="studio-cta-button"
                  >
                    Launch Studio IDE
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="hidden lg:block">
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs text-muted-foreground ml-2">studio.darkwavestudios.io</span>
                    </div>
                    <div className="font-mono text-xs space-y-1 text-muted-foreground">
                      <div><span className="text-purple-400">import</span> <span className="text-green-400">{'{ createApp }'}</span> <span className="text-purple-400">from</span> <span className="text-yellow-400">'darkwave'</span>;</div>
                      <div></div>
                      <div><span className="text-purple-400">const</span> <span className="text-blue-400">app</span> = <span className="text-yellow-400">createApp</span>{'({'}</div>
                      <div>  <span className="text-blue-400">name</span>: <span className="text-green-400">'My Awesome Site'</span>,</div>
                      <div>  <span className="text-blue-400">ai</span>: <span className="text-orange-400">true</span>,</div>
                      <div>  <span className="text-blue-400">deploy</span>: <span className="text-green-400">'production'</span></div>
                      <div>{'});'}</div>
                      <div></div>
                      <div className="text-primary">// Your site is live!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          {/* NEWSLETTER SECTION */}
          <ScrollReveal animation="fade-in"><section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-3 mt-4 lg:mt-6">
            <div className="col-span-3 lg:col-span-6">
              <Newsletter />
            </div>
            <div className="col-span-3 lg:col-span-6">
              <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border card-3d h-full">
                <h3 className="font-bold text-lg lg:text-xl mb-4 gradient-text">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/quote"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    data-testid="link-quote-calculator"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-center">Quote Calculator</span>
                  </Link>
                  <Link 
                    href="/book"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    data-testid="link-book-call"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-center">Book a Call</span>
                  </Link>
                  <Link 
                    href="/compare"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    data-testid="link-compare-pricing"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-center">Compare Pricing</span>
                  </Link>
                  <Link 
                    href="/projects"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    data-testid="link-view-portfolio"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-center">View Portfolio</span>
                  </Link>
                </div>
              </div>
            </div>
          </section></ScrollReveal>

          <AdFreeBanner isAdFree={isAdFree} loading={adLoading} onUpgrade={startCheckout} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
