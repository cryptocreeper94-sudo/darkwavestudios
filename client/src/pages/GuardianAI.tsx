import { useState } from "react";
import { Link } from "wouter";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Bot, 
  Lock, 
  Eye, 
  Activity, 
  FileCheck,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Search,
  Clock,
  Award,
  Star,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Users,
  BadgeCheck
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

const certificationTiers = [
  {
    name: "Basic",
    price: "$999",
    duration: "3-5 days",
    validity: "6 months",
    color: "from-blue-500 to-cyan-500",
    features: [
      "Automated security analysis",
      "Basic vulnerability scan",
      "Guardian AI Registry listing",
      "Certified badge for your agent",
      "Trust score report",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Advanced",
    price: "$4,999",
    duration: "1-2 weeks",
    validity: "12 months",
    color: "from-purple-500 to-pink-500",
    features: [
      "Everything in Basic",
      "Deep code review by experts",
      "API security audit",
      "Attack simulation testing",
      "Priority listing in registry",
      "Priority support",
      "Quarterly re-verification",
      "Trust score breakdown"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$14,999",
    duration: "3-4 weeks",
    validity: "24 months",
    color: "from-amber-500 to-orange-500",
    features: [
      "Everything in Advanced",
      "Full penetration testing",
      "Formal verification",
      "Guardian Shield 24/7 monitoring",
      "Dedicated account manager",
      "Custom compliance reports",
      "White-label certification",
      "Featured registry placement",
      "Marketing co-promotion"
    ],
    popular: false
  }
];

const trustMetrics = [
  {
    name: "Security Score",
    icon: Lock,
    description: "Code integrity, vulnerabilities, access control, wallet safety",
    color: "text-red-400"
  },
  {
    name: "Transparency Score", 
    icon: Eye,
    description: "Open source status, documentation quality, audit history",
    color: "text-blue-400"
  },
  {
    name: "Reliability Score",
    icon: Activity,
    description: "Uptime metrics, error handling, edge case coverage",
    color: "text-green-400"
  },
  {
    name: "Compliance Score",
    icon: FileCheck,
    description: "Regulatory alignment, data handling, consent mechanisms",
    color: "text-purple-400"
  }
];

const stats = [
  { value: "21,000+", label: "AI Agent Tokens Launched (Nov 2024)" },
  { value: "$50B+", label: "AI Crypto Market Cap" },
  { value: "1M+", label: "Projected Agents by 2025" },
  { value: "0", label: "Industry Certification Standards" }
];

export default function GuardianAI() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    agentName: "",
    agentUrl: "",
    contactEmail: "",
    tier: "Advanced",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.agentName,
          email: formData.contactEmail,
          company: formData.agentUrl,
          message: `Guardian AI Certification Request\nTier: ${formData.tier}\nAgent: ${formData.agentName}\nURL: ${formData.agentUrl}\n\n${formData.description}`,
          source: "guardian-ai"
        })
      });
      
      if (res.ok) {
        toast({
          title: "Certification Request Submitted",
          description: "Our team will review your agent and contact you within 24 hours."
        });
        setFormData({ agentName: "", agentUrl: "", contactEmail: "", tier: "Advanced", description: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        toast({
          title: "Submission Failed",
          description: data.message || "Please check your information and try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Guardian AI - The First Certification System for AI Agents in Crypto"
        description="Verify AI agent safety before trusting them with your wallet. Guardian AI provides comprehensive security certification for autonomous AI agents in the crypto ecosystem."
        keywords="AI agent certification, crypto AI security, bot verification, autonomous agent audit, AI safety, blockchain AI"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Guardian AI", url: "https://darkwavestudios.io/guardian-ai" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-red-500/5 via-background to-purple-500/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)] -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg lg:text-xl">
                  <span className="text-red-400">Guardian</span> AI
                </h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">Trust Layer Certification</p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-4 lg:gap-6">
            <Link href="/guardian-ai-registry" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden lg:block" data-testid="link-registry-nav">
              View Registry
            </Link>
            <a href="#certify" className="btn-glow bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors" data-testid="button-get-certified-nav">
              Get Certified
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
            <ShieldAlert className="w-4 h-4" />
            The Trust Crisis in AI Agents
          </div>
          
          <h1 className="font-display font-bold text-4xl lg:text-6xl xl:text-7xl mb-6 leading-tight" data-testid="text-hero-title">
            Before You Trust an AI Bot,
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Verify It's Safe
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            21,000+ AI agent tokens launched last month alone. How many were safe? 
            Guardian AI is the world's first certification system for autonomous AI agents in crypto.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a 
              href="#certify"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
              data-testid="button-hero-certify"
            >
              Get Your Agent Certified <ArrowRight className="w-5 h-5" />
            </a>
            <Link 
              href="/guardian-ai-registry"
              className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              data-testid="link-hero-registry"
            >
              <Search className="w-5 h-5" /> Search Registry
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4 lg:p-6 text-center">
                <div className="text-2xl lg:text-3xl font-bold font-display text-red-400 mb-1">{stat.value}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem Section */}
        <section className="mb-16 lg:mb-24">
          <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-12 gradient-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <h2 className="font-display font-bold text-2xl lg:text-4xl">The Problem</h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-muted-foreground mb-6">
                    AI agents can access your wallet, execute trades, and manage your funds autonomously. 
                    But there's <span className="text-red-400 font-semibold">no way to verify which agents are safe</span>.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Malicious bots can drain wallets instantly",
                      "Fake agents impersonate legitimate projects",
                      "No audit standards for AI agent code",
                      "Users have zero visibility into agent behavior",
                      "One wrong approval = total fund loss"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                      <Bot className="w-24 h-24 lg:w-32 lg:h-32 text-red-400/50" />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      UNVERIFIED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              The Solution
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-5xl mb-4">
              Guardian AI <span className="gradient-text">Certification</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security certification for AI agents. Trust scores, on-chain verification, and public registry.
            </p>
          </div>

          {/* Trust Score Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {trustMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="glass-card rounded-xl p-6 hover-lift gradient-border">
                  <Icon className={`w-10 h-10 ${metric.color} mb-4`} />
                  <h3 className="font-bold text-lg mb-2">{metric.name}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              );
            })}
          </div>

          {/* How It Works */}
          <div className="glass-card rounded-2xl p-6 lg:p-10">
            <h3 className="font-display font-bold text-xl lg:text-2xl mb-8 text-center">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Submit", desc: "Submit your AI agent for review with code access", icon: Bot },
                { step: "2", title: "Analyze", desc: "Our team conducts comprehensive security analysis", icon: Search },
                { step: "3", title: "Score", desc: "Receive trust scores across 4 key dimensions", icon: Activity },
                { step: "4", title: "Certify", desc: "Get listed in the Guardian AI Registry", icon: BadgeCheck }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="w-8 h-8 text-green-400" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.step}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="mb-16 lg:mb-24" id="certify">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl lg:text-5xl mb-4">
              Certification <span className="gradient-text">Tiers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the level of verification that matches your agent's needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {certificationTiers.map((tier, i) => (
              <div 
                key={i}
                className={`glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {tier.duration}</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4" /> Valid {tier.validity}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, tier: tier.name }))}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    formData.tier === tier.name
                      ? `bg-gradient-to-r ${tier.color} text-white`
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  {formData.tier === tier.name ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Submission Form */}
          <div className="glass-card rounded-2xl p-6 lg:p-10 gradient-border max-w-2xl mx-auto">
            <h3 className="font-display font-bold text-xl lg:text-2xl mb-6 text-center">
              Submit Your Agent for Certification
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agent Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.agentName}
                    onChange={e => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g., TradingBot Pro"
                    data-testid="input-agent-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Agent URL / Contract *</label>
                  <input
                    type="text"
                    required
                    value={formData.agentUrl}
                    onChange={e => setFormData(prev => ({ ...prev, agentUrl: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://... or 0x..."
                    data-testid="input-agent-url"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  data-testid="input-contact-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Selected Tier</label>
                <div className="flex gap-2">
                  {certificationTiers.map(tier => (
                    <button
                      key={tier.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tier: tier.name }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.tier === tier.name
                          ? `bg-gradient-to-r ${tier.color} text-white`
                          : 'glass hover:bg-white/10'
                      }`}
                      data-testid={`button-tier-${tier.name.toLowerCase()}`}
                    >
                      {tier.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your AI agent, its functionality, and any specific concerns..."
                  data-testid="textarea-description"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-glow bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                data-testid="button-submit-certification"
              >
                {submitting ? "Submitting..." : "Request Certification"}
              </button>
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10" />
            <div className="relative z-10">
              <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="font-display font-bold text-2xl lg:text-4xl mb-4">
                The Future of AI Agent Trust
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join the growing ecosystem of verified, trusted AI agents. 
                Guardian AI certified agents see 3x higher adoption rates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/guardian-ai-registry"
                  className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Search className="w-5 h-5" /> Browse Registry
                </Link>
                <Link 
                  href="/hub"
                  className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Zap className="w-5 h-5" /> Trust Layer Hub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="font-display font-bold">Guardian AI</span>
          </div>
          <div className="text-muted-foreground text-sm">Powered by DarkWave Trust Layer</div>
        </div>
      </footer>
    </div>
  );
}
