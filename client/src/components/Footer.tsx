import { Link } from "wouter";
import { ExternalLink, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 glass-strong mt-6 lg:mt-12 border-t border-white/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display text-lg lg:text-xl font-bold gradient-text mb-3" data-testid="text-footer-brand">
              DarkWave Studios
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Full-service web agency delivering agency-quality work without agency prices.
            </p>
          </div>
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Work</div>
            <div className="flex flex-col gap-2">
              <Link href="/projects" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-portfolio">Portfolio</Link>
              <Link href="/services" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-services">Services</Link>
              <Link href="/compare" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-compare">Compare</Link>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Free Tools</div>
            <div className="flex flex-col gap-2">
              <Link href="/audit" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-audit">Website Audit</Link>
              <Link href="/resources" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-resources">Free Resources</Link>
              <Link href="/quote" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-quote">Get a Quote</Link>
              <Link href="/payment" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-pricing">Plans & Pricing</Link>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Company</div>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">About Us</Link>
              <Link href="/mission" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-mission">Our Mission</Link>
              <Link href="/investors" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-investors">Investors</Link>
              <Link href="/contact" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-contact">Contact</Link>
              <Link href="/book" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-book">Book a Call</Link>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              <Link href="/developers" className="hover:text-primary transition-colors" data-testid="footer-link-developers">Developers</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/ecosystem" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-ecosystem">Ecosystem</Link>
              <Link href="/hub" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-hub">Trust Layer Hub</Link>
              <a href="https://dwsc.io/guardian-ai" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1" data-testid="footer-link-guardian">Guardian AI <ExternalLink className="w-3 h-3" /></a>
              <a href="https://trustshield.tech" target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1" data-testid="footer-link-shield">Guardian Shield <ExternalLink className="w-3 h-3" /></a>
              <Link href="/blog" className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-blog">Blog</Link>
            </div>
          </div>
        </div>
        
        {/* Trust Layer Branding */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground" data-testid="text-trust-layer-branding">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs lg:text-sm">Powered by <span className="text-primary font-semibold">Trust Layer</span></span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-xs lg:text-sm">Protected by <span className="text-primary font-semibold">Guardian Trust Shield</span></span>
            </div>
            
            <div className="flex items-center justify-center gap-4 lg:gap-6">
              <a 
                href="https://dwtl.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                data-testid="footer-link-dwtl"
              >
                DWTL.io
              </a>
              <a 
                href="https://trustshield.tech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                data-testid="footer-link-trustshield"
              >
                TrustShield.tech
              </a>
              <a 
                href="https://tlid.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                data-testid="footer-link-tlid"
              >
                TLId.io
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
            <div className="text-muted-foreground text-[10px] lg:text-sm text-center md:text-left" data-testid="text-copyright">
              &copy; 2026 DarkWave Studios. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-[10px] lg:text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-terms">Terms</Link>
              <Link href="/privacy" className="text-[10px] lg:text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-privacy">Privacy</Link>
              <span className="text-[10px] lg:text-xs text-muted-foreground">Nashville, TN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
