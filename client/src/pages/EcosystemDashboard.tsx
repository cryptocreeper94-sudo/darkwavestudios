import { Link } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { 
  Code2, Shield, Boxes, Terminal, ExternalLink, ArrowRight, Zap, Lock, Globe, Bot, 
  Sparkles, ChevronRight, Activity, TrendingUp, BarChart3, Clock, Layers, RefreshCw,
  CheckCircle2, AlertTriangle, XCircle, Wifi, WifiOff, Timer, Server, Eye,
  ArrowUpRight, Search, Filter, ChevronDown, Radio, Gauge, FileCode, Wrench,
  Command, BookOpen, PenTool, Cpu
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";

interface HealthApp {
  id: string;
  name: string;
  url: string;
  category: string;
  loc: string;
  pages: string;
  status: "online" | "degraded" | "offline" | "timeout" | "checking";
  statusCode: number;
  responseTime: number;
  checkedAt: string;
  error?: string;
}

interface HealthSummary {
  total: number;
  online: number;
  degraded: number;
  offline: number;
  avgResponseTime: number;
}

const categoryMeta: Record<string, { label: string; color: string; gradient: string }> = {
  core: { label: "Core Platform", color: "cyan", gradient: "from-cyan-500 to-blue-600" },
  trading: { label: "Trading & Crypto", color: "amber", gradient: "from-amber-500 to-orange-600" },
  business: { label: "Business Ops", color: "emerald", gradient: "from-emerald-500 to-teal-600" },
  trades: { label: "Trade Services", color: "violet", gradient: "from-violet-500 to-purple-600" },
  auto: { label: "Auto & Delivery", color: "sky", gradient: "from-sky-500 to-blue-600" },
  health: { label: "Health & Wellness", color: "rose", gradient: "from-rose-500 to-pink-600" },
  gaming: { label: "Gaming", color: "purple", gradient: "from-purple-500 to-indigo-600" },
  "real-estate": { label: "Real Estate", color: "green", gradient: "from-green-500 to-emerald-600" },
  social: { label: "Social", color: "indigo", gradient: "from-indigo-500 to-blue-600" },
  security: { label: "Security", color: "red", gradient: "from-red-500 to-rose-600" },
  devtools: { label: "Developer Tools", color: "teal", gradient: "from-teal-500 to-cyan-600" },
};

const quickActions = [
  { label: "Shared Components", href: "/developers/components", icon: Layers, desc: "Manage ecosystem-wide UI", gradient: "from-cyan-500 to-teal-500" },
  { label: "Command Center", href: "/command", icon: Command, desc: "Full feature access", gradient: "from-purple-500 to-indigo-500" },
  { label: "Trust Layer Hub", href: "/hub", icon: Boxes, desc: "102 embeddable widgets", gradient: "from-amber-500 to-orange-500" },
  { label: "API Documentation", href: "/developers/api", icon: BookOpen, desc: "Pulse API & endpoints", gradient: "from-emerald-500 to-green-500" },
  { label: "Marketing Hub", href: "/marketing", icon: PenTool, desc: "Automated social posting", gradient: "from-rose-500 to-pink-500" },
  { label: "Ecosystem Metrics", href: "/metrics", icon: BarChart3, desc: "Live stats & analytics", gradient: "from-blue-500 to-cyan-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online: "bg-green-400 shadow-green-400/50",
    degraded: "bg-yellow-400 shadow-yellow-400/50",
    offline: "bg-red-400 shadow-red-400/50",
    timeout: "bg-orange-400 shadow-orange-400/50",
    checking: "bg-cyan-400 shadow-cyan-400/50 animate-pulse",
  };
  return <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${colors[status] || colors.checking}`} />;
}

function ResponseBadge({ ms }: { ms: number }) {
  const color = ms < 500 ? "text-green-400" : ms < 1500 ? "text-yellow-400" : ms < 3000 ? "text-orange-400" : "text-red-400";
  return <span className={`text-xs font-mono ${color}`}>{ms}ms</span>;
}

function HealthRing({ online, total }: { online: number; total: number }) {
  const pct = total > 0 ? (online / total) * 100 : 0;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct === 100 ? "#22c55e" : pct >= 80 ? "#eab308" : "#ef4444";
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold font-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(pct)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">uptime</span>
      </div>
    </div>
  );
}

export default function EcosystemDashboard() {
  const [apps, setApps] = useState<HealthApp[]>([]);
  const [summary, setSummary] = useState<HealthSummary>({ total: 29, online: 0, degraded: 0, offline: 0, avgResponseTime: 0 });
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ecosystem/health");
      const data = await res.json();
      if (data.success) {
        setApps(data.apps);
        setSummary(data.summary || { total: data.apps.length, online: 0, degraded: 0, offline: 0, avgResponseTime: 0 });
        setLastChecked(data.checkedAt);
      }
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  const filteredApps = apps.filter(app => {
    if (filterCategory !== "all" && app.category !== filterCategory) return false;
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(apps.map(a => a.category)));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Ecosystem Dashboard - DarkWave Studios"
        description="Master control center for monitoring all 35 DarkWave ecosystem apps. Real-time health checks, response times, and quick access to developer tools."
        keywords="ecosystem dashboard, health monitoring, developer tools, API, widgets"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Developers", url: "https://darkwavestudios.io/developers" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)] -z-10" />

      {/* Animated grid background */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-home">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold hidden sm:block">Ecosystem Dashboard</span>
                <span className="font-display text-lg font-bold sm:hidden">Dashboard</span>
              </div>
            </div>
            {!loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex items-center gap-2 ml-4">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  summary.online === summary.total ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  <Radio className="w-3 h-3" />
                  {summary.online}/{summary.total} Online
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-40"
              data-testid="button-refresh-health"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/command"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              data-testid="link-command-center"
            >
              <Command className="w-3.5 h-3.5" /> Command
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Stats Row */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
            {/* Left: Title + Stats */}
            <div>
              <motion.h1
                className="font-display font-bold text-3xl lg:text-5xl mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Master Control
                </span>
              </motion.h1>
              <p className="text-muted-foreground text-sm lg:text-base mb-6 max-w-xl">
                Real-time health monitoring across all 35 production apps. 1.74M+ lines of code, live status, and instant access to every developer tool.
              </p>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Online", value: summary.online, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                  { label: "Degraded", value: summary.degraded, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                  { label: "Offline", value: summary.offline, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                  { label: "Avg Response", value: `${summary.avgResponseTime}ms`, icon: Timer, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <GlassCard variant="stat" className={`p-3 rounded-xl border ${stat.bg}`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <div className={`text-xl font-bold font-display ${stat.color}`}>
                        {loading ? "..." : stat.value}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Health Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:flex flex-col items-center"
            >
              <HealthRing online={summary.online} total={summary.total} />
              {lastChecked && (
                <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(lastChecked).toLocaleTimeString()}
                </span>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, i) => (
              <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.04 }}>
                <Link href={action.href} data-testid={`quick-${action.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <GlassCard className="p-3 rounded-xl group hover:border-white/20 transition-all cursor-pointer h-full">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-[11px] text-muted-foreground leading-tight">{action.desc}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
              data-testid="input-search-apps"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
                showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.03] border-white/10 text-muted-foreground hover:text-white"
              }`}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
              {(filterCategory !== "all" || filterStatus !== "all") && (
                <span className="w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-white font-bold">
                  {(filterCategory !== "all" ? 1 : 0) + (filterStatus !== "all" ? 1 : 0)}
                </span>
              )}
            </button>
            <div className="text-xs text-muted-foreground">
              {filteredApps.length} of {apps.length} apps
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <GlassCard className="p-4 rounded-xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setFilterCategory("all")}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          filterCategory === "all" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-white"
                        }`}
                        data-testid="filter-category-all"
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            filterCategory === cat ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-white"
                          }`}
                          data-testid={`filter-category-${cat}`}
                        >
                          {categoryMeta[cat]?.label || cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "online", "degraded", "offline", "timeout"].map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(s)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            filterStatus === s ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-white"
                          }`}
                          data-testid={`filter-status-${s}`}
                        >
                          {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* App Health Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <GlassCard className="p-4 rounded-xl animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10" />
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-white/10 rounded mb-1" />
                      <div className="w-16 h-3 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-white/5 rounded" />
                    <div className="w-16 h-6 bg-white/5 rounded" />
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            filteredApps.map(app => {
              const meta = categoryMeta[app.category] || categoryMeta.core;
              return (
                <motion.div key={app.id} variants={itemVariants}>
                  <GlassCard
                    className={`p-4 rounded-xl group hover:border-white/20 transition-all duration-300 relative overflow-hidden ${
                      app.status === "offline" || app.status === "timeout" ? "border-red-500/20" : ""
                    }`}
                    data-testid={`card-app-${app.id}`}
                  >
                    {/* Subtle category gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-[0.02] group-hover:opacity-[0.05] transition-opacity`} />

                    <div className="relative">
                      {/* Top row: Icon + Name + Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs font-bold">
                              {app.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{app.name}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-${meta.color}-400`}>{meta.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <StatusDot status={app.status} />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileCode className="w-3 h-3" /> {app.loc} LOC
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {app.pages} pages
                        </span>
                        <div className="ml-auto">
                          <ResponseBadge ms={app.responseTime || 0} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors"
                          data-testid={`link-visit-${app.id}`}
                        >
                          <Eye className="w-3 h-3" /> Visit
                        </a>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                          data-testid={`link-open-${app.id}`}
                        >
                          <ArrowUpRight className="w-3 h-3" /> Open App
                        </a>
                      </div>

                      {/* Error indicator */}
                      {(app.status === "offline" || app.status === "timeout") && app.error && (
                        <div className="mt-2 px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] truncate">
                          {app.error}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Empty state */}
        {!loading && filteredApps.length === 0 && (
          <GlassCard className="p-12 rounded-xl text-center">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No apps match your filters</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => { setFilterCategory("all"); setFilterStatus("all"); setSearchQuery(""); }}
              className="text-primary text-sm font-semibold hover:underline"
              data-testid="button-clear-filters"
            >
              Clear all filters
            </button>
          </GlassCard>
        )}

        {/* Bottom Developer Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 mb-8"
        >
          <GlassCard glow className="rounded-2xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">Developer Tools</h2>
                  <p className="text-xs text-muted-foreground">Build, manage, and monitor the ecosystem</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: "Guardian AI", desc: "Agent certification & security", href: "/guardian-ai", gradient: "from-red-500 to-orange-500" },
                { icon: Bot, label: "AI Agent Marketplace", desc: "Build & deploy AI agents", href: "https://dwtl.io/ai-agents", ext: true, gradient: "from-emerald-500 to-teal-500" },
                { icon: Terminal, label: "Studio IDE", desc: "Browser-based development", href: "https://dwtl.io/studio", ext: true, gradient: "from-purple-500 to-pink-500" },
                { icon: Globe, label: "Ecosystem", desc: "All 35 apps showcase", href: "/ecosystem", gradient: "from-indigo-500 to-blue-500" },
              ].map((tool, i) => (
                tool.ext ? (
                  <a key={tool.label} href={tool.href} target="_blank" rel="noopener noreferrer" data-testid={`tool-${tool.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <GlassCard variant="stat" className="p-4 rounded-xl group hover:border-white/20 transition-all cursor-pointer h-full">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold mb-0.5">{tool.label}</h3>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      <ExternalLink className="w-3 h-3 text-muted-foreground mt-2" />
                    </GlassCard>
                  </a>
                ) : (
                  <Link key={tool.label} href={tool.href} data-testid={`tool-${tool.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <GlassCard variant="stat" className="p-4 rounded-xl group hover:border-white/20 transition-all cursor-pointer h-full">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold mb-0.5">{tool.label}</h3>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </GlassCard>
                  </Link>
                )
              ))}
            </div>
          </GlassCard>
        </motion.section>

        {/* Ecosystem Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Total Apps", value: "35", icon: Server },
            { label: "Total Widgets", value: "102", icon: Boxes },
            { label: "Lines of Code", value: "1.74M+", icon: FileCode },
            { label: "API Endpoints", value: "1,500+", icon: Zap },
          ].map(stat => (
            <GlassCard variant="stat" key={stat.label} className="p-4 rounded-xl text-center" data-testid={`stat-footer-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold font-display text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} DarkWave Studios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
