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
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  BadgeCheck,
  Loader2,
  XCircle,
  CheckCircle2,
  Scan,
  ExternalLink,
  Rocket
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

interface ScanResult {
  securityScore: number;
  transparencyScore: number;
  reliabilityScore: number;
  complianceScore: number;
  overallScore: number;
  grade: string;
  riskLevel: string;
  findings: string[];
  recommendations: string[];
  summary: string;
}

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

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getGradeColor(grade: string) {
  if (grade === "A") return "from-green-500 to-emerald-500";
  if (grade === "B") return "from-blue-500 to-cyan-500";
  if (grade === "C") return "from-yellow-500 to-orange-500";
  if (grade === "D") return "from-orange-500 to-red-500";
  return "from-red-600 to-red-800";
}

function getRiskBadge(risk: string) {
  if (risk === "Low") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (risk === "Moderate") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (risk === "Elevated") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (risk === "High") return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-red-600/20 text-red-300 border-red-600/30";
}

export default function GuardianAI() {
  const { toast } = useToast();
  const [scanData, setScanData] = useState({ agentName: "", agentUrl: "", contactEmail: "" });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanPhase, setScanPhase] = useState("");

  const [formData, setFormData] = useState({
    agentName: "",
    agentUrl: "",
    contactEmail: "",
    tier: "Advanced",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanData.agentName || !scanData.agentUrl) return;
    
    setScanning(true);
    setScanResult(null);

    const phases = [
      "Initializing Guardian AI scan engine...",
      "Resolving agent endpoint...",
      "Analyzing smart contract patterns...",
      "Checking for honeypot signatures...",
      "Evaluating wallet permissions...",
      "Running rug pull detection...",
      "Scanning for malicious code patterns...",
      "Verifying ownership & authority...",
      "Computing trust scores...",
      "Generating security report..."
    ];

    let phaseIndex = 0;
    const phaseInterval = setInterval(() => {
      if (phaseIndex < phases.length) {
        setScanPhase(phases[phaseIndex]);
        phaseIndex++;
      }
    }, 1200);

    try {
      const res = await fetch("/api/guardian/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scanData)
      });
      
      clearInterval(phaseInterval);
      
      if (res.ok) {
        const data = await res.json();
        setScanPhase("Scan complete!");
        setTimeout(() => {
          setScanResult(data.scan);
          setScanPhase("");
        }, 500);
      } else {
        toast({
          title: "Scan Failed",
          description: "Unable to complete the security scan. Please try again.",
          variant: "destructive"
        });
        setScanPhase("");
      }
    } catch {
      clearInterval(phaseInterval);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
      setScanPhase("");
    }
    setScanning(false);
  };

  const handleCertificationSubmit = async (e: React.FormEvent) => {
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
        toast({
          title: "Submission Failed",
          description: "Please check your information and try again.",
          variant: "destructive"
        });
      }
    } catch {
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
        title="Guardian AI - AI Agent Security Scanner & Certification"
        description="Scan and verify AI agents on the blockchain. Guardian AI detects scams, honeypots, and fraudulent bots. Get your legitimate AI agent certified with Guardian AI Trust Shield."
        keywords="AI agent scanner, crypto bot verification, blockchain AI certification, scam detection, honeypot scanner, AI agent audit, Guardian AI"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Guardian AI", url: "https://darkwavestudios.io/guardian-ai" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-red-500/5 via-background to-purple-500/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back">
              <ChevronRight className="w-5 h-5 rotate-180" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg lg:text-xl">
                  <span className="text-red-400">Guardian</span> AI
                </h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">AI Agent Security Scanner</p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-4 lg:gap-6">
            <Link href="/guardian-ai-registry" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden lg:block" data-testid="link-registry-nav">
              Certified Registry
            </Link>
            <a href="#scan" className="btn-glow bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors" data-testid="button-scan-nav">
              Scan Agent
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        {/* Hero */}
        <section className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            The Trust Crisis in AI Agents
          </div>
          
          <h1 className="font-display font-bold text-4xl lg:text-6xl xl:text-7xl mb-6 leading-tight" data-testid="text-hero-title">
            Is That AI Bot
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Legit or a Scam?
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-hero-subtitle">
            21,000+ AI agent tokens launched last month. Most are untested. 
            Guardian AI scans blockchain-deployed bots to verify they're legitimate, safe, and not fraudulent.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a 
              href="#scan"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
              data-testid="button-hero-scan"
            >
              <Scan className="w-5 h-5" /> Scan an AI Agent
            </a>
            <a 
              href="https://dwsc.io/ai-agents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
              data-testid="link-hero-create-agent"
            >
              <Rocket className="w-5 h-5" /> Create an AI Agent <ExternalLink className="w-4 h-4" />
            </a>
            <Link 
              href="/guardian-ai-registry"
              className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              data-testid="link-hero-registry"
            >
              <Search className="w-5 h-5" /> Certified Registry
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mb-12" data-testid="text-hero-create-hint">
            Don't have an AI agent yet?{" "}
            <a 
              href="https://dwsc.io/ai-agents" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
              data-testid="link-hero-create-inline"
            >
              Build and train one at our AI Agent Marketplace
            </a>{" "}
            — then come back here to scan and certify it.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4 lg:p-6 text-center" data-testid={`stat-${i}`}>
                <div className="text-2xl lg:text-3xl font-bold font-display text-red-400 mb-1">{stat.value}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SCANNER SECTION */}
        <section className="mb-16 lg:mb-24" id="scan">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-4">
              <Scan className="w-4 h-4" aria-hidden="true" />
              Free AI Agent Scanner
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-5xl mb-4" data-testid="text-scanner-heading">
              Guardian AI <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Security Scan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Paste any AI agent's URL or contract address. Our AI analyzes it for scam indicators, 
              honeypot patterns, rug pull risks, and fraudulent behavior.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm" data-testid="banner-create-agent">
              <Rocket className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-muted-foreground">Want to create your own AI agent?</span>
              <a 
                href="https://dwsc.io/ai-agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                data-testid="link-scanner-create-agent"
              >
                Build & Train at DW Agent Marketplace <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-10 gradient-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
              <div className="relative z-10">
                <form onSubmit={handleScan} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Agent / Bot Name *</label>
                      <input
                        type="text"
                        required
                        value={scanData.agentName}
                        onChange={e => setScanData(prev => ({ ...prev, agentName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
                        placeholder="e.g., AutoTrader Pro, YieldBot X"
                        disabled={scanning}
                        data-testid="input-scan-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL or Contract Address *</label>
                      <input
                        type="text"
                        required
                        value={scanData.agentUrl}
                        onChange={e => setScanData(prev => ({ ...prev, agentUrl: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors font-mono text-sm"
                        placeholder="https://... or 0x..."
                        disabled={scanning}
                        data-testid="input-scan-url"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email (optional - for scan report)</label>
                    <input
                      type="email"
                      value={scanData.contactEmail}
                      onChange={e => setScanData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                      disabled={scanning}
                      data-testid="input-scan-email"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={scanning}
                    className="w-full btn-glow bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
                    data-testid="button-run-scan"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5" />
                        Run Guardian AI Scan
                      </>
                    )}
                  </button>
                </form>

                {scanning && scanPhase && (
                  <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20" data-testid="scan-progress">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Shield className="w-8 h-8 text-cyan-400" />
                        <div className="absolute inset-0 animate-ping">
                          <Shield className="w-8 h-8 text-cyan-400 opacity-30" />
                        </div>
                      </div>
                      <div>
                        <p className="text-cyan-400 font-mono text-sm">{scanPhase}</p>
                        <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SCAN RESULTS */}
            {scanResult && (
              <div className="mt-8 space-y-6" data-testid="scan-results">
                <div className="glass-card rounded-2xl p-6 lg:p-8 gradient-border">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-display font-bold text-xl lg:text-2xl mb-1" data-testid="text-scan-result-title">
                        Scan Report: {scanData.agentName}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">{scanData.agentUrl}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(scanResult.riskLevel)}`} data-testid="text-risk-level">
                        {scanResult.riskLevel} Risk
                      </span>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradeColor(scanResult.grade)} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white" data-testid="text-grade">{scanResult.grade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="text-center mb-6 p-4 rounded-xl bg-white/5">
                    <div className={`text-5xl font-bold font-display ${getScoreColor(scanResult.overallScore)}`} data-testid="text-overall-score">
                      {scanResult.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Overall Trust Score</div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Security", score: scanResult.securityScore, icon: Lock, color: "text-red-400" },
                      { label: "Transparency", score: scanResult.transparencyScore, icon: Eye, color: "text-blue-400" },
                      { label: "Reliability", score: scanResult.reliabilityScore, icon: Activity, color: "text-green-400" },
                      { label: "Compliance", score: scanResult.complianceScore, icon: FileCheck, color: "text-purple-400" },
                    ].map((metric, i) => {
                      const Icon = metric.icon;
                      return (
                        <div key={i} className="text-center p-4 rounded-xl bg-white/5" data-testid={`score-${metric.label.toLowerCase()}`}>
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} aria-hidden="true" />
                          <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>{metric.score}</div>
                          <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${metric.score >= 80 ? 'bg-green-400' : metric.score >= 60 ? 'bg-yellow-400' : metric.score >= 40 ? 'bg-orange-400' : 'bg-red-400'}`}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  {scanResult.summary && (
                    <div className="p-4 rounded-xl bg-white/5 mb-6" data-testid="text-summary">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Executive Summary
                      </h4>
                      <p className="text-sm text-muted-foreground">{scanResult.summary}</p>
                    </div>
                  )}

                  {/* Findings */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Search className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Security Findings
                      </h4>
                      <ul className="space-y-2">
                        {(scanResult.findings || []).map((finding, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`finding-${i}`}>
                            {finding.toLowerCase().includes("no ") || finding.toLowerCase().includes("secure") || finding.toLowerCase().includes("verified") || finding.toLowerCase().includes("legitimate") || finding.toLowerCase().includes("positive") ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            )}
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-400" aria-hidden="true" /> Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {(scanResult.recommendations || []).map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`recommendation-${i}`}>
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Certification CTA in results */}
                  {scanResult.overallScore >= 60 && (
                    <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                      <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-green-400 font-semibold mb-1">This agent may qualify for Guardian AI Certification</p>
                      <p className="text-sm text-muted-foreground mb-3">Get officially certified and listed in the trusted registry</p>
                      <a href="#certify" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors" data-testid="button-qualify-certify">
                        Apply for Certification <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {scanResult.overallScore < 60 && (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                      <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-red-400 font-semibold mb-1">This agent has significant security concerns</p>
                      <p className="text-sm text-muted-foreground">We recommend addressing the findings above before deploying. Contact us for a full audit.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setScanResult(null); setScanData({ agentName: "", agentUrl: "", contactEmail: "" }); }}
                  className="w-full glass py-3 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm"
                  data-testid="button-new-scan"
                >
                  Run Another Scan
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Problem Section */}
        <section className="mb-16 lg:mb-24">
          <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-12 gradient-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
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
                        <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                      <Bot className="w-24 h-24 lg:w-32 lg:h-32 text-red-400/50" aria-hidden="true" />
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

        {/* Solution / How It Works */}
        <section className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              The Solution
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-5xl mb-4">
              Scan. Verify. <span className="gradient-text">Certify.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guardian AI scans AI agents for scams, honeypots, rug pulls, and fraud. 
              Legitimate agents earn certification and join the trusted registry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {trustMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="glass-card rounded-xl p-6 hover-lift gradient-border">
                  <Icon className={`w-10 h-10 ${metric.color} mb-4`} aria-hidden="true" />
                  <h3 className="font-bold text-lg mb-2">{metric.name}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl p-6 lg:p-10">
            <h3 className="font-display font-bold text-xl lg:text-2xl mb-8 text-center">How Guardian AI Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Submit", desc: "Paste your AI agent's URL or contract address", icon: Bot },
                { step: "2", title: "Scan", desc: "Guardian AI analyzes for scams, honeypots, and fraud", icon: Scan },
                { step: "3", title: "Score", desc: "Get trust scores across security, transparency, reliability, and compliance", icon: Activity },
                { step: "4", title: "Certify", desc: "Legitimate agents earn certification and registry listing", icon: BadgeCheck }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="w-8 h-8 text-green-400" aria-hidden="true" />
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

        {/* Certification Tiers */}
        <section className="mb-16 lg:mb-24" id="certify">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl lg:text-5xl mb-4">
              Certification <span className="gradient-text">Tiers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passed the scan? Get officially certified and listed in the Guardian AI trusted registry.
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
                  <Shield className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" aria-hidden="true" /> {tier.duration}</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4" aria-hidden="true" /> Valid {tier.validity}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
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
                  data-testid={`button-select-tier-${tier.name.toLowerCase()}`}
                >
                  {formData.tier === tier.name ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Certification Form */}
          <div className="glass-card rounded-2xl p-6 lg:p-10 gradient-border max-w-2xl mx-auto">
            <h3 className="font-display font-bold text-xl lg:text-2xl mb-6 text-center">
              Apply for Guardian AI Certification
            </h3>
            <form onSubmit={handleCertificationSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agent / Bot Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.agentName}
                    onChange={e => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g., TradingBot Pro"
                    data-testid="input-cert-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL / Contract Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.agentUrl}
                    onChange={e => setFormData(prev => ({ ...prev, agentUrl: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://... or 0x..."
                    data-testid="input-cert-url"
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
                  data-testid="input-cert-email"
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
                  placeholder="Tell us about your AI agent, what it does, which blockchain it's on..."
                  data-testid="textarea-cert-description"
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

        {/* CTA */}
        <section>
          <div className="glass-card rounded-2xl lg:rounded-3xl p-8 lg:p-12 gradient-border text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10" />
            <div className="relative z-10">
              <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-6" aria-hidden="true" />
              <h2 className="font-display font-bold text-2xl lg:text-4xl mb-4">
                Don't Trust. Verify.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Guardian AI certified agents see 3x higher adoption rates. 
                Protect your users and prove your bot is legitimate.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#scan"
                  className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  data-testid="button-cta-scan"
                >
                  <Scan className="w-5 h-5" /> Scan an Agent
                </a>
                <Link 
                  href="/guardian-ai-registry"
                  className="inline-flex items-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                  data-testid="link-cta-registry"
                >
                  <Search className="w-5 h-5" /> Browse Registry
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
