import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Code2, 
  Download, 
  Heart, 
  ExternalLink, 
  Search, 
  Shield, 
  Zap, 
  Globe, 
  Copy,
  Check,
  ChevronRight,
  Layers,
  Box,
  Terminal,
  Sparkles,
  Lock,
  Activity,
  Menu,
  X
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface EcosystemApp {
  id: string;
  appName: string;
  displayName: string;
  description: string;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  authorName: string;
  version: string;
  downloads: number;
  likes: number;
  isPublic: boolean;
  isPremium: boolean;
  price: string | null;
}

interface HubStats {
  totalApps: number;
  totalSnippets: number;
  totalDownloads: number;
}

const categories = [
  { id: "all", name: "All", icon: Layers },
  { id: "components", name: "Components", icon: Box },
  { id: "utilities", name: "Utilities", icon: Terminal },
  { id: "hooks", name: "Hooks", icon: Code2 },
  { id: "api", name: "API", icon: Globe },
  { id: "auth", name: "Auth", icon: Lock },
];

export default function TrustLayerHub() {
  const [apps, setApps] = useState<EcosystemApp[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [stats, setStats] = useState<HubStats>({ totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/ecosystem/apps").then(r => r.json()),
      fetch("/api/ecosystem/snippets").then(r => r.json()),
      fetch("/api/ecosystem/stats").then(r => r.json())
    ]).then(([appsData, snippetsData, statsData]) => {
      console.log('[TL Hub] API responses:', { appsData, snippetsData, statsData });
      setApps(appsData.apps || []);
      setSnippets(snippetsData.snippets || []);
      setStats(statsData.stats || { totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
      setLoading(false);
    }).catch((err) => {
      console.error('[TL Hub] Error loading data:', err);
      setLoading(false);
    });
  }, []);

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    fetch(`/api/ecosystem/snippets/${id}/download`, { method: "POST" });
  };

  const likeSnippet = (id: string) => {
    fetch(`/api/ecosystem/snippets/${id}/like`, { method: "POST" });
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Trust Layer Hub - Code Marketplace & Developer Ecosystem"
        description="DarkWave Trust Layer Hub - Share, discover, and sync code snippets across all connected applications. The premium marketplace for verified widgets and components."
        keywords="code marketplace, developer hub, code snippets, widgets, DarkWave Trust Layer, blockchain verified code"
        type="website"
        url="https://darkwavestudios.com/hub"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Trust Layer Hub", url: "https://darkwavestudios.com/hub" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,200,255,0.1),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base lg:text-xl gradient-text" data-testid="text-hub-title">Trust Layer Hub</h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">DarkWave Ecosystem</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-projects">Portfolio</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-services">Services</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold" data-testid="link-contact">
              Get Started
            </Link>
          </nav>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden glass-strong border-t border-white/5 px-4 py-4">
            <nav className="flex flex-col gap-3">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-projects-mobile">Portfolio</Link>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-services-mobile">Services</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold text-center" data-testid="link-contact-mobile">Get Started</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* BENTO GRID SECTION 1: Hero + Stats - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {/* Hero Card - 3-col mobile / 8-col desktop */}
          <div className="col-span-3 lg:col-span-8">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-8 gradient-border relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
              <div className="absolute top-0 right-0 w-48 lg:w-96 h-48 lg:h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-primary/20 text-primary text-[10px] lg:text-xs font-semibold mb-2 lg:mb-4" data-testid="badge-blockchain-verified">
                  <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  Blockchain Verified
                </div>
                <h2 className="text-xl lg:text-4xl font-bold font-display mb-2 lg:mb-4" data-testid="text-hero-title">
                  The Developer <span className="gradient-text">Marketplace</span>
                </h2>
                <p className="text-muted-foreground text-xs lg:text-base max-w-xl mb-3 lg:mb-6 line-clamp-2 lg:line-clamp-none" data-testid="text-hero-description">
                  Share, discover, and sync code snippets across all connected DarkWave applications.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  <a href="#snippets" className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold" data-testid="button-browse-snippets">
                    Browse <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 glass px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold hover:bg-white/10 transition-colors" data-testid="button-connect-app">
                    Connect App
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - 3-col mobile / 4-col desktop */}
          <div className="col-span-3 lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-apps">{stats.totalApps}</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-apps">Connected Apps</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-snippets">{stats.totalSnippets}</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-snippets">Snippets</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-downloads">{stats.totalDownloads}</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-downloads">Downloads</div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 2: Connected Apps - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        {apps.length > 0 && (
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
            <div className="col-span-3 lg:col-span-12">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-apps-title">
                    Connected <span className="gradient-text">Apps</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] lg:text-sm text-muted-foreground">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-green-400 animate-pulse" />
                    <span data-testid="text-active-apps">{apps.length} Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="glass rounded-lg lg:rounded-xl p-2 lg:p-4 hover-lift group cursor-pointer"
                      data-testid={`app-card-${app.id}`}
                    >
                      <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs lg:text-lg flex-shrink-0">
                          {app.logoUrl ? (
                            <img src={app.logoUrl} alt={app.displayName} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            app.displayName.charAt(0)
                          )}
                        </div>
                        {app.isVerified && (
                          <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                        )}
                      </div>
                      <h4 className="font-bold font-display text-[10px] lg:text-sm group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-app-name-${app.id}`}>{app.displayName}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENTO GRID SECTION 3: Search + Categories - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section id="snippets" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6 scroll-mt-24">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 mb-3 lg:mb-4">
                <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-snippets-title">
                  Code <span className="gradient-text">Snippets</span>
                </h3>
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 lg:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "glass hover:bg-white/10"
                      }`}
                      data-testid={`button-category-${cat.id}`}
                    >
                      <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 4: Snippets Grid - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 animate-pulse">
                  <div className="h-4 lg:h-6 bg-white/10 rounded w-1/2 mb-2 lg:mb-4" />
                  <div className="h-3 lg:h-4 bg-white/10 rounded w-full mb-1 lg:mb-2" />
                  <div className="h-16 lg:h-24 bg-white/10 rounded" />
                </div>
              ))}
            </>
          ) : filteredSnippets.length > 0 ? (
            <>
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 gradient-border hover-lift group"
                  data-testid={`snippet-${snippet.id}`}
                >
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5 lg:mb-1">
                        <h4 className="font-bold font-display text-sm lg:text-lg truncate" data-testid={`text-snippet-title-${snippet.id}`}>{snippet.title}</h4>
                        {snippet.isPremium && (
                          <span className="px-1.5 lg:px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[8px] lg:text-[10px] font-semibold flex-shrink-0" data-testid={`badge-premium-${snippet.id}`}>
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] lg:text-sm text-muted-foreground line-clamp-1 lg:line-clamp-2" data-testid={`text-snippet-description-${snippet.id}`}>{snippet.description}</p>
                    </div>
                    <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-md lg:rounded-lg bg-primary/20 text-primary text-[8px] lg:text-xs font-mono ml-2 flex-shrink-0" data-testid={`text-snippet-language-${snippet.id}`}>
                      {snippet.language}
                    </span>
                  </div>

                  <div className="relative mb-2 lg:mb-4">
                    <pre className="bg-black/40 rounded-lg lg:rounded-xl p-2 lg:p-4 overflow-x-auto text-[10px] lg:text-xs font-mono text-gray-300 max-h-20 lg:max-h-32">
                      <code>{snippet.code.slice(0, 200)}{snippet.code.length > 200 ? "..." : ""}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(snippet.id, snippet.code)}
                      className="absolute top-1.5 lg:top-2 right-1.5 lg:right-2 p-1.5 lg:p-2 rounded-md lg:rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      data-testid={`button-copy-${snippet.id}`}
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                    </button>
                  </div>

                  <div className="hidden lg:flex flex-wrap gap-1.5 mb-3" data-testid={`container-snippet-tags-${snippet.id}`}>
                    {snippet.tags?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-foreground" data-testid={`tag-${snippet.id}-${i}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-sm text-muted-foreground">
                      <span className="flex items-center gap-0.5 lg:gap-1" data-testid={`text-snippet-downloads-${snippet.id}`}>
                        <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.downloads}
                      </span>
                      <button
                        onClick={() => likeSnippet(snippet.id)}
                        className="flex items-center gap-0.5 lg:gap-1 hover:text-red-400 transition-colors"
                        data-testid={`button-like-${snippet.id}`}
                      >
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.likes}
                      </button>
                    </div>
                    <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid={`text-snippet-author-${snippet.id}`}>
                      by <span className="text-primary">{snippet.authorName || "DarkWave"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-3 lg:col-span-12 glass-card rounded-xl lg:rounded-2xl p-6 lg:p-12 text-center" data-testid="empty-state-snippets">
              <Code2 className="w-10 h-10 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-2 lg:mb-4 opacity-50" />
              <h4 className="text-base lg:text-xl font-bold font-display mb-1 lg:mb-2" data-testid="text-empty-title">No Snippets Yet</h4>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6" data-testid="text-empty-description">
                Be the first to share code with the DarkWave ecosystem.
              </p>
              <Link 
                href="/contact"
                className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold"
                data-testid="button-contribute"
              >
                Contribute <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* BENTO GRID SECTION 5: CTA - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-12 gradient-border text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <div className="relative z-10">
                <h3 className="text-lg lg:text-3xl font-bold font-display mb-2 lg:mb-4" data-testid="text-cta-title">
                  Join the <span className="gradient-text">Trust Layer</span>
                </h3>
                <p className="text-xs lg:text-base text-muted-foreground max-w-2xl mx-auto mb-4 lg:mb-8 line-clamp-2 lg:line-clamp-none">
                  Connect your app to the DarkWave ecosystem. Share code, sync data, and leverage blockchain-verified integrations.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-lg"
                    data-testid="button-apply-access"
                  >
                    Apply for Access <Zap className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  </Link>
                  <a 
                    href="#"
                    className="inline-flex items-center gap-1.5 lg:gap-2 glass px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-sm hover:bg-white/10 transition-colors"
                    data-testid="button-docs"
                  >
                    Docs <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-6 lg:mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="font-display font-bold text-sm lg:text-base gradient-text" data-testid="text-footer-brand">Trust Layer Hub</span>
          </div>
          <div className="text-muted-foreground text-[10px] lg:text-sm" data-testid="text-footer-tagline">Powered by DarkWave Trust Layer Blockchain</div>
        </div>
      </footer>
    </div>
  );
}
