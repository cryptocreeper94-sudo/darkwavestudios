import { useState } from "react";
import { Link } from "wouter";
import { 
  Download, 
  FileText, 
  CheckSquare, 
  Rocket, 
  Code, 
  Palette,
  ArrowLeft,
  ArrowRight,
  Mail,
  Shield,
  Zap,
  BookOpen
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  downloadName: string;
  content: string;
}

const resources: Resource[] = [
  {
    id: "launch-checklist",
    title: "Website Launch Checklist",
    description: "The complete 50-point checklist we use before launching any website. Covers SEO, performance, security, and accessibility.",
    category: "Checklists",
    icon: CheckSquare,
    downloadName: "DarkWave-Website-Launch-Checklist.txt",
    content: `DARKWAVE STUDIOS - WEBSITE LAUNCH CHECKLIST
============================================

PRE-LAUNCH ESSENTIALS
---------------------
[ ] All pages have unique title tags
[ ] Meta descriptions written for all pages
[ ] Open Graph tags configured for social sharing
[ ] Favicon and app icons uploaded
[ ] 404 error page created and styled
[ ] Contact forms tested and working
[ ] Email notifications configured
[ ] Analytics installed (Google Analytics/Plausible)

PERFORMANCE
-----------
[ ] Images optimized (WebP format, compressed)
[ ] Lazy loading enabled for images
[ ] CSS and JS minified
[ ] Gzip compression enabled
[ ] CDN configured for static assets
[ ] Page speed score > 80 on mobile
[ ] Core Web Vitals passing

SEO
---
[ ] XML sitemap generated and submitted
[ ] Robots.txt configured correctly
[ ] Canonical URLs set
[ ] Schema markup implemented
[ ] Internal linking structure reviewed
[ ] Alt text on all images
[ ] H1 tags on every page (only one per page)

SECURITY
--------
[ ] SSL certificate installed (HTTPS)
[ ] Security headers configured
[ ] Form validation and sanitization
[ ] Rate limiting on API endpoints
[ ] Secure authentication if applicable
[ ] Backup system in place

MOBILE & ACCESSIBILITY
----------------------
[ ] Responsive design tested on all devices
[ ] Touch targets are 44px minimum
[ ] Contrast ratios meet WCAG standards
[ ] Keyboard navigation works
[ ] Screen reader tested
[ ] Focus states visible

FINAL CHECKS
------------
[ ] All links working (no 404s)
[ ] Spelling and grammar checked
[ ] Legal pages (Privacy, Terms) present
[ ] Contact information correct
[ ] Social media links working
[ ] Cross-browser testing complete

---
Brought to you by DarkWave Studios
https://darkwavestudios.io
`
  },
  {
    id: "seo-guide",
    title: "SEO Quick Start Guide",
    description: "A beginner-friendly guide to optimizing your website for search engines. Covers the fundamentals that make 80% of the difference.",
    category: "Guides",
    icon: BookOpen,
    downloadName: "DarkWave-SEO-Quick-Start-Guide.txt",
    content: `DARKWAVE STUDIOS - SEO QUICK START GUIDE
=========================================

THE 80/20 OF SEO
----------------
Focus on these fundamentals before anything else:

1. TITLE TAGS
   - Include your main keyword
   - Keep under 60 characters
   - Make it compelling to click
   Example: "Web Design Nashville | Custom Websites from $997"

2. META DESCRIPTIONS
   - Summarize the page in 155 characters
   - Include a call-to-action
   - Use your target keyword naturally

3. HEADING STRUCTURE
   - One H1 per page (your main topic)
   - Use H2s for main sections
   - Use H3s for subsections
   - Include keywords naturally

4. CONTENT QUALITY
   - Answer user questions thoroughly
   - Aim for 1000+ words on important pages
   - Use original images and graphics
   - Update content regularly

5. TECHNICAL BASICS
   - Fast loading speed (under 3 seconds)
   - Mobile-friendly design
   - HTTPS secure connection
   - Clean URL structure

6. LOCAL SEO (if applicable)
   - Google Business Profile claimed
   - Consistent NAP (Name, Address, Phone)
   - Local keywords in content
   - Customer reviews

QUICK WINS
----------
1. Add schema markup to your homepage
2. Create an XML sitemap
3. Submit to Google Search Console
4. Get backlinks from local directories
5. Write helpful blog content monthly

TOOLS WE RECOMMEND
------------------
- Google Search Console (free)
- Ahrefs or SEMrush (keyword research)
- PageSpeed Insights (performance)
- Screaming Frog (site audits)

---
Need help with SEO? Book a free consultation.
https://darkwavestudios.io/book
`
  },
  {
    id: "project-brief",
    title: "Project Brief Template",
    description: "The exact template we use to scope projects. Fill this out before your consultation to get the most accurate quote.",
    category: "Templates",
    icon: FileText,
    downloadName: "DarkWave-Project-Brief-Template.txt",
    content: `DARKWAVE STUDIOS - PROJECT BRIEF TEMPLATE
==========================================

ABOUT YOUR BUSINESS
-------------------
Business Name: ________________________
Industry: ________________________
Website (if existing): ________________________
Main Products/Services: ________________________

TARGET AUDIENCE
---------------
Who are your ideal customers?
________________________

What problems do you solve for them?
________________________

PROJECT GOALS
-------------
What do you want your website to achieve?
[ ] Generate leads
[ ] Sell products online
[ ] Showcase portfolio
[ ] Provide information
[ ] Book appointments
[ ] Other: ________________________

DESIGN PREFERENCES
------------------
Websites you like (list 2-3 URLs):
1. ________________________
2. ________________________
3. ________________________

What do you like about them?
________________________

Preferred colors/branding:
________________________

FUNCTIONALITY NEEDED
--------------------
Check all that apply:
[ ] Contact form
[ ] Newsletter signup
[ ] E-commerce/shopping cart
[ ] Booking/scheduling
[ ] Blog
[ ] User accounts/login
[ ] CRM integration
[ ] Payment processing
[ ] Chat widget
[ ] Other: ________________________

CONTENT
-------
Do you have existing content?
[ ] Yes, ready to use
[ ] Need help with copywriting
[ ] Need photography/graphics

Number of pages needed (estimate):
[ ] 1-5 pages
[ ] 6-10 pages
[ ] 11-20 pages
[ ] 20+ pages

TIMELINE & BUDGET
-----------------
Desired launch date: ________________________

Budget range:
[ ] Under $1,000
[ ] $1,000 - $3,000
[ ] $3,000 - $5,000
[ ] $5,000 - $10,000
[ ] $10,000+

ADDITIONAL NOTES
----------------
Anything else we should know?
________________________

---
Email completed brief to: hello@darkwavestudios.io
Or book a call: https://darkwavestudios.io/book
`
  },
  {
    id: "tech-stack",
    title: "Modern Tech Stack Guide",
    description: "Our recommended tech stack for different project types. Learn what technologies power fast, scalable web applications.",
    category: "Guides",
    icon: Code,
    downloadName: "DarkWave-Tech-Stack-Guide.txt",
    content: `DARKWAVE STUDIOS - MODERN TECH STACK GUIDE
===========================================

LANDING PAGES & MARKETING SITES
-------------------------------
Best for: Speed, SEO, simple updates

Frontend:
- React or Next.js
- Tailwind CSS for styling
- Framer Motion for animations

Backend:
- Headless CMS (Sanity, Contentful)
- Or static with Markdown

Hosting:
- Vercel or Netlify
- Cloudflare for CDN

BUSINESS WEBSITES
-----------------
Best for: Lead generation, contact forms, blogs

Frontend:
- Next.js (React framework)
- Tailwind CSS
- Shadcn/ui components

Backend:
- Node.js/Express API
- PostgreSQL database
- Drizzle ORM

Hosting:
- Vercel or Replit
- Managed PostgreSQL

E-COMMERCE
----------
Best for: Online stores, product catalogs

Option 1 - Custom:
- Next.js frontend
- Stripe for payments
- PostgreSQL for products

Option 2 - Platform:
- Shopify with custom theme
- Hydrogen (Shopify's React framework)

SAAS APPLICATIONS
-----------------
Best for: Subscription products, user dashboards

Frontend:
- React with TypeScript
- React Query for data fetching
- Zustand for state management

Backend:
- Node.js/Express or FastAPI (Python)
- PostgreSQL database
- Redis for caching

Auth:
- Clerk or Auth0
- Or custom JWT

Payments:
- Stripe with webhooks

AI-POWERED APPS
---------------
Frontend:
- React with streaming UI
- Vercel AI SDK

Backend:
- Python FastAPI
- OpenAI/Anthropic APIs
- Vector database (Pinecone, Supabase)

MOBILE APPS
-----------
Cross-platform:
- React Native or Flutter
- Expo for React Native

Backend:
- Same as SaaS stack
- Push notifications (OneSignal)

---
Questions about your stack? Let's talk.
https://darkwavestudios.io/book
`
  },
  {
    id: "design-principles",
    title: "Web Design Best Practices",
    description: "The design principles that make websites convert. Covers layout, typography, color, and user psychology.",
    category: "Guides",
    icon: Palette,
    downloadName: "DarkWave-Design-Best-Practices.txt",
    content: `DARKWAVE STUDIOS - WEB DESIGN BEST PRACTICES
=============================================

LAYOUT PRINCIPLES
-----------------
1. F-Pattern for content pages
   Users scan in an F-shape: headline, subheadings, left side

2. Z-Pattern for landing pages
   Logo -> Nav -> Hero -> CTA

3. White Space
   Don't fear empty space - it improves readability

4. Visual Hierarchy
   Size and color guide the eye to what matters

TYPOGRAPHY
----------
1. Limit to 2-3 fonts
   - One for headings (display font)
   - One for body (readable sans-serif)
   - Optional: accent or code font

2. Font Sizing Scale
   - H1: 2.5-4rem
   - H2: 2-2.5rem
   - H3: 1.5-2rem
   - Body: 1-1.125rem
   - Small: 0.875rem

3. Line Height
   - Body text: 1.5-1.7
   - Headings: 1.1-1.3

4. Maximum Line Width
   - 60-75 characters per line
   - Use max-width: 65ch

COLOR
-----
1. 60-30-10 Rule
   - 60% primary (background)
   - 30% secondary
   - 10% accent (CTAs)

2. Contrast Ratios
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Use WebAIM Contrast Checker

3. Dark Mode Tips
   - Don't use pure black (#000)
   - Reduce contrast slightly
   - Dim saturated colors

CONVERSION ELEMENTS
-------------------
1. Clear CTAs
   - One primary action per screen
   - Use action words ("Get Started", "Book Now")
   - Make buttons look clickable

2. Social Proof
   - Testimonials with photos
   - Client logos
   - Numbers/stats

3. Trust Signals
   - Security badges
   - Guarantees
   - Contact information visible

4. Reduce Friction
   - Fewer form fields
   - Guest checkout options
   - Progress indicators

MOBILE-FIRST
------------
1. Touch targets: 44px minimum
2. Thumb-friendly navigation
3. Collapsible menus
4. Stack elements vertically
5. Larger text on mobile

---
Want a design review? Book a call.
https://darkwavestudios.io/book
`
  },
  {
    id: "performance-checklist",
    title: "Performance Optimization Checklist",
    description: "Speed up your website with this technical checklist. Covers images, caching, code optimization, and server configuration.",
    category: "Checklists",
    icon: Zap,
    downloadName: "DarkWave-Performance-Checklist.txt",
    content: `DARKWAVE STUDIOS - PERFORMANCE OPTIMIZATION CHECKLIST
=====================================================

IMAGE OPTIMIZATION
------------------
[ ] Convert images to WebP format
[ ] Compress images (TinyPNG, Squoosh)
[ ] Use appropriate image dimensions
[ ] Implement lazy loading
[ ] Add width/height attributes
[ ] Use responsive images (srcset)
[ ] Consider using CDN for images

CODE OPTIMIZATION
-----------------
[ ] Minify CSS files
[ ] Minify JavaScript files
[ ] Remove unused CSS (PurgeCSS)
[ ] Tree-shake unused JavaScript
[ ] Code split by route
[ ] Defer non-critical JavaScript
[ ] Inline critical CSS

CACHING
-------
[ ] Set proper cache headers
[ ] Implement browser caching
[ ] Use a CDN (Cloudflare, Fastly)
[ ] Cache API responses where appropriate
[ ] Implement service worker for offline

SERVER
------
[ ] Enable Gzip/Brotli compression
[ ] Use HTTP/2 or HTTP/3
[ ] Optimize database queries
[ ] Implement connection pooling
[ ] Consider edge functions

FONTS
-----
[ ] Self-host fonts if possible
[ ] Use font-display: swap
[ ] Subset fonts to needed characters
[ ] Preload critical fonts
[ ] Limit number of font weights

THIRD-PARTY SCRIPTS
-------------------
[ ] Audit all third-party scripts
[ ] Remove unnecessary scripts
[ ] Load scripts asynchronously
[ ] Consider self-hosting analytics
[ ] Use facade for embeds (YouTube, etc.)

MONITORING
----------
[ ] Set up Real User Monitoring (RUM)
[ ] Monitor Core Web Vitals
[ ] Set performance budgets
[ ] Regular lighthouse audits
[ ] Monitor server response times

CORE WEB VITALS TARGETS
-----------------------
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1

TOOLS
-----
- PageSpeed Insights
- WebPageTest
- Lighthouse (Chrome DevTools)
- GTmetrix
- Chrome User Experience Report

---
Need help optimizing? We can help.
https://darkwavestudios.io/quote
`
  }
];

export default function Resources() {
  const [email, setEmail] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleDownload = (resource: Resource) => {
    setSelectedResource(resource);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedResource) return;

    setDownloadingId(selectedResource.id);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Resource Download",
          email,
          message: `Downloaded: ${selectedResource.title}`,
          source: "resource_download",
          projectType: "Resource Download"
        })
      });

      // Create and trigger download
      const blob = new Blob([selectedResource.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedResource.downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setEmailSubmitted(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSubmitted(false);
        setSelectedResource(null);
        setEmail("");
      }, 2000);
    } catch (err) {
      console.error("Failed to save lead");
    } finally {
      setDownloadingId(null);
    }
  };

  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Free Resources & Templates"
        description="Download free website checklists, SEO guides, project templates, and more. Expert resources to help you build better websites."
        keywords="free website templates, SEO checklist, web design guide, project brief template, developer resources"
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave Studios
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/audit" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Free Audit</Link>
            <Link href="/quote" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Get Quote</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Contact Us
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Download className="w-4 h-4" />
            Free Downloads
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Free <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download our proven templates, checklists, and guides. The same resources we use to build successful websites for our clients.
          </p>
        </div>

        {/* Resources Grid */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              {category === "Checklists" && <CheckSquare className="w-5 h-5 text-primary" />}
              {category === "Guides" && <BookOpen className="w-5 h-5 text-primary" />}
              {category === "Templates" && <FileText className="w-5 h-5 text-primary" />}
              {category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => r.category === category).map(resource => (
                <div key={resource.id} className="glass-card rounded-xl p-6 gradient-border hover:bg-white/5 transition-colors">
                  <resource.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="w-full py-3 rounded-lg bg-primary/10 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                    data-testid={`button-download-${resource.id}`}
                  >
                    <Download className="w-4 h-4" />
                    Download Free
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-16 glass-card rounded-2xl p-8 lg:p-12 gradient-border text-center bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-4">
            Need Custom Solutions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            These resources are just the beginning. Let us build a custom website tailored to your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-glow bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2">
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/audit" className="glass-card px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <Shield className="w-5 h-5" />
              Free Website Audit
            </Link>
          </div>
        </div>
      </main>

      {/* Email Modal */}
      {showEmailModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 lg:p-8 max-w-md w-full gradient-border">
            {!emailSubmitted ? (
              <>
                <h3 className="text-xl font-bold font-display mb-2">
                  Download {selectedResource.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Enter your email to download. We'll also send you helpful tips occasionally.
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <div className="relative mb-4">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                      required
                      data-testid="input-modal-email"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={downloadingId === selectedResource.id}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                      data-testid="button-submit-download"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <Rocket className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Download Started!</h3>
                <p className="text-muted-foreground">Check your downloads folder.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
