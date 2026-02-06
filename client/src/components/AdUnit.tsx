import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  isAdFree?: boolean;
  loading?: boolean;
  className?: string;
}

export function AdUnit({ slot, format = "auto", isAdFree = false, loading = false, className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (isAdFree || loading || pushed.current) return;
    if (typeof window.adsbygoogle === 'undefined') return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
      setAdLoaded(true);
    } catch (e) {
      console.log("AdSense not loaded");
    }
  }, [isAdFree, loading]);

  useEffect(() => {
    if (!adRef.current || adLoaded) return;
    const observer = new MutationObserver(() => {
      const ins = adRef.current?.querySelector('ins');
      if (ins && ins.getAttribute('data-ad-status') === 'filled') {
        setAdLoaded(true);
      }
    });
    observer.observe(adRef.current, { attributes: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, [adLoaded]);

  if (isAdFree || loading) return null;

  return (
    <div
      className={`ad-unit-wrapper overflow-hidden transition-all duration-300 ${className}`}
      ref={adRef}
      data-testid="ad-unit"
      style={{ maxHeight: adLoaded ? '400px' : '0px', opacity: adLoaded ? 1 : 0 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7386731030203849"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

interface AdFreeBannerProps {
  isAdFree?: boolean;
  loading?: boolean;
  onUpgrade?: () => void;
}

export function AdFreeBanner({ isAdFree = false, loading = false, onUpgrade }: AdFreeBannerProps) {
  if (isAdFree || loading) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
      data-testid="ad-free-banner"
    >
      <div className="flex items-center gap-2 text-center sm:text-left">
        <span className="text-sm text-muted-foreground">Enjoying DarkWave?</span>
        <span className="text-sm font-semibold text-white">Go Ad-Free for $5/mo</span>
      </div>
      <button
        onClick={onUpgrade}
        className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        data-testid="button-go-ad-free"
      >
        Upgrade
      </button>
    </div>
  );
}
