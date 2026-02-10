import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import {
  ArrowLeft, Coins, TrendingUp, TrendingDown, ShoppingCart, Zap,
  History, Package, Sparkles, Check, AlertCircle, Loader2, LogIn,
  PenTool, Shield, Monitor, Mic, Volume2, ImageIcon, ChevronRight
} from "lucide-react";
import Footer from "@/components/Footer";
import { AI_CREDIT_COSTS, CREDIT_PACKAGES } from "@shared/schema";

function Credits() {
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const queryClient = useQueryClient();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");
  const cancelled = params.get("cancelled");

  useEffect(() => {
    const saved = localStorage.getItem("trustvault_token") || localStorage.getItem("signal_chat_token");
    if (saved) setToken(saved);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const res = await fetch("/api/chat/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("trustvault_token", data.token);
        setLoginError("");
      } else {
        setLoginError(data.error || "Login failed");
      }
    },
  });

  const { data: balanceData, isLoading: loadingBalance } = useQuery({
    queryKey: ["credit-balance", token],
    queryFn: async () => {
      const res = await fetch("/api/credits/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  const { data: txData, isLoading: loadingTx } = useQuery({
    queryKey: ["credit-transactions", token],
    queryFn: async () => {
      const res = await fetch("/api/credits/transactions?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  const verifyMutation = useMutation({
    mutationFn: async (sid: string) => {
      const res = await fetch("/api/credits/verify-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId: sid }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
      queryClient.invalidateQueries({ queryKey: ["credit-transactions"] });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  useEffect(() => {
    if (sessionId && token && !verifyMutation.isPending && !verifyMutation.isSuccess) {
      verifyMutation.mutate(sessionId);
    }
  }, [sessionId, token]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const balance = balanceData?.balance;
  const transactions = txData?.transactions || [];

  const categoryIcons: Record<string, any> = {
    "blog-post": PenTool, "guardian-scan": Shield, "studio-export": Monitor,
    "transcription-min": Mic, "tts-1000chars": Volume2, "image-enhance": ImageIcon,
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
              <Coins className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">AI Credits</h1>
            <p className="text-gray-400">Sign in to manage your AI credits and usage</p>
          </div>
          <form onSubmit={handleLogin} className="glass-card p-6 rounded-xl space-y-4" data-testid="credits-login-form">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input type="text" value={loginForm.username} onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="Your Trust Layer username" data-testid="input-credits-username" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="Your password" data-testid="input-credits-password" />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-semibold transition-all flex items-center justify-center gap-2"
              data-testid="button-credits-login">
              {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Sign In
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" data-testid="button-credits-back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AI Credits</h1>
            <p className="text-gray-400 text-sm">Track your usage and purchase credits</p>
          </div>
        </div>

        {sessionId && verifyMutation.isSuccess && (
          <div className="glass-card p-4 rounded-xl mb-6 border border-green-500/30 bg-green-500/5 flex items-center gap-3" data-testid="purchase-success-banner">
            <Check className="w-6 h-6 text-green-400 shrink-0" />
            <div>
              <p className="font-semibold text-green-400">Credits Added Successfully!</p>
              <p className="text-sm text-gray-400">{verifyMutation.data?.creditsAdded} credits have been added to your account.</p>
            </div>
          </div>
        )}

        {cancelled && (
          <div className="glass-card p-4 rounded-xl mb-6 border border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="text-gray-300">Purchase cancelled. No charges were made.</p>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl" data-testid="card-balance">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-gray-400 text-sm">Available Credits</span>
            </div>
            {loadingBalance ? (
              <div className="h-10 shimmer-skeleton rounded-lg" />
            ) : (
              <p className="text-4xl font-bold">{balance?.credits ?? 0}</p>
            )}
          </div>
          <div className="glass-card p-6 rounded-xl" data-testid="card-purchased">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-gray-400 text-sm">Total Purchased</span>
            </div>
            {loadingBalance ? (
              <div className="h-10 shimmer-skeleton rounded-lg" />
            ) : (
              <p className="text-4xl font-bold text-green-400">{balance?.totalPurchased ?? 0}</p>
            )}
          </div>
          <div className="glass-card p-6 rounded-xl" data-testid="card-used">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-gray-400 text-sm">Total Used</span>
            </div>
            {loadingBalance ? (
              <div className="h-10 shimmer-skeleton rounded-lg" />
            ) : (
              <p className="text-4xl font-bold text-purple-400">{balance?.totalUsed ?? 0}</p>
            )}
          </div>
        </div>

        {/* Credit Costs Reference */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Credit Costs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(AI_CREDIT_COSTS).map(([key, { credits, label }]) => {
              const Icon = categoryIcons[key] || Zap;
              return (
                <div key={key} className="glass-card p-4 rounded-xl flex items-center gap-3" data-testid={`cost-${key}`}>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className={`text-xs ${credits === 0 ? "text-green-400" : "text-amber-400"}`}>
                      {credits === 0 ? "Free" : `${credits} credits`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase Packages */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Buy Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => {
              const badge = "badge" in pkg ? pkg.badge : null;
              return (
              <div key={pkg.id} className={`glass-card p-6 rounded-xl relative ${pkg.id === "popular" ? "border border-amber-500/50 ring-1 ring-amber-500/20" : ""}`} data-testid={`package-${pkg.id}`}>
                {badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold rounded-full whitespace-nowrap">
                    {badge}
                  </span>
                )}
                <h3 className="text-lg font-bold mb-1">{pkg.label}</h3>
                <p className="text-3xl font-bold mb-1">${(pkg.price / 100).toFixed(2)}</p>
                <p className="text-sm text-gray-400 mb-4">{pkg.description}</p>
                <p className="text-xs text-gray-500 mb-4">
                  ${(pkg.price / pkg.credits / 100).toFixed(3)} per credit
                </p>
                <button
                  onClick={() => purchaseMutation.mutate(pkg.id)}
                  disabled={purchaseMutation.isPending}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-sm font-semibold transition flex items-center justify-center gap-2"
                  data-testid={`button-buy-${pkg.id}`}
                >
                  {purchaseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  Buy Now
                </button>
              </div>
            );
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            Transaction History
          </h2>
          {loadingTx ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 shimmer-skeleton rounded-xl" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((tx: any) => {
                const isPositive = tx.amount > 0;
                return (
                  <div key={tx.id} className="glass-card p-4 rounded-xl flex items-center justify-between" data-testid={`tx-${tx.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive ? "bg-green-500/10" : "bg-purple-500/10"}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-gray-500">
                          {tx.category && <span className="capitalize">{tx.category.replace("-", " ")} · </span>}
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isPositive ? "text-green-400" : "text-purple-400"}`}>
                        {isPositive ? "+" : ""}{tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">Bal: {tx.balanceAfter}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-xl">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-gray-400 text-sm">Purchase credits above to get started with AI features</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Credits;
