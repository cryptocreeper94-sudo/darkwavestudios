import { Link } from "wouter";
import { ArrowLeft, LinkIcon } from "lucide-react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";

export default function AffiliateDisclosure() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Affiliate Disclosure - FTC Compliance"
        description="DarkWave Studios FTC-compliant Affiliate Disclosure. Learn how we use affiliate links and earn commissions while maintaining editorial independence."
        keywords="affiliate disclosure, FTC compliance, affiliate links, transparency"
        type="website"
        url="https://darkwavestudios.com/affiliate-disclosure"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Affiliate Disclosure", url: "https://darkwavestudios.com/affiliate-disclosure" }
        ]}
      />
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

      <div className="relative z-10">
        <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="glass-card rounded-2xl p-6 lg:p-12 gradient-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold font-display" data-testid="affiliate-disclosure-title">Affiliate Disclosure</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: February 2026</p>

              <section>
                <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground">
                  DarkWave Studios, LLC ("we," "us," or "our"), located in Nashville, TN, may earn commissions 
                  from affiliate links featured on our website. This means that when you click on certain links 
                  and make a purchase, we may receive a small commission at no additional cost to you. This 
                  affiliate income helps support the operation of our website and allows us to continue providing 
                  valuable content and services to our audience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. FTC Compliance</h2>
                <p className="text-muted-foreground">
                  In accordance with the Federal Trade Commission (FTC) guidelines, we are required to disclose 
                  any relationship between DarkWave Studios, LLC and the products or services we recommend. This 
                  disclosure is provided in compliance with the FTC's 16 CFR, Part 255: "Guides Concerning the 
                  Use of Endorsements and Testimonials in Advertising." We are committed to honest and transparent 
                  communication with our users regarding any compensation we receive through affiliate partnerships.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Affiliate Networks</h2>
                <p className="text-muted-foreground mb-3">
                  We participate in various affiliate programs and networks. When we recommend tools, platforms, 
                  hosting providers, software, or other products and services, some of these recommendations may 
                  include affiliate links. Our affiliate partnerships may include but are not limited to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
                  <li>Web hosting and domain providers</li>
                  <li>Software and development tools</li>
                  <li>Design and productivity applications</li>
                  <li>Cloud services and infrastructure</li>
                  <li>Educational courses and resources</li>
                  <li>Business and marketing tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Editorial Independence</h2>
                <p className="text-muted-foreground">
                  Our editorial content, opinions, and recommendations are entirely our own. Affiliate partnerships 
                  do not influence our editorial decisions, product reviews, or service recommendations. We only 
                  recommend products and services that we genuinely believe will provide value to our audience. 
                  Our reputation and the trust of our readers are paramount, and we will never compromise our 
                  integrity for affiliate commissions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. No Extra Cost to You</h2>
                <p className="text-muted-foreground">
                  When you click on an affiliate link and make a purchase, the price you pay is the same as if 
                  you had accessed the product or service directly. There is absolutely no additional cost to you 
                  for using our affiliate links. The commission we earn comes from the vendor or service provider, 
                  not from your pocket. In some cases, we may even be able to offer exclusive discounts through 
                  our affiliate partnerships.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. How Affiliate Links Work</h2>
                <p className="text-muted-foreground">
                  Affiliate links contain a unique tracking code that identifies DarkWave Studios, LLC as the 
                  referral source. When you click on one of these links, a small tracking cookie is placed on 
                  your device. If you complete a qualifying purchase within the cookie's active period, we receive 
                  a commission from the vendor. These links may appear in blog posts, resource pages, service 
                  comparisons, tool recommendations, and other content throughout our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Cookie Duration</h2>
                <p className="text-muted-foreground">
                  Affiliate tracking cookies have varying durations depending on the specific affiliate program. 
                  Cookie durations typically range from 24 hours to 90 days. During this window, if you make a 
                  qualifying purchase, we may receive a commission. You can manage or delete cookies at any time 
                  through your browser's privacy settings. Clearing your cookies will remove any affiliate tracking 
                  information from your device.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Advertising</h2>
                <p className="text-muted-foreground">
                  This website may display advertisements served by Google AdSense and other advertising networks. 
                  These ads may use cookies to serve ads based on your prior visits to this or other websites. 
                  You can opt out of personalized advertising by visiting{" "}
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    data-testid="link-google-ads-settings"
                  >
                    Google Ad Settings
                  </a>. For more information, please see our{" "}
                  <Link href="/privacy" className="text-primary hover:underline" data-testid="link-privacy-from-affiliate">
                    Privacy Policy
                  </Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Affiliate Disclosure or our affiliate partnerships, please 
                  don't hesitate to reach out. You can contact DarkWave Studios, LLC through our{" "}
                  <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact">
                    contact page
                  </Link>{" "}
                  or email us at support@dwsc.io.
                </p>
                <p className="text-muted-foreground mt-2">
                  DarkWave Studios, LLC<br />
                  Nashville, TN
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
