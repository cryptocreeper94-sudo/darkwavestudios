import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, Copy, Check, Share2, Users, TrendingUp, Coins, Award,
  Clock, CheckCircle, XCircle, ExternalLink, Shield, Loader2,
  ChevronRight, ChevronDown, Star, Diamond, Crown, Gem, Medal, Sparkles,
  Wallet, ArrowUpRight, Link2, Zap, Globe
} from "lucide-react";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";

const TIERS = [
  { name: "Base", minReferrals: 0, rate: "10%", rateNum: 10, color: "text-gray-400", accent: "#9ca3af", bg: "from-gray-600/20 to-gray-700/20", ring: "ring-gray-500/30", icon: Medal },
  { name: "Silver", minReferrals: 5, rate: "12.5%", rateNum: 12.5, color: "text-slate-300", accent: "#cbd5e1", bg: "from-slate-500/20 to-slate-600/20", ring: "ring-slate-400/30", icon: Star },
  { name: "Gold", minReferrals: 15, rate: "15%", rateNum: 15, color: "text-amber-400", accent: "#fbbf24", bg: "from-amber-500/20 to-orange-600/20", ring: "ring-amber-500/30", icon: Crown },
  { name: "Platinum", minReferrals: 30, rate: "17.5%", rateNum: 17.5, color: "text-purple-400", accent: "#a78bfa", bg: "from-purple-500/20 to-fuchsia-600/20", ring: "ring-purple-500/30", icon: Gem },
  { name: "Diamond", minReferrals: 50, rate: "20%", rateNum: 20, color: "text-cyan-400", accent: "#22d3ee", bg: "from-cyan-500/20 to-blue-600/20", ring: "ring-cyan-500/30", icon: Diamond },
];

const ECOSYSTEM_APPS = [
  { app: "Trust Layer Hub", domain: "trusthub.tlid.io", prefix: "TH", icon: "🔗" },
  { app: "Trust Layer (L1)", domain: "dwtl.io", prefix: "TL", icon: "⛓️" },
  { app: "TrustHome", domain: "trusthome.tlid.io", prefix: "TR", icon: "🏠" },
  { app: "TrustVault", domain: "trustvault.tlid.io", prefix: "TV", icon: "🔐" },
  { app: "TLID.io", domain: "tlid.io", prefix: "TI", icon: "🆔" },
  { app: "THE VOID", domain: "thevoid.tlid.io", prefix: "VO", icon: "🌀" },
  { app: "Signal Chat", domain: "signalchat.tlid.io", prefix: "SC", icon: "💬" },
  { app: "Guardian Shield", domain: "guardianshield.tlid.io", prefix: "GS", icon: "🛡️" },
  { app: "Guardian Scanner", domain: "guardianscanner.tlid.io", prefix: "GN", icon: "🔍" },
  { app: "Guardian Screener", domain: "guardianscreener.tlid.io", prefix: "GR", icon: "📊" },
  { app: "TradeWorks AI", domain: "tradeworks.tlid.io", prefix: "TW", icon: "📈" },
  { app: "StrikeAgent", domain: "strikeagent.tlid.io", prefix: "SA", icon: "⚡" },
  { app: "Pulse", domain: "pulse.tlid.io", prefix: "PU", icon: "💓" },
  { app: "Chronicles", domain: "chronicles.tlid.io", prefix: "CH", icon: "📜" },
  { app: "The Arcade", domain: "thearcade.tlid.io", prefix: "AR", icon: "🎮" },
  { app: "Bomber", domain: "bomber.tlid.io", prefix: "BO", icon: "💣" },
  { app: "Trust Golf", domain: "trustgolf.tlid.io", prefix: "TG", icon: "⛳" },
  { app: "ORBIT Staffing OS", domain: "orbit.tlid.io", prefix: "OR", icon: "🏢" },
  { app: "Orby Commander", domain: "orby.tlid.io", prefix: "OC", icon: "🤖" },
  { app: "GarageBot", domain: "garagebot.tlid.io", prefix: "GB", icon: "🚗" },
  { app: "Lot Ops Pro", domain: "lotops.tlid.io", prefix: "LO", icon: "🅿️" },
  { app: "TORQUE", domain: "torque.tlid.io", prefix: "TQ", icon: "🔧" },
  { app: "TL Driver Connect", domain: "driverconnect.tlid.io", prefix: "DC", icon: "🚚" },
  { app: "VedaSolus", domain: "vedasolus.tlid.io", prefix: "VS", icon: "🧘" },
  { app: "Verdara", domain: "verdara.tlid.io", prefix: "VD", icon: "🌿" },
  { app: "Arbora", domain: "arbora.tlid.io", prefix: "AB", icon: "🌳" },
  { app: "PaintPros", domain: "paintpros.tlid.io", prefix: "PP", icon: "🎨" },
  { app: "Nashville Painting Professionals", domain: "nashvillepainting.tlid.io", prefix: "NP", icon: "🖌️" },
  { app: "Trust Book", domain: "trustbook.tlid.io", prefix: "TB", icon: "📖" },
  { app: "DarkWave Academy", domain: "darkwaveacademy.tlid.io", prefix: "DA", icon: "🎓" },
  { app: "Happy Eats", domain: "happyeats.tlid.io", prefix: "HE", icon: "🍔" },
  { app: "Brew & Board Coffee", domain: "brewandboard.tlid.io", prefix: "BB", icon: "☕" },
  { app: "TrustGen", domain: "trustgen.tlid.io", prefix: "TN", icon: "🎨" },
  { app: "Lume", domain: "lume-lang.org", prefix: "LM", icon: "⚡" },
];

function getTierInfo(convertedCount: number) {
  let current = TIERS[0];
  let next: typeof TIERS[0] | null = TIERS[1];
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
  const [copiedCross, setCopiedCross] = useState<number | null>(null);
  const [showGenesis, setShowGenesis] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
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
    pendingEarnings: "0.00",
    paidEarnings: "0.00",
    referralLink: "https://darkwavestudio.tlid.io/ref/demo",
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
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const copyCrossLink = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCross(index);
      setTimeout(() => setCopiedCross(null), 2000);
    } catch {}
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join the Trust Layer Ecosystem",
          text: "Join me on DarkWave Studios — part of the Trust Layer ecosystem!",
          url: stats.referralLink,
        });
      } catch {}
    } else {
      copyLink();
    }
  };

  const genesis = genesisData?.hallmark;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-20 pb-24 sm:pt-24 sm:pb-28">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Link href="/">
            <button className="w-10 h-10 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] active:scale-95 transition-all" data-testid="button-affiliate-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" data-testid="text-affiliate-title">Share & Earn</h1>
            <p className="text-xs sm:text-sm text-gray-500">Earn SIG across all 35 Trust Layer apps</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-green-400 font-medium">Live</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-5"
        >
          <div className={`relative rounded-2xl overflow-hidden border border-white/[0.08]`} data-testid="card-tier-badge">
            <div className={`absolute inset-0 bg-gradient-to-br ${tierInfo.current.bg} opacity-60`} />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${tierInfo.current.bg} border border-white/[0.1] flex items-center justify-center shadow-lg`}>
                      <TierIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${tierInfo.current.color}`} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-white/10 flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mb-0.5">Current Tier</p>
                    <p className={`text-2xl sm:text-3xl font-black tracking-tight ${tierInfo.current.color}`} data-testid="text-current-tier">{tierInfo.current.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl sm:text-4xl font-black ${tierInfo.current.color}`}>{tierInfo.current.rate}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">commission</p>
                </div>
              </div>

              {tierInfo.next && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {stats.convertedCount || 0} / {tierInfo.next.minReferrals} conversions
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium" style={{ color: tierInfo.current.accent }}>
                      {tierInfo.next.name} ({tierInfo.next.rate})
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden" data-testid="progress-tier">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tierInfo.progress}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${tierInfo.current.accent}80, ${tierInfo.current.accent})`,
                        boxShadow: `0 0 12px ${tierInfo.current.accent}40`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1.5 text-center">
                    {tierInfo.next.minReferrals - (stats.convertedCount || 0)} more to unlock {tierInfo.next.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          {[
            { icon: Users, label: "Referrals", value: stats.totalReferrals, color: "text-blue-400", glow: "bg-blue-500/10" },
            { icon: CheckCircle, label: "Converted", value: stats.convertedCount, color: "text-green-400", glow: "bg-green-500/10" },
            { icon: Clock, label: "Pending", value: `${stats.pendingEarnings} SIG`, color: "text-amber-400", glow: "bg-amber-500/10" },
            { icon: Wallet, label: "Earned", value: `${stats.paidEarnings} SIG`, color: "text-purple-400", glow: "bg-purple-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <div
                className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
                data-testid={`card-stat-${stat.label.toLowerCase()}`}
              >
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
                <div className="relative p-4 sm:p-5">
                  <div className={`w-9 h-9 rounded-xl ${stat.glow} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-lg sm:text-xl font-bold tracking-tight" data-testid={`text-stat-${stat.label.toLowerCase()}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20" data-testid="card-referral-link">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] to-purple-500/[0.06]" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="relative p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold">Your Referral Link</h2>
              </div>
              <div className="bg-black/40 border border-white/[0.08] rounded-xl px-3.5 py-3 mb-3 overflow-hidden">
                <p className="text-xs sm:text-sm text-cyan-300/80 font-mono truncate" data-testid="text-referral-link">
                  {stats.referralLink}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className={`flex-1 h-11 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                    copied
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                  }`}
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={shareLink}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-sm flex items-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-purple-500/10"
                  data-testid="button-share-link"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-5"
        >
          <button
            onClick={() => setShowTiers(!showTiers)}
            className="w-full"
            data-testid="button-toggle-tiers"
          >
            <div className="flex items-center justify-between px-1 mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Commission Tiers
              </h2>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showTiers ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {showTiers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2" data-testid="table-commission-tiers">
                  {TIERS.map((tier, i) => {
                    const Icon = tier.icon;
                    const isActive = tier.name === tierInfo.current.name;
                    const isUnlocked = (stats.convertedCount || 0) >= tier.minReferrals;
                    return (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div
                          className={`relative rounded-xl overflow-hidden border transition-all ${
                            isActive ? `border-white/[0.15] ${tier.ring} ring-1` : "border-white/[0.06]"
                          }`}
                          data-testid={`row-tier-${tier.name.toLowerCase()}`}
                        >
                          {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${tier.bg} opacity-40`} />}
                          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
                          <div className="relative flex items-center gap-3 p-3.5 sm:p-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.bg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${tier.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${tier.color}`}>{tier.name}</span>
                                {isActive && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[9px] font-bold uppercase tracking-wider">Active</span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500">{tier.minReferrals}+ conversions</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`text-lg font-bold ${isUnlocked ? tier.color : "text-gray-600"}`}>{tier.rate}</p>
                              {!isUnlocked && (
                                <p className="text-[9px] text-gray-600">🔒 Locked</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showTiers && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                const isActive = tier.name === tierInfo.current.name;
                return (
                  <div
                    key={tier.name}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border shrink-0 text-xs ${
                      isActive
                        ? `border-white/[0.15] bg-gradient-to-r ${tier.bg}`
                        : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${tier.color}`} />
                    <span className={`font-medium ${isActive ? tier.color : "text-gray-500"}`}>{tier.name}</span>
                    <span className={`${isActive ? "text-white/60" : "text-gray-600"}`}>{tier.rate}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]" data-testid="card-payout">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
            <div className="relative p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Payout
                  </h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Min. 10 SIG required</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-400">{stats.pendingEarnings}</p>
                  <p className="text-[10px] text-gray-500">SIG available</p>
                </div>
              </div>
              <button
                onClick={() => payoutMutation.mutate()}
                disabled={!canPayout || payoutMutation.isPending}
                className={`w-full h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
                  canPayout
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-white/[0.04] text-gray-600 border border-white/[0.06] cursor-not-allowed"
                }`}
                data-testid="button-request-payout"
              >
                {payoutMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
                {canPayout ? "Request Payout" : `Need ${(10 - pendingAmount).toFixed(2)} more SIG`}
              </button>
              <AnimatePresence>
                {payoutMutation.isSuccess && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-3 text-xs text-green-400 text-center" data-testid="text-payout-success">
                    Payout request submitted! Processing within 48 hours.
                  </motion.p>
                )}
                {payoutMutation.isError && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-3 text-xs text-red-400 text-center" data-testid="text-payout-error">
                    Request failed. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5"
        >
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2 px-1 mb-3">
              <Users className="w-4 h-4 text-blue-400" />
              Recent Referrals
            </h2>
            {(stats.recentReferrals || []).length > 0 ? (
              <div className="space-y-2" data-testid="list-recent-referrals">
                {stats.recentReferrals.slice(0, 5).map((ref: any, i: number) => (
                  <div
                    key={ref.id || i}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                    data-testid={`referral-item-${i}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      ref.status === "converted" ? "bg-green-500/10" : ref.status === "expired" ? "bg-red-500/10" : "bg-amber-500/10"
                    }`}>
                      {ref.status === "converted" ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> :
                       ref.status === "expired" ? <XCircle className="w-3.5 h-3.5 text-red-400" /> :
                       <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{ref.platform || "darkwave-studio"}</p>
                      <p className="text-[10px] text-gray-600">{new Date(ref.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      ref.status === "converted" ? "bg-green-500/15 text-green-400" :
                      ref.status === "expired" ? "bg-red-500/15 text-red-400" :
                      "bg-amber-500/15 text-amber-400"
                    }`} data-testid={`status-referral-${i}`}>
                      {ref.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-blue-500/40" />
                </div>
                <p className="text-xs text-gray-500">No referrals yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Share your link to start earning</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2 px-1 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Recent Commissions
            </h2>
            {(stats.recentCommissions || []).length > 0 ? (
              <div className="space-y-2" data-testid="list-recent-commissions">
                {stats.recentCommissions.slice(0, 5).map((comm: any, i: number) => (
                  <div
                    key={comm.id || i}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                    data-testid={`commission-item-${i}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      comm.status === "paid" ? "bg-green-500/10" : "bg-amber-500/10"
                    }`}>
                      {comm.status === "paid" ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium capitalize">{comm.tier || "base"}</p>
                      <p className="text-[10px] text-gray-600">{new Date(comm.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-400">{comm.amount}</p>
                      <p className="text-[9px] text-gray-500">{comm.currency || "SIG"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Coins className="w-5 h-5 text-amber-500/40" />
                </div>
                <p className="text-xs text-gray-500">No commissions yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Convert referrals to earn SIG</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-5"
        >
          <h2 className="text-sm font-semibold flex items-center gap-2 px-1 mb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            Ecosystem Links
          </h2>
          <div className="grid grid-cols-2 gap-2" data-testid="list-cross-app-links">
            {ECOSYSTEM_APPS.map((app, i) => {
              const referralUrl = `https://${app.domain}/ref/${stats.referralLink?.split("/ref/")[1] || "demo"}`;
              return (
                <button
                  key={app.app}
                  onClick={() => copyCrossLink(referralUrl, i)}
                  className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3 text-left hover:border-white/[0.12] hover:bg-white/[0.04] active:scale-[0.97] transition-all"
                  data-testid={`cross-link-${i}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{app.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{app.app}</p>
                      <p className="text-[9px] text-gray-600 truncate">{app.domain}</p>
                    </div>
                    <div className="shrink-0">
                      {copiedCross === i ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20" data-testid="card-genesis-hallmark">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-purple-500/[0.04]" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="relative p-5 sm:p-6">
              <button
                onClick={() => setShowGenesis(!showGenesis)}
                className="w-full flex items-center gap-4 text-left"
                data-testid="button-toggle-genesis"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                    <Check className="w-2 h-2 text-black" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Genesis Hallmark</p>
                  <p className="text-lg sm:text-xl font-bold text-cyan-400 font-mono tracking-wide" data-testid="text-genesis-id">
                    {genesis?.thId || "DS-00000001"}
                  </p>
                  <p className="text-[10px] text-gray-500">{genesis?.productName || "Genesis Block"} · Verified</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-600 shrink-0 transition-transform duration-300 ${showGenesis ? "rotate-90" : ""}`} />
              </button>

              <AnimatePresence>
                {showGenesis && genesis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    data-testid="panel-genesis-details"
                  >
                    <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4">
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium mb-2">Application</p>
                        <div className="space-y-1.5">
                          {[
                            ["App ID", genesis.appId],
                            ["App Name", genesis.appName],
                            ["Release", genesis.releaseType],
                            ["Sequence", `#${genesis.hallmarkId}`],
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.03]">
                              <span className="text-[10px] text-gray-500">{label}</span>
                              <span className="text-xs text-gray-300 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium mb-2">Blockchain</p>
                        <div className="space-y-1.5">
                          {[
                            ["Data Hash", genesis.dataHash],
                            ["TX Hash", genesis.txHash],
                            ["Block", genesis.blockHeight],
                            ["Created", new Date(genesis.createdAt).toLocaleString()],
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.03]">
                              <span className="text-[10px] text-gray-500">{label}</span>
                              <span className="text-[10px] text-gray-400 font-mono truncate max-w-[55%] text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {genesis.metadata && (() => {
                        try {
                          const meta = typeof genesis.metadata === "string" ? JSON.parse(genesis.metadata) : genesis.metadata;
                          return (
                            <div>
                              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium mb-2">Ecosystem</p>
                              <div className="grid grid-cols-2 gap-1.5">
                                {Object.entries(meta).map(([key, value]) => (
                                  <div key={key} className="py-1.5 px-3 rounded-lg bg-white/[0.03]">
                                    <p className="text-[9px] text-gray-500 capitalize mb-0.5">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-[10px] text-gray-300 font-medium truncate">{String(value)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                      <div className="pt-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/[0.06] border border-cyan-500/10">
                          <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                          <p className="text-[10px] text-cyan-400/70">
                            Parent Genesis: TH-00000001 · Trust Layer Hub
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
}

export default AffiliateDashboard;
