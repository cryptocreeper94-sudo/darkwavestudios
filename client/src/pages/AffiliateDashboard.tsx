import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, Copy, Check, Share2, Users, TrendingUp, Coins, Award,
  Clock, CheckCircle, XCircle, ExternalLink, Shield, Loader2,
  ChevronRight, Star, Diamond, Crown, Gem, Medal
} from "lucide-react";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";

const TIERS = [
  { name: "Base", minReferrals: 0, rate: "10%", color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30", icon: Medal },
  { name: "Silver", minReferrals: 5, rate: "12.5%", color: "text-slate-300", bg: "bg-slate-400/20", border: "border-slate-400/30", icon: Star },
  { name: "Gold", minReferrals: 15, rate: "15%", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: Crown },
  { name: "Platinum", minReferrals: 30, rate: "17.5%", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30", icon: Gem },
  { name: "Diamond", minReferrals: 50, rate: "20%", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30", icon: Diamond },
];

function getTierInfo(convertedCount: number) {
  let current = TIERS[0];
  let next = TIERS[1];
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (convertedCount >= TIERS[i].minReferrals) {
      current = TIERS[i];
      next = TIERS[i + 1] || null;
      break;
    }
  }
  const progress = next
    ? ((convertedCount - current.minReferrals) / (next.minReferrals - current.minReferrals)) * 100
    : 100;
  return { current, next, progress: Math.min(progress, 100) };
}

function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const [showGenesis, setShowGenesis] = useState(false);
  const userId = "demo-user";

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["affiliate-dashboard", userId],
    queryFn: async () => {
      const res = await fetch(`/api/affiliate/dashboard?userId=${userId}`);
      return res.json();
    },
  });

  const { data: genesisData } = useQuery({
    queryKey: ["hallmark-genesis"],
    queryFn: async () => {
      const res = await fetch("/api/hallmark/genesis");
      return res.json();
    },
  });

  const payoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/affiliate/request-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return res.json();
    },
  });

  const stats = dashboardData || {
    totalReferrals: 0,
    convertedCount: 0,
    pendingEarnings: "0",
    paidEarnings: "0",
    referralLink: "https://darkwavestudios.io/ref/demo",
    recentReferrals: [],
    recentCommissions: [],
    crossPlatformLinks: [],
  };

  const tierInfo = getTierInfo(stats.convertedCount || 0);
  const TierIcon = tierInfo.current.icon;
  const pendingAmount = parseFloat(stats.pendingEarnings || "0");
  const canPayout = pendingAmount >= 10;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(stats.referralLink || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "DarkWave Studios Referral",
          text: "Join DarkWave Studios ecosystem!",
          url: stats.referralLink,
        });
      } catch {}
    } else {
      copyLink();
    }
  };

  const genesis = genesisData?.hallmark;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" data-testid="button-affiliate-back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-affiliate-title">Affiliate Dashboard</h1>
            <p className="text-gray-400 text-sm">Earn commissions by referring others to the ecosystem</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className={`p-6 rounded-xl ${tierInfo.current.border} border`} data-testid="card-tier-badge">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${tierInfo.current.bg} flex items-center justify-center`}>
                  <TierIcon className={`w-7 h-7 ${tierInfo.current.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Tier</p>
                  <p className={`text-2xl font-bold ${tierInfo.current.color}`} data-testid="text-current-tier">{tierInfo.current.name}</p>
                  <p className="text-sm text-gray-500">Commission Rate: {tierInfo.current.rate}</p>
                </div>
              </div>
              {tierInfo.next && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Next: {tierInfo.next.name} ({tierInfo.next.rate})</p>
                  <p className="text-sm text-gray-400">{tierInfo.next.minReferrals - (stats.convertedCount || 0)} more conversions needed</p>
                </div>
              )}
            </div>
            {tierInfo.next && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{stats.convertedCount || 0} converted</span>
                  <span>{tierInfo.next.minReferrals} needed</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden" data-testid="progress-tier">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${tierInfo.progress}%` }}
                  />
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <GlassCard variant="stat" className="p-5 rounded-xl" data-testid="card-total-referrals">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Total Referrals</span>
            </div>
            <p className="text-3xl font-bold" data-testid="text-total-referrals">{stats.totalReferrals}</p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5 rounded-xl" data-testid="card-converted">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Converted</span>
            </div>
            <p className="text-3xl font-bold text-green-400" data-testid="text-converted">{stats.convertedCount}</p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5 rounded-xl" data-testid="card-pending-earnings">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400">Pending (SIG)</span>
            </div>
            <p className="text-3xl font-bold text-amber-400" data-testid="text-pending-earnings">{stats.pendingEarnings}</p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5 rounded-xl" data-testid="card-paid-earnings">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Paid (SIG)</span>
            </div>
            <p className="text-3xl font-bold text-purple-400" data-testid="text-paid-earnings">{stats.paidEarnings}</p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-6 rounded-xl" data-testid="card-referral-link">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Your Referral Link
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 truncate" data-testid="text-referral-link">
                {stats.referralLink}
              </div>
              <button
                onClick={copyLink}
                className="px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition flex items-center gap-2 shrink-0"
                data-testid="button-copy-link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={shareLink}
                className="px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition flex items-center gap-2 shrink-0"
                data-testid="button-share-link"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Commission Tiers
          </h2>
          <GlassCard className="rounded-xl overflow-hidden" data-testid="table-commission-tiers">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Tier</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Required Conversions</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Commission Rate</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((tier) => {
                    const Icon = tier.icon;
                    const isActive = tier.name === tierInfo.current.name;
                    return (
                      <tr key={tier.name} className={`border-b border-white/5 ${isActive ? "bg-white/5" : ""}`} data-testid={`row-tier-${tier.name.toLowerCase()}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${tier.color}`} />
                            <span className={`font-medium ${tier.color}`}>{tier.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{tier.minReferrals}+ conversions</td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">{tier.rate}</td>
                        <td className="px-4 py-3 text-right">
                          {isActive ? (
                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">Active</span>
                          ) : (stats.convertedCount || 0) >= tier.minReferrals ? (
                            <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">Unlocked</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-white/5 text-gray-500 text-xs font-medium">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Recent Referrals
            </h2>
            {(stats.recentReferrals || []).length > 0 ? (
              <div className="space-y-2" data-testid="list-recent-referrals">
                {stats.recentReferrals.map((ref: any, i: number) => (
                  <GlassCard key={ref.id || i} className="p-4 rounded-xl flex items-center justify-between" data-testid={`referral-item-${i}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        ref.status === "converted" ? "bg-green-500/10" : ref.status === "expired" ? "bg-red-500/10" : "bg-amber-500/10"
                      }`}>
                        {ref.status === "converted" ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                         ref.status === "expired" ? <XCircle className="w-4 h-4 text-red-400" /> :
                         <Clock className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ref.platform || "darkwave-studio"}</p>
                        <p className="text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ref.status === "converted" ? "bg-green-500/20 text-green-400" :
                      ref.status === "expired" ? "bg-red-500/20 text-red-400" :
                      "bg-amber-500/20 text-amber-400"
                    }`} data-testid={`status-referral-${i}`}>
                      {ref.status}
                    </span>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-12 rounded-xl">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No referrals yet. Share your link to get started!</p>
              </GlassCard>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Recent Commissions
            </h2>
            {(stats.recentCommissions || []).length > 0 ? (
              <div className="space-y-2" data-testid="list-recent-commissions">
                {stats.recentCommissions.map((comm: any, i: number) => (
                  <GlassCard key={comm.id || i} className="p-4 rounded-xl flex items-center justify-between" data-testid={`commission-item-${i}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        comm.status === "paid" ? "bg-green-500/10" : "bg-amber-500/10"
                      }`}>
                        {comm.status === "paid" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{comm.tier || "base"} tier</p>
                        <p className="text-xs text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400">{comm.amount} {comm.currency || "SIG"}</p>
                      <span className={`text-xs ${comm.status === "paid" ? "text-green-400" : "text-amber-400"}`}>
                        {comm.status}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-12 rounded-xl">
                <Coins className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No commissions yet. Convert referrals to earn!</p>
              </GlassCard>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <GlassCard className="p-6 rounded-xl" data-testid="card-payout">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Request Payout</h2>
                <p className="text-sm text-gray-400">
                  Minimum payout: 10 SIG · Pending balance: <span className="text-amber-400 font-semibold">{stats.pendingEarnings} SIG</span>
                </p>
              </div>
              <button
                onClick={() => payoutMutation.mutate()}
                disabled={!canPayout || payoutMutation.isPending}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  canPayout
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                }`}
                data-testid="button-request-payout"
              >
                {payoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                Request Payout
              </button>
            </div>
            {payoutMutation.isSuccess && (
              <p className="mt-3 text-sm text-green-400" data-testid="text-payout-success">Payout request submitted successfully!</p>
            )}
            {payoutMutation.isError && (
              <p className="mt-3 text-sm text-red-400" data-testid="text-payout-error">Failed to submit payout request. Please try again.</p>
            )}
          </GlassCard>
        </motion.div>

        {(stats.crossPlatformLinks || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              Cross-App Referral Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="list-cross-app-links">
              {stats.crossPlatformLinks.map((link: any, i: number) => (
                <GlassCard key={i} className="p-4 rounded-xl flex items-center justify-between" data-testid={`cross-link-${i}`}>
                  <div>
                    <p className="text-sm font-medium">{link.app}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(link.url);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    data-testid={`button-copy-cross-link-${i}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard glow className="p-6 rounded-xl" data-testid="card-genesis-hallmark">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Genesis Hallmark</p>
                  <p className="text-xl font-bold text-cyan-400" data-testid="text-genesis-id">
                    {genesis?.thId || "DS-00000001"}
                  </p>
                  <p className="text-xs text-gray-500">{genesis?.productName || "Genesis Block"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowGenesis(!showGenesis)}
                className="px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition text-sm flex items-center gap-1"
                data-testid="button-toggle-genesis"
              >
                {showGenesis ? "Hide Details" : "View Details"}
                <ChevronRight className={`w-4 h-4 transition-transform ${showGenesis ? "rotate-90" : ""}`} />
              </button>
            </div>
            {showGenesis && genesis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
                data-testid="panel-genesis-details"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">App ID</span>
                      <span className="text-gray-300 font-mono text-xs">{genesis.appId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">App Name</span>
                      <span className="text-gray-300">{genesis.appName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Release Type</span>
                      <span className="text-gray-300">{genesis.releaseType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hallmark ID</span>
                      <span className="text-gray-300">{genesis.hallmarkId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data Hash</span>
                      <span className="text-gray-300 font-mono text-xs truncate max-w-[180px]">{genesis.dataHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">TX Hash</span>
                      <span className="text-gray-300 font-mono text-xs truncate max-w-[180px]">{genesis.txHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Block Height</span>
                      <span className="text-gray-300 font-mono text-xs">{genesis.blockHeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-300">{new Date(genesis.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {genesis.metadata && (() => {
                  try {
                    const meta = typeof genesis.metadata === "string" ? JSON.parse(genesis.metadata) : genesis.metadata;
                    return (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-500 mb-2">Metadata</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {Object.entries(meta).map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-2 bg-white/5 rounded px-2 py-1">
                              <span className="text-gray-500 capitalize">{key}</span>
                              <span className="text-gray-300 truncate">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default AffiliateDashboard;
