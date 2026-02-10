import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, Mail, Clock, MessageSquare } from "lucide-react";
import heroBackground from "@assets/generated_images/dark_tech_abstract_background.png";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";

const faqCategories = [
  {
    name: "General",
    questions: [
      {
        q: "What is DarkWave Studios?",
        a: "DarkWave Studios is a full-service web development agency based in Nashville, TN. We build custom websites, web applications, AI-powered solutions, and e-commerce platforms for businesses of all sizes."
      },
      {
        q: "How do I get started with a project?",
        a: "The easiest way to get started is to fill out our contact form, request a quote, or book a free consultation call. We'll discuss your project requirements, timeline, and budget to create a custom proposal."
      },
      {
        q: "Where is DarkWave Studios located?",
        a: "We're based in Nashville, Tennessee, but we work with clients worldwide. All communication and collaboration happens remotely through video calls, email, and our project management tools."
      },
      {
        q: "What makes you different from other agencies?",
        a: "We offer direct developer access (no account managers in between), agency-quality work at 60%+ savings compared to traditional agencies, unlimited support, and a transparent development process."
      }
    ]
  },
  {
    name: "Services",
    questions: [
      {
        q: "What services do you offer?",
        a: "We offer custom web development, web application development, AI integration, e-commerce solutions, SaaS development, UI/UX design, mobile-responsive websites, API development, and ongoing maintenance and support."
      },
      {
        q: "Do you build mobile apps?",
        a: "We specialize in responsive web applications that work beautifully on all devices. For native mobile apps, we can build progressive web apps (PWAs) or recommend trusted partners for native iOS/Android development."
      },
      {
        q: "Can you help with an existing website?",
        a: "Yes! We offer redesigns, feature additions, performance optimization, bug fixes, and ongoing maintenance for existing websites and applications, regardless of the original technology stack."
      },
      {
        q: "Do you offer website hosting?",
        a: "We can help you set up and manage hosting through reliable cloud providers. Hosting costs are separate from development fees and depend on your project's requirements."
      }
    ]
  },
  {
    name: "Pricing",
    questions: [
      {
        q: "How much does a website cost?",
        a: "Project costs vary based on complexity, features, and timeline. Simple websites start around $1,500, while complex web applications can range from $5,000 to $25,000+. We provide detailed quotes after understanding your specific needs."
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes, we offer flexible payment options including milestone-based payments and monthly installment plans. We typically require a deposit to begin work, with remaining payments tied to project milestones."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept credit/debit cards via Stripe, cryptocurrency via Coinbase Commerce, bank transfers, and other standard payment methods. All transactions are secure and encrypted."
      },
      {
        q: "Is there a monthly subscription option?",
        a: "Yes, we offer ongoing maintenance and support plans, as well as an ad-free browsing subscription ($5/month) that removes all advertisements from our platform."
      }
    ]
  },
  {
    name: "Technical",
    questions: [
      {
        q: "What technologies do you use?",
        a: "We primarily work with React, TypeScript, Node.js, PostgreSQL, and modern frameworks like Next.js and Vite. We also integrate AI services (OpenAI, custom models), payment processors (Stripe, Coinbase), and various third-party APIs."
      },
      {
        q: "How long does a typical project take?",
        a: "Timeline depends on project scope. A simple website takes 2-4 weeks, a standard web application 4-8 weeks, and complex platforms 8-16+ weeks. We provide estimated timelines in our project proposals."
      },
      {
        q: "Do you provide source code?",
        a: "Yes, upon project completion and final payment, you receive full ownership of all source code and assets. We can also help with deployment and handoff documentation."
      },
      {
        q: "How many revisions are included?",
        a: "Our standard projects include up to 3 rounds of revisions at each milestone. Additional revisions beyond that are billed at our hourly rate. We work closely with you throughout development to minimize the need for extensive revisions."
      }
    ]
  },
  {
    name: "Support",
    questions: [
      {
        q: "What are your support hours?",
        a: "Our standard support hours are Monday through Friday, 9:00 AM to 6:00 PM Central Time. For urgent issues, we offer extended support options for clients on maintenance plans."
      },
      {
        q: "How do I report a bug or issue?",
        a: "You can report issues through our contact form, email us at team@dwsc.io, or reach out via Signal Chat on our platform. We aim to acknowledge all support requests within 24 hours."
      },
      {
        q: "Do you offer ongoing maintenance?",
        a: "Yes, we offer monthly maintenance plans that include security updates, bug fixes, performance monitoring, content updates, and priority support. Plans are customized based on your needs."
      },
      {
        q: "What is Signal Chat?",
        a: "Signal Chat is our built-in real-time messaging platform available on DarkWave Studios. It allows you to communicate directly with our team and other community members through secure, encrypted channels."
      }
    ]
  }
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => 
    (!activeCategory || cat.name === activeCategory) && cat.questions.length > 0
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Support & FAQ"
        description="Get help with DarkWave Studios services. Browse frequently asked questions about web development, pricing, timelines, and technical support."
        keywords="support, FAQ, help, web development questions, customer support"
        type="website"
        url="https://darkwavestudios.com/support"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Support & FAQ", url: "https://darkwavestudios.com/support" }
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

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold font-display" data-testid="support-title">
              Support & <span className="gradient-text">FAQ</span>
            </h1>
          </div>
          <p className="text-muted-foreground mb-8">Find answers to common questions or reach out to our team for help.</p>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              data-testid="input-faq-search"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
              data-testid="button-category-all"
            >
              All
            </button>
            {faqCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.name ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
                data-testid={`button-category-${cat.name.toLowerCase()}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-8 mb-12">
            {filteredCategories.map(cat => (
              <div key={cat.name}>
                <h2 className="text-lg font-bold mb-4 text-foreground">{cat.name}</h2>
                <div className="space-y-2">
                  {cat.questions.map((item, idx) => {
                    const key = `${cat.name}-${idx}`;
                    const isExpanded = expandedItems.has(key);
                    return (
                      <div key={key} className="glass-card rounded-xl gradient-border overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                          data-testid={`button-faq-${cat.name.toLowerCase()}-${idx}`}
                        >
                          <span className="font-medium text-base lg:text-lg pr-4">{item.q}</span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-white/5">
                            <p className="text-muted-foreground text-sm lg:text-base pt-3 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions found matching your search. Try different keywords or <Link href="/contact" className="text-primary hover:underline">contact us</Link> directly.</p>
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 lg:p-10 gradient-border">
            <h2 className="text-2xl font-bold font-display mb-6" data-testid="text-still-need-help">Still Need Help?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link href="/contact" className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" data-testid="link-contact-support">
                <MessageSquare className="w-8 h-8 text-primary mb-3" />
                <span className="font-medium mb-1">Contact Us</span>
                <span className="text-muted-foreground text-sm">Send us a message</span>
              </Link>
              <a href="mailto:team@dwsc.io" className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" data-testid="link-email-support">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <span className="font-medium mb-1">Email Us</span>
                <span className="text-muted-foreground text-sm">team@dwsc.io</span>
              </a>
              <Link href="/book" className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" data-testid="link-book-support">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <span className="font-medium mb-1">Book a Call</span>
                <span className="text-muted-foreground text-sm">Mon-Fri, 9am-6pm CT</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
