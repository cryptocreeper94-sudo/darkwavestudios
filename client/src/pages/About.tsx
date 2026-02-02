import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Code2, Users, Zap, Shield, Clock, DollarSign } from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

const values = [
  {
    icon: Code2,
    title: "Quality Code",
    description: "Every line of code is written with care. No shortcuts, no templates — custom solutions built to last."
  },
  {
    icon: Users,
    title: "Direct Access",
    description: "No project managers or middlemen. You work directly with the developer building your application."
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Weekly demos and rapid iteration. See your project take shape in real-time, not months from now."
  },
  {
    icon: Shield,
    title: "Reliability",
    description: "Enterprise-grade infrastructure with 99.9% uptime. Your business deserves rock-solid technology."
  },
  {
    icon: Clock,
    title: "Unlimited Support",
    description: "No hourly billing surprises. Unlimited revisions and support included with every project."
  },
  {
    icon: DollarSign,
    title: "Fair Pricing",
    description: "60%+ less than traditional agencies. Premium quality without the premium markup."
  }
];

const stats = [
  { value: "10+", label: "Live Applications" },
  { value: "11", label: "Active Clients" },
  { value: "60%+", label: "Cost Savings" },
  { value: "24/7", label: "Support Available" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="About Us - Nashville's Premier Boutique Web Agency"
        description="Meet DarkWave Studios - a boutique web development agency offering direct developer access, unlimited support, and agency-quality results at 60% less cost. Based in Nashville, serving clients worldwide."
        keywords="about DarkWave Studios, Nashville web developer, boutique web agency, direct developer access, unlimited support, affordable web development"
        type="website"
        url="https://darkwavestudios.com/about"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "About", url: "https://darkwavestudios.com/about" }
        ]}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave Studios
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="/about" className="text-sm font-medium text-primary">About</Link>
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
            About <span className="gradient-text">DarkWave Studios</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A different kind of web agency. Direct developer access, unlimited support, and premium quality at fair prices.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 lg:p-12 gradient-border mb-12 lg:mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-6 text-center">
              The <span className="gradient-text">Problem</span> with Traditional Agencies
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Traditional web agencies charge $40,000+ for basic websites. They bill $200/hour for support with only 1 hour/month included. You never talk to the actual developer — just project managers who add layers of overhead and cost.
              </p>
              <p>
                We built DarkWave Studios as the antidote to this broken model. One developer. Direct communication. Unlimited support. Fair prices.
              </p>
              <p>
                Every project is custom-built from scratch using modern technology. No WordPress templates. No page builders. Real code that's maintainable, scalable, and built specifically for your business needs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-6 text-center gradient-border">
              <div className="text-3xl lg:text-4xl font-bold font-display gradient-text mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-8 text-center">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="glass-card rounded-xl p-6 gradient-border hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 lg:p-12 gradient-border">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/3 mb-6 lg:mb-0">
              <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto flex items-center justify-center">
                <span className="text-6xl lg:text-8xl">👨‍💻</span>
              </div>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">
                Meet <span className="gradient-text">Jason</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Full-stack developer with a passion for building applications that solve real problems. After years of watching agencies overcharge and underdeliver, I started DarkWave Studios to offer a better way.
                </p>
                <p>
                  When you work with DarkWave, you work directly with me. No account managers, no support tickets that disappear into a queue. Just direct communication and rapid iteration until your project is exactly what you envisioned.
                </p>
                <p>
                  Currently serving 11 clients with 10+ live applications. From AI trading platforms to local business websites, I build solutions that work.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">
              Ready to <span className="gradient-text">Work Together?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Free consultation. No pressure. Let's discuss how we can help your business grow.
            </p>
            <Link 
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold"
            >
              Get in Touch
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
