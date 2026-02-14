import { ExternalLink, Zap, TrendingUp, Users, Shield } from "lucide-react";

interface SignalPresaleBannerProps {
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export function SignalPresaleBanner({ variant = "full", className = "" }: SignalPresaleBannerProps) {
  const presaleUrl = "https://dwsc.io/presale";

  if (variant === "inline") {
    return (
      <a
        href={presaleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block glass-card rounded-xl p-4 gradient-border hover-elevate group transition-all ${className}`}
        data-testid="banner-signal-presale-inline"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-primary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm font-display">Signal Asset Presale — Live Now</div>
            <div className="text-xs text-muted-foreground">Starting at $0.001 per SIG</div>
          </div>
          <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={presaleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block glass-card rounded-xl lg:rounded-2xl p-4 lg:p-6 gradient-border hover-elevate group relative overflow-hidden transition-all ${className}`}
        data-testid="banner-signal-presale-compact"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-primary/10 to-accent/10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-primary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-0.5">Presale Live</div>
            <div className="font-bold text-base lg:text-lg font-display">Signal Asset — $0.001/SIG</div>
            <div className="text-xs text-muted-foreground mt-0.5">Be among the first to own Signal and help build the Trust Layer ecosystem</div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-primary/30 transition-colors flex-shrink-0">
            Join Presale
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={presaleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block glass-card rounded-xl lg:rounded-2xl gradient-border hover-elevate group relative overflow-hidden transition-all ${className}`}
      data-testid="banner-signal-presale-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-primary/10 to-accent/15" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 p-5 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              PRESALE LIVE NOW
            </div>
            <h3 className="text-xl lg:text-2xl font-bold font-display mb-2">
              Own a Piece of the <span className="gradient-text">Trust Layer</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xl">
              Signal is the native digital asset powering a 23-app ecosystem with 2.07M+ lines of production code. 
              Join early at $0.001/SIG before the price increases.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Max 2% per wallet</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Fair launch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Community owned</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Pay with card or crypto</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-3 flex-shrink-0">
            <div className="text-center lg:text-right">
              <div className="text-xs text-muted-foreground">Current Price</div>
              <div className="text-3xl lg:text-4xl font-bold font-display gradient-text">$0.001</div>
              <div className="text-xs text-muted-foreground">per SIG</div>
            </div>
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm group-hover:scale-105 transition-transform btn-glow">
              Join Signal Presale
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
