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
  Users
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-featured shopping experience with cart, checkout, and inventory management",
    tech: ["React", "Node.js", "Stripe"],
    image: "🛒",
    gradient: "from-cyan-500/20 to-blue-600/20"
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description: "Analytics dashboard with real-time data visualization and user management",
    tech: ["React", "PostgreSQL", "Charts"],
    image: "📊",
    gradient: "from-purple-500/20 to-pink-600/20"
  },
  {
    id: 3,
    title: "Booking System",
    description: "Appointment scheduling with calendar integration and automated reminders",
    tech: ["React", "Calendar API", "SMS"],
    image: "📅",
    gradient: "from-emerald-500/20 to-teal-600/20"
  },
  {
    id: 4,
    title: "Social Platform",
    description: "Community platform with profiles, messaging, and content sharing",
    tech: ["React", "WebSocket", "Media"],
    image: "💬",
    gradient: "from-orange-500/20 to-red-600/20"
  },
  {
    id: 5,
    title: "Portfolio Builder",
    description: "Dynamic portfolio generator with customizable themes and SEO optimization",
    tech: ["React", "CMS", "SEO"],
    image: "🎨",
    gradient: "from-violet-500/20 to-purple-600/20"
  },
  {
    id: 6,
    title: "Task Management",
    description: "Project management tool with Kanban boards, assignments, and deadlines",
    tech: ["React", "Drag & Drop", "Teams"],
    image: "✅",
    gradient: "from-blue-500/20 to-indigo-600/20"
  },
  {
    id: 7,
    title: "Learning Platform",
    description: "Course management with video hosting, quizzes, and progress tracking",
    tech: ["React", "Video", "Auth"],
    image: "📚",
    gradient: "from-amber-500/20 to-orange-600/20"
  },
  {
    id: 8,
    title: "Inventory System",
    description: "Stock management with barcode scanning and automated reorder alerts",
    tech: ["React", "API", "Reports"],
    image: "📦",
    gradient: "from-teal-500/20 to-cyan-600/20"
  },
  {
    id: 9,
    title: "Healthcare Portal",
    description: "Patient management with appointments, records, and secure messaging",
    tech: ["React", "HIPAA", "Secure"],
    image: "🏥",
    gradient: "from-rose-500/20 to-pink-600/20"
  },
  {
    id: 10,
    title: "Real Estate App",
    description: "Property listings with search filters, maps, and virtual tours",
    tech: ["React", "Maps", "Media"],
    image: "🏠",
    gradient: "from-lime-500/20 to-green-600/20"
  }
];

const services = [
  {
    icon: Globe,
    title: "Custom Web Applications",
    description: "Full-stack web apps built from scratch, tailored to your exact requirements."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Pixel-perfect designs that look stunning on every device."
  },
  {
    icon: Database,
    title: "Database Architecture",
    description: "Efficient, scalable database design that grows with your business."
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces your users will love."
  },
  {
    icon: Code2,
    title: "API Development",
    description: "Clean, documented APIs that integrate seamlessly."
  },
  {
    icon: Layers,
    title: "System Integration",
    description: "Connect your tools into a unified workflow."
  }
];

const faqs = [
  {
    question: "How do you keep prices so low compared to agencies?",
    answer: "Simple: no bloated teams, no fancy office overhead, no account managers who don't code. You work directly with me, the developer who's actually building your project. Every dollar goes toward actual development."
  },
  {
    question: "What's your typical timeline for a project?",
    answer: "Most projects are delivered in 2-6 weeks depending on complexity. I move fast because I'm not juggling meetings all day. You'll see real progress every week with regular demos and updates."
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Absolutely. I offer flexible maintenance packages to keep your app updated, secure, and running smoothly. Most clients pay a fraction of what agencies charge for the same support."
  },
  {
    question: "What technologies do you work with?",
    answer: "Primarily React, Node.js, and PostgreSQL — the modern stack that powers most successful startups. But I adapt to your needs and can work with whatever makes sense for your project."
  },
  {
    question: "Can I see examples of your work?",
    answer: "You're looking at 10 of them right here! Each project above is a real, functional application I've built. I can also arrange demos or provide references upon request."
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
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <AnimatedElement delay={0}>
              <div className="font-display text-2xl font-bold gradient-text" data-testid="logo">
                DarkWave Studios
              </div>
            </AnimatedElement>
            <AnimatedElement delay={100}>
              <div className="flex items-center gap-6">
                <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-projects">Projects</a>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-services">Services</a>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-faq">FAQ</a>
                <a 
                  href="#contact" 
                  className="btn-glow bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium"
                  data-testid="nav-contact"
                >
                  Get Started
                </a>
              </div>
            </AnimatedElement>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          
          {/* BENTO GRID SECTION 1: Hero + Stats */}
          <section className="grid grid-cols-12 gap-4 mb-6">
            {/* Main Hero - Large Cell */}
            <AnimatedElement delay={100} className="col-span-12 lg:col-span-8 row-span-2">
              <div className="glass-card rounded-2xl p-8 lg:p-10 relative overflow-hidden gradient-border h-full min-h-[400px] flex flex-col justify-center">
                <div className="absolute inset-0 noise-overlay" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-primary">Available for new projects</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold font-display leading-tight mb-4" data-testid="hero-title">
                    Premium Apps.
                    <br />
                    <span className="gradient-text text-glow-primary">Honest Prices.</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed" data-testid="hero-description">
                    Get exactly what you envision — built around your needs, your way. 
                    Guided by you every step of the way.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="#contact"
                      className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold animate-pulse-glow"
                      data-testid="hero-cta-primary"
                    >
                      Start Your Project
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a 
                      href="#projects"
                      className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                      data-testid="hero-cta-secondary"
                    >
                      View My Work
                    </a>
                  </div>
                </div>
                
                <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl opacity-50" />
              </div>
            </AnimatedElement>

            {/* Stat 1 - Apps Built */}
            <AnimatedElement delay={200} className="col-span-6 lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-apps">
                <Rocket className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display gradient-text">10+</div>
                <div className="text-muted-foreground text-sm">Apps Built</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 2 - Cost Savings */}
            <AnimatedElement delay={250} className="col-span-6 lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-savings">
                <DollarSign className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display gradient-text">60%+</div>
                <div className="text-muted-foreground text-sm">Cost Savings</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 3 - Week Delivery */}
            <AnimatedElement delay={300} className="col-span-6 lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-delivery">
                <Zap className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display gradient-text">2-6</div>
                <div className="text-muted-foreground text-sm">Week Delivery</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>

            {/* Stat 4 - Satisfaction */}
            <AnimatedElement delay={350} className="col-span-6 lg:col-span-2">
              <div className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden h-full flex flex-col justify-center" data-testid="stat-satisfaction">
                <Star className="w-8 h-8 text-primary mb-2" />
                <div className="text-3xl font-bold font-display gradient-text">100%</div>
                <div className="text-muted-foreground text-sm">Satisfaction</div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </AnimatedElement>
          </section>

          {/* BENTO GRID SECTION 2: Projects Carousel + Value Props */}
          <section id="projects" className="grid grid-cols-12 gap-4 mb-6 scroll-mt-24">
            {/* Projects Carousel - Wide */}
            <div className="col-span-12 lg:col-span-8">
              <div className="glass-card rounded-2xl p-6 gradient-border h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-display" data-testid="projects-title">
                    Built to <span className="gradient-text">Perform</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevProject}
                      className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                      data-testid="carousel-prev"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-muted-foreground text-sm">
                      <span className="text-primary font-bold">{currentProject + 1}</span>/{projects.length}
                    </span>
                    <button
                      onClick={nextProject}
                      className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                      data-testid="carousel-next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visibleProjects().map((project, index) => (
                    <div
                      key={`${project.id}-${currentProject}`}
                      className={`glass rounded-xl p-5 hover-lift relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                        index === 0 ? 'ring-2 ring-primary/50' : ''
                      }`}
                      data-testid={`project-card-${project.id}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                      <div className="relative z-10">
                        <div className="text-4xl mb-3">{project.image}</div>
                        <h3 className="text-lg font-bold font-display mb-1">{project.title}</h3>
                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <span key={tech} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
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

            {/* Value Props - Tall Stack */}
            <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
              <div className="glass-card rounded-2xl p-6 hover-lift gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative z-10">
                  <Clock className="w-10 h-10 text-primary mb-3" />
                  <h3 className="text-xl font-bold font-display mb-2">Fast Turnaround</h3>
                  <p className="text-muted-foreground text-sm">No endless meetings. Real progress every week with demos you can see and test.</p>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6 hover-lift gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative z-10">
                  <Shield className="w-10 h-10 text-accent mb-3" />
                  <h3 className="text-xl font-bold font-display mb-2">Your Vision</h3>
                  <p className="text-muted-foreground text-sm">You guide the process. I build exactly what you need — no compromises.</p>
                </div>
              </div>
            </div>
          </section>

          {/* BENTO GRID SECTION 3: Services + Pricing */}
          <section id="services" className="grid grid-cols-12 gap-4 mb-6 scroll-mt-24">
            {/* Pricing Card - Tall */}
            <div className="col-span-12 lg:col-span-4 row-span-2">
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
                      "Weekly progress demos",
                      "No hidden fees",
                      "Modern tech stack"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="btn-glow inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold w-full"
                    data-testid="pricing-cta"
                  >
                    Get Quote
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Services Grid - 2x3 */}
            {services.map((service, index) => (
              <div key={service.title} className="col-span-6 lg:col-span-4">
                <div
                  className="glass-card rounded-2xl p-5 hover-lift gradient-border relative overflow-hidden group h-full"
                  data-testid={`service-${service.title.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-display mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* BENTO GRID SECTION 4: FAQ + CTA */}
          <section id="faq" className="grid grid-cols-12 gap-4 scroll-mt-24">
            {/* FAQ - Wide */}
            <div className="col-span-12 lg:col-span-7">
              <div className="glass-card rounded-2xl p-6 gradient-border h-full">
                <h2 className="text-2xl font-bold font-display mb-4" data-testid="faq-title">
                  Common <span className="gradient-text">Questions</span>
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="glass rounded-xl border-0 overflow-hidden"
                      data-testid={`faq-item-${index}`}
                    >
                      <AccordionTrigger className="px-4 py-4 text-left font-display font-semibold text-sm hover:no-underline hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* CTA + Trust Signals */}
            <div className="col-span-12 lg:col-span-5 grid gap-4" id="contact">
              {/* Main CTA */}
              <div className="glass-card rounded-2xl p-8 gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative z-10 text-center">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold font-display mb-2" data-testid="contact-title">
                    Ready to <span className="gradient-text">Start?</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Let's discuss your project. No commitment, no pressure.
                  </p>
                  <a
                    href="mailto:contact@darkwavestudios.com"
                    className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg animate-pulse-glow hover:scale-105 transition-transform w-full justify-center"
                    data-testid="contact-cta"
                  >
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Trust Signal */}
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
          </section>
        </main>

        <footer className="relative z-10 glass-strong mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-display text-xl font-bold gradient-text">
              DarkWave Studios
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025. Built with passion, priced with honesty.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
