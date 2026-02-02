import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Calculator, Zap, Check, Loader2, ChevronDown, ChevronUp, Sparkles, Clock, Shield, Code } from "lucide-react";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

import landingImg from "@assets/generated_images/landing_page_laptop_mockup.png";
import webappImg from "@assets/generated_images/web_application_dashboard_screen.png";
import ecommerceImg from "@assets/generated_images/e-commerce_shopping_interface.png";
import saasImg from "@assets/generated_images/saas_cloud_platform_visual.png";
import mobileImg from "@assets/generated_images/mobile_app_phones_floating.png";
import dashboardImg from "@assets/generated_images/analytics_dashboard_monitor.png";
import aiImg from "@assets/generated_images/ai_neural_network_visual.png";
import apiImg from "@assets/generated_images/api_data_connections_visual.png";

const projectTypes = [
  { id: "landing", name: "Landing Page", base: 997, icon: "🌐", image: landingImg },
  { id: "webapp", name: "Web Application", base: 2997, icon: "💻", image: webappImg },
  { id: "ecommerce", name: "E-Commerce Store", base: 3997, icon: "🛒", image: ecommerceImg },
  { id: "saas", name: "SaaS Platform", base: 4997, icon: "☁️", image: saasImg },
  { id: "mobile", name: "Mobile App", base: 4497, icon: "📱", image: mobileImg },
  { id: "dashboard", name: "Custom Dashboard", base: 2497, icon: "📊", image: dashboardImg },
  { id: "ai", name: "AI Integration", base: 1997, icon: "🤖", image: aiImg },
  { id: "api", name: "API Development", base: 1497, icon: "🔗", image: apiImg }
];

const features = [
  { id: "auth", name: "User Authentication", price: 497, desc: "Login, signup, password reset" },
  { id: "payments", name: "Payment Processing", price: 697, desc: "Stripe, subscriptions, invoicing" },
  { id: "analytics", name: "Analytics Dashboard", price: 797, desc: "Real-time metrics & reporting" },
  { id: "ai", name: "AI/ML Features", price: 997, desc: "ChatGPT, automation, predictions" },
  { id: "admin", name: "Admin Panel", price: 597, desc: "Content management, user management" },
  { id: "notifications", name: "Notifications", price: 297, desc: "Email, SMS, push notifications" },
  { id: "integrations", name: "3rd Party Integrations", price: 497, desc: "CRM, ERP, APIs" },
  { id: "mobile", name: "Mobile Responsive", price: 0, desc: "Included FREE with all projects" }
];

const monthlyPlans = [
  { id: "starter", name: "Starter", price: 99, desc: "Hosting, SSL, basic support" },
  { id: "growth", name: "Growth", price: 199, desc: "Priority support, updates, backups" },
  { id: "scale", name: "Scale", price: 399, desc: "Unlimited support, dedicated manager" }
];

const timelines = [
  { id: "standard", name: "Standard", weeks: "8-12 weeks", multiplier: 1 },
  { id: "accelerated", name: "Accelerated", weeks: "4-6 weeks", multiplier: 1.25 },
  { id: "rush", name: "Rush", weeks: "2-4 weeks", multiplier: 1.5 }
];

export default function Quote() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState("standard");
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [expandedSection, setExpandedSection] = useState<string | null>("type");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const calculateTotal = () => {
    const typePrice = projectTypes.find(t => t.id === selectedType)?.base || 0;
    const featuresPrice = features.filter(f => selectedFeatures.includes(f.id)).reduce((sum, f) => sum + f.price, 0);
    const timeline = timelines.find(t => t.id === selectedTimeline);
    return Math.round((typePrice + featuresPrice) * (timeline?.multiplier || 1));
  };

  const getMonthlyPrice = () => monthlyPlans.find(p => p.id === selectedPlan)?.price || 0;

  const traditionalPrice = () => Math.round(calculateTotal() * 3);

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedType || !formData.name || !formData.email) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          projectType: selectedType,
          features: selectedFeatures,
          timeline: selectedTimeline,
          estimatedCost: calculateTotal().toString(),
          description: formData.description || null
        })
      });
      
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Get a Quote - Instant Web Development Pricing Calculator"
        description="Calculate your web project cost instantly. Custom websites, web apps, e-commerce, and SaaS - all 60% less than traditional agencies. Transparent pricing, no surprises."
        keywords="web development quote, website pricing, app development cost, custom website quote, instant pricing calculator"
        type="website"
        url="https://darkwavestudios.com/quote"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Get a Quote", url: "https://darkwavestudios.com/quote" }
        ]}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Compare</Link>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary mb-6">
            <Calculator className="w-4 h-4" />
            <span>Instant Project Estimate</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            <span className="gradient-text">Quote Calculator</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get an instant estimate for your project. Transparent pricing with no hidden fees.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 lg:p-12 gradient-border text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-3 gradient-text">Quote Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your estimate of <span className="text-primary font-bold">${calculateTotal().toLocaleString()}</span> has been saved. 
              We'll review your requirements and send a detailed proposal within 24 hours.
            </p>
            <Link 
              href="/"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Calculator Section */}
            <div className="col-span-3 lg:col-span-8 space-y-4 lg:space-y-6">
              
              {/* Project Type Accordion */}
              <div className="glass-card rounded-2xl lg:rounded-3xl gradient-border overflow-hidden card-3d">
                <button
                  onClick={() => setExpandedSection(expandedSection === "type" ? null : "type")}
                  className="w-full p-6 flex items-center justify-between"
                  data-testid="button-expand-type"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">1. Project Type</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedType ? projectTypes.find(t => t.id === selectedType)?.name : "Select your project type"}
                      </p>
                    </div>
                  </div>
                  {expandedSection === "type" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSection === "type" && (
                  <div className="px-3 lg:px-6 pb-4 lg:pb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all text-left h-28 lg:h-40 group ${
                          selectedType === type.id 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 hover:border-white/20"
                        }`}
                        data-testid={`button-type-${type.id}`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
                          style={{ backgroundImage: `url(${type.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-3 lg:p-4">
                          <div className="text-xl lg:text-2xl mb-1">{type.icon}</div>
                          <div className="font-semibold text-xs lg:text-sm text-white leading-tight line-clamp-2">{type.name}</div>
                          <div className="text-[10px] lg:text-xs text-primary font-medium mt-0.5">From ${type.base.toLocaleString()}</div>
                        </div>
                        {selectedType === type.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Features Accordion */}
              <div className="glass-card rounded-2xl lg:rounded-3xl gradient-border overflow-hidden card-3d">
                <button
                  onClick={() => setExpandedSection(expandedSection === "features" ? null : "features")}
                  className="w-full p-6 flex items-center justify-between"
                  data-testid="button-expand-features"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">2. Features</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedFeatures.length > 0 ? `${selectedFeatures.length} features selected` : "Add optional features"}
                      </p>
                    </div>
                  </div>
                  {expandedSection === "features" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSection === "features" && (
                  <div className="px-3 lg:px-6 pb-4 lg:pb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => toggleFeature(feature.id)}
                        className={`p-3 lg:p-4 rounded-xl border-2 transition-all text-left relative min-h-[70px] lg:min-h-[90px] ${
                          selectedFeatures.includes(feature.id) 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        data-testid={`button-feature-${feature.id}`}
                      >
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          selectedFeatures.includes(feature.id) ? "border-primary bg-primary" : "border-white/30"
                        }`}>
                          {selectedFeatures.includes(feature.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="font-semibold text-xs lg:text-sm pr-6 leading-tight">{feature.name}</div>
                        <div className="text-xs lg:text-sm text-primary font-medium mt-1">
                          {feature.price === 0 ? "FREE" : `+$${feature.price}`}
                        </div>
                        <div className="text-[10px] lg:text-xs text-muted-foreground mt-1 hidden lg:block line-clamp-2">{feature.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timeline Accordion */}
              <div className="glass-card rounded-2xl lg:rounded-3xl gradient-border overflow-hidden card-3d">
                <button
                  onClick={() => setExpandedSection(expandedSection === "timeline" ? null : "timeline")}
                  className="w-full p-6 flex items-center justify-between"
                  data-testid="button-expand-timeline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">3. Timeline</h3>
                      <p className="text-sm text-muted-foreground">
                        {timelines.find(t => t.id === selectedTimeline)?.name} - {timelines.find(t => t.id === selectedTimeline)?.weeks}
                      </p>
                    </div>
                  </div>
                  {expandedSection === "timeline" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSection === "timeline" && (
                  <div className="px-3 lg:px-6 pb-4 lg:pb-6 grid grid-cols-3 gap-2 lg:gap-3">
                    {timelines.map((timeline) => (
                      <button
                        key={timeline.id}
                        onClick={() => setSelectedTimeline(timeline.id)}
                        className={`p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 transition-all text-left ${
                          selectedTimeline === timeline.id 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        data-testid={`button-timeline-${timeline.id}`}
                      >
                        <div className="font-semibold text-[10px] lg:text-base">{timeline.name}</div>
                        <div className="text-[9px] lg:text-sm text-muted-foreground">{timeline.weeks}</div>
                        {timeline.multiplier > 1 && (
                          <div className="text-[8px] lg:text-xs text-accent mt-0.5 lg:mt-1">+{Math.round((timeline.multiplier - 1) * 100)}%</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Monthly Service Plan */}
              <div className="glass-card rounded-2xl lg:rounded-3xl gradient-border overflow-hidden card-3d">
                <button
                  onClick={() => setExpandedSection(expandedSection === "plan" ? null : "plan")}
                  className="w-full p-6 flex items-center justify-between"
                  data-testid="button-expand-plan"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">4. Monthly Service Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {monthlyPlans.find(p => p.id === selectedPlan)?.name} - ${monthlyPlans.find(p => p.id === selectedPlan)?.price}/mo
                      </p>
                    </div>
                  </div>
                  {expandedSection === "plan" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSection === "plan" && (
                  <div className="px-3 lg:px-6 pb-4 lg:pb-6 grid grid-cols-3 gap-2 lg:gap-3">
                    {monthlyPlans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 transition-all text-left ${
                          selectedPlan === plan.id 
                            ? "border-green-400 bg-green-500/10" 
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        data-testid={`button-plan-${plan.id}`}
                      >
                        <div className="font-semibold text-[10px] lg:text-base">{plan.name}</div>
                        <div className="text-lg lg:text-2xl font-bold text-green-400">${plan.price}<span className="text-[9px] lg:text-sm text-muted-foreground">/mo</span></div>
                        <div className="text-[8px] lg:text-xs text-muted-foreground mt-0.5 lg:mt-1 hidden lg:block">{plan.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">5. Your Details</h3>
                    <p className="text-sm text-muted-foreground">We'll send your detailed quote</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    data-testid="input-quote-name"
                  />
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    data-testid="input-quote-email"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    data-testid="input-quote-phone"
                  />
                  <textarea
                    placeholder="Project details (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
                    rows={1}
                    data-testid="textarea-quote-description"
                  />
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="col-span-3 lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-4 lg:space-y-6">
              <div className="glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="font-bold text-lg mb-6 gradient-text">Your Estimate</h3>
                
                <div className="space-y-4 mb-6">
                  {selectedType && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm">{projectTypes.find(t => t.id === selectedType)?.name}</span>
                      <span className="font-semibold">${projectTypes.find(t => t.id === selectedType)?.base.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {selectedFeatures.map(id => {
                    const feature = features.find(f => f.id === id);
                    return feature ? (
                      <div key={id} className="flex items-center justify-between py-2 border-b border-white/10">
                        <span className="text-sm">{feature.name}</span>
                        <span className="font-semibold">+${feature.price.toLocaleString()}</span>
                      </div>
                    ) : null;
                  })}
                  
                  {selectedTimeline !== "standard" && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm">{timelines.find(t => t.id === selectedTimeline)?.name} Timeline</span>
                      <span className="font-semibold text-accent">+{Math.round((timelines.find(t => t.id === selectedTimeline)?.multiplier || 1 - 1) * 100)}%</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-primary/10 mb-3">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">One-Time Build</div>
                  <div className="text-3xl font-bold gradient-text">${calculateTotal().toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-3">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Monthly Service</div>
                  <div className="text-2xl font-bold text-green-400">${getMonthlyPrice()}<span className="text-sm">/mo</span></div>
                  <div className="text-xs text-muted-foreground mt-1">{monthlyPlans.find(p => p.id === selectedPlan)?.desc}</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 mb-6">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Traditional Agency</div>
                  <div className="text-xl font-bold text-red-400 line-through">${traditionalPrice().toLocaleString()}</div>
                  <div className="text-xs text-green-400 mt-1">Save ${(traditionalPrice() - calculateTotal()).toLocaleString()} + get ongoing support!</div>
                </div>

                {(!formData.name || !formData.email) && (
                  <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm text-center">
                    Please fill in your Name and Email above to get your quote
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedType || !formData.name || !formData.email || loading}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                    (!formData.name || !formData.email || !selectedType) 
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                      : "btn-glow bg-primary text-primary-foreground"
                  }`}
                  data-testid="button-submit-quote"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get My Quote
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Includes Card */}
              <div className="glass-card rounded-2xl p-6 gradient-border">
                <h4 className="font-bold text-sm mb-4">All Projects Include:</h4>
                <div className="space-y-2">
                  {["Unlimited Support", "Source Code Ownership", "30-Day Bug Fixes", "Performance Optimization", "SEO Best Practices"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
