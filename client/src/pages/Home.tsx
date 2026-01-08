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
  Star
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
    description: "Full-stack web apps built from scratch, tailored to your exact requirements. No templates, no bloat."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Pixel-perfect designs that look stunning on every device, from mobile to ultra-wide displays."
  },
  {
    icon: Database,
    title: "Database Architecture",
    description: "Efficient, scalable database design that grows with your business without performance hits."
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that your users will actually enjoy using."
  },
  {
    icon: Code2,
    title: "API Development",
    description: "Clean, well-documented APIs that integrate seamlessly with any frontend or third-party service."
  },
  {
    icon: Layers,
    title: "System Integration",
    description: "Connect your existing tools and services into a unified, automated workflow."
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

const stats = [
  { value: "10+", label: "Apps Built", icon: Rocket },
  { value: "60%", label: "Cost Savings", icon: DollarSign },
  { value: "2-6", label: "Week Delivery", icon: Zap },
  { value: "100%", label: "Satisfaction", icon: Star }
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

        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <section className="bento-grid grid-cols-1 lg:grid-cols-4 gap-6 mb-20">
            <AnimatedElement delay={200} className="lg:col-span-3 lg:row-span-2">
              <div className="glass-card rounded-2xl p-10 relative overflow-hidden noise-overlay gradient-border h-full">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-primary">Available for new projects</span>
                  </div>
                  
                  <h1 
                    className="text-5xl lg:text-7xl font-bold font-display leading-tight mb-6"
                    data-testid="hero-title"
                  >
                    Premium Apps.
                    <br />
                    <span className="gradient-text text-glow-primary">Honest Prices.</span>
                  </h1>
                  
                  <p 
                    className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
                    data-testid="hero-description"
                  >
                    Stop overpaying development agencies. Get exactly what you envision — 
                    built around your needs, your way. Custom web apps crafted with cutting-edge 
                    tech, guided by you every step of the way.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="#contact"
                      className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg animate-pulse-glow"
                      data-testid="hero-cta-primary"
                    >
                      Start Your Project
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a 
                      href="#projects"
                      className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                      data-testid="hero-cta-secondary"
                    >
                      View My Work
                    </a>
                  </div>
                </div>
                
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl opacity-50" />
                <div className="absolute -left-10 -top-10 w-60 h-60 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-3xl opacity-30" />
              </div>
            </AnimatedElement>

            {stats.map((stat, index) => (
              <AnimatedElement key={stat.label} delay={300 + index * 100}>
                <div
                  className="glass-card rounded-2xl p-6 hover-lift gradient-border relative overflow-hidden h-full"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="relative z-10">
                    <stat.icon className="w-8 h-8 text-primary mb-3" />
                    <div className="text-4xl font-bold font-display gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                </div>
              </AnimatedElement>
            ))}
          </section>

          <section id="projects" className="mb-20 scroll-mt-24">
            <AnimatedElement delay={0}>
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold font-display mb-4" data-testid="projects-title">
                  Built to <span className="gradient-text">Perform</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  10+ production-ready applications, each solving real business problems
                </p>
              </div>
            </AnimatedElement>

            <div className="glass-card rounded-2xl p-8 relative overflow-hidden gradient-border">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevProject}
                    className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                    data-testid="carousel-prev"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextProject}
                    className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors btn-glow"
                    data-testid="carousel-next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary font-bold">{currentProject + 1}</span> / {projects.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {visibleProjects().map((project, index) => (
                  <div
                    key={`${project.id}-${currentProject}`}
                    className={`glass-card rounded-xl p-6 hover-lift gradient-border relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                      index === 0 ? 'ring-2 ring-primary/50' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{project.image}</div>
                      <h3 className="text-xl font-bold font-display mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span 
                            key={tech} 
                            className="text-xs bg-white/10 px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentProject 
                        ? 'w-8 bg-primary' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                    data-testid={`carousel-dot-${index}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="services" className="mb-20 scroll-mt-24">
            <AnimatedElement delay={0}>
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold font-display mb-4" data-testid="services-title">
                  What I <span className="gradient-text">Build</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Full-stack development services tailored to your business needs
                </p>
              </div>
            </AnimatedElement>

            <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <AnimatedElement key={service.title} delay={index * 100}>
                  <div
                    className="glass-card rounded-2xl p-8 hover-lift gradient-border relative overflow-hidden group h-full"
                    data-testid={`service-${service.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:glow-primary transition-shadow">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold font-display mb-3">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <AnimatedElement delay={0}>
              <div className="glass-card rounded-2xl p-10 gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <h2 className="text-4xl font-bold font-display mb-4" data-testid="value-title">
                      Why Pay <span className="gradient-text">Agency Prices?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Development agencies charge $50,000+ for projects I can deliver for a fraction 
                      of that cost. Same quality, same tech stack, faster delivery.
                    </p>
                    <ul className="space-y-4">
                      {[
                        "No middlemen — work directly with the developer",
                        "No bloated timelines — fast, focused delivery",
                        "No hidden fees — transparent, honest pricing",
                        "No compromises — modern tech, clean code"
                      ].map((item, index) => (
                        <li 
                          key={index}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="perspective-1000">
                    <div
                      className="transform-3d glass-strong rounded-2xl p-8 relative hover:scale-105 transition-transform duration-300"
                      style={{ transform: 'rotateY(-5deg) rotateX(3deg)' }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-50" />
                      <div className="relative z-10 text-center">
                        <div className="text-sm text-muted-foreground mb-2">Agency Price</div>
                        <div className="text-3xl font-bold line-through text-muted-foreground mb-4">$50,000+</div>
                        <div className="text-sm text-primary mb-2">My Price</div>
                        <div className="text-5xl font-bold font-display gradient-text mb-4">60%+ Less</div>
                        <div className="text-sm text-muted-foreground">Same quality. Faster delivery.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </section>

          <section id="faq" className="mb-20 scroll-mt-24">
            <AnimatedElement delay={0}>
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold font-display mb-4" data-testid="faq-title">
                  Common <span className="gradient-text">Questions</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to know before we start working together
                </p>
              </div>
            </AnimatedElement>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="glass-card rounded-xl border-0 overflow-hidden gradient-border"
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger className="px-6 py-5 text-left font-display font-semibold text-lg hover:no-underline hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <section id="contact" className="scroll-mt-24">
            <AnimatedElement delay={0}>
              <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden gradient-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="absolute -left-20 -top-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="text-4xl lg:text-5xl font-bold font-display mb-4" data-testid="contact-title">
                    Ready to <span className="gradient-text">Start?</span>
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                    Let's discuss your project. No commitment, no pressure — just a conversation 
                    about what you're building and how I can help.
                  </p>
                  <a
                    href="mailto:jason@example.com"
                    className="btn-glow inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-xl animate-pulse-glow hover:scale-105 transition-transform"
                    data-testid="contact-cta"
                  >
                    Get in Touch
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </AnimatedElement>
          </section>
        </main>

        <footer className="relative z-10 glass-strong mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
