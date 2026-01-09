import { useState, useEffect } from "react";
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
  Shield,
  Users,
  Menu,
  X
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import webDevImg from "@assets/generated_images/web_development_workspace.png";
import supportImg from "@assets/generated_images/support_headset_desk.png";
import domainImg from "@assets/generated_images/domain_hosting_servers.png";
import designImg from "@assets/generated_images/design_branding_workspace.png";
import appDevImg from "@assets/generated_images/app_development_devices.png";
import maintenanceImg from "@assets/generated_images/maintenance_gears_circuits.png";

const projects = [
  {
    id: 1,
    title: "Strike Agent",
    description: "AI-powered crypto trading signals with 61% win rate and real-time alerts",
    tech: ["AI", "Trading", "Real-time"],
    image: "🎯",
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://strikeagent.io"
  },
  {
    id: 2,
    title: "DarkWave Pulse",
    description: "Predictive market intelligence powered by AI analytics systems",
    tech: ["AI", "Analytics", "Markets"],
    image: "📡",
    gradient: "from-purple-500/20 to-pink-600/20",
    url: "https://darkwavepulse.com"
  },
  {
    id: 3,
    title: "Orbit Staffing",
    description: "Full-cycle staffing platform with GPS clock-in, payroll automation, and AI matching",
    tech: ["HR Tech", "Payroll", "AI"],
    image: "🚀",
    gradient: "from-emerald-500/20 to-teal-600/20",
    url: "https://orbitstaffing.io"
  },
  {
    id: 4,
    title: "Orby",
    description: "Venue operations command suite with geofencing and facial recognition clock-in",
    tech: ["Operations", "Geofencing", "Security"],
    image: "🔮",
    gradient: "from-orange-500/20 to-red-600/20",
    url: "https://getorby.io"
  },
  {
    id: 5,
    title: "Nash Paint Pros",
    description: "Nashville's #1 painters with AI room visualizer and instant estimates",
    tech: ["AI Estimates", "Booking", "Visualizer"],
    image: "🎨",
    gradient: "from-violet-500/20 to-purple-600/20",
    url: "https://nashpaintpros.io"
  },
  {
    id: 6,
    title: "Paint Pros",
    description: "White-label SaaS for painting contractors with blockchain verification",
    tech: ["SaaS", "Blockchain", "White-label"],
    image: "🖌️",
    gradient: "from-blue-500/20 to-indigo-600/20",
    url: "https://paintpros.io"
  },
  {
    id: 7,
    title: "DWSC",
    description: "Layer 1 blockchain with 200K+ TPS, DeFi suite, NFTs, and Chronicles game",
    tech: ["Blockchain", "DeFi", "Gaming"],
    image: "⛓️",
    gradient: "from-amber-500/20 to-orange-600/20",
    url: "https://dwsc.io"
  },
  {
    id: 8,
    title: "Your Legacy",
    description: "Parallel life simulation spanning 70+ historical eras on DarkWave Chain",
    tech: ["Gaming", "Blockchain", "Simulation"],
    image: "🏰",
    gradient: "from-teal-500/20 to-cyan-600/20",
    url: "https://yourlegacy.io"
  },
  {
    id: 9,
    title: "Garage Bot",
    description: "Search 15M+ auto parts across 40+ retailers with AI DIY repair guides",
    tech: ["AI", "E-commerce", "Automotive"],
    image: "🔧",
    gradient: "from-rose-500/20 to-pink-600/20",
    url: "https://garagebot.io"
  },
  {
    id: 10,
    title: "Brew & Board",
    description: "Nashville coffee and catering delivery with white-glove service for meetings",
    tech: ["Delivery", "Catering", "Nashville"],
    image: "☕",
    gradient: "from-lime-500/20 to-green-600/20",
    url: "https://brewandboard.coffee"
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
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div 
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
          {/* Mobile Header */}
          <div className="lg:hidden max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-display text-base font-semibold gradient-text" data-testid="logo-mobile">
              DarkWave
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
            <div className="lg:hidden glass-strong border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
                <a 
                  href="#projects" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  data-testid="nav-projects-mobile"
                >
                  Projects
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  data-testid="nav-services-mobile"
                >
                  Services
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  data-testid="nav-faq-mobile"
                >
                  FAQ
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-glow bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium text-center mt-2"
                  data-testid="nav-contact-mobile"
                >
                  Get Started
                </a>
              </div>
            </div>
          )}
          
          {/* Desktop Header */}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-3 items-center justify-between">
            <div className="font-display text-lg font-semibold gradient-text" data-testid="logo">
              DarkWave Studios
            </div>
            <div className="flex items-center gap-8">
              <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-projects">Projects</a>
              <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-services">Services</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-faq">FAQ</a>
              <a 
                href="#contact" 
                className="btn-glow bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium"
                data-testid="nav-contact"
              >
                Get Started
              </a>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-20 pb-20">
          
          {/* BENTO GRID SECTION 1: Hero + Stats - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6">
            {/* Main Hero - 3-col mobile / 8-col desktop */}
            <AnimatedElement delay={100} className="col-span-3 lg:col-span-8 lg:row-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-10 relative overflow-hidden gradient-border h-full min-h-[180px] lg:min-h-[400px] flex flex-col justify-center">
                <div className="absolute inset-0 noise-overlay" />
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
                    <a 
                      href="#contact"
                      className="btn-glow inline-flex items-center gap-1 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-base font-semibold animate-pulse-glow"
                      data-testid="hero-cta-primary"
                    >
                      Start Project
                      <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5" />
                    </a>
                    <a 
                      href="#projects"
                      className="inline-flex items-center gap-1 glass px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-base font-semibold hover:bg-white/10 transition-colors"
                      data-testid="hero-cta-secondary"
                    >
                      View Work
                    </a>
                  </div>
                </div>
                
                <div className="absolute -right-20 -bottom-20 w-40 lg:w-60 h-40 lg:h-60 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl opacity-50" />
              </div>
            </AnimatedElement>

            {/* Stat 1 - Live Projects - 1 col mobile */}
            <AnimatedElement delay={200} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-apps">
                <Rocket className="w-5 h-5 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display gradient-text">10+</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Live Apps</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 2 - AI Powered - 1 col mobile */}
            <AnimatedElement delay={250} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-ai">
                <Zap className="w-5 h-5 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display gradient-text">AI</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Powered</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 3 - Cost Savings - 1 col mobile */}
            <AnimatedElement delay={300} className="col-span-1 lg:col-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-savings">
                <DollarSign className="w-5 h-5 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-2" />
                <div className="text-lg lg:text-3xl font-bold font-display gradient-text">60%</div>
                <div className="text-muted-foreground text-[9px] lg:text-sm">Less Cost</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 4 - Satisfaction - hidden on mobile, shown on desktop */}
            <AnimatedElement delay={350} className="hidden lg:block lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-satisfaction">
                <Star className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display gradient-text">100%</div>
                <div className="text-muted-foreground text-sm">Satisfaction</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>
          </section>

          {/* BENTO GRID SECTION 2: Projects Carousel + Value Props - 3-COL MOBILE */}
          <section id="projects" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6 scroll-mt-24">
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

                <div className="grid grid-cols-3 gap-2 lg:gap-4">
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
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                      <div className="relative z-10">
                        <div className="text-xl lg:text-4xl mb-1 lg:mb-3">{project.image}</div>
                        <h3 className="text-[10px] lg:text-lg font-bold font-display mb-0.5 lg:mb-1 line-clamp-1">{project.title}</h3>
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
            <div className="col-span-3 lg:col-span-4 grid grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-2 lg:gap-4">
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
          </section>

          {/* BENTO GRID SECTION 3: Services + Pricing - 3-COL MOBILE */}
          <section id="services" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6 scroll-mt-24">
            {/* Pricing Card - 2-col mobile / 4-col desktop */}
            <div className="col-span-2 lg:col-span-4 row-span-2">
              <div className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border h-full relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
                <div className="relative z-10 text-center">
                  <div className="text-[9px] lg:text-sm text-muted-foreground mb-1 lg:mb-2">Agency Price</div>
                  <div className="text-xl lg:text-4xl font-bold line-through text-muted-foreground mb-2 lg:mb-6">$50,000+</div>
                  <div className="text-[9px] lg:text-sm text-primary mb-1 lg:mb-2">DarkWave Price</div>
                  <div className="text-3xl lg:text-6xl font-bold font-display gradient-text mb-0.5 lg:mb-2">60%+</div>
                  <div className="text-sm lg:text-2xl font-display gradient-text mb-3 lg:mb-6">Less</div>
                  <ul className="text-left space-y-1 lg:space-y-3 mb-3 lg:mb-6">
                    {[
                      "Direct developer access",
                      "Weekly demos",
                      "No hidden fees",
                      "Modern stack"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-1 lg:gap-2 text-[9px] lg:text-sm">
                        <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="btn-glow inline-flex items-center justify-center gap-1 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-base font-semibold w-full"
                    data-testid="pricing-cta"
                  >
                    Get Quote
                    <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Services Grid - 1-col cells on mobile with photorealistic backgrounds */}
            {services.map((service, index) => (
              <div key={service.title} className="col-span-1 lg:col-span-4">
                <div
                  className="glass-card rounded-xl lg:rounded-2xl p-2 lg:p-5 hover-lift gradient-border relative overflow-hidden group h-full min-h-[80px] lg:min-h-[200px]"
                  data-testid={`service-${service.title.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-1 lg:mb-3 group-hover:glow-primary transition-shadow">
                      <service.icon className="w-3 h-3 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <h3 className="text-[9px] lg:text-lg font-bold font-display mb-0.5 lg:mb-2 line-clamp-2 text-white">{service.title}</h3>
                    <p className="text-muted-foreground text-[8px] lg:text-sm hidden lg:block line-clamp-2">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* BENTO GRID SECTION 4: FAQ + CTA - 3-COL MOBILE */}
          <section id="faq" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 scroll-mt-24">
            {/* FAQ - 2-col mobile / 7-col desktop */}
            <div className="col-span-2 lg:col-span-7">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border h-full">
                <h2 className="text-base lg:text-2xl font-bold font-display mb-2 lg:mb-4" data-testid="faq-title">
                  <span className="gradient-text">FAQ</span>
                </h2>
                <Accordion type="single" collapsible className="space-y-1.5 lg:space-y-3">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="glass rounded-lg lg:rounded-xl border-0 overflow-hidden"
                      data-testid={`faq-item-${index}`}
                    >
                      <AccordionTrigger className="px-2 lg:px-4 py-2 lg:py-4 text-left font-display font-semibold text-[9px] lg:text-sm hover:no-underline hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-2 lg:px-4 pb-2 lg:pb-4 text-muted-foreground text-[8px] lg:text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* CTA + Trust Signals - 1-col mobile / 5-col desktop */}
            <div className="col-span-1 lg:col-span-5 grid gap-2 lg:gap-4" id="contact">
              {/* Main CTA */}
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-8 gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                <div className="absolute -left-10 -top-10 w-20 lg:w-40 h-20 lg:h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -right-10 -bottom-10 w-20 lg:w-40 h-20 lg:h-40 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative z-10 text-center">
                  <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-2 lg:mb-4" />
                  <h2 className="text-sm lg:text-2xl font-bold font-display mb-1 lg:mb-2" data-testid="contact-title">
                    Ready to <span className="gradient-text">Start?</span>
                  </h2>
                  <p className="text-muted-foreground text-[9px] lg:text-sm mb-2 lg:mb-4 hidden lg:block">
                    Let's discuss your project. No commitment, no pressure.
                  </p>
                  <a
                    href="mailto:contact@darkwavestudios.com"
                    className="btn-glow inline-flex items-center gap-1 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-bold text-xs lg:text-lg animate-pulse-glow hover:scale-105 transition-transform w-full justify-center"
                    data-testid="contact-cta"
                  >
                    Contact
                    <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5" />
                  </a>
                </div>
              </div>

              {/* Trust Signal - hidden on mobile */}
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 gradient-border hidden lg:block">
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
          </section>
        </main>

        <footer className="relative z-10 glass-strong mt-6 lg:mt-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-4">
            <div className="font-display text-sm lg:text-xl font-bold gradient-text">
              DarkWave Studios
            </div>
            <div className="text-muted-foreground text-[10px] lg:text-sm">
              © 2025. Built with passion, priced with honesty.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
