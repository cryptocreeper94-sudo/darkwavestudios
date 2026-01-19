import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Target, Sparkles, Rocket, Heart, Globe, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

export default function Mission() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data } = useQuery<{ document: { content: string; title: string } }>({
    queryKey: ["/api/documents/executive-summary"],
  });

  const defaultContent = {
    vision: "To democratize premium web development by providing agency-quality solutions at accessible prices, empowering entrepreneurs and businesses to compete with larger enterprises through cutting-edge technology.",
    mission: "DarkWave Studios exists to bridge the gap between enterprise-level web solutions and small-to-medium businesses. We believe that every business deserves access to powerful, modern web applications without the traditional agency markup.",
    values: [
      { icon: Heart, title: "Client-First Approach", description: "Every decision starts with what's best for you. No upselling, no unnecessary features—just solutions that work." },
      { icon: Rocket, title: "Innovation at Core", description: "We leverage AI, automation, and cutting-edge frameworks to deliver solutions that stay ahead of the curve." },
      { icon: Shield, title: "Transparency Always", description: "Clear pricing, honest timelines, and direct communication. No hidden fees or surprise charges." },
      { icon: Globe, title: "Unlimited Support", description: "Your success is our success. We provide ongoing support without nickel-and-diming for every small request." },
    ],
    goals: [
      "Launch 100+ successful client applications by 2026",
      "Maintain 95%+ client satisfaction rating",
      "Expand AI-powered development tools for faster delivery",
      "Build a community of entrepreneurs who thrive with our solutions"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Our Mission - Democratizing Premium Web Development"
        description="Learn about DarkWave Studios' mission to deliver agency-quality web solutions at accessible prices. Our vision, values, and commitment to client success."
        keywords="web development mission, company values, affordable web development, client-first approach, Nashville web agency"
        type="website"
        url="https://darkwavestudios.com/mission"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Our Mission", url: "https://darkwavestudios.com/mission" }
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
            <Link href="/" className="font-display text-base font-semibold gradient-text">DarkWave</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors" data-testid="mobile-menu-toggle">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden glass-strong border-t border-white/5 px-4 py-4">
              <div className="flex flex-col gap-2">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Home</Link>
                <Link href="/investors" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Investors</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Contact</Link>
              </div>
            </div>
          )}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-3 items-center justify-between">
            <Link href="/" className="font-display text-lg font-semibold gradient-text">DarkWave Studios</Link>
            <div className="flex items-center gap-6">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link href="/investors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investors</Link>
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
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-5xl font-bold font-display gradient-text" data-testid="mission-title">Our Mission</h1>
                    <p className="text-muted-foreground">What drives DarkWave Studios forward</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-6">
              <div className="glass-card rounded-xl p-6 h-full gradient-border">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold">Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="vision-text">
                  {data?.document?.content ? JSON.parse(data.document.content).vision : defaultContent.vision}
                </p>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-6">
              <div className="glass-card rounded-xl p-6 h-full gradient-border">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Mission Statement</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="mission-text">
                  {data?.document?.content ? JSON.parse(data.document.content).mission : defaultContent.mission}
                </p>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-12">
              <h2 className="text-2xl font-bold font-display mb-4">Our Core Values</h2>
            </div>

            {defaultContent.values.map((value, i) => (
              <div key={i} className="col-span-3 lg:col-span-3">
                <div className="glass-card rounded-xl p-6 h-full hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}

            <div className="col-span-3 lg:col-span-12 mt-4">
              <div className="glass-card rounded-xl p-6 gradient-border">
                <h2 className="text-xl font-bold mb-4">Strategic Goals</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {defaultContent.goals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
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
