import { Link } from "wouter";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Strike Agent",
    description: "AI-powered crypto trading signals platform with 61% win rate. Real-time alerts, backtested strategies, and comprehensive analytics dashboard for serious traders.",
    tech: ["AI/ML", "Real-time", "Analytics", "Crypto"],
    image: "🎯",
    gradient: "from-cyan-500/20 to-blue-600/20",
    url: "https://strikeagent.io",
    category: "FinTech"
  },
  {
    id: 2,
    title: "DarkWave Pulse",
    description: "Predictive market intelligence platform powered by advanced AI analytics. Monitors market sentiment, identifies trends, and provides actionable insights.",
    tech: ["AI", "Analytics", "Markets", "Predictions"],
    image: "📡",
    gradient: "from-purple-500/20 to-pink-600/20",
    url: "https://darkwavepulse.com",
    category: "FinTech"
  },
  {
    id: 3,
    title: "Orbit Staffing",
    description: "Complete staffing platform with GPS clock-in, automated payroll processing, AI-powered candidate matching, and comprehensive HR management tools.",
    tech: ["HR Tech", "Payroll", "AI Matching", "GPS"],
    image: "🚀",
    gradient: "from-emerald-500/20 to-teal-600/20",
    url: "https://orbitstaffing.io",
    category: "HR/Staffing"
  },
  {
    id: 4,
    title: "Orby",
    description: "Venue operations command suite featuring geofencing technology, facial recognition clock-in, and real-time staff management for large-scale events.",
    tech: ["Operations", "Geofencing", "Biometrics", "Real-time"],
    image: "🔮",
    gradient: "from-orange-500/20 to-red-600/20",
    url: "https://getorby.io",
    category: "Operations"
  },
  {
    id: 5,
    title: "Nashville Painting Pros",
    description: "Professional painting contractor website with instant quote calculator, project galleries, and integrated booking system for residential and commercial services.",
    tech: ["Quote System", "Booking", "CMS", "Local SEO"],
    image: "🎨",
    gradient: "from-yellow-500/20 to-orange-600/20",
    url: "https://nashpaintpros.io",
    category: "Local Business"
  },
  {
    id: 6,
    title: "Paint Pros",
    description: "Lead generation and CRM platform for painting contractors. Features job scheduling, customer management, and automated follow-up sequences.",
    tech: ["CRM", "Lead Gen", "Scheduling", "Automation"],
    image: "🖌️",
    gradient: "from-rose-500/20 to-pink-600/20",
    url: "https://paintpros.io",
    category: "SaaS"
  },
  {
    id: 7,
    title: "DWSC",
    description: "DarkWave Sports Console - comprehensive sports analytics and data visualization platform for teams, coaches, and analysts.",
    tech: ["Sports", "Analytics", "Data Viz", "Real-time"],
    image: "⚡",
    gradient: "from-indigo-500/20 to-purple-600/20",
    url: "https://dwsc.io",
    category: "Sports Tech"
  },
  {
    id: 8,
    title: "Your Legacy",
    description: "Digital estate planning and legacy preservation platform. Secure document storage, video messages, and scheduled delivery for future generations.",
    tech: ["Security", "Scheduling", "Storage", "Privacy"],
    image: "📜",
    gradient: "from-amber-500/20 to-yellow-600/20",
    url: "https://yourlegacy.io",
    category: "LegalTech"
  },
  {
    id: 9,
    title: "Garage Bot",
    description: "AI-powered automotive diagnostics and maintenance scheduling. Connects to OBD-II systems for real-time vehicle health monitoring and predictive maintenance.",
    tech: ["IoT", "AI", "Automotive", "Predictive"],
    image: "🤖",
    gradient: "from-slate-500/20 to-gray-600/20",
    url: "https://garagebot.io",
    category: "Automotive"
  },
  {
    id: 10,
    title: "Brew & Board",
    description: "Coffee shop and board game cafe management system. Handles reservations, game library tracking, loyalty programs, and POS integration.",
    tech: ["POS", "Reservations", "Loyalty", "Inventory"],
    image: "☕",
    gradient: "from-amber-600/20 to-brown-600/20",
    url: "https://brewandboard.coffee",
    category: "Hospitality"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-primary">Projects</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Compare</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Get Quote
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Our <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            10+ live applications serving real businesses. From AI trading platforms to local service websites — we build solutions that work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 gradient-border hover-lift group cursor-pointer"
              data-testid={`project-card-${project.id}`}
            >
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 relative overflow-hidden`}>
                <span className="text-5xl">{project.image}</span>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{project.category}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span key={i} className="px-2 py-1 text-[10px] rounded-full bg-primary/10 text-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">
              Want Something <span className="gradient-text">Like This?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Every project is custom-built from scratch. Tell us about your vision and we'll bring it to life.
            </p>
            <Link 
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-bold gradient-text">DarkWave Studios</div>
          <div className="text-muted-foreground text-sm">© 2025. Built with passion, priced with honesty.</div>
        </div>
      </footer>
    </div>
  );
}
