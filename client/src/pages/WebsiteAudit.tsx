import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Zap, 
  Smartphone, 
  Shield, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  ArrowRight,
  Gauge,
  Eye,
  Lock,
  FileText,
  Share2,
  ArrowLeft
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";

interface AuditResult {
  url: string;
  scores: {
    performance: number;
    seo: number;
    mobile: number;
    security: number;
    accessibility: number;
  };
  issues: {
    critical: string[];
    warnings: string[];
    passed: string[];
  };
  recommendations: string[];
  loadTime: string;
  pageSize: string;
}

export default function WebsiteAudit() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/website-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        setShowEmailCapture(true);
      } else {
        setError(data.error || "Failed to analyze website");
      }
    } catch (err) {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Website Audit User",
          email,
          message: `Website Audit for: ${url}`,
          source: "website_audit",
          projectType: "Website Optimization"
        })
      });
      setEmailSubmitted(true);
    } catch (err) {
      console.error("Failed to save lead");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5";
    if (score >= 50) return "from-yellow-500/20 to-yellow-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Free Website Audit Tool"
        description="Get an instant free analysis of your website's performance, SEO, mobile-friendliness, and security. See exactly what's holding your site back."
        keywords="website audit, free SEO checker, site speed test, mobile friendly test, website analyzer"
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave Studios
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="/quote" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Get Quote</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Contact Us
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Gauge className="w-4 h-4" />
            Free Instant Analysis
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Free Website <span className="gradient-text">Audit Tool</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your website URL and get an instant analysis of performance, SEO, mobile-friendliness, and security. See exactly what's holding your site back.
          </p>
        </div>

        {/* Audit Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleAudit} className="glass-card rounded-2xl p-6 lg:p-8 gradient-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  required
                  data-testid="input-url"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-glow bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="button-analyze"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Score Overview */}
            <div className="glass-card rounded-2xl p-6 lg:p-8 gradient-border">
              <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Audit Results for {result.url}
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Performance", score: result.scores.performance, icon: Zap },
                  { label: "SEO", score: result.scores.seo, icon: Search },
                  { label: "Mobile", score: result.scores.mobile, icon: Smartphone },
                  { label: "Security", score: result.scores.security, icon: Shield },
                  { label: "Accessibility", score: result.scores.accessibility, icon: Eye },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl p-4 bg-gradient-to-b ${getScoreBg(item.score)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Quick Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Load Time</span>
                      <span className="font-medium">{result.loadTime}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Page Size</span>
                      <span className="font-medium">{result.pageSize}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Security Status
                  </h3>
                  <div className="space-y-2">
                    {result.issues.passed.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Issues & Recommendations */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 gradient-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Issues Found
                </h3>
                <div className="space-y-3">
                  {result.issues.critical.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                  {result.issues.warnings.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 gradient-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Capture */}
            {showEmailCapture && !emailSubmitted && (
              <div className="glass-card rounded-2xl p-6 lg:p-8 gradient-border bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="text-center max-w-xl mx-auto">
                  <h3 className="text-xl font-bold font-display mb-2">
                    Want a detailed report?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your email and we'll send you a comprehensive analysis with actionable fixes.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                      required
                      data-testid="input-email"
                    />
                    <button
                      type="submit"
                      className="btn-glow bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold"
                      data-testid="button-get-report"
                    >
                      Get Full Report
                    </button>
                  </form>
                </div>
              </div>
            )}

            {emailSubmitted && (
              <div className="glass-card rounded-2xl p-6 text-center gradient-border">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Report Sent!</h3>
                <p className="text-muted-foreground">Check your inbox for the detailed analysis.</p>
              </div>
            )}

            {/* CTA */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">
                Need help fixing these issues? We can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quote" className="btn-glow bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2">
                  Get a Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/book" className="glass-card px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!result && (
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: Zap,
                title: "Performance Analysis",
                description: "Check load times, page speed, and optimization opportunities."
              },
              {
                icon: Search,
                title: "SEO Score",
                description: "See how search engine friendly your site is with actionable tips."
              },
              {
                icon: Smartphone,
                title: "Mobile Check",
                description: "Ensure your site looks great on all devices and screen sizes."
              },
              {
                icon: Shield,
                title: "Security Scan",
                description: "Identify SSL issues, vulnerabilities, and security best practices."
              },
              {
                icon: Eye,
                title: "Accessibility",
                description: "Check if your site is accessible to all users."
              },
              {
                icon: Share2,
                title: "Social Preview",
                description: "See how your site appears when shared on social media."
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-xl p-6 gradient-border">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
