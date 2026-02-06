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
  const [adFilled, setAdFilled] = useState(false);

  useEffect(() => {
    if (isAdFree || loading || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense script not loaded yet
    }
  }, [isAdFree, loading]);

  useEffect(() => {
    if (!adRef.current) return;
    const checkFilled = () => {
      const ins = adRef.current?.querySelector('ins');
      if (ins) {
        const status = ins.getAttribute('data-ad-status');
        if (status === 'filled') {
          setAdFilled(true);
        } else if (status === 'unfilled') {
          setAdFilled(false);
        }
        const height = ins.offsetHeight;
        if (height > 0) {
          setAdFilled(true);
        }
      }
    };
    const observer = new MutationObserver(checkFilled);
    observer.observe(adRef.current, { attributes: true, childList: true, subtree: true, attributeFilter: ['data-ad-status', 'style'] });
    const timer = setTimeout(checkFilled, 2000);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  if (isAdFree || loading) return null;

  return (
    <div
      className={`ad-unit-wrapper overflow-hidden ${adFilled ? className : ''}`}
      ref={adRef}
      data-testid="ad-unit"
      style={{ 
        maxHeight: adFilled ? '400px' : '0px', 
        opacity: adFilled ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
      }}
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
