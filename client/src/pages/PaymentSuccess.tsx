import { Link, useSearch } from "wouter";
import { CheckCircle2, ArrowRight, Home, Download, Package, Clock, Shield, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface PurchaseItem {
  id: string;
  name: string;
  type: string;
}

interface PurchaseData {
  id: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: string;
  customerEmail: string | null;
  downloadToken: string;
  downloadCount: number;
  paymentMethod: string;
  createdAt: string;
  fulfilledAt: string | null;
}

export default function PaymentSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get("token");
  const sessionId = params.get("session_id");
  const [copied, setCopied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } = useQuery<{ success: boolean; purchase: PurchaseData }>({
    queryKey: ["/api/purchases/verify", token, sessionId, retryCount],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (token) queryParams.set("token", token);
      if (sessionId) queryParams.set("session_id", sessionId);
      const res = await fetch(`/api/purchases/verify?${queryParams}`);
      if (!res.ok) throw new Error("Purchase not found");
      return res.json();
    },
    enabled: !!(token || sessionId),
    refetchInterval: (query) => {
      const purchase = query.state.data?.purchase;
      if (purchase?.status === "fulfilled") return false;
      return 3000;
    },
    retry: 3,
  });

  const purchase = data?.purchase;
  const isFulfilled = purchase?.status === "fulfilled";
  const isPending = purchase?.status === "pending";

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  const handleCopyToken = () => {
    if (purchase?.downloadToken) {
      navigator.clipboard.writeText(purchase.downloadToken);
      setCopied(true);
    }
  };

  const handleDownload = (widgetId: string) => {
    if (purchase?.downloadToken) {
      window.open(`/api/purchases/download/${purchase.downloadToken}?widget=${widgetId}`, "_blank");
    }
  };

  if (!token && !sessionId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-8 animate-pulse" data-testid="icon-success">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Payment <span className="gradient-text">Successful!</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for your purchase! We've sent a confirmation email with your receipt and next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="glow-button px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl flex items-center justify-center gap-2" data-testid="link-home">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isFulfilled 
              ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30" 
              : "bg-gradient-to-br from-yellow-500/30 to-amber-500/30 animate-pulse"
          }`} data-testid="icon-status">
            {isFulfilled ? (
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            ) : (
              <Clock className="w-10 h-10 text-yellow-400" />
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-display mb-3">
            {isFulfilled ? (
              <>Payment <span className="gradient-text">Confirmed!</span></>
            ) : isPending ? (
              <>Processing <span className="gradient-text">Payment...</span></>
            ) : (
              <>Payment <span className="gradient-text">Received</span></>
            )}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isFulfilled 
              ? "Your widgets are ready to download below." 
              : "Hang tight — we're confirming your payment. This usually takes just a moment."}
          </p>
        </div>

        {isLoading && (
          <div className="glass-card rounded-2xl p-8 text-center" data-testid="loading-purchase">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your purchase details...</p>
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-8 text-center" data-testid="error-purchase">
            <p className="text-red-400 mb-4">We couldn't find this purchase. Please check your confirmation email.</p>
            <button 
              onClick={() => { setRetryCount(c => c + 1); refetch(); }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 mx-auto"
              data-testid="button-retry"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {purchase && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6" data-testid="card-order-summary">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isFulfilled 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-yellow-500/20 text-yellow-400"
                }`} data-testid="text-status">
                  {isFulfilled ? "Fulfilled" : "Processing"}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {purchase.items.map((item: PurchaseItem, i: number) => (
                  <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5" data-testid={`row-item-${i}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-sm font-bold">
                        {item.type === "widget" ? "W" : "S"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                      </div>
                    </div>
                    {isFulfilled && (
                      <button
                        onClick={() => handleDownload(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium transition-all"
                        data-testid={`button-download-${item.id}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold font-display" data-testid="text-total">
                  ${(purchase.totalAmount / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {isFulfilled && purchase.downloadToken && (
              <div className="glass-card rounded-2xl p-6" data-testid="card-download-token">
                <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-400" />
                  Download Access
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save this download link. You can use it anytime to re-download your widgets.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 rounded-lg px-4 py-2.5 text-xs font-mono text-muted-foreground overflow-hidden">
                    <span className="opacity-60 truncate block" data-testid="text-token">
                      {purchase.downloadToken.slice(0, 16)}...{purchase.downloadToken.slice(-8)}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyToken}
                    className="px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    title="Copy download token"
                    data-testid="button-copy-token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-400 mt-2">Token copied to clipboard!</p>
                )}
                {purchase.downloadCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Downloaded {purchase.downloadCount} time{purchase.downloadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {!isFulfilled && (
              <div className="glass-card rounded-2xl p-6 text-center" data-testid="card-processing">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Your payment is being processed. Downloads will appear here automatically.
                </p>
                <p className="text-xs text-muted-foreground">
                  This usually takes less than 30 seconds.
                </p>
              </div>
            )}

            <div className="glass-card rounded-2xl p-6" data-testid="card-details">
              <h3 className="font-display font-bold mb-4">Purchase Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Payment Method</p>
                  <p className="font-medium capitalize" data-testid="text-payment-method">{purchase.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Date</p>
                  <p className="font-medium" data-testid="text-date">{new Date(purchase.createdAt).toLocaleDateString()}</p>
                </div>
                {purchase.customerEmail && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Email</p>
                    <p className="font-medium" data-testid="text-email">{purchase.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/hub" className="px-6 py-3 glass-card rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all" data-testid="link-hub">
                <ExternalLink className="w-5 h-5" />
                Back to Hub
              </Link>
              <Link href="/" className="glow-button px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl flex items-center justify-center gap-2" data-testid="link-home">
                <Home className="w-5 h-5" />
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
