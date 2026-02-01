import { useState } from "react";
import { Link } from "wouter";
import { 
  Shield, 
  ShieldCheck, 
  Search,
  ChevronRight,
  ExternalLink,
  Lock,
  Eye,
  Activity,
  FileCheck,
  Star,
  Calendar,
  Globe,
  Filter,
  Bot,
  BadgeCheck,
  TrendingUp
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface CertifiedAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: "Basic" | "Advanced" | "Enterprise";
  trustScore: number;
  securityScore: number;
  transparencyScore: number;
  reliabilityScore: number;
  complianceScore: number;
  certifiedDate: string;
  expiresDate: string;
  website: string;
  verified: boolean;
}

const mockAgents: CertifiedAgent[] = [
  {
    id: "1",
    name: "AutoTrader Pro",
    description: "Autonomous DeFi trading agent with multi-chain support and risk management",
    category: "Trading",
    tier: "Enterprise",
    trustScore: 94,
    securityScore: 96,
    transparencyScore: 92,
    reliabilityScore: 95,
    complianceScore: 93,
    certifiedDate: "2024-11-15",
    expiresDate: "2026-11-15",
    website: "https://autotrader.example",
    verified: true
  },
  {
    id: "2",
    name: "YieldMaster AI",
    description: "Intelligent yield farming optimizer across major DeFi protocols",
    category: "DeFi",
    tier: "Advanced",
    trustScore: 87,
    securityScore: 89,
    transparencyScore: 85,
    reliabilityScore: 88,
    complianceScore: 86,
    certifiedDate: "2024-12-01",
    expiresDate: "2025-12-01",
    website: "https://yieldmaster.example",
    verified: true
  },
  {
    id: "3",
    name: "NFT Scout",
    description: "AI-powered NFT analysis and trading assistant with rarity detection",
    category: "NFT",
    tier: "Basic",
    trustScore: 78,
    securityScore: 80,
    transparencyScore: 75,
    reliabilityScore: 79,
    complianceScore: 78,
    certifiedDate: "2024-12-10",
    expiresDate: "2025-06-10",
    website: "https://nftscout.example",
    verified: true
  },
  {
    id: "4",
    name: "PortfolioGuard",
    description: "Risk management agent that monitors and rebalances crypto portfolios",
    category: "Portfolio",
    tier: "Enterprise",
    trustScore: 96,
    securityScore: 98,
    transparencyScore: 94,
    reliabilityScore: 97,
    complianceScore: 95,
    certifiedDate: "2024-10-20",
    expiresDate: "2026-10-20",
    website: "https://portfolioguard.example",
    verified: true
  },
  {
    id: "5",
    name: "ArbitrageBot X",
    description: "Cross-exchange arbitrage detection and execution with slippage protection",
    category: "Trading",
    tier: "Advanced",
    trustScore: 85,
    securityScore: 88,
    transparencyScore: 82,
    reliabilityScore: 86,
    complianceScore: 84,
    certifiedDate: "2024-11-28",
    expiresDate: "2025-11-28",
    website: "https://arbbot.example",
    verified: true
  },
  {
    id: "6",
    name: "SocialSentinel",
    description: "Social media sentiment analyzer for crypto market predictions",
    category: "Analytics",
    tier: "Basic",
    trustScore: 72,
    securityScore: 75,
    transparencyScore: 70,
    reliabilityScore: 73,
    complianceScore: 70,
    certifiedDate: "2024-12-05",
    expiresDate: "2025-06-05",
    website: "https://socialsentinel.example",
    verified: true
  }
];

const categories = ["All", "Trading", "DeFi", "NFT", "Portfolio", "Analytics"];
const tiers = ["All", "Basic", "Advanced", "Enterprise"];

function getTierColor(tier: string) {
  switch (tier) {
    case "Enterprise": return "from-amber-500 to-orange-500";
    case "Advanced": return "from-purple-500 to-pink-500";
    default: return "from-blue-500 to-cyan-500";
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-400";
  if (score >= 75) return "text-yellow-400";
  return "text-red-400";
}

export default function GuardianAIRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [sortBy, setSortBy] = useState<"trustScore" | "certifiedDate">("trustScore");

  const filteredAgents = mockAgents
    .filter(agent => {
      const matchesSearch = !searchQuery || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
      const matchesTier = selectedTier === "All" || agent.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === "trustScore") return b.trustScore - a.trustScore;
      return new Date(b.certifiedDate).getTime() - new Date(a.certifiedDate).getTime();
    });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Guardian AI Registry - Verified AI Agents in Crypto"
        description="Browse the public registry of Guardian AI certified agents. View trust scores, security ratings, and verification status for autonomous AI agents."
        keywords="certified AI agents, verified bots, AI registry, crypto agent directory, trusted AI"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Guardian AI", url: "https://darkwavestudios.io/guardian-ai" },
          { name: "Registry", url: "https://darkwavestudios.io/guardian-ai-registry" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-green-500/5 via-background to-emerald-500/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.1),transparent_50%)] -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/guardian-ai" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg lg:text-xl">
                  <span className="text-green-400">Certified</span> Registry
                </h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">Guardian AI Verified Agents</p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-4 lg:gap-6">
            <Link href="/guardian-ai" className="btn-glow bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Get Certified
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl lg:text-5xl mb-4">
            Verified <span className="text-green-400">AI Agents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse the public registry of Guardian AI certified agents. 
            Every agent listed has passed comprehensive security verification.
          </p>
        </section>

        {/* Search & Filters */}
        <section className="glass-card rounded-xl p-4 lg:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search certified agents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                data-testid="input-search-agents"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                data-testid="select-category"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedTier}
                onChange={e => setSelectedTier(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                data-testid="select-tier"
              >
                {tiers.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                data-testid="select-sort"
              >
                <option value="trustScore">Highest Trust Score</option>
                <option value="certifiedDate">Recently Certified</option>
              </select>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-green-400">{mockAgents.length}</div>
            <div className="text-sm text-muted-foreground">Certified Agents</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-purple-400">
              {mockAgents.filter(a => a.tier === "Enterprise").length}
            </div>
            <div className="text-sm text-muted-foreground">Enterprise Tier</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-blue-400">
              {Math.round(mockAgents.reduce((a, b) => a + b.trustScore, 0) / mockAgents.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Trust Score</div>
          </div>
        </section>

        {/* Agent Grid */}
        <section className="grid lg:grid-cols-2 gap-6" data-testid="agent-grid">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="glass-card rounded-2xl p-6 hover-lift gradient-border group" data-testid={`card-agent-${agent.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(agent.tier)} flex items-center justify-center`}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      {agent.verified && <BadgeCheck className="w-5 h-5 text-green-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(agent.tier)} text-white`}>
                        {agent.tier}
                      </span>
                      <span>{agent.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(agent.trustScore)}`}>
                    {agent.trustScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Trust Score</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>

              {/* Score Breakdown */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <Lock className="w-4 h-4 mx-auto mb-1 text-red-400" />
                  <div className={`text-sm font-bold ${getScoreColor(agent.securityScore)}`}>{agent.securityScore}</div>
                  <div className="text-[10px] text-muted-foreground">Security</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <Eye className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  <div className={`text-sm font-bold ${getScoreColor(agent.transparencyScore)}`}>{agent.transparencyScore}</div>
                  <div className="text-[10px] text-muted-foreground">Transparency</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <Activity className="w-4 h-4 mx-auto mb-1 text-green-400" />
                  <div className={`text-sm font-bold ${getScoreColor(agent.reliabilityScore)}`}>{agent.reliabilityScore}</div>
                  <div className="text-[10px] text-muted-foreground">Reliability</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <FileCheck className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                  <div className={`text-sm font-bold ${getScoreColor(agent.complianceScore)}`}>{agent.complianceScore}</div>
                  <div className="text-[10px] text-muted-foreground">Compliance</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Certified {new Date(agent.certifiedDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Expires {new Date(agent.expiresDate).toLocaleDateString()}
                  </span>
                </div>
                <a 
                  href={agent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  <Globe className="w-4 h-4" /> Website
                </a>
              </div>
            </div>
          ))}
        </section>

        {filteredAgents.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Agents Found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Link 
              href="/guardian-ai"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Submit Your Agent <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* CTA */}
        <section className="mt-12">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl lg:text-3xl mb-4">
              Want Your Agent Listed Here?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Get your AI agent certified and join the trusted registry. Certified agents see 3x higher adoption.
            </p>
            <Link 
              href="/guardian-ai"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Apply for Certification <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="font-display font-bold">Guardian AI Registry</span>
          </div>
          <div className="text-muted-foreground text-sm">Powered by DarkWave Trust Layer</div>
        </div>
      </footer>
    </div>
  );
}
