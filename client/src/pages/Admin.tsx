import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Calendar, Mail, 
  TrendingUp, ArrowRight, ChevronDown, ChevronUp, Clock, Check, X,
  Eye, Trash2, RefreshCw, AlertCircle, DollarSign, Zap, BarChart3, Globe, Bot, PenTool
} from "lucide-react";

type TabType = "overview" | "leads" | "quotes" | "bookings" | "subscribers";

interface Stats {
  totalLeads: number;
  newLeads: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalBookings: number;
  upcomingBookings: number;
  totalSubscribers: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  budget: string | null;
  projectType: string | null;
  message: string;
  status: string | null;
  createdAt: string;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  features: string[] | null;
  timeline: string | null;
  estimatedCost: string | null;
  status: string | null;
  createdAt: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  timeSlot: string;
  type: string | null;
  notes: string | null;
  status: string | null;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, quotesRes, bookingsRes, subscribersRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/leads"),
        fetch("/api/quotes"),
        fetch("/api/bookings"),
        fetch("/api/subscribers")
      ]);

      const [statsData, leadsData, quotesData, bookingsData, subscribersData] = await Promise.all([
        statsRes.json(),
        leadsRes.json(),
        quotesRes.json(),
        bookingsRes.json(),
        subscribersRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (leadsData.success) setLeads(leadsData.leads);
      if (quotesData.success) setQuotes(quotesData.quotes);
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (subscribersData.success) setSubscribers(subscribersData.subscribers);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/quotes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "new": case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "contacted": case "reviewed": return "bg-blue-500/20 text-blue-400";
      case "converted": case "confirmed": case "approved": return "bg-green-500/20 text-green-400";
      case "closed": case "cancelled": case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-muted-foreground";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users, count: stats?.newLeads },
    { id: "quotes", label: "Quotes", icon: FileText, count: stats?.pendingQuotes },
    { id: "bookings", label: "Bookings", icon: Calendar, count: stats?.upcomingBookings },
    { id: "subscribers", label: "Subscribers", icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
              DarkWave
            </Link>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Admin</span>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "glass-card hover:bg-white/10"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-primary/20 text-primary"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-span-3 glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
                <div className="h-8 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
              <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Stats Cards */}
                <div className="col-span-3 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d bg-gradient-to-br from-primary/10 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Leads</div>
                      <div className="text-3xl font-bold">{stats.totalLeads}</div>
                      {stats.newLeads > 0 && (
                        <div className="text-xs text-primary">+{stats.newLeads} new</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d bg-gradient-to-br from-accent/10 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Quote Requests</div>
                      <div className="text-3xl font-bold">{stats.totalQuotes}</div>
                      {stats.pendingQuotes > 0 && (
                        <div className="text-xs text-accent">+{stats.pendingQuotes} pending</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/30 to-primary/30 flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Bookings</div>
                      <div className="text-3xl font-bold">{stats.totalBookings}</div>
                      {stats.upcomingBookings > 0 && (
                        <div className="text-xs text-green-400">+{stats.upcomingBookings} upcoming</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-primary/30 flex items-center justify-center">
                      <Mail className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Subscribers</div>
                      <div className="text-3xl font-bold">{stats.totalSubscribers}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions - Analytics & AI */}
                <div className="col-span-3 lg:col-span-12 grid grid-cols-3 lg:grid-cols-12 gap-4">
                  <Link href="/analytics" className="col-span-3 lg:col-span-3">
                    <div className="glass-card rounded-2xl p-6 gradient-border card-3d bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all cursor-pointer group" data-testid="link-analytics">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BarChart3 className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Analytics</div>
                          <div className="text-xs text-muted-foreground">View real-time stats</div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/blog/admin" className="col-span-3 lg:col-span-3">
                    <div className="glass-card rounded-2xl p-6 gradient-border card-3d bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30 transition-all cursor-pointer group" data-testid="link-blog-admin">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <PenTool className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Blog Manager</div>
                          <div className="text-xs text-muted-foreground">AI content creation</div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/analytics" className="col-span-3 lg:col-span-3">
                    <div className="glass-card rounded-2xl p-6 gradient-border card-3d bg-gradient-to-br from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 transition-all cursor-pointer group" data-testid="link-seo">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/30 to-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Globe className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">SEO & Analytics</div>
                          <div className="text-xs text-muted-foreground">Monitor rankings</div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/blog/admin" className="col-span-3 lg:col-span-3">
                    <div className="glass-card rounded-2xl p-6 gradient-border card-3d bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/30 hover:to-red-600/30 transition-all cursor-pointer group" data-testid="link-ai-blog">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Bot className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">AI Writer</div>
                          <div className="text-xs text-muted-foreground">Generate SEO content</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Recent Activity */}
                <div className="col-span-3 lg:col-span-6 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Leads
                  </h3>
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No leads yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-3 lg:col-span-6 glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recent Quotes
                  </h3>
                  <div className="space-y-3">
                    {quotes.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div>
                          <div className="font-medium">{quote.name}</div>
                          <div className="text-xs text-muted-foreground">{quote.projectType}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">${Number(quote.estimatedCost || 0).toLocaleString()}</div>
                          <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {quotes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No quote requests yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="glass-card rounded-2xl gradient-border overflow-hidden card-3d">
                    <button
                      onClick={() => setExpandedItem(expandedItem === lead.id ? null : lead.id)}
                      className="w-full p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                        {expandedItem === lead.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>
                    
                    {expandedItem === lead.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          {lead.company && (
                            <div>
                              <div className="text-xs text-muted-foreground">Company</div>
                              <div className="font-medium">{lead.company}</div>
                            </div>
                          )}
                          {lead.phone && (
                            <div>
                              <div className="text-xs text-muted-foreground">Phone</div>
                              <div className="font-medium">{lead.phone}</div>
                            </div>
                          )}
                          {lead.budget && (
                            <div>
                              <div className="text-xs text-muted-foreground">Budget</div>
                              <div className="font-medium">{lead.budget}</div>
                            </div>
                          )}
                          {lead.projectType && (
                            <div>
                              <div className="text-xs text-muted-foreground">Project Type</div>
                              <div className="font-medium">{lead.projectType}</div>
                            </div>
                          )}
                        </div>
                        <div className="mb-4">
                          <div className="text-xs text-muted-foreground mb-1">Message</div>
                          <div className="p-3 rounded-xl bg-white/5 text-sm">{lead.message}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateLeadStatus(lead.id, "contacted")}
                            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            Mark Contacted
                          </button>
                          <button
                            onClick={() => updateLeadStatus(lead.id, "converted")}
                            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                          >
                            Mark Converted
                          </button>
                          <button
                            onClick={() => updateLeadStatus(lead.id, "closed")}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No leads yet</div>
                    <div className="text-sm text-muted-foreground">When visitors submit the contact form, they'll appear here.</div>
                  </div>
                )}
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="glass-card rounded-2xl gradient-border overflow-hidden card-3d">
                    <button
                      onClick={() => setExpandedItem(expandedItem === quote.id ? null : quote.id)}
                      className="w-full p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">{quote.name}</div>
                          <div className="text-sm text-muted-foreground">{quote.projectType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-primary">${Number(quote.estimatedCost || 0).toLocaleString()}</div>
                          <span className={`px-3 py-1 rounded-lg text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </div>
                        {expandedItem === quote.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>
                    
                    {expandedItem === quote.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Email</div>
                            <div className="font-medium">{quote.email}</div>
                          </div>
                          {quote.phone && (
                            <div>
                              <div className="text-xs text-muted-foreground">Phone</div>
                              <div className="font-medium">{quote.phone}</div>
                            </div>
                          )}
                          {quote.timeline && (
                            <div>
                              <div className="text-xs text-muted-foreground">Timeline</div>
                              <div className="font-medium capitalize">{quote.timeline}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-muted-foreground">Submitted</div>
                            <div className="font-medium">{formatDate(quote.createdAt)}</div>
                          </div>
                        </div>
                        {quote.features && quote.features.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-muted-foreground mb-2">Selected Features</div>
                            <div className="flex flex-wrap gap-2">
                              {quote.features.map((f, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateQuoteStatus(quote.id, "reviewed")}
                            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => updateQuoteStatus(quote.id, "approved")}
                            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateQuoteStatus(quote.id, "rejected")}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {quotes.length === 0 && (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No quote requests yet</div>
                    <div className="text-sm text-muted-foreground">When visitors use the quote calculator, they'll appear here.</div>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="glass-card rounded-2xl p-5 gradient-border card-3d">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold">{booking.name}</div>
                          <div className="text-sm text-muted-foreground">{booking.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatDate(booking.date)}</div>
                        <div className="text-sm text-primary">{booking.timeSlot}</div>
                        <span className={`px-3 py-1 rounded-lg text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 p-3 rounded-xl bg-white/5 text-sm">{booking.notes}</div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No bookings yet</div>
                    <div className="text-sm text-muted-foreground">When visitors book discovery calls, they'll appear here.</div>
                  </div>
                )}
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === "subscribers" && (
              <div className="glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Newsletter Subscribers ({subscribers.length})
                </h3>
                <div className="space-y-2">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{sub.email}</div>
                          {sub.name && <div className="text-xs text-muted-foreground">{sub.name}</div>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</div>
                    </div>
                  ))}
                  {subscribers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No subscribers yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-bold gradient-text">DarkWave Studios</div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            Back to Website
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
