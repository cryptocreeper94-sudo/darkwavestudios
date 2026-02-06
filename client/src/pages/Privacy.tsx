import { Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Shield, Menu, X } from "lucide-react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";

export default function Privacy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Privacy Policy"
        description="DarkWave Studios Privacy Policy. Learn how we collect, use, and protect your personal information. Your privacy matters to us."
        keywords="privacy policy, data protection, web development privacy"
        type="website"
        url="https://darkwavestudios.com/privacy"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Privacy Policy", url: "https://darkwavestudios.com/privacy" }
        ]}
      />
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
          <div className="lg:hidden max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-display text-base font-semibold gradient-text">DarkWave Studios</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors" data-testid="mobile-menu-toggle">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden glass-strong border-t border-white/5 px-4 py-4">
              <div className="flex flex-col gap-2">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Home</Link>
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Terms of Service</Link>
              </div>
            </div>
          )}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-3 items-center justify-between">
            <Link href="/" className="font-display text-lg font-semibold gradient-text">DarkWave Studios</Link>
            <div className="flex items-center gap-6">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium">Get Started</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold font-display" data-testid="privacy-title">Privacy Policy</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 2025</p>

              <section>
                <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly, including name, email, company name, phone number, 
                  and project details when you contact us or request services. We also collect usage data through 
                  analytics to improve our website experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. How We Use Information</h2>
                <p className="text-muted-foreground">
                  We use collected information to: respond to inquiries, provide requested services, send project 
                  updates, improve our website and services, and communicate about new offerings (with consent). 
                  We never sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Data Storage & Security</h2>
                <p className="text-muted-foreground">
                  Your data is stored on secure servers with industry-standard encryption. We implement appropriate 
                  technical and organizational measures to protect against unauthorized access, alteration, or 
                  destruction of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Cookies & Tracking</h2>
                <p className="text-muted-foreground mb-3">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website 
                  traffic, and understand visitor behavior. You can control cookie preferences through your 
                  browser settings.
                </p>
                <p className="text-muted-foreground mb-3">
                  <strong className="text-foreground">Google AdSense:</strong> This website uses Google AdSense, 
                  a third-party advertising service provided by Google LLC. Google AdSense uses cookies to serve 
                  ads based on your prior visits to this website and other websites on the internet. Google's use 
                  of advertising cookies enables it and its partners to serve ads based on your browsing history.
                </p>
                <p className="text-muted-foreground">
                  You may opt out of personalized advertising by visiting{" "}
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Ad Settings
                  </a>{" "}
                  or by visiting{" "}
                  <a 
                    href="https://www.aboutads.info/choices/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.aboutads.info/choices
                  </a>. 
                  We also offer an ad-free subscription ($5/month) that removes all advertisements from our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Third-Party Services</h2>
                <p className="text-muted-foreground mb-3">
                  We use third-party services for various purposes. These services have their own privacy policies 
                  governing data use. We only share necessary information required for these services to function:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
                  <li><strong className="text-foreground">Google AdSense</strong> — Advertising (uses cookies for personalized ads)</li>
                  <li><strong className="text-foreground">Stripe</strong> — Payment processing</li>
                  <li><strong className="text-foreground">Coinbase Commerce</strong> — Cryptocurrency payments</li>
                  <li><strong className="text-foreground">OpenAI</strong> — AI-powered features and content generation</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Some pages may contain affiliate links. For details, see our{" "}
                  <Link href="/affiliate-disclosure" className="text-primary hover:underline">
                    Affiliate Disclosure
                  </Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to: access your personal data, request corrections, request deletion, 
                  opt out of marketing communications, and data portability where applicable. Contact us to 
                  exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain personal information for as long as necessary to provide services and comply with 
                  legal obligations. Project-related data may be retained for reference and support purposes 
                  unless deletion is requested.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not directed to individuals under 18. We do not knowingly collect personal 
                  information from children. If you believe we have collected such information, please contact us 
                  immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Policy Updates</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically. Changes will be posted on this page with an 
                  updated revision date. Continued use of our services after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  For privacy-related questions or to exercise your data rights, please contact us through our 
                  website contact form or reach out directly. We aim to respond to all privacy inquiries within 
                  30 days.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
