import { Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, FileText, Menu, X } from "lucide-react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";

export default function Terms() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
          <div className="lg:hidden max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-display text-base font-semibold gradient-text">DarkWave</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors" data-testid="mobile-menu-toggle">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden glass-strong border-t border-white/5 px-4 py-4">
              <div className="flex flex-col gap-2">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Home</Link>
                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2">Privacy Policy</Link>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold font-display" data-testid="terms-title">Terms of Service</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 2025</p>

              <section>
                <h2 className="text-xl font-bold mb-3">1. Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using DarkWave Studios' services, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Services Description</h2>
                <p className="text-muted-foreground">
                  DarkWave Studios provides web development, application development, design, hosting, and related 
                  digital services. The specific scope of services will be outlined in individual project agreements 
                  or service contracts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Client Responsibilities</h2>
                <p className="text-muted-foreground">
                  Clients are responsible for providing accurate information, timely feedback, necessary access 
                  credentials, and content/assets required for project completion. Delays caused by client 
                  responsiveness may affect project timelines.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Payment Terms</h2>
                <p className="text-muted-foreground">
                  Payment terms will be specified in individual project agreements. Generally, projects require 
                  a deposit before work begins, with remaining payments due upon milestones or completion. 
                  Late payments may incur additional fees.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  Upon full payment, clients receive ownership of custom work created specifically for their project. 
                  DarkWave Studios retains rights to reusable components, frameworks, and tools developed during the engagement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Confidentiality</h2>
                <p className="text-muted-foreground">
                  Both parties agree to maintain confidentiality of proprietary information shared during the 
                  engagement. This includes business strategies, technical implementations, and sensitive data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  DarkWave Studios' liability is limited to the amount paid for services. We are not liable for 
                  indirect, incidental, or consequential damages arising from the use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Termination</h2>
                <p className="text-muted-foreground">
                  Either party may terminate services with written notice. Upon termination, client is responsible 
                  for payment of work completed. Any proprietary materials will be returned or deleted as appropriate.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Continued use of services after changes 
                  constitutes acceptance of new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">10. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us through our website or reach out 
                  directly to discuss your concerns.
                </p>
              </section>
            </div>
          </div>
        </main>

        <footer className="relative z-10 glass-strong mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© 2025 DarkWave Studios</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-privacy">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
