import { Link } from "wouter";
import { 
  Code2, 
  Clock, 
  Globe, 
  Palette, 
  Smartphone, 
  Layers,
  ArrowRight,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import webDevImg from "@assets/generated_images/web_development_workspace.png";
import supportImg from "@assets/generated_images/support_headset_desk.png";
import domainImg from "@assets/generated_images/domain_hosting_servers.png";
import designImg from "@assets/generated_images/design_branding_workspace.png";
import appDevImg from "@assets/generated_images/app_development_devices.png";
import maintenanceImg from "@assets/generated_images/maintenance_gears_circuits.png";

const services = [
  {
    icon: Code2,
    title: "Custom Web Development",
    description: "Full-stack applications built with modern frameworks. No templates, no shortcuts — every line of code written specifically for your business needs.",
    image: webDevImg,
    features: [
      "React, Node.js, and modern tech stack",
      "Custom admin dashboards",
      "API integrations",
      "Database design & optimization",
      "Scalable architecture"
    ],
    pricing: "Starting at $5,000"
  },
  {
    icon: Clock,
    title: "Unlimited Support",
    description: "Unlike traditional agencies that charge $200/hr with 1 hour/month included, we provide unlimited support. Your success is our priority.",
    image: supportImg,
    features: [
      "Unlimited revisions & changes",
      "Direct developer communication",
      "Same-day response times",
      "No hourly billing surprises",
      "Proactive monitoring"
    ],
    pricing: "Included with all projects"
  },
  {
    icon: Globe,
    title: "Domain & Hosting",
    description: "Enterprise-grade hosting with 99.9% uptime, SSL certificates, and CDN included. We handle the technical infrastructure so you don't have to.",
    image: domainImg,
    features: [
      "Domain registration & management",
      "Enterprise-grade hosting",
      "Free SSL certificates",
      "Global CDN for fast loading",
      "Daily automated backups"
    ],
    pricing: "Starting at $50/month"
  },
  {
    icon: Palette,
    title: "Design & Branding",
    description: "Cohesive visual identity that sets you apart. From logos to complete brand guidelines, we create designs that resonate with your audience.",
    image: designImg,
    features: [
      "Logo design & brand identity",
      "UI/UX design",
      "Style guides & brand books",
      "Marketing collateral",
      "Social media assets"
    ],
    pricing: "Starting at $2,500"
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Native-quality mobile and web applications. Cross-platform solutions that work seamlessly on iOS, Android, and web browsers.",
    image: appDevImg,
    features: [
      "iOS & Android apps",
      "Progressive Web Apps (PWA)",
      "Cross-platform development",
      "App store submission",
      "Push notifications"
    ],
    pricing: "Starting at $10,000"
  },
  {
    icon: Layers,
    title: "Maintenance & Updates",
    description: "Keep your applications secure, fast, and up-to-date. We handle security patches, performance optimization, and feature updates.",
    image: maintenanceImg,
    features: [
      "Security updates & patches",
      "Performance optimization",
      "Feature additions",
      "Bug fixes",
      "Analytics & reporting"
    ],
    pricing: "Starting at $200/month"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Web Development Services - Custom Apps, AI Integration & More"
        description="Full-stack web development services including custom websites, AI-powered applications, e-commerce, SaaS platforms, and unlimited support. 60% savings vs traditional agencies."
        keywords="web development services, custom websites, AI development, e-commerce development, SaaS development, React development, Node.js, Nashville web agency"
        type="website"
        url="https://darkwavestudios.com/services"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Services", url: "https://darkwavestudios.com/services" }
        ]}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave Studios
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-primary">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
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
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Full-service web development at 60%+ less than traditional agencies. Direct developer access, unlimited support, no hidden fees.
          </p>
        </div>

        <div className="space-y-8 lg:space-y-16">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className={`glass-card rounded-2xl overflow-hidden gradient-border ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } lg:flex`}
              data-testid={`service-detail-${service.title.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div 
                className="h-48 lg:h-auto lg:w-2/5 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background via-background/50 to-transparent" />
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <service.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 lg:p-10 lg:w-3/5">
                <h2 className="text-xl lg:text-3xl font-bold font-display mb-3">{service.title}</h2>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold gradient-text">{service.pricing}</div>
                  <Link 
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Free consultation. No commitment required. Let's discuss how we can help your business grow.
            </p>
            <Link 
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold"
            >
              Contact Us
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
