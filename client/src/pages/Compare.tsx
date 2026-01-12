import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  Users,
  Shield,
  Zap,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const comparisonPoints = [
  {
    category: "Support",
    darkwave: "Unlimited support included",
    competitor: "60 minutes/month — $150/hr after",
    savings: "$1,800+/year",
    icon: Clock
  },
  {
    category: "Communication",
    darkwave: "Direct developer access",
    competitor: "Project managers & ticket systems",
    savings: "Faster turnaround",
    icon: Users
  },
  {
    category: "Timeline",
    darkwave: "2-4 weeks typical",
    competitor: "8-16 weeks development",
    savings: "3-4 months faster",
    icon: Zap
  },
  {
    category: "Contract",
    darkwave: "Flexible terms",
    competitor: "24-month minimum lock-in",
    savings: "Freedom to leave",
    icon: Shield
  },
  {
    category: "Ownership",
    darkwave: "You own everything",
    competitor: "They own files until paid",
    savings: "Your assets",
    icon: CheckCircle2
  },
  {
    category: "Revisions",
    darkwave: "Unlimited revisions",
    competitor: "2 revisions, then $150/hr",
    savings: "$500+/project",
    icon: DollarSign
  }
];

const hortonBreakdown = [
  { item: "Discovery & Consultation", cost: 1750 },
  { item: "Website Design", cost: 4500 },
  { item: "Engineering & Development", cost: 6000 },
  { item: "Content Placement", cost: 1125 },
  { item: "Directory/SEO/Ads Setup", cost: 1750 },
  { item: "Monthly Services (×24 months)", cost: 36450 },
];

const hiddenFees = [
  {
    title: "Support Beyond 60 Minutes",
    description: "Only 1 hour of monthly support included. Need a quick change? That's $150/hour. Most businesses need 2-3 hours/month minimum.",
    cost: "$150/hr"
  },
  {
    title: "Additional Revisions",
    description: "Only 2 design revisions included. Don't like the third version? Pay up. Every 'minor' change gets scrutinized.",
    cost: "$150/hr"
  },
  {
    title: "Extra Training Sessions",
    description: "One hour of CMS training included. Need a refresher or have new staff? That's an extra $175 per session.",
    cost: "$175/session"
  },
  {
    title: "Content After Launch",
    description: "Any content added after 'Development Complete' is billed hourly. Want to update your services page? Pay again.",
    cost: "$150/hr"
  },
  {
    title: "Reactivation Fee",
    description: "If you don't respond to their emails for 30 days, you owe $2,000 to restart your project. Life gets busy? Too bad.",
    cost: "$2,000"
  },
  {
    title: "Credit Card Fee",
    description: "Want to pay with a credit card? Add 3.5% to every payment. That's over $1,600 extra on a typical project.",
    cost: "3.5%"
  }
];

const testimonialSlides = [
  {
    quote: "I was quoted $45,000 by a traditional agency for a basic business website. DarkWave built something better for a fraction of the cost.",
    author: "Local Business Owner",
    result: "Saved $30,000+"
  },
  {
    quote: "No more waiting weeks for simple updates. I text Jason, it's done the same day. That alone is worth switching.",
    author: "Service Company",
    result: "Same-day support"
  },
  {
    quote: "After being locked into a 24-month contract with limited support, working with DarkWave feels like freedom.",
    author: "Previous Agency Client",
    result: "No more lock-ins"
  }
];

export default function Compare() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const hortonTotal = hortonBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const darkwaveEstimate = Math.round(hortonTotal * 0.35);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonialSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonialSlides.length) % testimonialSlides.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="/compare" className="text-sm font-medium text-primary">Compare</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Get Quote
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">The Agency Pricing Reality</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Traditional Agency vs. <span className="gradient-text">DarkWave</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real numbers from real contracts. See why businesses are switching to direct developer relationships.
          </p>
        </div>

        {/* BENTO GRID: Main Comparison */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-8 lg:mb-12">
          
          {/* Cost Comparison Card - 3-col mobile / 6-col desktop */}
          <div className="col-span-3 lg:col-span-6">
            <div className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border h-full">
              <h2 className="text-lg lg:text-2xl font-bold font-display mb-4 lg:mb-6">
                24-Month <span className="text-red-400">True Cost</span>
              </h2>
              
              <div className="space-y-3 mb-6">
                {hortonBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm lg:text-base">
                    <span className="text-muted-foreground">{item.item}</span>
                    <span className="font-mono">${item.cost.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Traditional Agency Total</span>
                  <span className="font-mono text-xl lg:text-2xl text-red-400">${hortonTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass rounded-xl p-4 lg:p-6 bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg gradient-text">DarkWave Equivalent</span>
                  <span className="font-mono text-xl lg:text-2xl gradient-text">~${darkwaveEstimate.toLocaleString()}</span>
                </div>
                <div className="text-2xl lg:text-4xl font-bold font-display gradient-text text-center mt-4">
                  Save ${(hortonTotal - darkwaveEstimate).toLocaleString()}+
                </div>
              </div>
            </div>
          </div>

          {/* Key Differences - 3-col mobile / 6-col desktop */}
          <div className="col-span-3 lg:col-span-6">
            <div className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border h-full">
              <h2 className="text-lg lg:text-2xl font-bold font-display mb-4 lg:mb-6">
                What You <span className="gradient-text">Actually Get</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {comparisonPoints.slice(0, 6).map((point, i) => (
                  <div key={i} className="glass rounded-lg lg:rounded-xl p-3 lg:p-4 hover-lift">
                    <point.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary mb-2" />
                    <div className="text-xs lg:text-sm font-semibold mb-1">{point.category}</div>
                    <div className="text-[10px] lg:text-xs text-primary">{point.darkwave}</div>
                    <div className="text-[10px] lg:text-xs text-red-400 line-through opacity-60">{point.competitor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Comparison Table */}
        <section className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border mb-8 lg:mb-12 overflow-x-auto">
          <h2 className="text-lg lg:text-2xl font-bold font-display mb-4 lg:mb-6 text-center">
            Feature <span className="gradient-text">Comparison</span>
          </h2>
          
          <div className="min-w-[500px]">
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="text-muted-foreground text-sm lg:text-base font-medium">Feature</div>
              <div className="text-red-400 text-sm lg:text-base font-bold">Traditional Agency</div>
              <div className="gradient-text text-sm lg:text-base font-bold">DarkWave Studios</div>
            </div>
            
            {[
              { feature: "Monthly Support", competitor: "60 min included", darkwave: "Unlimited" },
              { feature: "Hourly Rate", competitor: "$150/hour", darkwave: "Included" },
              { feature: "Contract Term", competitor: "24-month minimum", darkwave: "Flexible" },
              { feature: "Design Revisions", competitor: "2 rounds only", darkwave: "Unlimited" },
              { feature: "Development Time", competitor: "8-16 weeks", darkwave: "2-4 weeks" },
              { feature: "Communication", competitor: "Project managers", darkwave: "Direct developer" },
              { feature: "File Ownership", competitor: "They own until paid", darkwave: "You own everything" },
              { feature: "SEO Work After Cancel", competitor: "Deleted in 30 days", darkwave: "Yours forever" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 py-3 border-t border-white/5 items-center">
                <div className="text-sm lg:text-base">{row.feature}</div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs lg:text-sm text-red-400">
                    <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    {row.competitor}
                  </span>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs lg:text-sm text-primary">
                    <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    {row.darkwave}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hidden Fees Accordion */}
        <section className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border mb-8 lg:mb-12">
          <h2 className="text-lg lg:text-2xl font-bold font-display mb-4 lg:mb-6">
            <span className="text-red-400">Hidden Fees</span> They Don't Tell You About
          </h2>
          
          <Accordion type="single" collapsible className="space-y-2 lg:space-y-3">
            {hiddenFees.map((fee, index) => (
              <AccordionItem 
                key={index} 
                value={`fee-${index}`}
                className="glass rounded-lg lg:rounded-xl border-0 overflow-hidden"
                data-testid={`hidden-fee-${index}`}
              >
                <AccordionTrigger className="px-4 lg:px-6 py-3 lg:py-4 text-left font-display font-semibold text-sm lg:text-base hover:no-underline hover:text-primary transition-colors">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{fee.title}</span>
                    <span className="text-red-400 font-mono text-sm">{fee.cost}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 lg:px-6 pb-4 lg:pb-6 text-muted-foreground text-sm leading-relaxed">
                  {fee.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Testimonials Carousel */}
        <section className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-8 gradient-border mb-8 lg:mb-12 relative">
          <h2 className="text-lg lg:text-2xl font-bold font-display mb-4 lg:mb-6 text-center">
            Why Clients <span className="gradient-text">Switch</span>
          </h2>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonialSlides.map((slide, i) => (
                <div key={i} className="w-full flex-shrink-0 px-4 lg:px-12">
                  <div className="text-center max-w-2xl mx-auto">
                    <p className="text-lg lg:text-2xl italic text-muted-foreground mb-6">
                      "{slide.quote}"
                    </p>
                    <div className="font-display font-semibold">{slide.author}</div>
                    <div className="text-primary text-sm">{slide.result}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-6">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              data-testid="carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonialSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-primary' : 'bg-white/20'
                  }`}
                  data-testid={`carousel-dot-${i}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              data-testid="carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="glass-card rounded-2xl p-8 lg:p-12 gradient-border max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-4xl font-bold font-display mb-4">
                Stop Overpaying for <span className="gradient-text">Basic Websites</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Get the same quality (often better) at 60%+ less. No 24-month lock-ins. No hourly support billing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="btn-glow inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold animate-pulse-glow"
                >
                  Get Your Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-bold gradient-text">DarkWave Studios</div>
          <div className="text-muted-foreground text-sm">© 2025. Built with passion, priced with honesty.</div>
        </div>
      </footer>
    </div>
  );
}
