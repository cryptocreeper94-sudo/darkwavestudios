import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-6 lg:mt-12 border-t border-white/10 bg-background/80 backdrop-blur-sm" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-muted-foreground text-xs lg:text-sm" data-testid="text-copyright">
            &copy; 2026 DarkWave Studios
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs lg:text-sm text-muted-foreground">
            <a
              href="https://trustshield.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              data-testid="footer-link-trustshield"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Protected by <span className="text-primary font-semibold">TrustShield.tech</span></span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://dwtl.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              data-testid="footer-link-trustlayer"
            >
              Powered by <span className="text-primary font-semibold">Trust Layer</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
