import { Link } from "wouter";
import { 
  Code2, 
  Shield, 
  Boxes, 
  Terminal, 
  ExternalLink, 
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Bot,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

const developerProducts = [
  {
    id: "hub",
    title: "Trust Layer Hub",
    description: "Blockchain-verified widget marketplace with 12+ embeddable components for analytics, booking, lead capture, and more.",
    icon: Boxes,
    href: "/hub",
    gradient: "from-cyan-500 to-blue-600",
    features: ["Live widget previews", "Full source code access", "One-click embed", "API documentation"]
  },
  {
    id: "guardian",
    title: "Guardian AI",
    description: "AI agent certification platform. Verify autonomous agents meet security, transparency, and reliability standards.",
    icon: Shield,
    href: "/guardian-ai",
    gradient: "from-red-500 to-orange-500",
    features: ["Trust score ratings", "Security audits", "Compliance certification", "Public registry"]
  },
  {
    id: "studio",
    title: "Studio IDE",
    description: "Integrated development environment for building, testing, and deploying Trust Layer widgets and applications.",
    icon: Terminal,
    href: "https://dwtl.io/studio",
    external: true,
    gradient: "from-purple-500 to-pink-500",
    features: ["Visual builder", "Code editor", "Live preview", "One-click deploy"]
  }
];

const apiFeatures = [
  { icon: Zap, title: "REST APIs", description: "Simple, well-documented RESTful endpoints" },
  { icon: Lock, title: "Secure Auth", description: "API key authentication with rate limiting" },
  { icon: Globe, title: "Webhooks", description: "Real-time event notifications" },
  { icon: Bot, title: "AI Integration", description: "GPT-4o powered content generation" },
];

export default function Developers() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Developers - DarkWave Studios"
        description="Developer tools and APIs for building with DarkWave Studios. Access Trust Layer widgets, Guardian AI certification, and Studio IDE."
        keywords="developer tools, API, widgets, embeddable components, AI certification, web development SDK"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Developers", url: "https://darkwavestudios.io/developers" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)] -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="font-display text-lg lg:text-xl font-bold">Developer Hub</span>
            </div>
          </div>
          <Link 
            href="/hub"
            className="btn-glow bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            data-testid="button-browse-widgets"
          >
            Browse Widgets
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        {/* Hero */}
        <section className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-6" data-testid="badge-developer-tools">
            <Sparkles className="w-4 h-4" />
            Developer Tools & APIs
          </div>
          
          <h1 className="font-display font-bold text-4xl lg:text-6xl mb-6" data-testid="text-hero-title">
            Build with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              DarkWave
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access our suite of developer tools, embeddable widgets, and APIs to enhance your applications with battle-tested, production-ready components.
          </p>
        </section>

        {/* Products Grid */}
        <section className="mb-16 lg:mb-24">
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-center mb-8 lg:mb-12">
            Developer Products
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {developerProducts.map((product) => (
              <div key={product.id} className="glass-card rounded-2xl p-6 lg:p-8 hover-lift gradient-border group" data-testid={`card-product-${product.id}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <product.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-bold font-display mb-3">{product.title}</h3>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {product.external ? (
                  <a 
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${product.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                    data-testid={`link-${product.id}`}
                  >
                    Open Studio <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <Link 
                    href={product.href}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${product.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                    data-testid={`link-${product.id}`}
                  >
                    Explore <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* API Features */}
        <section className="mb-16 lg:mb-24">
          <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">API Capabilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Integrate DarkWave services into your applications with our comprehensive API suite.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiFeatures.map((feature, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white/5" data-testid={`card-api-feature-${i}`}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">Ready to Build?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Start integrating DarkWave widgets into your projects today. Browse our marketplace or contact us for custom solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/hub"
                className="btn-glow inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-cta-widgets"
              >
                Browse Widgets <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                data-testid="button-cta-contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} DarkWave Studios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
