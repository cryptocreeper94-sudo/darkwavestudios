import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardVariant = "default" | "stat" | "feature" | "elevated";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  variant?: GlassCardVariant;
}

const variantStyles: Record<GlassCardVariant, string> = {
  default: "bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl border border-white/[0.08] rounded-xl",
  stat: "bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-xl",
  feature: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl",
  elevated: "bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_0_40px_rgba(0,255,255,0.15)]",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, variant = "default", children, ...props }, ref) => {
    if (glow) {
      return (
        <div className="relative group">
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div
            ref={ref}
            className={cn(
              variantStyles[variant],
              "relative transition-all duration-300 hover:border-cyan-500/30 shadow-2xl hover:shadow-[0_0_60px_rgba(6,182,212,0.2)]",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          "transition-all duration-300 hover:border-white/20",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
export type { GlassCardProps, GlassCardVariant };
