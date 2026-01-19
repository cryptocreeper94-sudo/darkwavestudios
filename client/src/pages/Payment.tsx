import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, CreditCard, Bitcoin, Check, Zap, Shield, 
  Clock, Users, Rocket, Star, Sparkles, ArrowRight
} from "lucide-react";

import starterImg from "@assets/stock_images/electric_energy_ligh_ce0a8be1.jpg";
import growthImg from "@assets/stock_images/business_growth_char_5920f51f.jpg";
import scaleImg from "@assets/stock_images/city_skyline_corpora_dc5f4033.jpg";
import landingImg from "@assets/stock_images/laptop_website_desig_6884969e.jpg";
import businessImg from "@assets/stock_images/modern_office_desk_w_5943966b.jpg";
import ecommerceImg from "@assets/stock_images/shopping_cart_ecomme_dba40b90.jpg";
import saasImg from "@assets/stock_images/code_programming_scr_4cd47126.jpg";

interface PaymentConfig {
  stripePublishableKey: string | null;
  coinbaseEnabled: boolean;
  plans: Record<string, { name: string; price: number; priceId: string }>;
}

const monthlyPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "Perfect for small businesses",
    image: starterImg,
    features: [
      "Up to 5 support tickets/month",
      "48-hour response time",
      "Basic maintenance",
      "Security updates",
      "Monthly reports"
    ],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 199,
    description: "Scale your online presence",
    image: growthImg,
    features: [
      "Unlimited support tickets",
      "24-hour response time",
      "Priority maintenance",
      "Performance optimization",
      "Weekly reports",
      "A/B testing support"
    ],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 399,
    description: "Enterprise-grade support",
    image: scaleImg,
    features: [
      "Dedicated account manager",
      "4-hour response time",
      "24/7 emergency support",
      "Custom integrations",
      "Real-time monitoring",
      "Strategy consulting",
      "Quarterly reviews"
    ],
    popular: false,
  },
];

const oneTimePlans = [
  {
    id: "custom_landing",
    name: "Landing Page",
    price: 997,
    description: "High-converting single page",
    image: landingImg,
    features: ["Custom design", "Mobile optimized", "SEO setup", "Contact form", "Analytics"],
  },
  {
    id: "custom_business",
    name: "Business Site",
    price: 1997,
    description: "Professional multi-page site",
    image: businessImg,
    features: ["5-10 pages", "CMS integration", "Blog setup", "Lead capture", "Social integration"],
  },
  {
    id: "custom_ecommerce",
    name: "E-Commerce",
    price: 3997,
    description: "Full online store",
    image: ecommerceImg,
    features: ["Product catalog", "Payment integration", "Inventory management", "Customer accounts", "Analytics dashboard"],
  },
  {
    id: "custom_saas",
    name: "SaaS App",
    price: 4997,
    description: "Custom web application",
    image: saasImg,
    features: ["User authentication", "Database design", "API development", "Admin dashboard", "Scalable architecture"],
  },
];

export default function Payment() {
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "coinbase">("stripe");
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"monthly" | "onetime">("monthly");

  useEffect(() => {
    fetch("/api/payments/config")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan || !customerInfo.name || !customerInfo.email) return;
    
    setProcessing(true);
    try {
      if (paymentMethod === "stripe") {
        const response = await fetch("/api/payments/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planType: selectedPlan,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          }),
        });
        const data = await response.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || "Failed to create checkout session");
        }
      } else {
        const response = await fetch("/api/payments/coinbase/create-charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planType: selectedPlan,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          }),
        });
        const data = await response.json();
        if (data.success && data.hostedUrl) {
          window.location.href = data.hostedUrl;
        } else {
          alert(data.error || "Failed to create crypto payment");
        }
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const selectedPlanData = selectedPlan 
    ? [...monthlyPlans, ...oneTimePlans].find(p => p.id === selectedPlan)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl gradient-text" data-testid="link-home">
            DarkWave Studios
          </Link>
          <Link 
            href="/quote" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-back-quote"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quote
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16 pt-24">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary mb-6">
            <Shield className="w-4 h-4" />
            <span>Secure Payment — SSL Encrypted</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Pay with card or cryptocurrency.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Tab Switcher */}
          <div className="col-span-3 lg:col-span-12 flex justify-center mb-4">
            <div className="glass-card rounded-2xl p-1.5 flex gap-2">
              <button
                onClick={() => setActiveTab("monthly")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "monthly" 
                    ? "bg-gradient-to-r from-primary to-accent text-white" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-tab-monthly"
              >
                Monthly Plans
              </button>
              <button
                onClick={() => setActiveTab("onetime")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "onetime" 
                    ? "bg-gradient-to-r from-primary to-accent text-white" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-tab-onetime"
              >
                One-Time Projects
              </button>
            </div>
          </div>

          {/* Monthly Plans - 3 Cards Side by Side */}
          {activeTab === "monthly" && (
            <div className="col-span-3 lg:col-span-12 flex flex-row gap-4">
              {monthlyPlans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`flex-1 min-w-0 glass-card rounded-2xl overflow-hidden gradient-border card-3d cursor-pointer transition-all relative ${
                    selectedPlan === plan.id 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-white/5"
                  } ${plan.popular ? "-mt-2 mb-2" : ""}`}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="relative w-full h-20 lg:h-24 overflow-hidden">
                    <img 
                      src={plan.image} 
                      alt={plan.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className={`absolute bottom-2 left-2 w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${
                      plan.popular 
                        ? "bg-gradient-to-br from-primary to-accent" 
                        : "bg-gradient-to-br from-primary/80 to-accent/80"
                    }`}>
                      {plan.id === "starter" && <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />}
                      {plan.id === "growth" && <Rocket className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />}
                      {plan.id === "scale" && <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />}
                    </div>
                  </div>

                  <div className="p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-sm lg:text-lg">{plan.name}</h3>
                      <div>
                        <span className="text-lg lg:text-2xl font-bold gradient-text">${plan.price}</span>
                        <span className="text-muted-foreground text-xs">/mo</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 lg:mb-3 hidden lg:block">{plan.description}</p>

                    <ul className="space-y-1 lg:space-y-1.5 mb-3 lg:mb-4">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5 lg:gap-2 text-xs">
                          <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-xs text-primary">+{plan.features.length - 3} more</li>
                      )}
                    </ul>

                    <div className={`w-full py-2 rounded-lg text-center text-xs lg:text-sm font-medium transition-all ${
                      selectedPlan === plan.id 
                        ? "bg-gradient-to-r from-primary to-accent text-white" 
                        : "bg-white/10 text-foreground"
                    }`}>
                      {selectedPlan === plan.id ? "Selected" : "Select"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* One-Time Project Plans - Horizontal Layout */}
          {activeTab === "onetime" && oneTimePlans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`col-span-3 lg:col-span-6 glass-card rounded-2xl lg:rounded-3xl overflow-hidden gradient-border card-3d cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? "ring-2 ring-primary bg-primary/10" 
                  : "hover:bg-white/5"
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img 
                    src={plan.image} 
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 hidden sm:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent sm:hidden" />
                  <div className="absolute bottom-2 left-2 sm:bottom-auto sm:top-2 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold">{plan.name}</h3>
                    <div>
                      <span className="text-xl font-bold gradient-text">${plan.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>

                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout Section */}
          {selectedPlan && (
            <>
              {/* Customer Info */}
              <div className="col-span-3 lg:col-span-6 glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border">
                <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  Your Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="John Smith"
                      data-testid="input-customer-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="john@company.com"
                      data-testid="input-customer-email"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="col-span-3 lg:col-span-6 glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border">
                <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                      paymentMethod === "stripe" 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                    data-testid="button-payment-stripe"
                  >
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-medium">Credit Card</div>
                      <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
                    </div>
                  </button>
                  
                  {config?.coinbaseEnabled && (
                    <button
                      onClick={() => setPaymentMethod("coinbase")}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        paymentMethod === "coinbase" 
                          ? "border-primary bg-primary/10" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                      data-testid="button-payment-coinbase"
                    >
                      <Bitcoin className="w-8 h-8 text-[#F7931A]" />
                      <div className="text-center">
                        <div className="font-medium">Crypto</div>
                        <div className="text-xs text-muted-foreground">BTC, ETH, USDC</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Order Summary & Pay Button */}
              <div className="col-span-3 lg:col-span-12 glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl">{selectedPlanData?.name}</h3>
                      <p className="text-muted-foreground">
                        ${selectedPlanData?.price.toLocaleString()}
                        {selectedPlan && !selectedPlan.startsWith("custom_") ? "/month" : " one-time"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing || !customerInfo.name || !customerInfo.email}
                    className="glow-button w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-pay-now"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "stripe" ? <CreditCard className="w-5 h-5" /> : <Bitcoin className="w-5 h-5" />}
                        Pay ${selectedPlanData?.price.toLocaleString()} Now
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Trust Badges */}
          <div className="col-span-3 lg:col-span-12 grid grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            <div className="col-span-1 glass-card rounded-xl p-4 text-center">
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">SSL Encrypted</div>
            </div>
            <div className="col-span-1 glass-card rounded-xl p-4 text-center">
              <CreditCard className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">PCI Compliant</div>
            </div>
            <div className="col-span-1 glass-card rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">24hr Support</div>
            </div>
            <div className="col-span-3 lg:col-span-1 glass-card rounded-xl p-4 text-center">
              <Star className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">Money-back Guarantee</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
