import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, DollarSign, Users, Globe, Rocket, BarChart3, Target, Shield, Menu, X } from "lucide-react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

export default function Investors() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const metrics = [
    { icon: TrendingUp, label: "Revenue Growth", value: "180%", sublabel: "Year over Year" },
    { icon: Users, label: "Active Clients", value: "45+", sublabel: "Enterprise & SMB" },
    { icon: Globe, label: "Live Applications", value: "12+", sublabel: "In Production" },
    { icon: DollarSign, label: "Cost Savings", value: "60%+", sublabel: "vs. Traditional Agencies" },
  ];

  const opportunities = [
    {
      title: "AI-Powered Development",
      description: "Proprietary AI tools that reduce development time by 40%, enabling faster delivery and higher margins.",
      growth: "High Growth Potential"
    },
    {
      title: "SaaS Product Line",
      description: "White-label solutions like Paint Pros and Orbit Staffing generating recurring revenue streams.",
      growth: "Recurring Revenue"
    },
    {
      title: "Blockchain Infrastructure",
      description: "DarkWave Chain - Layer 1 blockchain with DeFi suite, positioned for enterprise adoption.",
      growth: "Emerging Technology"
    },
    {
      title: "Agency Disruption",
      description: "Democratizing premium web development, capturing market share from overpriced traditional agencies.",
      growth: "Market Opportunity"
    },
  ];

  const highlights = [
    "Bootstrap-profitable with no external debt",
    "Strong client retention rate (95%+)",
    "Scalable service model with AI automation",
    "Multiple revenue streams (services + SaaS)",
    "Experienced technical leadership",
    "Growing portfolio of intellectual property"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Investor Relations - Partner with the Future of Web Development"
        description="Investment opportunities at DarkWave Studios. 180% YoY growth, 45+ active clients, AI-powered development, and disrupting the traditional agency model."
        keywords="web development investment, tech startup, agency disruption, AI development company, Nashville startup"
        type="website"
        url="https://darkwavestudios.com/investors"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Investors", url: "https://darkwavestudios.com/investors" }
        ]}
      />
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
          <div className="lg:hidden max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-display text-base font-semibold gradient-text">DarkWave Studios</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors" data-testid="mobile-menu-toggle">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 glass-strong border-t border-white/5 px-4 py-4 pb-20 overflow-y-auto z-50">
              <div className="flex flex-col gap-2">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Home</Link>
                <Link href="/mission" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Our Mission</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Contact</Link>
              </div>
            </div>
          )}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-3 items-center justify-between">
            <Link href="/" className="font-display text-lg font-semibold gradient-text">DarkWave Studios</Link>
            <div className="flex items-center gap-6">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link href="/mission" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Mission</Link>
              <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium">Get Started</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-3 lg:col-span-12">
              <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-5xl font-bold font-display gradient-text" data-testid="investors-title">Investor Relations</h1>
                    <p className="text-muted-foreground">Partner with the future of web development</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  DarkWave Studios is disrupting the traditional agency model by delivering enterprise-quality 
                  web solutions at 60%+ cost savings. We're seeking strategic partners who share our vision 
                  of democratizing premium technology.
                </p>
              </div>
            </div>

            {metrics.map((metric, i) => (
              <div key={i} className="col-span-3 lg:col-span-3">
                <div className="glass-card rounded-xl p-6 h-full text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <metric.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1" data-testid={`metric-${i}`}>{metric.value}</div>
                  <div className="text-sm font-medium">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.sublabel}</div>
                </div>
              </div>
            ))}

            <div className="col-span-3 lg:col-span-12">
              <h2 className="text-2xl font-bold font-display mb-4">Growth Opportunities</h2>
            </div>

            {opportunities.map((opp, i) => (
              <div key={i} className="col-span-3 lg:col-span-6">
                <div className="glass-card rounded-xl p-6 h-full gradient-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">{opp.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{opp.growth}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </div>
              </div>
            ))}

            <div className="col-span-3 lg:col-span-6 mt-4">
              <div className="glass-card rounded-xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold">Investment Highlights</h2>
                </div>
                <div className="space-y-3">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-6 mt-4">
              <div className="glass-card rounded-xl p-6 h-full gradient-border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Get In Touch</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Interested in learning more about investment opportunities? We'd love to discuss how 
                  you can be part of our growth story.
                </p>
                <Link 
                  href="/contact" 
                  className="btn-glow bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium inline-block"
                  data-testid="contact-investors"
                >
                  Schedule a Discussion
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 glass-strong mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <p className="text-muted-foreground text-sm">© 2025 DarkWave Studios. Built with passion.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
