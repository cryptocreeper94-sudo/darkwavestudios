import { Link } from "wouter";
import { useState } from "react";
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
  ChevronRight,
  Copy,
  Check,
  Activity,
  TrendingUp,
  BarChart3,
  Clock,
  Newspaper,
  Mail,
  Megaphone,
  Target,
  Users,
  Building2,
  Wrench,
  Home
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

const developerProducts = [
  {
    id: "agents",
    title: "AI Agent Marketplace",
    description: "Create, deploy, and discover autonomous AI agents. Build trading bots, DeFi agents, NFT snipers, and more.",
    icon: Bot,
    href: "https://dwtl.io/ai-agents",
    external: true,
    gradient: "from-emerald-500 to-teal-500",
    features: ["Agent builder", "Smart contract integration", "Revenue sharing", "Guardian AI certified"]
  },
  {
    id: "guardian",
    title: "Guardian AI",
    description: "AI agent certification platform. Verify autonomous agents meet security, transparency, and reliability standards.",
    icon: Shield,
    href: "https://dwtl.io/guardian-ai",
    external: true,
    gradient: "from-red-500 to-orange-500",
    features: ["Trust score ratings", "Security audits", "Compliance certification", "Public registry"]
  },
  {
    id: "shield",
    title: "Guardian Shield",
    description: "24/7 continuous security monitoring for enterprise applications. Real-time threat detection and response.",
    icon: Shield,
    href: "https://trustshield.tech",
    external: true,
    gradient: "from-violet-500 to-purple-600",
    features: ["Continuous monitoring", "Threat detection", "Enterprise security", "Real-time alerts"]
  },
  {
    id: "hub",
    title: "Trust Layer Hub",
    description: "Blockchain-verified widget marketplace with 60 embeddable components for analytics, booking, lead capture, media editing, AI tools, and more.",
    icon: Boxes,
    href: "/hub",
    gradient: "from-cyan-500 to-blue-600",
    features: ["Live widget previews", "Full source code access", "One-click embed", "API documentation"]
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

const pulseEndpoints = [
  {
    method: "GET",
    path: "/api/ml/stats",
    title: "ML Prediction Stats",
    description: "Returns comprehensive prediction statistics including total predictions, signal distribution, and win rates by time horizon.",
    response: `{
  "totalPredictions": 134937,
  "buySignals": 16629,
  "sellSignals": 39387,
  "holdSignals": 4297,
  "winRates": {
    "1H": 0.68,
    "4H": 0.71,
    "24H": 0.74,
    "7D": 0.65
  }
}`
  },
  {
    method: "GET",
    path: "/api/ml/predictions",
    title: "Recent Predictions",
    description: "Get the latest ML predictions with confidence levels, signals, and supporting data.",
    response: `{
  "predictions": [
    {
      "id": "pred_abc123",
      "asset": "BTC/USD",
      "signal": "BUY",
      "confidence": 0.87,
      "timeframe": "4H",
      "timestamp": "2026-02-02T10:00:00Z"
    }
  ]
}`
  },
  {
    method: "GET",
    path: "/api/ml/performance",
    title: "Model Performance",
    description: "Historical performance metrics and accuracy tracking for the ML models.",
    response: `{
  "accuracy": {
    "overall": 0.72,
    "1day": 0.75,
    "7day": 0.68,
    "30day": 0.71
  },
  "totalVerified": 100000
}`
  }
];

function PulseApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <section className="mb-16 lg:mb-24" data-testid="pulse-api-docs">
      <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold font-display">Pulse API</h2>
            <p className="text-muted-foreground">Quant & Predictive AI Integration</p>
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-4 mb-8 border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Production Base URL</span>
            <button
              onClick={() => copyToClipboard("https://darkwavepulse.com/api", "baseurl")}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              data-testid="copy-base-url"
            >
              {copiedEndpoint === "baseurl" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEndpoint === "baseurl" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="text-amber-400 font-mono text-sm lg:text-base">https://darkwavepulse.com/api</code>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">65-70%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <BarChart3 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">100K+</div>
            <div className="text-sm text-muted-foreground">Predictions Verified</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">Real-time</div>
            <div className="text-sm text-muted-foreground">Data Updates</div>
          </div>
        </div>

        <h3 className="text-xl font-bold font-display mb-4">Available Endpoints</h3>
        
        <div className="space-y-4">
          {pulseEndpoints.map((endpoint) => (
            <div key={endpoint.path} className="bg-black/30 rounded-xl border border-white/10 overflow-hidden" data-testid={`endpoint-${endpoint.path.replace(/\//g, '-')}`}>
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">{endpoint.method}</span>
                  <code className="text-sm font-mono text-white">{endpoint.path}</code>
                  <button
                    onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                    className="ml-auto text-muted-foreground hover:text-white transition-colors"
                    data-testid={`copy-${endpoint.path.replace(/\//g, '-')}`}
                  >
                    {copiedEndpoint === endpoint.path ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <h4 className="font-semibold text-white mb-1">{endpoint.title}</h4>
                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
              </div>
              <div className="p-4 bg-black/40">
                <div className="text-xs text-muted-foreground mb-2">Sample Response</div>
                <pre className="text-xs font-mono text-gray-300 overflow-x-auto"><code>{endpoint.response}</code></pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-400 mb-1">API Access</h4>
              <p className="text-sm text-muted-foreground">
                Pulse API access is available to approved customers. Request access through the{" "}
                <Link href="/hub" className="text-amber-400 hover:underline">Trust Layer Hub</Link> to receive your API credentials and onboarding documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
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

        {/* Pulse API Documentation */}
        <PulseApiDocs />

        {/* Publications & Outreach Directory */}
        <section className="mb-16 lg:mb-24" data-testid="section-publications">
          <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border">
            <div className="text-center mb-8 lg:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
                <Megaphone className="w-3.5 h-3.5" />
                PR & OUTREACH DIRECTORY
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">Publications & Media Outreach</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Target publications for press coverage, product launches, and thought leadership across our ecosystem verticals.
              </p>
            </div>

            <div className="space-y-8">
              {/* Tech & Startup Publications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Tech & Startup Publications</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "TechCrunch", url: "https://techcrunch.com/submit-a-tip/", type: "Tip submission form", pitch: "Full-stack ecosystem with 23 production apps and 2.07M+ lines of code", icon: Zap },
                    { name: "Product Hunt", url: "https://www.producthunt.com/posts/new", type: "Product launch platform", pitch: "Launch Trust Layer Hub, Guardian AI, or Pulse individually for maximum visibility", icon: Target },
                    { name: "Hacker News (Show HN)", url: "https://news.ycombinator.com/submit", type: "Community submission", pitch: "Technical deep-dive on building a 23-app ecosystem as a solo developer", icon: Terminal },
                    { name: "IndieHackers", url: "https://www.indiehackers.com", type: "Community + interviews", pitch: "Indie builder story — solo dev building enterprise-scale ecosystem", icon: Users },
                    { name: "BetaList", url: "https://betalist.com/submit", type: "Startup directory", pitch: "Submit new products for early adopter exposure", icon: Sparkles },
                    { name: "Dev.to", url: "https://dev.to", type: "Developer community", pitch: "Technical articles on architecture, Trust Layer, widget marketplace patterns", icon: Code2 },
                  ].map((pub, i) => (
                    <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300" data-testid={`pub-tech-${i}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <pub.icon className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-sm">{pub.name}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{pub.type}</span>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pub.pitch}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Blockchain & Web3 Publications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Blockchain & Web3 Publications</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "CoinDesk", url: "https://www.coindesk.com/contact/", type: "Press inquiries", pitch: "Trust Layer L1 blockchain, Guardian AI agent certification, Signal digital asset", icon: Shield },
                    { name: "The Block", url: "https://www.theblock.co/contact", type: "News tips", pitch: "First AI agent certification system for crypto — Guardian AI + Trust Shield", icon: Lock },
                    { name: "Decrypt", url: "https://decrypt.co/contact", type: "Story pitches", pitch: "Real-world blockchain utility — 23 apps verified through Trust Layer", icon: Boxes },
                    { name: "CoinTelegraph", url: "https://cointelegraph.com/press-releases", type: "Press releases", pitch: "Proof-of-Authority L1 with DeFi, NFT marketplace, DAO governance", icon: Globe },
                    { name: "Blockchain News", url: "https://www.the-blockchain.com/submit-press-release/", type: "Press release submission", pitch: "Trust Layer ecosystem — wallet, DEX, bridge, staking, explorer", icon: Zap },
                    { name: "NFT Now", url: "https://nftnow.com", type: "NFT/digital asset coverage", pitch: "Signal asset presale, blockchain-verified widget marketplace", icon: Sparkles },
                  ].map((pub, i) => (
                    <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300" data-testid={`pub-crypto-${i}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <pub.icon className="w-4 h-4 text-purple-400" />
                          <span className="font-semibold text-sm">{pub.name}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium">{pub.type}</span>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pub.pitch}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Industry-Specific Publications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Industry-Specific Publications</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Painting Contractor Magazine", url: "https://www.paintmag.com", type: "Trade publication", pitch: "PaintPros.io + TradeWorks AI — 85+ calculators, voice-to-estimate, AI tools for painters", icon: Wrench, color: "amber" },
                    { name: "Staffing Industry Analysts", url: "https://www2.staffingindustry.com", type: "Staffing industry news", pitch: "ORBIT Staffing OS — automated white-label staffing with GPS tracking, payroll, compliance", icon: Users, color: "amber" },
                    { name: "Inman News", url: "https://www.inman.com/contribute/", type: "Real estate tech", pitch: "TrustHome — Expo React Native platform with Voice AI, blockchain doc vault, MLS integration", icon: Home, color: "amber" },
                    { name: "HousingWire", url: "https://www.housingwire.com", type: "Real estate + fintech", pitch: "Blockchain-verified real estate transactions with TrustHome + Trust Layer", icon: Building2, color: "amber" },
                    { name: "QSR Magazine", url: "https://www.qsrmagazine.com", type: "Food service industry", pitch: "TL Driver Connect / Happy Eats — multi-tenant delivery platform with zone ordering", icon: Target, color: "amber" },
                    { name: "Venue Management Association", url: "https://www.iavm.org", type: "Venue operations", pitch: "Orby Commander — stadium/arena command center with emergency response + delivery tracking", icon: Building2, color: "amber" },
                  ].map((pub, i) => (
                    <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300" data-testid={`pub-industry-${i}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <pub.icon className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-sm">{pub.name}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">{pub.type}</span>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pub.pitch}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* SaaS & Developer Platforms */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">SaaS & Developer Platforms</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "SaaStr", url: "https://www.saastr.com", type: "SaaS community + events", pitch: "23-app ecosystem with widget marketplace, subscription model, and AI credits system", icon: TrendingUp },
                    { name: "G2", url: "https://www.g2.com/products/new", type: "Software reviews", pitch: "List PaintPros, ORBIT, and individual products for verified reviews", icon: BarChart3 },
                    { name: "Capterra", url: "https://www.capterra.com/vendors/sign-up", type: "Software directory", pitch: "List trade service tools, staffing software, and real estate platforms", icon: Target },
                    { name: "AppSumo", url: "https://sell.appsumo.com", type: "Lifetime deal marketplace", pitch: "Trust Layer Hub widgets or Pulse API access as a limited-time deal", icon: Zap },
                    { name: "AlternativeTo", url: "https://alternativeto.net/manage-apps/", type: "Software alternative directory", pitch: "Position against competitors — PaintPros vs Jobber, ORBIT vs Bullhorn", icon: Globe },
                    { name: "StackShare", url: "https://stackshare.io", type: "Tech stack community", pitch: "Showcase the full ecosystem tech stack — great for developer credibility", icon: Boxes },
                  ].map((pub, i) => (
                    <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300" data-testid={`pub-saas-${i}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <pub.icon className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-sm">{pub.name}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{pub.type}</span>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pub.pitch}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Outreach Tips */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Outreach Best Practices</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">1</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Lead with the story — solo developer building a 23-app, 2.07M+ line ecosystem is compelling and rare</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">2</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Pitch one product per publication — don't overwhelm. Match the product to the publication's audience</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">3</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Product Hunt launches work best on Tuesday–Thursday. Prepare assets, GIFs, and a maker comment in advance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">4</span>
                      </div>
                      <p className="text-sm text-muted-foreground">For trade publications, offer to write a guest article — position yourself as a tech expert solving industry problems</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">5</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Include live demo links and the Ecosystem Metrics page — real numbers build credibility instantly</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">6</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Follow up once after 5–7 days. Keep pitches under 200 words. Journalists are busy — make it easy to say yes</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground">
                    Contact for all press inquiries: <span className="text-primary font-semibold">team@dwsc.io</span>
                  </p>
                </div>
              </div>
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
