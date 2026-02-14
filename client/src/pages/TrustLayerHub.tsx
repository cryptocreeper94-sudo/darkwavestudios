import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Code2, 
  Download, 
  Heart, 
  ExternalLink, 
  Search, 
  Shield, 
  Zap, 
  Globe, 
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Layers,
  Box,
  Terminal,
  Sparkles,
  Lock,
  Activity,
  Menu,
  X,
  Radio,
  Eye,
  Calculator,
  UserPlus,
  Star,
  Calendar,
  BarChart3,
  MessageCircle,
  Users,
  MapPin,
  FileText,
  TrendingUp,
  Cloud,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  Send,
  Bot,
  Car,
  Truck,
  Utensils,
  Clock,
  Receipt,
  Scan,
  Trophy,
  Palette,
  Fingerprint,
  Wallet
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface EcosystemApp {
  id: string;
  appName: string;
  displayName: string;
  description: string;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  authorName: string;
  version: string;
  downloads: number;
  likes: number;
  isPublic: boolean;
  isPremium: boolean;
  price: string | null;
}

interface HubStats {
  totalApps: number;
  totalSnippets: number;
  totalDownloads: number;
}

const categories = [
  { id: "all", name: "All", icon: Layers },
  { id: "components", name: "Components", icon: Box },
  { id: "utilities", name: "Utilities", icon: Terminal },
  { id: "hooks", name: "Hooks", icon: Code2 },
  { id: "api", name: "API", icon: Globe },
  { id: "auth", name: "Auth", icon: Lock },
];

const widgetsList = [
  { 
    id: "estimator", name: "Trade Estimator", icon: Calculator, containerId: "demo-estimator", color: "#3b82f6", 
    description: "Instant project pricing calculator for trades", price: 149, priceId: "price_widget_estimator",
    fullDescription: "Give your customers instant, accurate project estimates. This AI-powered calculator handles square footage, materials, labor rates, and profit margins automatically. Perfect for painters, roofers, landscapers, and contractors.",
    features: ["Square footage calculator", "Material cost estimation", "Labor hour calculation", "Profit margin controls", "Lead capture integration", "PDF estimate generation", "CRM webhook sync"],
    requirements: ["React 18+ or vanilla JS", "Works with any website", "No backend required"],
    includes: ["Full source code", "Step-by-step setup guide", "Customization documentation", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Tailwind CSS", "Zod validation"],
    linesOfCode: "~850 lines",
    complexity: "Intermediate"
  },
  { 
    id: "lead-capture", name: "Lead Capture", icon: UserPlus, containerId: "demo-lead-capture", color: "#8b5cf6", 
    description: "Convert visitors into qualified leads", price: 99, priceId: "price_widget_lead_capture",
    fullDescription: "Turn website visitors into qualified leads with smart forms that adapt to user behavior. Multi-step forms, conditional logic, and instant notifications help you never miss an opportunity.",
    features: ["Multi-step form wizard", "Conditional field logic", "Email & SMS notifications", "CRM integration ready", "Spam protection built-in", "Mobile-optimized design", "A/B testing support"],
    requirements: ["Any website or React app", "Optional: Email service for notifications"],
    includes: ["Full source code", "Setup documentation", "Integration examples", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "React Hook Form", "Tailwind CSS"],
    linesOfCode: "~620 lines",
    complexity: "Beginner-friendly"
  },
  { 
    id: "reviews", name: "Review Display", icon: Star, containerId: "demo-reviews", color: "#10b981", 
    description: "Showcase customer testimonials", price: 79, priceId: "price_widget_reviews",
    fullDescription: "Build trust instantly by showcasing your best customer reviews. Pulls from Google, Yelp, and Facebook or use your own testimonials. Beautiful carousel and grid layouts included.",
    features: ["Google/Yelp/Facebook sync", "Star rating display", "Photo testimonials", "Carousel & grid layouts", "Schema markup for SEO", "Filter by rating", "Moderation dashboard"],
    requirements: ["Any website", "Optional: API keys for review platforms"],
    includes: ["Full source code", "Platform integration guide", "Styling customization docs", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Embla Carousel", "Tailwind CSS", "JSON-LD Schema"],
    linesOfCode: "~540 lines",
    complexity: "Beginner-friendly"
  },
  { 
    id: "booking", name: "Booking Calendar", icon: Calendar, containerId: "demo-booking", color: "#f59e0b", 
    description: "Schedule appointments seamlessly", price: 129, priceId: "price_widget_booking",
    fullDescription: "Let customers book appointments 24/7 without the back-and-forth. Syncs with Google Calendar, handles time zones, sends reminders, and prevents double-bookings automatically.",
    features: ["Real-time availability", "Google Calendar sync", "Automatic reminders", "Time zone detection", "Buffer time between appointments", "Service duration settings", "Deposit collection ready"],
    requirements: ["React or vanilla JS", "Optional: Google Calendar API", "Optional: Stripe for deposits"],
    includes: ["Full source code", "Calendar integration guide", "Reminder setup docs", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "date-fns", "Tailwind CSS", "Google Calendar API"],
    linesOfCode: "~1,200 lines",
    complexity: "Intermediate"
  },
  { 
    id: "analytics", name: "Analytics Dashboard", icon: BarChart3, containerId: "demo-analytics", color: "#6366f1", 
    description: "Track website performance metrics", price: 199, priceId: "price_widget_analytics",
    fullDescription: "Privacy-focused analytics that gives you the insights you need without compromising visitor privacy. Real-time dashboards, conversion tracking, and heatmaps - no cookies required.",
    features: ["Real-time visitor tracking", "Page view analytics", "Click heatmaps", "Conversion funnels", "Custom event tracking", "GDPR/CCPA compliant", "No cookies required"],
    requirements: ["Any website", "Node.js backend for data storage"],
    includes: ["Frontend widget code", "Backend API code", "Database schema", "Dashboard UI", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Recharts", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    linesOfCode: "~2,400 lines (full stack)",
    complexity: "Advanced"
  },
  { 
    id: "chat", name: "Live Chat", icon: MessageCircle, containerId: "demo-chat", color: "#ec4899", 
    description: "Real-time customer support widget", price: 149, priceId: "price_widget_chat",
    fullDescription: "Engage visitors in real-time with a beautiful chat widget. AI-powered auto-responses handle common questions while you're away. Full conversation history and team inbox included.",
    features: ["Real-time messaging", "AI auto-responses", "Offline message capture", "File sharing", "Typing indicators", "Team inbox", "Mobile app notifications"],
    requirements: ["React or vanilla JS", "WebSocket-capable backend", "Optional: OpenAI for AI responses"],
    includes: ["Chat widget code", "Backend server code", "Admin dashboard UI", "AI integration guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Socket.io", "Node.js", "Express", "OpenAI API", "PostgreSQL"],
    linesOfCode: "~1,800 lines (full stack)",
    complexity: "Advanced"
  },
  { 
    id: "crm", name: "CRM Pipeline", icon: Users, containerId: "demo-crm", color: "#14b8a6", 
    description: "Manage customer relationships", price: 249, priceId: "price_widget_crm",
    fullDescription: "Visual sales pipeline built for service businesses. Drag-and-drop deal management, automated follow-ups, and revenue forecasting. Stop losing leads and start closing more deals.",
    features: ["Kanban pipeline view", "Drag-and-drop deals", "Automated stage transitions", "Follow-up reminders", "Email integration", "Calendar sync", "Revenue forecasting", "Win/loss analytics"],
    requirements: ["React frontend", "Node.js/Express backend", "PostgreSQL database"],
    includes: ["Complete CRM frontend", "Backend API", "Database migrations", "Email templates", "Setup walkthrough", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "@dnd-kit", "TanStack Query", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    linesOfCode: "~3,200 lines (full stack)",
    complexity: "Advanced"
  },
  { 
    id: "crew-tracker", name: "Crew Tracker", icon: MapPin, containerId: "demo-crew-tracker", color: "#f97316", 
    description: "GPS clock-in for field teams", price: 179, priceId: "price_widget_crew_tracker",
    fullDescription: "Know where your team is and track hours accurately with GPS-verified time tracking. Geofencing ensures clock-ins only happen on job sites. Export timesheets directly to payroll.",
    features: ["GPS clock-in/out", "Photo verification", "Geofencing by job site", "Real-time location", "Break reminders", "Overtime calculations", "Timesheet export", "Payroll integration"],
    requirements: ["React Native or web app", "Node.js backend", "Mobile device with GPS"],
    includes: ["Web dashboard code", "Mobile-ready components", "Backend API", "Payroll export templates", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Geolocation API", "Leaflet Maps", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~2,100 lines (full stack)",
    complexity: "Advanced"
  },
  { 
    id: "proposal", name: "Proposal Builder", icon: FileText, containerId: "demo-proposal", color: "#8b5cf6", 
    description: "Create professional proposals", price: 199, priceId: "price_widget_proposal",
    fullDescription: "Create stunning proposals in minutes, not hours. Customizable templates, dynamic pricing tables, e-signature capture, and Stripe integration for instant deposits.",
    features: ["Customizable templates", "Dynamic pricing tables", "E-signature capture", "Stripe payment integration", "Deposit collection", "Expiration tracking", "Client portal", "Automated follow-ups"],
    requirements: ["React frontend", "Node.js backend", "Stripe account for payments"],
    includes: ["Proposal builder UI", "Template system", "E-signature integration", "Backend API", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "PDF generation", "Stripe API", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~2,600 lines (full stack)",
    complexity: "Advanced"
  },
  { 
    id: "seo", name: "SEO Manager", icon: TrendingUp, containerId: "demo-seo", color: "#22c55e", 
    description: "Optimize search visibility", price: 149, priceId: "price_widget_seo",
    fullDescription: "Audit your website's SEO health and get actionable recommendations. Track keyword rankings, monitor competitors, and generate schema markup automatically.",
    features: ["On-page SEO audit", "Keyword rank tracking", "Competitor monitoring", "Schema markup generator", "Meta tag optimizer", "Core Web Vitals check", "Weekly email reports"],
    requirements: ["Any website", "Node.js for backend features", "Optional: Google Search Console API"],
    includes: ["Audit tool code", "Tracking dashboard", "Schema generators", "Report templates", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Cheerio", "Puppeteer", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~1,900 lines (full stack)",
    complexity: "Intermediate"
  },
  { 
    id: "weather", name: "Weather Scheduling", icon: Cloud, containerId: "demo-weather", color: "#0ea5e9", 
    description: "Weather-aware job scheduling", price: 99, priceId: "price_widget_weather",
    fullDescription: "Never get caught in the rain again. Automatically checks weather forecasts and alerts you to reschedule outdoor jobs. Integrates with your calendar and notifies affected customers.",
    features: ["7-day weather forecasts", "Automatic delay alerts", "Customer notifications", "Calendar integration", "Weather threshold settings", "Job site locations", "Reschedule suggestions"],
    requirements: ["Any website or app", "Weather API key (free tier available)"],
    includes: ["Weather widget code", "Notification system", "Calendar integration", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "OpenWeatherMap API", "Tailwind CSS"],
    linesOfCode: "~680 lines",
    complexity: "Beginner-friendly"
  },
  { 
    id: "pulse", name: "Pulse", icon: Activity, containerId: "demo-pulse", color: "#ef4444", 
    description: "AI predictive quant system with 65%+ accuracy", price: 499, priceId: "price_1SwJOePCLBtdVWVNUZOlCId8",
    fullDescription: "Pulse is our flagship AI predictive system with a verified 65-70% win rate across 100,000+ predictions. Harness institutional-grade quant intelligence for trading, forecasting, and data-driven decision making. Every prediction is hashed to DarkWave Smart Chain for immutable verification.",
    features: ["65-70% verified win rate", "100,000+ prediction track record", "Real-time market signals", "Multi-asset analysis", "Blockchain-verified predictions", "1-day & 7-day forecasts", "Confidence scoring", "API access included", "Historical backtesting"],
    requirements: ["API integration capability", "Secure server environment recommended"],
    includes: ["Pulse widget code", "Full API documentation", "Prediction endpoints", "Webhook integration", "Historical data access", "Priority email support", "Lifetime updates", "Trust Shield certification"],
    techStack: ["Python", "TensorFlow", "FastAPI", "React 18", "TypeScript", "PostgreSQL", "Redis", "DarkWave Smart Chain"],
    linesOfCode: "~12,000+ lines (ML pipeline)",
    complexity: "Enterprise-grade",
    customizations: [
      "Asset selection - Configure which cryptocurrencies, stocks, or commodities to track",
      "Prediction timeframes - Set up 1-hour, 4-hour, 1-day, or 7-day forecasts",
      "Alert thresholds - Custom notification triggers based on confidence scores",
      "Dashboard branding - Your logo and color scheme on the widget",
      "Data refresh rate - Adjust update frequency (1min to 1hr intervals)",
      "Risk tolerance settings - Conservative, moderate, or aggressive prediction modes"
    ]
  },
  { 
    id: "pulse-pro", name: "Pulse Pro API", icon: Zap, containerId: "demo-pulse-pro", color: "#f59e0b", 
    description: "Unlimited API access to Pulse predictions", price: 1499, priceId: "price_1SwJOfPCLBtdVWVNJICDoloi",
    fullDescription: "Full programmatic access to DarkWave Pulse with unlimited API calls. Build your own applications, trading bots, or analytics dashboards powered by our 65%+ accurate predictive engine. Includes backtesting suite and custom model training.",
    features: ["Unlimited API calls", "All Pulse Basic features", "Custom prediction parameters", "Backtesting suite", "Bulk historical data export", "Custom webhooks", "Rate limit: 1000/min", "Multi-exchange support", "Advanced analytics dashboard"],
    requirements: ["Developer knowledge", "Server for API integration", "API authentication handling"],
    includes: ["Complete API access", "SDK libraries (JS, Python)", "Backtesting tools", "Trading bot templates", "Dedicated support channel", "1-hour onboarding call", "Lifetime updates"],
    techStack: ["Python SDK", "JavaScript SDK", "REST API", "WebSocket streams", "OAuth 2.0", "Rate limiting"],
    linesOfCode: "SDK: ~3,500 lines",
    complexity: "Developer-focused",
    customizations: [
      "All Basic customizations included",
      "Custom prediction models - Train on your specific use case data",
      "Multi-exchange integration - Connect to Binance, Coinbase, Kraken, etc.",
      "Webhook endpoints - Push predictions to your own servers in real-time",
      "Historical data access - Backtest against years of prediction data",
      "Custom confidence thresholds - Set your own signal strength requirements",
      "Batch processing - Request predictions for multiple assets simultaneously",
      "Rate limit customization - Adjust API limits based on your volume needs"
    ]
  },
  { 
    id: "pulse-enterprise", name: "Pulse Enterprise", icon: Shield, containerId: "demo-pulse-enterprise", color: "#8b5cf6", 
    description: "White-label quant system for institutions", price: 3999, priceId: "price_1SwJOfPCLBtdVWVNEGp2zZUu",
    fullDescription: "Deploy DarkWave Pulse under your own brand. Full white-label rights, dedicated infrastructure, custom model training, and SLA-backed uptime. Perfect for funds, brokerages, and fintech platforms seeking institutional-grade predictive intelligence.",
    features: ["All Pulse Pro features", "White-label rights", "Custom branding", "Dedicated infrastructure", "Custom model training", "99.9% SLA uptime", "Priority 24/7 support", "Compliance documentation", "On-premise deployment option"],
    requirements: ["Enterprise infrastructure", "Legal entity for licensing", "Technical integration team"],
    includes: ["Full source code license", "White-label kit", "Dedicated account manager", "Custom integration support", "Quarterly strategy calls", "SLA agreement", "Compliance package"],
    techStack: ["Full source code", "Docker/Kubernetes", "Custom ML models", "Private infrastructure", "SOC 2 compliant"],
    linesOfCode: "Complete platform",
    complexity: "Enterprise-grade",
    customizations: [
      "All Pro customizations included",
      "Full white-label branding - Your company name, logo, and identity throughout",
      "Dedicated infrastructure - Isolated servers for your exclusive use",
      "Custom ML model training - Models trained specifically on your data",
      "On-premise deployment - Install on your own infrastructure",
      "Custom API domains - Your own branded API endpoints",
      "Compliance packages - SOC 2, GDPR, financial regulations documentation",
      "Multi-tenant support - Serve your own customers with sub-accounts",
      "Priority 24/7 support - Dedicated account manager and technical team",
      "Custom integrations - Direct connections to your existing systems"
    ]
  },
  { 
    id: "signal-chat", name: "Signal Chat", icon: Radio, containerId: "demo-signal-chat", color: "#06b6d4", 
    description: "Cross-ecosystem community chat with SSO, bots & subscription billing", price: 349, priceId: "price_widget_signal_chat",
    fullDescription: "The unified communication layer for your entire ecosystem. Embed <ChatContainer channelId=\"app-support\" /> into any app — users authenticate once through Trust Layer SSO and gain cross-app identity everywhere. Dedicated support channels per app, ecosystem-wide channels (#general, #announcements), real-time WebSocket messaging, threaded conversations, DMs, polls, file sharing, and an extensible bot framework. Built-in subscription billing (free tier → paid tiers) turns chat into recurring revenue. Package and resell through DarkWave Studios for $499–$4,999.",
    features: ["Cross-ecosystem SSO — one login works across all apps", "Cross-app identity — same verified user everywhere, no re-registration", "Embed via <ChatContainer channelId /> — one component, any app", "Ecosystem-wide channels (#general, #announcements)", "Per-app support channels (#darkwavestudios-support, #garagebot-support)", "Unified support inbox — see messages from every app in one place", "Subscription billing — free basic chat, paid DMs/files/bots/polls", "Real-time WebSocket messaging with auto-reconnect", "Communities & channels (text, voice, announcements)", "Threaded conversations & replies", "Direct messages with read receipts", "Reactions & custom emoji support", "File uploads with drag & drop", "Polls with multi-vote", "Scheduled messages", "Role-based permissions (owner, admin, mod, member)", "Extensible bot framework with slash commands", "Typing indicators & presence (online/idle/DND)", "Message pinning, search, & forwarding", "Invite system with expiry & max uses", "Notification settings (all, mentions, muted)", "PWA-installable"],
    requirements: ["React 18+ frontend", "Node.js/Express backend", "PostgreSQL database", "WebSocket support", "Trust Layer SSO (included)"],
    includes: ["Full source code (frontend + backend)", "17 database table schemas", "WebSocket server with auto-reconnect", "Bot framework with sample bots", "18 React components", "Presence & identity system", "Subscription billing integration", "PWA manifest", "White-label customization guide", "Ecosystem embedding guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Framer Motion", "TanStack Query", "WebSocket", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "Stripe (subscriptions)"],
    linesOfCode: "~6,500+ lines (full stack)",
    complexity: "Advanced",
    customizations: [
      "Ecosystem integration - Embed into any app with one component: <ChatContainer />",
      "White-label branding - Your logo, colors, and brand identity throughout",
      "Subscription tiers - Free basic chat, paid DMs, file sharing, bots, polls",
      "Resell as managed service - Package for your clients at $499–$4,999",
      "Custom channel types - Add voice, video, or custom channel categories",
      "Bot framework - Build custom bots with slash commands and webhooks",
      "Trust Layer SSO - Cross-app identity with zero re-registration",
      "Custom roles & permissions - Define granular access controls per community",
      "Multi-tenant support - Each client gets isolated communities and billing",
      "Custom emoji packs - Upload branded emoji sets for communities"
    ]
  },
  {
    id: "vin-decoder", name: "VIN Decoder", icon: Car, containerId: "demo-vin-decoder", color: "#ef4444",
    description: "Decode any vehicle by VIN instantly", price: 129, priceId: "price_widget_vin_decoder",
    fullDescription: "Decode any Vehicle Identification Number into detailed specs instantly. Returns year, make, model, engine, transmission, trim level, and safety ratings. Built from GarageBot's production VIN decoding system used across 68+ parts retailers.",
    features: ["Instant VIN lookup", "Year/Make/Model/Trim extraction", "Engine & transmission details", "Safety rating lookup", "Recall check integration", "Vehicle history summary", "Multi-format input (barcode, manual)", "Garage/vehicle profile storage"],
    requirements: ["React or vanilla JS", "NHTSA API (free)", "Optional: backend for vehicle storage"],
    includes: ["Full source code", "VIN validation logic", "NHTSA API integration", "Vehicle profile UI", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "NHTSA API", "Tailwind CSS", "Zod validation"],
    linesOfCode: "~750 lines",
    complexity: "Intermediate"
  },
  {
    id: "parts-aggregator", name: "Parts Aggregator", icon: Package, containerId: "demo-parts-aggregator", color: "#f97316",
    description: "Search 68+ auto parts retailers at once", price: 299, priceId: "price_widget_parts_aggregator",
    fullDescription: "Unified search across 68+ auto parts retailers. Enter a part name or number, get prices from AutoZone, O'Reilly, RockAuto, Amazon, and more — all in one view. Extracted from GarageBot's production parts search engine.",
    features: ["68+ retailer integration", "Price comparison grid", "Part number cross-reference", "Availability checking", "Shipping cost estimates", "Save to wishlist", "Price history tracking", "Affiliate link support"],
    requirements: ["React frontend", "Node.js backend for API aggregation", "Optional: affiliate accounts"],
    includes: ["Frontend search UI", "Backend aggregation API", "Retailer adapters", "Price comparison logic", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Node.js", "Express", "Cheerio", "Tailwind CSS"],
    linesOfCode: "~2,800 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "shift-manager", name: "Shift Manager", icon: Clock, containerId: "demo-shift-manager", color: "#3b82f6",
    description: "Employee scheduling and shift management", price: 179, priceId: "price_widget_shift_manager",
    fullDescription: "Drag-and-drop shift scheduling with conflict detection, availability management, and shift swap requests. Built from ORBIT Staffing's production scheduling engine handling thousands of workers across multiple locations.",
    features: ["Drag-and-drop scheduling", "Shift conflict detection", "Availability management", "Shift swap requests", "Overtime alerts", "Multi-location support", "Break compliance tracking", "Schedule templates", "Mobile-friendly view"],
    requirements: ["React frontend", "Node.js backend", "PostgreSQL database"],
    includes: ["Schedule builder UI", "Backend API", "Database schema", "Notification system", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "@dnd-kit", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    linesOfCode: "~2,200 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "payroll-calc", name: "Payroll Calculator", icon: Receipt, containerId: "demo-payroll-calc", color: "#10b981",
    description: "Automated payroll with tax calculations", price: 249, priceId: "price_widget_payroll_calc",
    fullDescription: "Calculate payroll for W-2 and 1099 workers with federal and state tax withholding, overtime rules, and deductions. Extracted from ORBIT Staffing's payroll engine processing thousands of paychecks monthly.",
    features: ["W-2 & 1099 support", "Federal tax withholding", "State tax calculations", "Overtime rules (1.5x, 2x)", "Deduction management", "Pay stub generation", "Batch payroll processing", "Export to QuickBooks/ADP", "Year-end tax form prep"],
    requirements: ["Node.js backend", "PostgreSQL database", "Optional: QuickBooks API"],
    includes: ["Calculation engine", "Pay stub templates", "Tax table data", "Export adapters", "Backend API", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "PDF generation"],
    linesOfCode: "~3,100 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "ocr-scanner", name: "OCR Scanner", icon: Scan, containerId: "demo-ocr-scanner", color: "#8b5cf6",
    description: "Camera-based text and document scanning", price: 99, priceId: "price_widget_ocr_scanner",
    fullDescription: "Turn any device camera into a document scanner. Extracts text from photos of receipts, VINs, license plates, business cards, and invoices. Built from Lot Ops Pro's production OCR system for scanning vehicle stock numbers.",
    features: ["Camera text capture", "Receipt scanning", "VIN/plate recognition", "Business card reader", "Invoice data extraction", "Multi-language support", "Batch scanning mode", "Clipboard integration"],
    requirements: ["React or vanilla JS", "Device with camera", "No backend required"],
    includes: ["Full source code", "Camera integration guide", "OCR processing logic", "Result formatting", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Tesseract.js", "Canvas API", "Tailwind CSS"],
    linesOfCode: "~680 lines",
    complexity: "Intermediate"
  },
  {
    id: "driver-leaderboard", name: "Driver Leaderboard", icon: Trophy, containerId: "demo-driver-leaderboard", color: "#eab308",
    description: "Gamified employee performance rankings", price: 129, priceId: "price_widget_driver_leaderboard",
    fullDescription: "Gamify workforce performance with real-time leaderboards. Track moves per hour, jobs completed, ratings, and streak bonuses. Drives healthy competition and boosts productivity. Extracted from Lot Ops Pro's driver ranking system.",
    features: ["Real-time rankings", "Moves-per-hour tracking", "Daily/weekly/monthly views", "Achievement badges", "Streak tracking", "Team vs individual modes", "Photo avatars", "Export performance reports"],
    requirements: ["React frontend", "Node.js backend", "PostgreSQL database"],
    includes: ["Leaderboard UI", "Backend API", "Scoring engine", "Badge system", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Framer Motion", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~1,100 lines (full stack)",
    complexity: "Intermediate"
  },
  {
    id: "delivery-tracker", name: "Delivery Tracker", icon: Truck, containerId: "demo-delivery-tracker", color: "#06b6d4",
    description: "Real-time order and delivery tracking", price: 199, priceId: "price_widget_delivery_tracker",
    fullDescription: "Give customers real-time visibility into their orders from placement to doorstep. Live driver GPS, estimated arrival times, and delivery photo proof. Built from Brew & Board and Happy Eats' production delivery systems.",
    features: ["Real-time GPS tracking", "ETA calculations", "Delivery status updates", "Photo proof of delivery", "Customer notifications", "Driver assignment", "Route optimization hints", "Delivery history"],
    requirements: ["React frontend", "Node.js backend with WebSocket", "PostgreSQL", "Device with GPS"],
    includes: ["Customer tracking UI", "Driver app components", "Backend API", "WebSocket server", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "WebSocket", "Geolocation API", "Leaflet Maps", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~2,400 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "menu-builder", name: "Menu Builder", icon: Utensils, containerId: "demo-menu-builder", color: "#22c55e",
    description: "Digital menu with ordering system", price: 149, priceId: "price_widget_menu_builder",
    fullDescription: "Create beautiful digital menus with categories, modifiers, dietary tags, and built-in ordering. Perfect for restaurants, food trucks, and catering companies. Extracted from Happy Eats' menu management system.",
    features: ["Drag-and-drop menu editor", "Category management", "Item modifiers & add-ons", "Dietary labels (vegan, GF, etc.)", "Photo uploads", "Price variants (S/M/L)", "QR code menu link", "Online ordering integration", "Multi-location menus"],
    requirements: ["React frontend", "Node.js backend", "PostgreSQL database"],
    includes: ["Menu editor UI", "Customer-facing menu", "Backend API", "QR code generator", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "@dnd-kit", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS"],
    linesOfCode: "~1,800 lines (full stack)",
    complexity: "Intermediate"
  },
  {
    id: "room-visualizer", name: "Room Visualizer", icon: Palette, containerId: "demo-room-visualizer", color: "#ec4899",
    description: "AI color visualizer for painting & design", price: 199, priceId: "price_widget_room_visualizer",
    fullDescription: "Let customers visualize paint colors on their walls before buying. Upload a room photo, select from Benjamin Moore and Sherwin-Williams palettes, and see the transformation in real-time. Built from TradeWorks AI's painting vertical.",
    features: ["Room photo upload", "Benjamin Moore colors", "Sherwin-Williams colors", "Custom color input", "Before/after comparison", "Color palette suggestions", "Save favorite combos", "Share visualizations", "Mobile-friendly"],
    requirements: ["React frontend", "Canvas API support", "Optional: color API keys"],
    includes: ["Visualizer UI", "Color processing logic", "Paint brand palettes", "Image manipulation code", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Canvas API", "Color conversion utils", "Tailwind CSS"],
    linesOfCode: "~1,400 lines",
    complexity: "Intermediate"
  },
  {
    id: "invoice-generator", name: "Invoice Generator", icon: Receipt, containerId: "demo-invoice-generator", color: "#6366f1",
    description: "Professional invoice creation and tracking", price: 149, priceId: "price_widget_invoice_generator",
    fullDescription: "Create, send, and track professional invoices in minutes. Line items, tax calculations, payment terms, and Stripe integration for instant online payment. Built from TradeWorks AI's invoicing system used across 8 trade industries.",
    features: ["Professional invoice templates", "Line item management", "Tax calculation", "Payment terms & due dates", "Online payment via Stripe", "PDF export", "Invoice status tracking", "Overdue reminders", "Client portal"],
    requirements: ["React frontend", "Node.js backend", "Stripe account for payments"],
    includes: ["Invoice builder UI", "PDF generation", "Backend API", "Stripe integration", "Email templates", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Stripe API", "PDF generation", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~2,000 lines (full stack)",
    complexity: "Intermediate"
  },
  {
    id: "emergency-dashboard", name: "Emergency Dashboard", icon: Shield, containerId: "demo-emergency-dashboard", color: "#dc2626",
    description: "Real-time emergency command center", price: 349, priceId: "price_widget_emergency_dashboard",
    fullDescription: "Centralized emergency response dashboard for venues, campuses, and large facilities. Real-time incident reporting, team dispatch, evacuation tracking, and communication hub. Extracted from Orby Commander's stadium operations system.",
    features: ["Incident reporting & triage", "Team dispatch & assignment", "Real-time status board", "Evacuation tracking", "Communication hub", "GPS-guided response", "Incident history & analytics", "Multi-zone management", "Alert broadcasting"],
    requirements: ["React frontend", "Node.js backend with WebSocket", "PostgreSQL database"],
    includes: ["Dashboard UI", "Incident management API", "WebSocket real-time layer", "Alert system", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "WebSocket", "Leaflet Maps", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    linesOfCode: "~3,500 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "inventory-counter", name: "Inventory Counter", icon: Package, containerId: "demo-inventory-counter", color: "#14b8a6",
    description: "3-phase inventory counting system", price: 129, priceId: "price_widget_inventory_counter",
    fullDescription: "Structured 3-phase inventory counting with variance detection and approval workflows. Count, verify, reconcile — all from a mobile device. Built from Orby Commander's venue inventory system managing thousands of items.",
    features: ["3-phase counting (count, verify, reconcile)", "Barcode/QR scanning", "Variance detection", "Approval workflows", "Location-based counting", "Photo verification", "Export to spreadsheet", "Historical tracking", "Multi-user simultaneous counting"],
    requirements: ["React frontend", "Node.js backend", "PostgreSQL database", "Device with camera"],
    includes: ["Counter UI", "Backend API", "Barcode scanner integration", "Variance reports", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Camera API", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    linesOfCode: "~1,600 lines (full stack)",
    complexity: "Intermediate"
  },
  {
    id: "token-scanner", name: "Token Scanner", icon: Eye, containerId: "demo-token-scanner", color: "#f59e0b",
    description: "Multi-chain token safety analysis", price: 199, priceId: "price_widget_token_scanner",
    fullDescription: "Scan any token across 23+ blockchains for honeypot risks, liquidity locks, ownership concentration, and contract vulnerabilities. Extracted from StrikeAgent's production safety scoring engine that analyzes thousands of tokens daily.",
    features: ["23+ blockchain support", "Honeypot detection", "Liquidity lock verification", "Ownership analysis", "Contract vulnerability scan", "Rug pull risk scoring", "Token holder distribution", "Social sentiment check", "Historical safety data"],
    requirements: ["React frontend", "Node.js backend", "Blockchain RPC endpoints"],
    includes: ["Scanner UI", "Multi-chain analyzers", "Safety scoring engine", "Backend API", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "ethers.js", "@solana/web3.js", "Node.js", "Express", "PostgreSQL"],
    linesOfCode: "~3,200 lines (full stack)",
    complexity: "Advanced"
  },
  {
    id: "wellness-assessment", name: "Wellness Assessment", icon: Heart, containerId: "demo-wellness-assessment", color: "#10b981",
    description: "AI-powered health and dosha analysis quiz", price: 99, priceId: "price_widget_wellness_assessment",
    fullDescription: "Interactive wellness assessment that determines Ayurvedic body type (dosha), provides personalized health recommendations, and creates custom daily routines. Built from VedaSolus's production wellness platform.",
    features: ["Dosha type analysis", "Personalized recommendations", "Daily routine builder", "Dietary suggestions", "Seasonal adjustments", "Progress tracking", "PDF report generation", "Lead capture integration"],
    requirements: ["React or vanilla JS", "Optional: backend for data storage"],
    includes: ["Assessment quiz UI", "Scoring algorithm", "Recommendation engine", "Report templates", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Tailwind CSS", "PDF generation"],
    linesOfCode: "~900 lines",
    complexity: "Beginner-friendly"
  },
  {
    id: "multi-wallet", name: "Multi-Chain Wallet", icon: Wallet, containerId: "demo-multi-wallet", color: "#8b5cf6",
    description: "Unified wallet for Solana + 22 EVM chains", price: 299, priceId: "price_widget_multi_wallet",
    fullDescription: "Connect and manage wallets across Solana and 22 EVM-compatible chains from a single interface. Portfolio tracking, token balances, transaction history, and one-click swaps. Extracted from Pulse's production multi-chain wallet system.",
    features: ["Solana wallet support", "22 EVM chain support", "Unified portfolio view", "Token balance tracking", "Transaction history", "One-click chain switching", "WalletConnect integration", "Phantom/MetaMask support", "Portfolio value charts"],
    requirements: ["React frontend", "Web3 wallet extensions"],
    includes: ["Wallet connection UI", "Chain adapters", "Portfolio dashboard", "Transaction viewer", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "@solana/web3.js", "ethers.js", "WalletConnect", "Tailwind CSS"],
    linesOfCode: "~2,100 lines",
    complexity: "Advanced"
  },
  {
    id: "effects-kit", name: "DarkWave Effects Kit", icon: Sparkles, containerId: "demo-effects-kit", color: "#a855f7",
    description: "Complete UI effects system — glass, 3D hover, shimmer, scroll animations, haptics & micro-interactions", price: 149, priceId: "price_widget_effects_kit",
    fullDescription: "Drop-in UI polish kit used across DarkWave Studios' entire production platform. Includes glassmorphism panels, 3D perspective card hover, purple gradient shimmer loading, IntersectionObserver scroll-triggered animations, navigator.vibrate haptic feedback, and micro-interaction classes (press, lift, ripple). One CSS file + two utility modules — paste into any React or vanilla project and instantly elevate your UI.",
    features: ["Glassmorphism (glass, glass-card, glass-strong)", "3D perspective card tilt on hover", "Purple gradient shimmer skeleton loading", "Scroll-triggered fade, slide & scale animations", "IntersectionObserver hook + ScrollReveal component", "Haptic feedback utility (6 vibration patterns)", "Button press scale effect", "Hover elevation with shadow", "Expanding ripple click effect", "Animated toggle switch", "CSS-only — no runtime dependencies", "Dark & light theme compatible"],
    requirements: ["Any website or React app", "No backend required", "No external dependencies"],
    includes: ["Full CSS effects stylesheet", "useScrollAnimation React hook", "ScrollReveal wrapper component", "Haptic feedback utility module", "Integration guide", "30-day email support", "Lifetime updates"],
    techStack: ["CSS3", "TypeScript", "React 18 (optional)", "IntersectionObserver API", "Web Vibration API"],
    linesOfCode: "~420 lines (CSS + hooks + utility)",
    complexity: "Beginner-friendly"
  },
  {
    id: "compliance-engine", name: "Compliance Engine", icon: Fingerprint, containerId: "demo-compliance-engine", color: "#0ea5e9",
    description: "Worker compliance and document verification", price: 199, priceId: "price_widget_compliance_engine",
    fullDescription: "Automated compliance tracking for I-9 verification, background checks, certifications, and license expiration. Ensures your workforce stays compliant with alerts before documents expire. Built from ORBIT Staffing's compliance system.",
    features: ["I-9 document verification", "Background check integration", "Certification tracking", "License expiration alerts", "Document upload & storage", "Compliance dashboard", "Audit trail logging", "Bulk worker processing", "Custom compliance rules"],
    requirements: ["React frontend", "Node.js backend", "PostgreSQL database"],
    includes: ["Compliance dashboard UI", "Document management API", "Alert system", "Audit logging", "Setup guide", "30-day email support", "Lifetime updates"],
    techStack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Multer"],
    linesOfCode: "~2,500 lines (full stack)",
    complexity: "Advanced"
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "widget" | "snippet";
}

interface WidgetInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  containerId: string;
  color: string;
  description: string;
  price: number;
  priceId: string;
  fullDescription: string;
  features: string[];
  requirements: string[];
  includes: string[];
  techStack: string[];
  linesOfCode: string;
  complexity: string;
  customizations?: string[];
}

// Widget name mapping for full code lookup
const WIDGET_MAP: Record<string, string> = {
  "TrustLayer Analytics Widget": "tl-analytics",
  "Trade Estimator Widget": "tl-estimator",
  "Booking Widget": "tl-booking",
  "Lead Capture Widget": "tl-lead-capture",
  "Review Display Widget": "tl-reviews",
  "SEO Manager Widget": "tl-seo",
  "Live Chat Widget": "tl-chat",
  "Proposal Builder Widget": "tl-proposal",
  "Crew Tracker / GPS Clock-In": "tl-crew-tracker",
  "CRM Pipeline Manager": "tl-crm",
  "Weather-Based Scheduling": "tl-weather",
  "Signal Chat Widget": "tl-signal-chat",
  "DarkWave Effects Kit": "tl-effects-kit",
};

export default function TrustLayerHub() {
  const [apps, setApps] = useState<EcosystemApp[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [stats, setStats] = useState<HubStats>({ totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [codeModal, setCodeModal] = useState<{ open: boolean; title: string; code: string; lines: number; loading: boolean }>({
    open: false,
    title: "",
    code: "",
    lines: 0,
    loading: false
  });
  const [selectedWidget, setSelectedWidget] = useState(0);
  const [widgetTheme, setWidgetTheme] = useState<"light" | "dark" | "trustlayer">("trustlayer");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [pulseModalOpen, setPulseModalOpen] = useState(false);
  const [pulseFormData, setPulseFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    tier: "",
    useCase: "",
    expectedVolume: "",
    integrationNeeds: "",
    currentTools: "",
    timeline: "",
    budgetRange: "",
    additionalNotes: ""
  });
  const [pulseSubmitting, setPulseSubmitting] = useState(false);
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hello! I'm your DarkWave AI assistant. I can help you explore our widgets, answer questions about the Trust Layer Hub, or assist with your development needs. How can I help you today?" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;
    
    const userMessage = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setAiInput("");
    setAiLoading(true);
    
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, context: "Trust Layer Hub assistant" })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setAiMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I'm having trouble connecting right now. Please try again or contact our team directly." }]);
      }
    } catch (error) {
      setAiMessages(prev => [...prev, { role: "assistant", content: "I'm experiencing some technical difficulties. Our team is here to help - reach out via the contact page!" }]);
    } finally {
      setAiLoading(false);
    }
  };

  const isPulseProduct = (id: string) => id.startsWith("pulse");

  const openPulseModal = (widgetId: string) => {
    const tierMap: Record<string, string> = {
      "pulse": "basic",
      "pulse-pro": "pro",
      "pulse-enterprise": "enterprise"
    };
    setPulseFormData(prev => ({ ...prev, tier: tierMap[widgetId] || "basic" }));
    setPulseModalOpen(true);
  };

  const handlePulseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPulseSubmitting(true);
    try {
      const response = await fetch("/api/pulse-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pulseFormData)
      });
      if (response.ok) {
        setPulseSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting Pulse request:", error);
    } finally {
      setPulseSubmitting(false);
    }
  };

  const addToCart = (item: CartItem) => {
    if (!cart.find(c => c.id === item.id)) {
      setCart(prev => [...prev, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (method: "stripe" | "coinbase") => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    
    try {
      const endpoint = method === "stripe" 
        ? "/api/payments/stripe/cart-checkout"
        : "/api/payments/coinbase/cart-checkout";
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      
      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const openFullCode = async (snippetTitle: string) => {
    const widgetName = WIDGET_MAP[snippetTitle];
    if (!widgetName) {
      return;
    }
    
    setCodeModal({ open: true, title: snippetTitle, code: "", lines: 0, loading: true });
    
    try {
      const res = await fetch(`/api/ecosystem/widget-code/${widgetName}`);
      const data = await res.json();
      if (data.success) {
        setCodeModal({ open: true, title: snippetTitle, code: data.code, lines: data.lines, loading: false });
      } else {
        setCodeModal(prev => ({ ...prev, loading: false, code: "// Error loading code" }));
      }
    } catch (err) {
      setCodeModal(prev => ({ ...prev, loading: false, code: "// Error loading code" }));
    }
  };

  const copyFullCode = async () => {
    await navigator.clipboard.writeText(codeModal.code);
    setCopiedId("modal");
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/ecosystem/apps").then(r => r.json()),
      fetch("/api/ecosystem/snippets").then(r => r.json()),
      fetch("/api/ecosystem/stats").then(r => r.json())
    ]).then(([appsData, snippetsData, statsData]) => {
      setApps(appsData.apps || []);
      setSnippets(snippetsData.snippets || []);
      setStats(statsData.stats || { totalApps: 0, totalSnippets: 0, totalDownloads: 0 });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Load live widget previews - ALL 11 widgets
  useEffect(() => {
    const loadWidgets = () => {
      // All widget configurations
      const widgetConfigs = [
        { name: 'tl-estimator', container: 'demo-estimator', color: '#3b82f6', extra: { 'data-trade': 'painting' } },
        { name: 'tl-lead-capture', container: 'demo-lead-capture', color: '#8b5cf6' },
        { name: 'tl-reviews', container: 'demo-reviews', color: '#10b981' },
        { name: 'tl-booking', container: 'demo-booking', color: '#f59e0b' },
        { name: 'tl-analytics', container: 'demo-analytics', color: '#6366f1' },
        { name: 'tl-chat', container: 'demo-chat', color: '#ec4899' },
        { name: 'tl-crm', container: 'demo-crm', color: '#14b8a6' },
        { name: 'tl-crew-tracker', container: 'demo-crew-tracker', color: '#f97316' },
        { name: 'tl-proposal', container: 'demo-proposal', color: '#8b5cf6' },
        { name: 'tl-seo', container: 'demo-seo', color: '#22c55e' },
        { name: 'tl-weather', container: 'demo-weather', color: '#0ea5e9' },
      ];
      
      // Clear existing widget content
      widgetConfigs.forEach(({ container }) => {
        const el = document.getElementById(container);
        if (el) el.innerHTML = '';
      });
      
      // Remove any existing widget scripts and styles
      document.querySelectorAll('script[data-widget-demo]').forEach(s => s.remove());
      document.querySelectorAll('style[id^="tl-"]').forEach(s => s.remove());
      
      // Load all widgets
      widgetConfigs.forEach(({ name, container, color, extra }) => {
        const script = document.createElement('script');
        script.src = `/widgets/${name}.js`;
        script.setAttribute('data-widget-demo', 'true');
        script.setAttribute('data-container', container);
        script.setAttribute('data-primary-color', color);
        if (extra) {
          Object.entries(extra).forEach(([key, value]) => {
            script.setAttribute(key, value);
          });
        }
        document.body.appendChild(script);
      });
    };
    
    // Delay slightly to ensure containers are mounted
    const timer = setTimeout(loadWidgets, 500);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    fetch(`/api/ecosystem/snippets/${id}/download`, { method: "POST" });
  };

  const likeSnippet = (id: string) => {
    fetch(`/api/ecosystem/snippets/${id}/like`, { method: "POST" });
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Trust Layer Hub - Code Marketplace & Developer Ecosystem"
        description="DarkWave Trust Layer Hub - Share, discover, and sync code snippets across all connected applications. The premium marketplace for verified widgets and components."
        keywords="code marketplace, developer hub, code snippets, widgets, DarkWave Trust Layer, blockchain verified code"
        type="website"
        url="https://darkwavestudios.com/hub"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Trust Layer Hub", url: "https://darkwavestudios.com/hub" }
        ]}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,200,255,0.1),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base lg:text-xl gradient-text" data-testid="text-hub-title">Trust Layer Hub</h1>
                <p className="text-[8px] lg:text-[10px] text-muted-foreground hidden lg:block">DarkWave Ecosystem</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-projects">Portfolio</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-services">Services</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold" data-testid="link-contact">
              Get Started
            </Link>
          </nav>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-background/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 pb-20 overflow-y-auto z-50">
            <nav className="flex flex-col gap-3">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-projects-mobile">Portfolio</Link>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2" data-testid="link-services-mobile">Services</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold text-center" data-testid="link-contact-mobile">Get Started</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* BENTO GRID SECTION 1: Hero + Stats - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {/* Hero Card - 3-col mobile / 8-col desktop */}
          <div className="col-span-3 lg:col-span-8">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-8 gradient-border relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
              <div className="absolute top-0 right-0 w-48 lg:w-96 h-48 lg:h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-primary/20 text-primary text-[10px] lg:text-xs font-semibold mb-2 lg:mb-4" data-testid="badge-blockchain-verified">
                  <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  Blockchain Verified
                </div>
                <h2 className="text-xl lg:text-4xl font-bold font-display mb-2 lg:mb-4" data-testid="text-hero-title">
                  The Developer <span className="gradient-text">Marketplace</span>
                </h2>
                <p className="text-muted-foreground text-xs lg:text-base max-w-xl mb-3 lg:mb-6 line-clamp-2 lg:line-clamp-none" data-testid="text-hero-description">
                  Share, discover, and sync code snippets across all connected DarkWave applications.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  <a href="#snippets" className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold" data-testid="button-browse-snippets">
                    Browse <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 glass px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold hover:bg-white/10 transition-colors" data-testid="button-connect-app">
                    Connect App
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - 3-col mobile / 4-col desktop */}
          <div className="col-span-3 lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-apps">16</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-apps">Live Apps</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-snippets">19</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-snippets">Snippets</div>
            </div>
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center card-3d gradient-border">
              <div className="text-xl lg:text-4xl font-bold gradient-text mb-0.5 lg:mb-1" data-testid="stat-widgets">32</div>
              <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid="label-stat-widgets">Widgets</div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 2: Connected Apps - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        {apps.length > 0 && (
          <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
            <div className="col-span-3 lg:col-span-12">
              <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-apps-title">
                    Connected <span className="gradient-text">Apps</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] lg:text-sm text-muted-foreground">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-green-400 animate-pulse" />
                    <span data-testid="text-active-apps">{apps.length} Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="glass rounded-lg lg:rounded-xl p-2 lg:p-4 hover-lift group cursor-pointer"
                      data-testid={`app-card-${app.id}`}
                    >
                      <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs lg:text-lg flex-shrink-0">
                          {app.logoUrl ? (
                            <img src={app.logoUrl} alt={app.displayName} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            app.displayName.charAt(0)
                          )}
                        </div>
                        {app.isVerified && (
                          <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                        )}
                      </div>
                      <h4 className="font-bold font-display text-[10px] lg:text-sm group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-app-name-${app.id}`}>{app.displayName}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENTO GRID SECTION 3: Search + Categories - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section id="snippets" className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-6 scroll-mt-24">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 gradient-border">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 mb-3 lg:mb-4">
                <h3 className="text-sm lg:text-xl font-bold font-display" data-testid="text-snippets-title">
                  Code <span className="gradient-text">Snippets</span>
                </h3>
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 lg:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "glass hover:bg-white/10"
                      }`}
                      data-testid={`button-category-${cat.id}`}
                    >
                      <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 4: Snippets Grid - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 mb-4 lg:mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-6 animate-pulse">
                  <div className="h-4 lg:h-6 bg-white/10 rounded w-1/2 mb-2 lg:mb-4" />
                  <div className="h-3 lg:h-4 bg-white/10 rounded w-full mb-1 lg:mb-2" />
                  <div className="h-16 lg:h-24 bg-white/10 rounded" />
                </div>
              ))}
            </>
          ) : filteredSnippets.length > 0 ? (
            <>
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="col-span-3 lg:col-span-6 glass-card rounded-xl lg:rounded-2xl p-3 lg:p-5 gradient-border hover-lift group"
                  data-testid={`snippet-${snippet.id}`}
                >
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5 lg:mb-1">
                        <h4 className="font-bold font-display text-sm lg:text-lg truncate" data-testid={`text-snippet-title-${snippet.id}`}>{snippet.title}</h4>
                        {snippet.isPremium && (
                          <span className="px-1.5 lg:px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[8px] lg:text-[10px] font-semibold flex-shrink-0" data-testid={`badge-premium-${snippet.id}`}>
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] lg:text-sm text-muted-foreground line-clamp-1 lg:line-clamp-2" data-testid={`text-snippet-description-${snippet.id}`}>{snippet.description}</p>
                    </div>
                    <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-md lg:rounded-lg bg-primary/20 text-primary text-[8px] lg:text-xs font-mono ml-2 flex-shrink-0" data-testid={`text-snippet-language-${snippet.id}`}>
                      {snippet.language}
                    </span>
                  </div>

                  <div className="relative mb-2 lg:mb-4">
                    <pre className="bg-black/40 rounded-lg lg:rounded-xl p-2 lg:p-4 overflow-x-auto text-[10px] lg:text-xs font-mono text-gray-300 max-h-20 lg:max-h-32">
                      <code>{snippet.code.slice(0, 200)}{snippet.code.length > 200 ? "..." : ""}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(snippet.id, snippet.code)}
                      className="absolute top-1.5 lg:top-2 right-1.5 lg:right-2 p-1.5 lg:p-2 rounded-md lg:rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      data-testid={`button-copy-${snippet.id}`}
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                    </button>
                  </div>

                  <div className="hidden lg:flex flex-wrap gap-1.5 mb-3" data-testid={`container-snippet-tags-${snippet.id}`}>
                    {snippet.tags?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-foreground" data-testid={`tag-${snippet.id}-${i}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-sm text-muted-foreground">
                      <span className="flex items-center gap-0.5 lg:gap-1" data-testid={`text-snippet-downloads-${snippet.id}`}>
                        <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.downloads}
                      </span>
                      <button
                        onClick={() => likeSnippet(snippet.id)}
                        className="flex items-center gap-0.5 lg:gap-1 hover:text-red-400 transition-colors"
                        data-testid={`button-like-${snippet.id}`}
                      >
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                        {snippet.likes}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {WIDGET_MAP[snippet.title] && (
                        <button
                          onClick={() => openFullCode(snippet.title)}
                          className="text-[8px] lg:text-xs px-2 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                          data-testid={`button-view-full-${snippet.id}`}
                        >
                          View Full Code
                        </button>
                      )}
                      <div className="text-[8px] lg:text-xs text-muted-foreground" data-testid={`text-snippet-author-${snippet.id}`}>
                        by <span className="text-primary">{snippet.authorName || "DarkWave"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-3 lg:col-span-12 glass-card rounded-xl lg:rounded-2xl p-6 lg:p-12 text-center" data-testid="empty-state-snippets">
              <Code2 className="w-10 h-10 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-2 lg:mb-4 opacity-50" />
              <h4 className="text-base lg:text-xl font-bold font-display mb-1 lg:mb-2" data-testid="text-empty-title">No Snippets Yet</h4>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6" data-testid="text-empty-description">
                Be the first to share code with the DarkWave ecosystem.
              </p>
              <Link 
                href="/contact"
                className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold"
                data-testid="button-contribute"
              >
                Contribute <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* WIDGET STOREFRONT - Compact Tab/Carousel Interface */}
        <section className="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-6 gradient-border mb-4 lg:mb-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <h3 className="font-display font-bold text-sm lg:text-xl" data-testid="text-live-preview-title">Widget Storefront</h3>
              <span className="hidden lg:inline px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-semibold">{widgetsList.length} LIVE WIDGETS</span>
            </div>
          </div>
          
          {/* Widget Selector Tabs - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {widgetsList.map((widget, index) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  onClick={() => setSelectedWidget(index)}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedWidget === index
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                  data-testid={`widget-tab-${widget.id}`}
                >
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">{widget.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Selected Widget Preview */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Widget Info */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${widgetsList[selectedWidget].color}20` }}
                >
                  {(() => {
                    const Icon = widgetsList[selectedWidget].icon;
                    return <Icon className="w-6 h-6" style={{ color: widgetsList[selectedWidget].color }} />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold font-display text-lg lg:text-xl">{widgetsList[selectedWidget].name}</h4>
                    <div className="text-xl lg:text-2xl font-bold text-primary">${widgetsList[selectedWidget].price}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] font-semibold">LIVE DEMO</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{widgetsList[selectedWidget].description}</p>
              <div className="flex flex-wrap gap-2">
                {isPulseProduct(widgetsList[selectedWidget].id) ? (
                  <button 
                    onClick={() => openPulseModal(widgetsList[selectedWidget].id)}
                    className="btn-glow inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
                    data-testid={`request-access-${widgetsList[selectedWidget].id}`}
                  >
                    <Zap className="w-4 h-4" /> Request Access - Starting at ${widgetsList[selectedWidget].price}
                  </button>
                ) : (
                  <button 
                    onClick={() => addToCart({ 
                      id: widgetsList[selectedWidget].id, 
                      name: widgetsList[selectedWidget].name, 
                      price: widgetsList[selectedWidget].price,
                      type: "widget"
                    })}
                    className={`btn-glow inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      cart.find(c => c.id === widgetsList[selectedWidget].id)
                        ? "bg-green-600 text-white"
                        : "bg-primary text-white"
                    }`}
                    data-testid={`add-to-cart-${widgetsList[selectedWidget].id}`}
                  >
                    {cart.find(c => c.id === widgetsList[selectedWidget].id) ? (
                      <><Check className="w-4 h-4" /> Added to Cart</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart - ${widgetsList[selectedWidget].price}</>
                    )}
                  </button>
                )}
                {!isPulseProduct(widgetsList[selectedWidget].id) && (
                  <button className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">
                    <Code2 className="w-4 h-4" /> View Source
                  </button>
                )}
              </div>
            </div>
            
            {/* Widget Preview Container */}
            <div className="order-1 lg:order-2 relative">
              {/* Theme Toggle */}
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full p-1 border border-white/20">
                <button
                  onClick={(e) => { e.stopPropagation(); setWidgetTheme("trustlayer"); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    widgetTheme === "trustlayer" 
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30" 
                      : "text-white/60 hover:text-white"
                  }`}
                  data-testid="theme-trustlayer"
                >
                  Aurora
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setWidgetTheme("dark"); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    widgetTheme === "dark" 
                      ? "bg-slate-800 text-cyan-400 shadow" 
                      : "text-white/60 hover:text-white"
                  }`}
                  data-testid="theme-dark"
                >
                  Dark
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setWidgetTheme("light"); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    widgetTheme === "light" 
                      ? "bg-white text-gray-800 shadow" 
                      : "text-white/60 hover:text-white"
                  }`}
                  data-testid="theme-light"
                >
                  Light
                </button>
              </div>

              <div className={`rounded-xl overflow-hidden transition-all relative ${
                widgetTheme === "trustlayer" 
                  ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-gray-100" 
                  : widgetTheme === "dark" 
                    ? "bg-slate-900 text-gray-100" 
                    : "bg-white text-gray-800"
              }`} style={{ minHeight: '320px' }}>
              {/* Aurora glow overlay for Trust Layer theme */}
              {widgetTheme === "trustlayer" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute top-1/2 -right-10 w-32 h-32 bg-purple-500/15 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 left-1/3 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>
              )}
              {/* Trade Estimator Demo */}
              {widgetsList[selectedWidget].id === "estimator" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-4">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Project Estimator</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-cyan-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Get instant pricing</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between text-sm items-center">
                      <span className={widgetTheme === "trustlayer" ? "text-gray-300" : ""}>Project Type</span>
                      <select className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/10 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 shadow-lg shadow-cyan-500/10" 
                          : widgetTheme === "dark" 
                            ? "bg-slate-800 border-slate-700 text-white" 
                            : "border bg-white"
                      }`}><option>Interior Painting</option></select>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className={widgetTheme === "trustlayer" ? "text-gray-300" : ""}>Square Feet</span>
                      <input type="number" className={`rounded-full px-3 py-1.5 w-24 text-xs text-center transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/10 backdrop-blur-sm border border-purple-500/30 text-purple-200 shadow-lg shadow-purple-500/10" 
                          : widgetTheme === "dark" 
                            ? "bg-slate-800 border-slate-700 text-white" 
                            : "border bg-white"
                      }`} value="1500" readOnly />
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className={widgetTheme === "trustlayer" ? "text-gray-300" : ""}>Rooms</span>
                      <input type="number" className={`rounded-full px-3 py-1.5 w-24 text-xs text-center transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/10 backdrop-blur-sm border border-pink-500/30 text-pink-200 shadow-lg shadow-pink-500/10" 
                          : widgetTheme === "dark" 
                            ? "bg-slate-800 border-slate-700 text-white" 
                            : "border bg-white"
                      }`} value="4" readOnly />
                    </div>
                    <div className={`rounded-xl p-4 mt-4 transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 shadow-xl shadow-cyan-500/20" 
                        : widgetTheme === "dark" 
                          ? "bg-blue-900/50" 
                          : "bg-blue-50"
                    }`}>
                      <div className={`text-xs mb-1 ${widgetTheme === "trustlayer" ? "text-cyan-300" : widgetTheme === "dark" ? "text-blue-400" : "text-blue-600"}`}>Estimated Total</div>
                      <div className={`text-3xl font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg" : widgetTheme === "dark" ? "text-blue-300" : "text-blue-700"}`}>$2,450</div>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-full text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer" 
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}>Get Full Quote</button>
                </div>
              )}
              {/* Lead Capture Demo */}
              {widgetsList[selectedWidget].id === "lead-capture" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-4">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Get a Free Consultation</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-purple-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>We'll get back to you within 24 hours</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <input className={`w-full px-4 py-2.5 text-sm transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 shadow-lg shadow-purple-500/10" 
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                          : "border rounded-lg bg-white"
                    }`} placeholder="Your Name" defaultValue="John Smith" />
                    <input className={`w-full px-4 py-2.5 text-sm transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-100 placeholder-cyan-300/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-lg shadow-cyan-500/10" 
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                          : "border rounded-lg bg-white"
                    }`} placeholder="Email Address" defaultValue="john@email.com" />
                    <input className={`w-full px-4 py-2.5 text-sm transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-white/10 backdrop-blur-sm border border-pink-500/30 rounded-full text-pink-100 placeholder-pink-300/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 shadow-lg shadow-pink-500/10" 
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                          : "border rounded-lg bg-white"
                    }`} placeholder="Phone Number" defaultValue="(555) 123-4567" />
                    <textarea className={`w-full px-4 py-2.5 text-sm resize-none transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-white/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl text-indigo-100 placeholder-indigo-300/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 shadow-lg shadow-indigo-500/10" 
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                          : "border rounded-lg bg-white"
                    }`} rows={2} placeholder="Tell us about your project"></textarea>
                  </div>
                  <button className={`w-full py-2.5 text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer" 
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]" 
                      : "bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  }`}>Submit Request</button>
                </div>
              )}
              {/* Reviews Demo */}
              {widgetsList[selectedWidget].id === "reviews" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Customer Reviews</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className={widgetTheme === "trustlayer" ? "text-amber-400 drop-shadow-lg shadow-amber-400" : "text-yellow-500"}>{"★★★★★".split("").map((s,i)=><span key={i} className={widgetTheme === "trustlayer" ? "drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" : ""}>{s}</span>)}</span>
                      <span className={`text-sm ml-1 ${widgetTheme === "trustlayer" ? "text-amber-200/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>4.9 (127 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[{name:"Sarah M.", text:"Excellent work! Transformed our kitchen.", rating:5},{name:"Mike R.", text:"Professional team, on time and on budget.", rating:5},{name:"Lisa T.", text:"Highly recommend for any painting project.", rating:5}].map((r,i)=>(
                      <div key={i} className={`rounded-xl p-3 transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/5 backdrop-blur-sm border border-amber-500/20 hover:border-amber-400/40 shadow-lg shadow-amber-500/5" 
                          : widgetTheme === "dark"
                            ? "bg-slate-800/50"
                            : "bg-gray-50"
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold text-sm ${widgetTheme === "trustlayer" ? "text-amber-100" : widgetTheme === "dark" ? "text-white" : ""}`}>{r.name}</span>
                          <span className={`text-xs ${widgetTheme === "trustlayer" ? "text-amber-400" : "text-yellow-500"}`}>{"★".repeat(r.rating)}</span>
                        </div>
                        <p className={`text-xs ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Booking Demo */}
              {widgetsList[selectedWidget].id === "booking" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Book an Appointment</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-amber-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Select a date and time</div>
                  </div>
                  <div className={`grid grid-cols-7 gap-1 text-center text-xs mb-3 ${widgetTheme === "trustlayer" ? "text-gray-400" : ""}`}>
                    {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} className={widgetTheme === "trustlayer" ? "text-cyan-400/70" : "text-gray-400"}>{d}</div>)}
                    {[...Array(31)].map((_,i)=><div key={i} className={`p-1 rounded-lg transition-all ${
                      widgetTheme === "trustlayer"
                        ? i===14
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                          : i>14&&i<18
                            ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                            : "text-gray-400 hover:bg-white/10"
                        : i===14
                          ? "bg-amber-500 text-white"
                          : i>14&&i<18
                            ? "bg-amber-100"
                            : "hover:bg-gray-100"
                    }`}>{i+1}</div>)}
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {["9:00 AM","10:30 AM","2:00 PM","4:30 PM"].map((t,i)=><button key={i} className={`px-3 py-1.5 text-xs transition-all ${
                      widgetTheme === "trustlayer"
                        ? i===1
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg shadow-amber-500/30"
                          : "bg-white/10 border border-amber-500/30 rounded-full text-amber-200 hover:bg-amber-500/20"
                        : i===1
                          ? "bg-amber-500 text-white rounded"
                          : "border hover:bg-gray-50 rounded"
                    }`}>{t}</button>)}
                  </div>
                  <button className={`w-full py-2.5 text-sm font-semibold mt-auto transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]"
                      : "bg-amber-500 text-white rounded-lg"
                  }`}>Confirm Booking</button>
                </div>
              )}
              {/* Analytics Demo */}
              {widgetsList[selectedWidget].id === "analytics" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Analytics</div>
                    <select className={`text-xs px-3 py-1.5 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/10 border border-indigo-500/30 rounded-full text-indigo-200"
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white rounded"
                          : "border rounded"
                    }`}><option>Last 7 days</option></select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className={`rounded-xl p-2 text-center transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-indigo-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10" 
                        : widgetTheme === "dark" ? "bg-indigo-900/50" : "bg-indigo-50"
                    }`}>
                      <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "text-indigo-300" : widgetTheme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>2,847</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-indigo-300/60" : "text-gray-500"}`}>Visitors</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-green-500/20 border border-green-500/30 shadow-lg shadow-green-500/10" 
                        : widgetTheme === "dark" ? "bg-green-900/50" : "bg-green-50"
                    }`}>
                      <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "text-green-300" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>4.2%</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-green-300/60" : "text-gray-500"}`}>Conv Rate</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                        : widgetTheme === "dark" ? "bg-purple-900/50" : "bg-purple-50"
                    }`}>
                      <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "text-purple-300" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-600"}`}>$12.4k</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-purple-300/60" : "text-gray-500"}`}>Revenue</div>
                    </div>
                  </div>
                  <div className="h-24 flex items-end gap-1">
                    {[40,65,45,80,60,90,75].map((h,i)=><div key={i} className={`flex-1 rounded-t transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-t from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/30"
                        : "bg-indigo-500"
                    }`} style={{height:`${h}%`}}></div>)}
                  </div>
                  <div className={`flex justify-between text-[10px] mt-1 ${widgetTheme === "trustlayer" ? "text-indigo-300/50" : "text-gray-400"}`}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d}>{d}</span>)}</div>
                </div>
              )}
              {/* Chat Demo */}
              {widgetsList[selectedWidget].id === "chat" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${widgetTheme === "trustlayer" ? "border-pink-500/30" : widgetTheme === "dark" ? "border-slate-700" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30" 
                        : "bg-pink-500"
                    }`}>AI</div>
                    <div>
                      <div className={`font-semibold text-sm ${widgetTheme === "trustlayer" ? "text-pink-100" : widgetTheme === "dark" ? "text-white" : ""}`}>Support Chat</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-cyan-400" : "text-green-500"}`}>● Online</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 overflow-auto">
                    <div className="flex gap-2">
                      <div className={`rounded-2xl rounded-tl-sm p-3 text-xs max-w-[80%] ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/10 backdrop-blur-sm border border-purple-500/20 text-purple-100" 
                          : widgetTheme === "dark" ? "bg-slate-700 text-white" : "bg-gray-100"
                      }`}>Hi! How can I help you today?</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className={`rounded-2xl rounded-tr-sm p-3 text-xs max-w-[80%] ${
                        widgetTheme === "trustlayer" 
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30" 
                          : "bg-pink-500 text-white"
                      }`}>I need a quote for my project</div>
                    </div>
                    <div className="flex gap-2">
                      <div className={`rounded-2xl rounded-tl-sm p-3 text-xs max-w-[80%] ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/10 backdrop-blur-sm border border-purple-500/20 text-purple-100" 
                          : widgetTheme === "dark" ? "bg-slate-700 text-white" : "bg-gray-100"
                      }`}>I'd be happy to help! What type of project are you looking for?</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input className={`flex-1 rounded-full px-4 py-2 text-xs ${
                      widgetTheme === "trustlayer" 
                        ? "bg-white/10 backdrop-blur-sm border border-pink-500/30 text-pink-100 placeholder-pink-300/50" 
                        : widgetTheme === "dark" ? "bg-slate-800 border border-slate-700 text-white" : "border"
                    }`} placeholder="Type a message..." />
                    <button className={`rounded-full w-9 h-9 flex items-center justify-center text-sm transition-all ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40" 
                        : "bg-pink-500 text-white"
                    }`}>→</button>
                  </div>
                </div>
              )}
              {/* CRM Demo */}
              {widgetsList[selectedWidget].id === "crm" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className={`text-lg font-bold mb-3 ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Sales Pipeline</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      {stage:"Lead",tlColor:"from-gray-500/30 to-gray-600/30",lightColor:"bg-gray-200",items:["ABC Corp","XYZ Inc"]},
                      {stage:"Quoted",tlColor:"from-amber-500/30 to-orange-500/30",lightColor:"bg-amber-100",items:["Smith Home"]},
                      {stage:"Won",tlColor:"from-green-500/30 to-emerald-500/30",lightColor:"bg-green-100",items:["Johnson Proj"]}
                    ].map((s,i)=>(
                      <div key={i} className="min-w-[100px] flex-shrink-0">
                        <div className={`rounded-t-xl px-2 py-1.5 text-xs font-semibold ${
                          widgetTheme === "trustlayer" 
                            ? `bg-gradient-to-r ${s.tlColor} backdrop-blur-sm border border-white/10 text-white` 
                            : widgetTheme === "dark" ? "bg-slate-700 text-white" : s.lightColor
                        }`}>{s.stage}</div>
                        <div className={`border-t-0 rounded-b-xl p-1.5 space-y-1.5 min-h-[100px] ${
                          widgetTheme === "trustlayer" 
                            ? "bg-white/5 border border-t-0 border-white/10" 
                            : widgetTheme === "dark" ? "bg-slate-800/50 border border-slate-700" : "border"
                        }`}>
                          {s.items.map((item,j)=><div key={j} className={`rounded-lg p-2 text-[10px] ${
                            widgetTheme === "trustlayer" 
                              ? "bg-white/10 backdrop-blur-sm border border-cyan-500/20 text-cyan-100 shadow-md shadow-cyan-500/5" 
                              : widgetTheme === "dark" ? "bg-slate-700 text-white" : "bg-white border shadow-sm"
                          }`}>{item}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Crew Tracker Demo */}
              {widgetsList[selectedWidget].id === "crew-tracker" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Crew Status</div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      widgetTheme === "trustlayer" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/20" 
                        : widgetTheme === "dark" ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"
                    }`}>3 Active</span>
                  </div>
                  <div className="space-y-2">
                    {[{name:"Mike Johnson",status:"On Site",location:"123 Main St",time:"8:32 AM"},{name:"Sarah Williams",status:"In Transit",location:"456 Oak Ave",time:"9:15 AM"},{name:"Tom Brown",status:"On Break",location:"789 Pine Rd",time:"10:00 AM"}].map((c,i)=>(
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/5 backdrop-blur-sm border border-orange-500/20 hover:border-orange-400/40" 
                          : widgetTheme === "dark" ? "bg-slate-800/50" : "bg-gray-50"
                      }`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                          widgetTheme === "trustlayer" 
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30" 
                            : "bg-orange-500"
                        }`}>{c.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div className="flex-1">
                          <div className={`text-sm font-semibold ${widgetTheme === "trustlayer" ? "text-orange-100" : widgetTheme === "dark" ? "text-white" : ""}`}>{c.name}</div>
                          <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-400" : "text-gray-500"}`}>{c.location}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                            widgetTheme === "trustlayer"
                              ? c.status==="On Site"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : c.status==="In Transit"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              : c.status==="On Site"
                                ? "bg-green-100 text-green-700"
                                : c.status==="In Transit"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-200 text-gray-600"
                          }`}>{c.status}</div>
                          <div className={`text-[10px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-500" : "text-gray-400"}`}>{c.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Proposal Demo */}
              {widgetsList[selectedWidget].id === "proposal" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className={`text-lg font-bold mb-3 ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Proposal Builder</div>
                  <div className={`rounded-xl p-4 mb-3 flex-1 ${
                    widgetTheme === "trustlayer" 
                      ? "bg-white/5 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                      : widgetTheme === "dark" ? "bg-slate-800/50 border border-slate-700" : "border"
                  }`}>
                    <div className="flex justify-between text-sm mb-3">
                      <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-purple-100" : widgetTheme === "dark" ? "text-white" : ""}`}>Kitchen Renovation</span>
                      <span className={`font-bold ${widgetTheme === "trustlayer" ? "text-purple-300" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-600"}`}>$8,500</span>
                    </div>
                    <div className={`space-y-1.5 text-xs ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <div className="flex justify-between"><span>Cabinet Painting</span><span>$2,500</span></div>
                      <div className="flex justify-between"><span>Wall Painting</span><span>$1,800</span></div>
                      <div className="flex justify-between"><span>Ceiling Work</span><span>$1,200</span></div>
                      <div className="flex justify-between"><span>Materials</span><span>$3,000</span></div>
                    </div>
                    <div className={`border-t mt-3 pt-3 flex justify-between text-sm font-semibold ${
                      widgetTheme === "trustlayer" 
                        ? "border-purple-500/30 text-purple-200" 
                        : widgetTheme === "dark" ? "border-slate-700 text-white" : ""
                    }`}><span>Total</span><span className={widgetTheme === "trustlayer" ? "text-purple-300" : ""}>$8,500</span></div>
                  </div>
                  <button className={`w-full py-2.5 text-sm font-semibold transition-all ${
                    widgetTheme === "trustlayer" 
                      ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]" 
                      : "bg-purple-600 text-white rounded-lg"
                  }`}>Send Proposal</button>
                </div>
              )}
              {/* SEO Demo */}
              {widgetsList[selectedWidget].id === "seo" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>SEO Score</div>
                    <div className={`text-2xl font-bold ${widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>85<span className={`text-sm ${widgetTheme === "trustlayer" ? "text-green-300/50" : "text-gray-400"}`}>/100</span></div>
                  </div>
                  <div className="space-y-3">
                    {[{label:"Meta Tags",score:95,tlGrad:"from-green-500 to-emerald-500",color:"bg-green-500"},{label:"Page Speed",score:78,tlGrad:"from-amber-500 to-orange-500",color:"bg-amber-500"},{label:"Mobile",score:92,tlGrad:"from-green-500 to-teal-500",color:"bg-green-500"},{label:"Keywords",score:75,tlGrad:"from-amber-500 to-yellow-500",color:"bg-amber-500"}].map((s,i)=>(
                      <div key={i}>
                        <div className={`flex justify-between text-xs mb-1 ${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : ""}`}><span>{s.label}</span><span className={widgetTheme === "trustlayer" ? "text-cyan-300" : ""}>{s.score}%</span></div>
                        <div className={`h-2.5 rounded-full overflow-hidden ${widgetTheme === "trustlayer" ? "bg-white/10" : widgetTheme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                          <div className={`h-full rounded-full transition-all ${widgetTheme === "trustlayer" ? `bg-gradient-to-r ${s.tlGrad} shadow-lg` : s.color}`} style={{width:`${s.score}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-4 p-3 rounded-xl text-xs ${
                    widgetTheme === "trustlayer" 
                      ? "bg-amber-500/20 border border-amber-500/30 text-amber-200" 
                      : widgetTheme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-700"
                  }`}>3 issues found. <span className="underline cursor-pointer">View details</span></div>
                </div>
              )}
              {/* Weather Demo */}
              {widgetsList[selectedWidget].id === "weather" && (
                <div className="p-4 pt-10 lg:pt-4 h-full relative z-10">
                  <div className={`text-lg font-bold mb-3 ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Weather Schedule</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[{day:"Mon",icon:"☀️",temp:"72°",status:"Good"},{day:"Tue",icon:"🌤",temp:"68°",status:"Good"},{day:"Wed",icon:"🌧",temp:"55°",status:"Delay"},{day:"Thu",icon:"☀️",temp:"70°",status:"Good"},{day:"Fri",icon:"☀️",temp:"74°",status:"Good"}].map((d,i)=>(
                      <div key={i} className={`min-w-[60px] text-center p-2.5 rounded-xl transition-all ${
                        widgetTheme === "trustlayer"
                          ? d.status==="Delay"
                            ? "bg-red-500/20 border border-red-500/40 shadow-lg shadow-red-500/20"
                            : "bg-sky-500/20 border border-sky-500/30"
                          : d.status==="Delay"
                            ? "bg-red-50 border-red-200 border"
                            : "bg-sky-50 border"
                      }`}>
                        <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-sky-200" : ""}`}>{d.day}</div>
                        <div className="text-2xl my-1">{d.icon}</div>
                        <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-white" : ""}`}>{d.temp}</div>
                        <div className={`text-[10px] mt-1 font-medium ${
                          widgetTheme === "trustlayer"
                            ? d.status==="Delay" ? "text-red-300" : "text-green-300"
                            : d.status==="Delay" ? "text-red-600" : "text-green-600"
                        }`}>{d.status}</div>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-3 p-3 rounded-xl text-xs ${
                    widgetTheme === "trustlayer" 
                      ? "bg-sky-500/20 border border-sky-500/30 text-sky-200" 
                      : widgetTheme === "dark" ? "bg-sky-900/30 text-sky-400" : "bg-sky-50 text-sky-700"
                  }`}>Wednesday rain expected - consider rescheduling outdoor work.</div>
                </div>
              )}
              {/* Pulse Demo */}
              {widgetsList[selectedWidget].id === "pulse" && (
                <div className={`p-4 pt-10 lg:pt-4 h-full relative z-10 ${widgetTheme === "light" ? "bg-gradient-to-br from-red-50 to-orange-50" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Pulse</div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                      widgetTheme === "trustlayer" 
                        ? "bg-green-500/20 border border-green-500/40 shadow-lg shadow-green-500/20" 
                        : widgetTheme === "dark" ? "bg-green-900/50" : "bg-green-100"
                    }`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className={`text-[10px] font-semibold ${widgetTheme === "trustlayer" ? "text-green-300" : widgetTheme === "dark" ? "text-green-400" : "text-green-700"}`}>LIVE</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-green-500/20 border border-green-500/30 shadow-lg shadow-green-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`text-xl font-bold ${widgetTheme === "trustlayer" ? "text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>67.3%</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-green-300/60" : "text-gray-500"}`}>Win Rate</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-blue-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`text-xl font-bold ${widgetTheme === "trustlayer" ? "text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : widgetTheme === "dark" ? "text-blue-400" : "text-blue-600"}`}>103.2K</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-blue-300/60" : "text-gray-500"}`}>Predictions</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`text-xl font-bold ${widgetTheme === "trustlayer" ? "text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-600"}`}>94.1%</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-purple-300/60" : "text-gray-500"}`}>Confidence</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[{asset:"BTC/USD",signal:"LONG",conf:89,time:"2m ago"},{asset:"ETH/USD",signal:"SHORT",conf:76,time:"8m ago"},{asset:"SOL/USD",signal:"LONG",conf:92,time:"12m ago"}].map((s,i)=>(
                      <div key={i} className={`flex items-center justify-between rounded-xl p-2.5 transition-all ${
                        widgetTheme === "trustlayer" 
                          ? "bg-white/5 backdrop-blur-sm border border-red-500/20 hover:border-red-400/40" 
                          : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${widgetTheme === "trustlayer" ? "text-red-100" : widgetTheme === "dark" ? "text-white" : ""}`}>{s.asset}</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            widgetTheme === "trustlayer"
                              ? s.signal==="LONG"
                                ? "bg-green-500/30 text-green-300 border border-green-500/40 shadow-md shadow-green-500/20"
                                : "bg-red-500/30 text-red-300 border border-red-500/40 shadow-md shadow-red-500/20"
                              : s.signal==="LONG"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}>{s.signal}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-cyan-300" : widgetTheme === "dark" ? "text-white" : "text-gray-700"}`}>{s.conf}%</div>
                          <div className={`text-[9px] ${widgetTheme === "trustlayer" ? "text-gray-500" : "text-gray-400"}`}>{s.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-3 flex items-center gap-2 text-[10px] ${widgetTheme === "trustlayer" ? "text-red-300/70" : "text-gray-500"}`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-white text-[8px] ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/30" 
                        : "bg-red-500"
                    }`}>⛓</div>
                    <span>Predictions verified on DarkWave Smart Chain</span>
                  </div>
                </div>
              )}
              {/* Pulse Pro API Demo */}
              {widgetsList[selectedWidget].id === "pulse-pro" && (
                <div className={`p-4 pt-10 lg:pt-4 h-full font-mono text-xs relative z-10 ${widgetTheme === "light" ? "bg-gradient-to-br from-amber-50 to-yellow-50" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Pulse API Console</div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30" 
                        : "bg-amber-200 text-amber-800"
                    }`}>PRO</span>
                  </div>
                  <div className={`rounded-xl p-3 overflow-x-auto ${
                    widgetTheme === "trustlayer" 
                      ? "bg-black/40 backdrop-blur-sm border border-amber-500/30 shadow-xl shadow-amber-500/10" 
                      : "bg-gray-900"
                  }`}>
                    <div className={`text-[10px] mb-1 ${widgetTheme === "trustlayer" ? "text-amber-400/60" : "text-gray-500"}`}># GET /api/v1/pulse/predict</div>
                    <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>{"{"}</div>
                    <div className={`text-[10px] pl-3 ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>"asset": <span className={widgetTheme === "trustlayer" ? "text-amber-300" : "text-amber-400"}>"BTC/USD"</span>,</div>
                    <div className={`text-[10px] pl-3 ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>"signal": <span className={widgetTheme === "trustlayer" ? "text-green-300" : "text-green-400"}>"LONG"</span>,</div>
                    <div className={`text-[10px] pl-3 ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>"confidence": <span className={widgetTheme === "trustlayer" ? "text-purple-300" : "text-purple-400"}>0.89</span>,</div>
                    <div className={`text-[10px] pl-3 ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>"timestamp": <span className={widgetTheme === "trustlayer" ? "text-sky-300" : "text-sky-400"}>"2026-02-02T09:15:00Z"</span>,</div>
                    <div className={`text-[10px] pl-3 ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>"hash": <span className={widgetTheme === "trustlayer" ? "text-pink-300" : "text-pink-400"}>"0x7f3a9c..."</span></div>
                    <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-cyan-300" : "text-green-400"}`}>{"}"}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-amber-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-amber-600"}`}>∞</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-amber-300/60" : "text-gray-500"}`}>API Calls</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-amber-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-amber-600"}`}>1000/m</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-amber-300/60" : "text-gray-500"}`}>Rate Limit</div>
                    </div>
                  </div>
                  <div className={`mt-3 text-[10px] ${widgetTheme === "trustlayer" ? "text-amber-200/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>SDK available: <span className={widgetTheme === "trustlayer" ? "text-cyan-300" : ""}>JavaScript</span>, <span className={widgetTheme === "trustlayer" ? "text-yellow-300" : ""}>Python</span>, <span className={widgetTheme === "trustlayer" ? "text-sky-300" : ""}>Go</span></div>
                </div>
              )}
              {/* Pulse Enterprise Demo */}
              {widgetsList[selectedWidget].id === "pulse-enterprise" && (
                <div className={`p-4 pt-10 lg:pt-4 h-full relative z-10 ${widgetTheme === "light" ? "bg-gradient-to-br from-purple-50 to-indigo-50" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Enterprise Suite</div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30" 
                        : "bg-purple-200 text-purple-800"
                    }`}>WHITE-LABEL</span>
                  </div>
                  <div className={`rounded-xl p-3 mb-3 ${
                    widgetTheme === "trustlayer" 
                      ? "bg-white/5 backdrop-blur-sm border border-purple-500/30 shadow-xl shadow-purple-500/10" 
                      : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                  }`}>
                    <div className={`text-xs mb-1 ${widgetTheme === "trustlayer" ? "text-purple-300/70" : "text-gray-500"}`}>Your Brand Here</div>
                    <div className={`h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      widgetTheme === "trustlayer" 
                        ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 shadow-lg shadow-purple-500/30" 
                        : "bg-gradient-to-r from-purple-500 to-indigo-500"
                    }`}>ACME PREDICTIONS™</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-green-500/20 border border-green-500/30 shadow-lg shadow-green-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`font-bold ${widgetTheme === "trustlayer" ? "text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>99.9%</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-green-300/60" : "text-gray-500"}`}>SLA Uptime</div>
                    </div>
                    <div className={`rounded-xl p-2 text-center ${
                      widgetTheme === "trustlayer" 
                        ? "bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                        : widgetTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
                    }`}>
                      <div className={`font-bold ${widgetTheme === "trustlayer" ? "text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-600"}`}>24/7</div>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-purple-300/60" : "text-gray-500"}`}>Priority Support</div>
                    </div>
                  </div>
                  <div className={`space-y-1.5 text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="flex items-center gap-2"><span className={widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" : "text-green-500"}>✓</span> Custom model training</div>
                    <div className="flex items-center gap-2"><span className={widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" : "text-green-500"}>✓</span> Dedicated infrastructure</div>
                    <div className="flex items-center gap-2"><span className={widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" : "text-green-500"}>✓</span> Compliance documentation</div>
                    <div className="flex items-center gap-2"><span className={widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" : "text-green-500"}>✓</span> On-premise deployment</div>
                  </div>
                </div>
              )}
              {/* Signal Chat Demo */}
              {widgetsList[selectedWidget].id === "signal-chat" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/40"
                          : "bg-cyan-500 text-white"
                      }`}>⚡</div>
                      <div>
                        <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-cyan-100" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Trust Layer Ecosystem</div>
                        <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-cyan-400/70" : widgetTheme === "dark" ? "text-green-400" : "text-green-500"}`}>● 142 online across 20 apps</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                          : widgetTheme === "dark" ? "bg-purple-900/30 text-purple-400 border border-purple-500/30"
                          : "bg-purple-100 text-purple-700"
                      }`}>SSO</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
                          : widgetTheme === "dark" ? "bg-cyan-900/40 text-cyan-400 border border-cyan-500/30"
                          : "bg-cyan-100 text-cyan-700"
                      }`}>LIVE</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-1 min-h-0">
                    <div className={`w-20 rounded-lg p-1.5 space-y-1 overflow-auto ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 border border-cyan-500/20"
                        : widgetTheme === "dark" ? "bg-slate-800/50" : "bg-gray-50"
                    }`}>
                      <div className={`text-[8px] font-semibold uppercase tracking-wider mb-1 ${widgetTheme === "trustlayer" ? "text-cyan-400/60" : widgetTheme === "dark" ? "text-cyan-400/50" : "text-cyan-600/70"}`}>Ecosystem</div>
                      {["# general", "# announce..."].map((ch, i) => (
                        <div key={i} className={`text-[8px] px-1.5 py-1 rounded cursor-pointer transition-all ${
                          widgetTheme === "trustlayer"
                            ? "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                            : widgetTheme === "dark" ? "text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}>{ch}</div>
                      ))}
                      <div className={`text-[8px] font-semibold uppercase tracking-wider mt-2 mb-1 ${widgetTheme === "trustlayer" ? "text-purple-400/60" : widgetTheme === "dark" ? "text-purple-400/50" : "text-purple-600/70"}`}>App Support</div>
                      <div className={`text-[8px] px-1.5 py-1 rounded cursor-pointer transition-all ${
                        widgetTheme === "trustlayer"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : widgetTheme === "dark" ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-cyan-100 text-cyan-700"
                      }`}># dws-supp...</div>
                      {["# garagebot...", "# tlid-mkt..."].map((ch, i) => (
                        <div key={i} className={`text-[8px] px-1.5 py-1 rounded cursor-pointer transition-all ${
                          widgetTheme === "trustlayer"
                            ? "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                            : widgetTheme === "dark" ? "text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}>{ch}</div>
                      ))}
                      <div className={`text-[8px] font-semibold uppercase tracking-wider mt-2 mb-1 ${widgetTheme === "trustlayer" ? "text-green-400/60" : widgetTheme === "dark" ? "text-green-400/50" : "text-green-600/70"}`}>DMs</div>
                      <div className={`text-[8px] px-1.5 py-1 rounded flex items-center gap-1 ${
                        widgetTheme === "trustlayer" ? "text-gray-400 hover:text-cyan-300" : widgetTheme === "dark" ? "text-slate-400 hover:text-cyan-400" : "text-gray-500"
                      }`}><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Alex
                        <span className={`ml-auto text-[7px] px-1 rounded ${
                          widgetTheme === "trustlayer" ? "bg-cyan-500/30 text-cyan-300" : widgetTheme === "dark" ? "bg-cyan-500/30 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                        }`}>PRO</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className={`flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-lg ${
                        widgetTheme === "trustlayer"
                          ? "bg-white/5 border border-white/10"
                          : widgetTheme === "dark" ? "bg-slate-800/30" : "bg-gray-50 border"
                      }`}>
                        <span className={`text-[10px] font-semibold ${widgetTheme === "trustlayer" ? "text-cyan-300" : widgetTheme === "dark" ? "text-cyan-400" : "text-cyan-700"}`}># darkwavestudios-support</span>
                        <span className={`text-[8px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-slate-500" : "text-gray-400"}`}>|</span>
                        <span className={`text-[8px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-slate-500" : "text-gray-400"}`}>DarkWave Studios</span>
                        <span className={`ml-auto text-[7px] px-1.5 py-0.5 rounded ${
                          widgetTheme === "trustlayer"
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                            : widgetTheme === "dark" ? "bg-green-900/30 text-green-400 border border-green-500/30"
                            : "bg-green-100 text-green-700"
                        }`}>3 online</span>
                      </div>
                      <div className={`flex-1 space-y-2 overflow-auto p-2 rounded-lg mb-2 ${
                        widgetTheme === "trustlayer"
                          ? "bg-white/5 border border-white/10"
                          : widgetTheme === "dark" ? "bg-slate-800/30" : "bg-white border"
                      }`}>
                        {[
                          { user: "Sarah", msg: "Need help with my booking widget config", time: "2:31 PM", color: "from-pink-500 to-purple-500", badge: "GarageBot" },
                          { user: "🤖 SignalBot", msg: "Ticket #284 created. @DarkWave team notified.", time: "2:31 PM", color: "from-green-500 to-emerald-500", isBot: true },
                          { user: "Alex", msg: "Checking your setup now — same TL account right?", time: "2:33 PM", color: "from-blue-500 to-cyan-500", badge: "DWS Team" },
                        ].map((m, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] text-white font-bold ${
                              widgetTheme === "trustlayer"
                                ? `bg-gradient-to-r ${m.color} shadow-md`
                                : widgetTheme === "dark" ? `bg-gradient-to-r ${m.color}` : "bg-cyan-500"
                            }`}>{m.user[0] === '🤖' ? '🤖' : m.user[0]}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-semibold ${
                                  m.isBot
                                    ? widgetTheme === "trustlayer" ? "text-green-400" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"
                                    : widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"
                                }`}>{m.user}</span>
                                {(m as any).badge && (
                                  <span className={`text-[7px] px-1 py-0.5 rounded font-medium ${
                                    (m as any).badge === "DWS Team"
                                      ? widgetTheme === "trustlayer" ? "bg-cyan-500/20 text-cyan-300" : widgetTheme === "dark" ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                                      : widgetTheme === "trustlayer" ? "bg-purple-500/20 text-purple-300" : widgetTheme === "dark" ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                                  }`}>{(m as any).badge}</span>
                                )}
                                <span className={`text-[8px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-slate-500" : "text-gray-400"}`}>{m.time}</span>
                              </div>
                              <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{m.msg}</div>
                              {i === 0 && (
                                <div className="flex gap-1 mt-1">
                                  {["👍 2", "🔧 1"].map((r, ri) => (
                                    <span key={ri} className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                                      widgetTheme === "trustlayer"
                                        ? "bg-white/10 border border-white/10"
                                        : widgetTheme === "dark" ? "bg-slate-700 border border-slate-600"
                                        : "bg-gray-100"
                                    }`}>{r}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className={`text-[9px] animate-pulse ${widgetTheme === "trustlayer" ? "text-cyan-400/60" : widgetTheme === "dark" ? "text-cyan-400/50" : "text-gray-400"}`}>Sarah is typing...</div>
                      </div>
                      <div className="flex gap-1.5">
                        <input className={`flex-1 rounded-lg px-3 py-1.5 text-[10px] ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/10 border border-cyan-500/30 text-cyan-100 placeholder-cyan-300/40"
                            : widgetTheme === "dark" ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-400" : "border placeholder-gray-400"
                        }`} placeholder="Message #darkwavestudios-support..." />
                        <button className={`rounded-lg w-7 h-7 flex items-center justify-center text-[10px] ${
                          widgetTheme === "trustlayer"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                            : "bg-cyan-500 text-white"
                        }`}>↑</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* VIN Decoder Demo */}
              {widgetsList[selectedWidget].id === "vin-decoder" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>VIN Decoder</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-red-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Decode any vehicle instantly</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex gap-2">
                      <input className={`flex-1 px-3 py-2 text-xs font-mono transition-all ${
                        widgetTheme === "trustlayer"
                          ? "bg-white/10 backdrop-blur-sm border border-red-500/30 rounded-lg text-red-100 placeholder-red-300/50 shadow-lg shadow-red-500/10"
                          : widgetTheme === "dark"
                            ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                            : "border rounded-lg bg-white"
                      }`} defaultValue="1HGBH41JXMN109186" readOnly />
                      <button className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}>Decode</button>
                    </div>
                    <div className={`rounded-xl p-3 space-y-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-400/20 shadow-xl shadow-red-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-slate-700"
                          : "bg-gray-50 border"
                    }`}>
                      {[
                        { label: "Year", value: "2021" },
                        { label: "Make", value: "Honda" },
                        { label: "Model", value: "Civic" },
                        { label: "Trim", value: "EX" },
                        { label: "Engine", value: "2.0L I4" },
                        { label: "Transmission", value: "CVT" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className={widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}>{item.label}</span>
                          <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-red-200" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Safety:</span>
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-sm ${widgetTheme === "trustlayer" ? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" : "text-yellow-500"}`}>★</span>
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : widgetTheme === "dark" ? "bg-green-900/30 text-green-400 border border-green-500/30"
                          : "bg-green-100 text-green-700"
                      }`}>No Active Recalls</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Parts Aggregator Demo */}
              {widgetsList[selectedWidget].id === "parts-aggregator" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Parts Aggregator</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-orange-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Search 68+ retailers at once</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <input className={`w-full px-3 py-2 text-xs transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/10 backdrop-blur-sm border border-orange-500/30 rounded-lg text-orange-100 placeholder-orange-300/50 shadow-lg shadow-orange-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 rounded-lg text-white"
                          : "border rounded-lg bg-white"
                    }`} defaultValue="Brake Pads - Honda Civic 2021" readOnly />
                    <div className="space-y-2">
                      {[
                        { retailer: "AutoZone", price: "$42.99", best: false },
                        { retailer: "O'Reilly", price: "$39.99", best: true },
                        { retailer: "RockAuto", price: "$35.49", best: false },
                      ].map((item, i) => (
                        <div key={i} className={`rounded-lg p-2.5 flex items-center justify-between transition-all ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 backdrop-blur-sm border border-orange-500/20 hover:border-orange-400/40"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/60 border border-slate-700"
                              : "bg-white border hover:border-gray-300"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                            <div>
                              <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-orange-200" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.retailer}</div>
                              <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-green-400/70" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>In Stock</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.best && (
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                widgetTheme === "trustlayer"
                                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30"
                                  : widgetTheme === "dark" ? "bg-orange-900/30 text-orange-400 border border-orange-500/30"
                                  : "bg-orange-100 text-orange-700"
                              }`}>Best Price</span>
                            )}
                            <span className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02]"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}>Compare All</button>
                </div>
              )}
              {/* Shift Manager Demo */}
              {widgetsList[selectedWidget].id === "shift-manager" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Shift Manager</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-blue-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Employee scheduling</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                        <button key={i} className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                          i === 0
                            ? widgetTheme === "trustlayer"
                              ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                              : widgetTheme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                            : widgetTheme === "trustlayer"
                              ? "bg-white/5 text-gray-400 border border-white/10 hover:border-blue-500/30"
                              : widgetTheme === "dark" ? "bg-slate-800 text-gray-400 border border-slate-700" : "bg-gray-100 text-gray-500"
                        }`}>{day}</button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "Mike J.", time: "8AM-4PM", status: "confirmed" },
                        { name: "Sarah W.", time: "4PM-12AM", status: "confirmed" },
                        { name: "Tom B.", time: "12AM-8AM", status: "pending" },
                      ].map((shift, i) => (
                        <div key={i} className={`rounded-lg p-2.5 flex items-center justify-between transition-all ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 backdrop-blur-sm border border-blue-500/20"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/60 border border-slate-700"
                              : "bg-white border"
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                              widgetTheme === "trustlayer"
                                ? "bg-gradient-to-r from-blue-500 to-sky-500 shadow-md"
                                : "bg-blue-500"
                            }`}>{shift.name[0]}</div>
                            <div>
                              <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-blue-200" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{shift.name}</div>
                              <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{shift.time}</div>
                            </div>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                            shift.status === "confirmed"
                              ? widgetTheme === "trustlayer"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : widgetTheme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                              : widgetTheme === "trustlayer"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : widgetTheme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                          }`}>{shift.status === "confirmed" ? "Confirmed" : "Pending"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : widgetTheme === "dark" ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>⚠ 1 Conflict Detected</span>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}>Publish Schedule</button>
                </div>
              )}
              {/* Payroll Calculator Demo */}
              {widgetsList[selectedWidget].id === "payroll-calc" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Payroll Calculator</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-emerald-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Automated tax calculations</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className={`flex items-center justify-between rounded-lg p-2.5 ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 border border-emerald-500/20"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-slate-700" : "bg-gray-50 border"
                    }`}>
                      <div>
                        <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-emerald-200" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Sarah Williams</div>
                        <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Full-time Employee</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : widgetTheme === "dark" ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                      }`}>W-2</span>
                    </div>
                    <div className={`rounded-xl p-3 space-y-2 ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-sm border border-emerald-500/20"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-slate-700" : "bg-white border"
                    }`}>
                      {[
                        { label: "Gross Pay", value: "$4,200.00", negative: false },
                        { label: "Federal Tax", value: "-$630.00", negative: true },
                        { label: "State Tax", value: "-$210.00", negative: true },
                        { label: "SS/Medicare", value: "-$321.30", negative: true },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className={widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}>{item.label}</span>
                          <span className={`font-semibold ${
                            item.negative
                              ? widgetTheme === "trustlayer" ? "text-red-400" : widgetTheme === "dark" ? "text-red-400" : "text-red-600"
                              : widgetTheme === "trustlayer" ? "text-emerald-200" : widgetTheme === "dark" ? "text-white" : "text-gray-900"
                          }`}>{item.value}</span>
                        </div>
                      ))}
                      <div className={`border-t pt-2 mt-1 ${widgetTheme === "trustlayer" ? "border-emerald-500/20" : widgetTheme === "dark" ? "border-slate-700" : "border-gray-200"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${widgetTheme === "trustlayer" ? "text-emerald-300" : widgetTheme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>Net Pay</span>
                          <span className={`text-xl font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent drop-shadow-lg" : widgetTheme === "dark" ? "text-emerald-300" : "text-emerald-700"}`}>$3,038.70</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : widgetTheme === "dark" ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>Bi-Weekly</span>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}>Generate Pay Stub</button>
                </div>
              )}
              {/* OCR Scanner Demo */}
              {widgetsList[selectedWidget].id === "ocr-scanner" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>OCR Scanner</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-purple-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Camera-based text capture</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className={`rounded-xl p-4 flex items-center justify-center relative transition-all ${
                      widgetTheme === "trustlayer"
                        ? "border-2 border-dashed border-purple-500/40 bg-white/5 backdrop-blur-sm"
                        : widgetTheme === "dark"
                          ? "border-2 border-dashed border-slate-600 bg-slate-800/40"
                          : "border-2 border-dashed border-gray-300 bg-gray-50"
                    }`} style={{ minHeight: "80px" }}>
                      <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${widgetTheme === "trustlayer" ? "border-purple-400" : widgetTheme === "dark" ? "border-purple-400" : "border-purple-500"}`}></div>
                      <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${widgetTheme === "trustlayer" ? "border-purple-400" : widgetTheme === "dark" ? "border-purple-400" : "border-purple-500"}`}></div>
                      <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${widgetTheme === "trustlayer" ? "border-purple-400" : widgetTheme === "dark" ? "border-purple-400" : "border-purple-500"}`}></div>
                      <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${widgetTheme === "trustlayer" ? "border-purple-400" : widgetTheme === "dark" ? "border-purple-400" : "border-purple-500"}`}></div>
                      <div className="text-center">
                        <div className={`text-xs animate-pulse font-semibold ${widgetTheme === "trustlayer" ? "text-purple-300" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-600"}`}>Scanning...</div>
                        <div className={`text-[10px] mt-1 ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Point camera at text</div>
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/20 shadow-xl shadow-green-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-green-500/20"
                          : "bg-green-50 border border-green-200"
                    }`}>
                      <div className={`text-[10px] mb-1 ${widgetTheme === "trustlayer" ? "text-green-400/70" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>Detected Text</div>
                      <div className={`text-sm font-mono font-bold ${widgetTheme === "trustlayer" ? "text-green-300 drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]" : widgetTheme === "dark" ? "text-green-300" : "text-green-800"}`}>VIN: 1HGBH41JXMN109186</div>
                    </div>
                    <div className="flex justify-end">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : widgetTheme === "dark" ? "bg-purple-900/30 text-purple-400 border border-purple-500/30"
                          : "bg-purple-100 text-purple-700"
                      }`}>98.7% Match</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}>Copy Text</button>
                    <button className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/10 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-white/15"
                        : widgetTheme === "dark"
                          ? "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
                          : "bg-white border text-gray-700 hover:bg-gray-50"
                    }`}>Scan Again</button>
                  </div>
                </div>
              )}

              {/* Driver Leaderboard Demo */}
              {widgetsList[selectedWidget].id === "driver-leaderboard" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Driver Leaderboard</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-yellow-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Gamified performance rankings</div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {["Today", "Week", "Month"].map((period, i) => (
                      <button key={i} className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        i === 0
                          ? widgetTheme === "trustlayer"
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30"
                            : widgetTheme === "dark" ? "bg-yellow-600 text-white" : "bg-yellow-500 text-white"
                          : widgetTheme === "trustlayer"
                            ? "bg-white/5 text-gray-400 border border-white/10 hover:border-yellow-500/30"
                            : widgetTheme === "dark" ? "bg-slate-800 text-gray-400 border border-slate-700" : "bg-gray-100 text-gray-500"
                      }`}>{period}</button>
                    ))}
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { rank: 1, name: "Alex Rivera", initials: "AR", rate: 47, streak: "🔥 12 day streak", color: "from-yellow-500 to-amber-500" },
                      { rank: 2, name: "Jordan Lee", initials: "JL", rate: 43, streak: null, color: "from-gray-300 to-gray-400" },
                      { rank: 3, name: "Casey Morgan", initials: "CM", rate: 39, streak: null, color: "from-orange-400 to-orange-500" },
                    ].map((driver, i) => (
                      <div key={i} className={`rounded-xl p-2.5 transition-all ${
                        widgetTheme === "trustlayer"
                          ? i === 0 ? "bg-gradient-to-r from-yellow-500/15 to-amber-500/10 backdrop-blur-sm border border-yellow-400/30 shadow-lg shadow-yellow-500/10" : "bg-white/5 backdrop-blur-sm border border-white/10"
                          : widgetTheme === "dark"
                            ? i === 0 ? "bg-yellow-900/20 border border-yellow-500/20" : "bg-slate-800/60 border border-slate-700"
                            : i === 0 ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold w-4 ${widgetTheme === "trustlayer" ? "text-yellow-400" : widgetTheme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>#{driver.rank}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br ${driver.color}`}>{driver.initials}</div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{driver.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={`h-1.5 rounded-full ${widgetTheme === "trustlayer" ? "bg-white/10" : widgetTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`} style={{ width: "60px" }}>
                                <div className={`h-full rounded-full bg-gradient-to-r ${driver.color}`} style={{ width: `${(driver.rate / 50) * 100}%` }}></div>
                              </div>
                              <span className={`text-[9px] font-medium ${widgetTheme === "trustlayer" ? "text-yellow-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{driver.rate} moves/hr</span>
                            </div>
                          </div>
                          {driver.streak && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                              widgetTheme === "trustlayer"
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : widgetTheme === "dark" ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-700"
                            }`}>{driver.streak}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {["Speed Demon", "Perfect Week"].map((badge, i) => (
                      <span key={i} className={`px-2 py-1 rounded-lg text-[9px] font-semibold ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30"
                          : widgetTheme === "dark" ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/20" : "bg-yellow-100 text-yellow-700"
                      }`}>🏆 {badge}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Tracker Demo */}
              {widgetsList[selectedWidget].id === "delivery-tracker" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Delivery Tracker</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-cyan-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Order #DW-8847</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between px-1">
                      {[
                        { label: "Confirmed", done: true },
                        { label: "Preparing", done: true },
                        { label: "In Transit", done: false, active: true },
                        { label: "Delivered", done: false },
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 relative">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                            step.done
                              ? widgetTheme === "trustlayer"
                                ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30"
                                : "bg-cyan-500 text-white"
                              : step.active
                                ? widgetTheme === "trustlayer"
                                  ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 animate-pulse"
                                  : "bg-cyan-500 text-white animate-pulse"
                                : widgetTheme === "trustlayer"
                                  ? "bg-white/10 border border-white/20 text-gray-500"
                                  : widgetTheme === "dark" ? "bg-slate-700 border border-slate-600 text-gray-500" : "bg-gray-200 text-gray-400"
                          }`}>{step.done ? "✓" : i + 1}</div>
                          <span className={`text-[8px] font-medium ${
                            step.done || step.active
                              ? widgetTheme === "trustlayer" ? "text-cyan-300" : widgetTheme === "dark" ? "text-cyan-400" : "text-cyan-600"
                              : widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-xl p-3 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-cyan-500/10 to-teal-500/10 backdrop-blur-sm border border-cyan-400/20 shadow-xl shadow-cyan-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-cyan-500/20"
                          : "bg-cyan-50 border border-cyan-200"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-cyan-500 to-teal-500`}>MK</div>
                          <div>
                            <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Marcus K.</div>
                            <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-cyan-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Your driver</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" : widgetTheme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>12 min</div>
                          <div className={`text-[9px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>ETA</div>
                        </div>
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 flex items-center justify-center transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-slate-800/80 to-cyan-900/40 backdrop-blur-sm border border-cyan-400/20"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/80 border border-slate-700"
                          : "bg-gray-100 border border-gray-200"
                    }`} style={{ minHeight: "60px" }}>
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${widgetTheme === "trustlayer" ? "text-cyan-400" : widgetTheme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                        <span className={`text-[10px] font-medium ${widgetTheme === "trustlayer" ? "text-cyan-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Live map view</span>
                      </div>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]"
                      : "bg-cyan-600 text-white hover:bg-cyan-700"
                  }`}>Live Tracking</button>
                </div>
              )}

              {/* Menu Builder Demo */}
              {widgetsList[selectedWidget].id === "menu-builder" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Menu Builder</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-green-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Digital menu editor</div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {["Mains", "Sides", "Drinks"].map((tab, i) => (
                      <button key={i} className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        i === 0
                          ? widgetTheme === "trustlayer"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                            : widgetTheme === "dark" ? "bg-green-600 text-white" : "bg-green-600 text-white"
                          : widgetTheme === "trustlayer"
                            ? "bg-white/5 text-gray-400 border border-white/10 hover:border-green-500/30"
                            : widgetTheme === "dark" ? "bg-slate-800 text-gray-400 border border-slate-700" : "bg-gray-100 text-gray-500"
                      }`}>{tab}</button>
                    ))}
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { emoji: "🍔", name: "Classic Burger", price: "$14.99", tags: ["GF"] },
                      { emoji: "🥗", name: "Caesar Salad", price: "$11.99", tags: ["V", "GF"] },
                      { emoji: "🍝", name: "Truffle Pasta", price: "$18.99", tags: ["V"] },
                    ].map((item, i) => (
                      <div key={i} className={`rounded-xl p-2.5 flex items-center gap-2.5 transition-all ${
                        widgetTheme === "trustlayer"
                          ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30"
                          : widgetTheme === "dark"
                            ? "bg-slate-800/60 border border-slate-700 hover:border-green-500/30"
                            : "bg-white border border-gray-200 hover:border-green-300"
                      }`}>
                        <span className="text-lg">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.name}</div>
                          <div className="flex gap-1 mt-0.5">
                            {item.tags.map((tag, j) => (
                              <span key={j} className={`px-1.5 py-0.5 rounded text-[7px] font-bold ${
                                widgetTheme === "trustlayer"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : widgetTheme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                              }`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-green-300 drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-700"}`}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                      widgetTheme === "trustlayer"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : widgetTheme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                    }`}>3 items</span>
                    <button className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}>+ Add Item</button>
                  </div>
                </div>
              )}

              {/* Room Visualizer Demo */}
              {widgetsList[selectedWidget].id === "room-visualizer" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Room Visualizer</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-pink-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>AI color visualizer</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className={`rounded-xl overflow-hidden transition-all ${
                      widgetTheme === "trustlayer"
                        ? "border border-pink-400/20 shadow-xl shadow-pink-500/10"
                        : widgetTheme === "dark"
                          ? "border border-slate-700"
                          : "border border-gray-200"
                    }`} style={{ minHeight: "80px" }}>
                      <div className="w-full h-20 bg-gradient-to-br from-teal-200 via-teal-100 to-cyan-100 relative">
                        <div className={`absolute bottom-0 left-0 right-0 h-6 ${widgetTheme === "trustlayer" ? "bg-white/10 backdrop-blur-sm" : widgetTheme === "dark" ? "bg-slate-800/60" : "bg-gray-100/80"}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                      {[
                        { color: "#5F9EA0", name: "Seaside Blue" },
                        { color: "#8FBC8F", name: "Sage Green" },
                        { color: "#A9A9A9", name: "Warm Gray" },
                        { color: "#FFFFF0", name: "Ivory" },
                        { color: "#E8967A", name: "Sunset" },
                      ].map((swatch, i) => (
                        <button key={i} className={`w-7 h-7 rounded-full transition-all ${
                          i === 0
                            ? widgetTheme === "trustlayer"
                              ? "ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-pink-500/30"
                              : widgetTheme === "dark" ? "ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900" : "ring-2 ring-pink-500 ring-offset-2"
                            : widgetTheme === "trustlayer" ? "hover:ring-1 hover:ring-white/30" : "hover:ring-1 hover:ring-gray-300"
                        }`} style={{ backgroundColor: swatch.color }} title={swatch.name}></button>
                      ))}
                    </div>
                    <div className={`text-center py-2 rounded-lg transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-sm border border-pink-400/20"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-slate-700"
                          : "bg-gray-50 border border-gray-200"
                    }`}>
                      <div className={`text-xs font-bold ${widgetTheme === "trustlayer" ? "text-pink-300 drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]" : widgetTheme === "dark" ? "text-pink-400" : "text-pink-600"}`}>SW 6204 - Sea Salt</div>
                      <div className={`text-[9px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Sherwin-Williams</div>
                    </div>
                    <div className="flex gap-1">
                      {["Before", "After"].map((label, i) => (
                        <button key={i} className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                          i === 1
                            ? widgetTheme === "trustlayer"
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                              : widgetTheme === "dark" ? "bg-pink-600 text-white" : "bg-pink-600 text-white"
                            : widgetTheme === "trustlayer"
                              ? "bg-white/5 text-gray-400 border border-white/10"
                              : widgetTheme === "dark" ? "bg-slate-800 text-gray-400 border border-slate-700" : "bg-gray-100 text-gray-500"
                        }`}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02]"
                      : "bg-pink-600 text-white hover:bg-pink-700"
                  }`}>Save Palette</button>
                </div>
              )}

              {/* Invoice Generator Demo */}
              {widgetsList[selectedWidget].id === "invoice-generator" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Invoice Generator</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-indigo-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Professional invoicing</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${widgetTheme === "trustlayer" ? "text-indigo-300 drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]" : widgetTheme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>#INV-2024-0089</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        widgetTheme === "trustlayer"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : widgetTheme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                      }`}>Sent - Awaiting Payment</span>
                    </div>
                    <div className={`rounded-lg p-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-sm border border-indigo-400/20"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-slate-700"
                          : "bg-gray-50 border border-gray-200"
                    }`}>
                      <div className={`text-[9px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Bill to</div>
                      <div className={`text-xs font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Apex Digital LLC</div>
                      <div className={`text-[9px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Due Feb 28</div>
                    </div>
                    <div className="space-y-1">
                      {[
                        { desc: "Website Redesign", amount: "$4,500" },
                        { desc: "SEO Package", amount: "$1,200" },
                        { desc: "Hosting (Annual)", amount: "$480" },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 border border-white/5"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/40 border border-slate-700/50"
                              : "bg-white border border-gray-100"
                        }`}>
                          <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{item.desc}</span>
                          <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-lg p-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-sm border border-indigo-400/20 shadow-lg shadow-indigo-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-indigo-500/20"
                          : "bg-indigo-50 border border-indigo-200"
                    }`}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Subtotal</span>
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>$6,180.00</span>
                      </div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Tax (8%)</span>
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>$494.40</span>
                      </div>
                      <div className={`flex justify-between text-sm font-bold pt-1 border-t ${
                        widgetTheme === "trustlayer" ? "border-indigo-400/20 text-indigo-300 drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]" : widgetTheme === "dark" ? "border-slate-600 text-indigo-400" : "border-indigo-200 text-indigo-700"
                      }`}>
                        <span>Total</span>
                        <span>$6,674.40</span>
                      </div>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}>Download PDF</button>
                </div>
              )}

              {widgetsList[selectedWidget].id === "emergency-dashboard" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Command Center</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-red-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Emergency Response</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${widgetTheme === "trustlayer" ? "text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]" : widgetTheme === "dark" ? "text-red-400" : "text-red-600"}`}>Alert Level</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold animate-pulse ${
                        widgetTheme === "trustlayer"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : widgetTheme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                      }`}>ELEVATED</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "Medical - Section 204", status: "critical", color: "red" },
                        { label: "Lost Child - Gate B", status: "active", color: "amber" },
                        { label: "Spill - Concourse", status: "resolved", color: "green" },
                      ].map((incident, i) => (
                        <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 border border-white/5 backdrop-blur-sm"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/40 border border-slate-700/50"
                              : "bg-white border border-gray-100"
                        }`}>
                          <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{incident.label}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${
                            incident.color === "red"
                              ? widgetTheme === "trustlayer" ? "bg-red-500/20 text-red-300 border border-red-500/30" : widgetTheme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                              : incident.color === "amber"
                                ? widgetTheme === "trustlayer" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : widgetTheme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                                : widgetTheme === "trustlayer" ? "bg-green-500/20 text-green-300 border border-green-500/30" : widgetTheme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                          }`}>{incident.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-lg p-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-400/20 shadow-lg shadow-red-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-red-500/20"
                          : "bg-red-50 border border-red-200"
                    }`}>
                      <div className="flex justify-between text-[10px]">
                        <div className="text-center">
                          <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]" : widgetTheme === "dark" ? "text-red-400" : "text-red-600"}`}>3</div>
                          <div className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Active</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-green-300" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>12</div>
                          <div className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Resolved</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-bold ${widgetTheme === "trustlayer" ? "text-amber-300" : widgetTheme === "dark" ? "text-amber-400" : "text-amber-600"}`}>8</div>
                          <div className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Teams</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02]"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}>Broadcast Alert</button>
                </div>
              )}

              {widgetsList[selectedWidget].id === "inventory-counter" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Inventory Counter</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-teal-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>3-Phase Count System</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${widgetTheme === "trustlayer" ? "text-teal-300 drop-shadow-[0_0_6px_rgba(94,234,212,0.4)]" : widgetTheme === "dark" ? "text-teal-400" : "text-teal-600"}`}>Phase 2 of 3 — Verification</span>
                      <div className="flex gap-1">
                        {[true, true, false].map((done, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${done
                            ? widgetTheme === "trustlayer" ? "bg-teal-400 shadow-[0_0_6px_rgba(94,234,212,0.5)]" : widgetTheme === "dark" ? "bg-teal-400" : "bg-teal-500"
                            : widgetTheme === "trustlayer" ? "bg-white/20" : widgetTheme === "dark" ? "bg-slate-600" : "bg-gray-300"
                          }`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { name: "Napkins (500ct)", counted: 47, expected: 50 },
                        { name: "Cups (12oz)", counted: 234, expected: 240 },
                        { name: "Lids (12oz)", counted: 198, expected: 200 },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 border border-white/5 backdrop-blur-sm"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/40 border border-slate-700/50"
                              : "bg-white border border-gray-100"
                        }`}>
                          <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{item.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{item.counted}</span>
                            <span className={`${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>/</span>
                            <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{item.expected}</span>
                            {item.counted !== item.expected && (
                              <span className={`text-[8px] font-bold ${widgetTheme === "trustlayer" ? "text-red-400" : widgetTheme === "dark" ? "text-red-400" : "text-red-600"}`}>-{item.expected - item.counted}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-lg p-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm border border-teal-400/20 shadow-lg shadow-teal-500/10"
                        : widgetTheme === "dark"
                          ? "bg-slate-800/60 border border-teal-500/20"
                          : "bg-teal-50 border border-teal-200"
                    }`}>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Progress</span>
                        <span className={`font-bold ${widgetTheme === "trustlayer" ? "text-teal-300" : widgetTheme === "dark" ? "text-teal-400" : "text-teal-600"}`}>67%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${widgetTheme === "trustlayer" ? "bg-white/10" : widgetTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}>
                        <div className={`h-full rounded-full ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-teal-400 to-cyan-400 shadow-[0_0_8px_rgba(94,234,212,0.5)]" : "bg-teal-500"}`} style={{ width: "67%" }}></div>
                      </div>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-[1.02]"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}>Submit Count</button>
                </div>
              )}

              {widgetsList[selectedWidget].id === "token-scanner" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Token Safety Scan</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-amber-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Smart contract analysis</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 border border-amber-400/20 backdrop-blur-sm"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-slate-700" : "bg-gray-50 border border-gray-200"
                    }`}>
                      <span className={`text-[10px] font-mono ${widgetTheme === "trustlayer" ? "text-amber-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>0x7a25...3f9d</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold ${
                        widgetTheme === "trustlayer" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : widgetTheme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"
                      }`}>Ethereum</span>
                    </div>
                    <div className={`rounded-lg p-3 text-center transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/20 shadow-lg shadow-green-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-green-500/20" : "bg-green-50 border border-green-200"
                    }`}>
                      <div className={`text-3xl font-black ${widgetTheme === "trustlayer" ? "text-green-300 drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>87</div>
                      <div className={`text-xs font-bold ${widgetTheme === "trustlayer" ? "text-green-400/70" : widgetTheme === "dark" ? "text-green-500" : "text-green-700"}`}>Grade: B+</div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "Liquidity Lock", value: 95 },
                        { label: "Ownership", value: 82 },
                        { label: "Contract Safety", value: 91 },
                        { label: "Community", value: 78 },
                      ].map((metric, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[9px] mb-0.5">
                            <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{metric.label}</span>
                            <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-amber-300" : widgetTheme === "dark" ? "text-amber-400" : "text-amber-600"}`}>{metric.value}%</span>
                          </div>
                          <div className={`h-1 rounded-full overflow-hidden ${widgetTheme === "trustlayer" ? "bg-white/10" : widgetTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}>
                            <div className={`h-full rounded-full ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]" : "bg-amber-500"}`} style={{ width: `${metric.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] ${
                      widgetTheme === "trustlayer" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" : widgetTheme === "dark" ? "bg-amber-900/20 text-amber-400" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      <span>⚠️</span>
                      <span>Ownership not renounced</span>
                    </div>
                  </div>
                </div>
              )}

              {widgetsList[selectedWidget].id === "wellness-assessment" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Wellness Assessment</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-emerald-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Discover your Dosha</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className={`rounded-lg p-2 text-center ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-sm border border-emerald-400/20"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-slate-700" : "bg-gray-50 border border-gray-200"
                    }`}>
                      <div className={`text-[10px] ${widgetTheme === "trustlayer" ? "text-gray-500" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Question 5 of 12</div>
                      <div className={`text-xs font-semibold mt-0.5 ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>How would you describe your energy levels?</div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "High & Steady", dosha: "Vata", selected: false },
                        { label: "Intense & Focused", dosha: "Pitta", selected: true },
                        { label: "Calm & Sustained", dosha: "Kapha", selected: false },
                      ].map((option, i) => (
                        <div key={i} className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                          option.selected
                            ? widgetTheme === "trustlayer"
                              ? "bg-emerald-500/15 border border-emerald-400/40 shadow-lg shadow-emerald-500/10"
                              : widgetTheme === "dark" ? "bg-emerald-900/20 border border-emerald-500/30" : "bg-emerald-50 border-2 border-emerald-400"
                            : widgetTheme === "trustlayer"
                              ? "bg-white/5 border border-white/5 hover:border-emerald-400/20 backdrop-blur-sm"
                              : widgetTheme === "dark" ? "bg-slate-800/40 border border-slate-700/50 hover:border-slate-600" : "bg-white border border-gray-100 hover:border-gray-300"
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                              option.selected
                                ? widgetTheme === "trustlayer" ? "border-emerald-400 bg-emerald-400" : widgetTheme === "dark" ? "border-emerald-400 bg-emerald-400" : "border-emerald-500 bg-emerald-500"
                                : widgetTheme === "trustlayer" ? "border-gray-500" : widgetTheme === "dark" ? "border-gray-500" : "border-gray-300"
                            }`}>
                              {option.selected && <div className="w-1 h-1 rounded-full bg-white"></div>}
                            </div>
                            <span className={`font-medium ${widgetTheme === "trustlayer" ? "text-gray-200" : widgetTheme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{option.label}</span>
                          </div>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                            widgetTheme === "trustlayer" ? "bg-white/10 text-gray-400" : widgetTheme === "dark" ? "bg-slate-700 text-gray-400" : "bg-gray-100 text-gray-500"
                          }`}>{option.dosha}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-lg p-2 transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-400/20 shadow-lg shadow-emerald-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"
                    }`}>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className={`${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Progress</span>
                        <span className={`font-bold ${widgetTheme === "trustlayer" ? "text-emerald-300" : widgetTheme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>42%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${widgetTheme === "trustlayer" ? "bg-white/10" : widgetTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}>
                        <div className={`h-full rounded-full ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-emerald-400 to-green-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-emerald-500"}`} style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    <div className={`text-center py-1.5 rounded-lg text-[10px] font-semibold ${
                      widgetTheme === "trustlayer" ? "bg-white/5 border border-emerald-400/10 text-emerald-300/60" : widgetTheme === "dark" ? "bg-slate-800/40 text-emerald-400/50" : "bg-gray-50 text-emerald-600/50"
                    }`}>Your Dosha: Pitta-Kapha</div>
                  </div>
                </div>
              )}

              {widgetsList[selectedWidget].id === "multi-wallet" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Portfolio</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-purple-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Multi-chain overview</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className={`rounded-lg p-3 text-center transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm border border-purple-400/20 shadow-lg shadow-purple-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-purple-500/20" : "bg-purple-50 border border-purple-200"
                    }`}>
                      <div className={`text-2xl font-black ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>$12,847.32</div>
                      <div className={`text-xs font-semibold mt-0.5 ${widgetTheme === "trustlayer" ? "text-green-400" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"}`}>+3.2% (24h)</div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { symbol: "SOL", amount: "24.5", usd: "$3,214", color: "#9945FF" },
                        { symbol: "ETH", amount: "1.82", usd: "$5,460", color: "#627EEA" },
                        { symbol: "MATIC", amount: "2,340", usd: "$1,872", color: "#8247E5" },
                      ].map((token, i) => (
                        <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 border border-white/5 backdrop-blur-sm"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/40 border border-slate-700/50"
                              : "bg-white border border-gray-100"
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }}></div>
                            <span className={`font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{token.symbol}</span>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${widgetTheme === "trustlayer" ? "text-white" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>{token.amount}</div>
                            <div className={`text-[8px] ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{token.usd}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}>Send</button>
                    <button className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/10 border border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
                        : widgetTheme === "dark" ? "bg-slate-700 text-purple-400 hover:bg-slate-600" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}>Swap</button>
                  </div>
                </div>
              )}

              {widgetsList[selectedWidget].id === "effects-kit" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Effects Kit</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-purple-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Interactive demo — try each effect</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div className={`rounded-lg p-2.5 text-center transition-all cursor-pointer hover:scale-105 ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-purple-400/30 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-purple-500/20 hover:bg-slate-700/60" : "bg-purple-50 border border-purple-200 hover:bg-purple-100"
                    }`} style={{ perspective: "600px" }}>
                      <div className="transition-transform duration-300 hover:rotate-y-6 hover:rotate-x-3" style={{ transformStyle: "preserve-3d" }}>
                        <div className={`text-lg mb-0.5 ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : ""}`}>🪟</div>
                        <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-purple-300" : widgetTheme === "dark" ? "text-purple-400" : "text-purple-700"}`}>Glassmorphism</div>
                        <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>blur + transparency</div>
                      </div>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-cyan-500/20 hover:bg-slate-700/60" : "bg-cyan-50 border border-cyan-200 hover:bg-cyan-100"
                    }`} style={{ perspective: "600px", transformStyle: "preserve-3d" }}>
                      <div className={`text-lg mb-0.5 ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}`}>🎴</div>
                      <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-cyan-300" : widgetTheme === "dark" ? "text-cyan-400" : "text-cyan-700"}`}>3D Card Hover</div>
                      <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>perspective + tilt</div>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center relative overflow-hidden ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-pink-400/30"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-pink-500/20" : "bg-pink-50 border border-pink-200"
                    }`}>
                      <div className="absolute inset-0 shimmer-skeleton opacity-30" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }}></div>
                      <div className="relative z-10">
                        <div className={`text-lg mb-0.5 ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : ""}`}>✨</div>
                        <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-pink-300" : widgetTheme === "dark" ? "text-pink-400" : "text-pink-700"}`}>Shimmer Load</div>
                        <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>purple gradient sweep</div>
                      </div>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center transition-all cursor-pointer ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-green-400/30 shadow-lg shadow-green-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-green-500/20" : "bg-green-50 border border-green-200"
                    }`}>
                      <div className={`text-lg mb-0.5 animate-bounce ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" : ""}`}>📜</div>
                      <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-green-300" : widgetTheme === "dark" ? "text-green-400" : "text-green-700"}`}>Scroll Reveal</div>
                      <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>fade + slide + scale</div>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center transition-all cursor-pointer active:scale-90 ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-amber-400/30 shadow-lg shadow-amber-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-amber-500/20" : "bg-amber-50 border border-amber-200"
                    }`} onClick={() => { if (navigator.vibrate) navigator.vibrate(25); }}>
                      <div className={`text-lg mb-0.5 ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : ""}`}>📳</div>
                      <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-amber-300" : widgetTheme === "dark" ? "text-amber-400" : "text-amber-700"}`}>Haptic Touch</div>
                      <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>tap to feel vibrate</div>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center transition-all cursor-pointer group ${
                      widgetTheme === "trustlayer"
                        ? "bg-white/5 backdrop-blur-md border border-red-400/30 shadow-lg shadow-red-500/10"
                        : widgetTheme === "dark" ? "bg-slate-800/60 border border-red-500/20" : "bg-red-50 border border-red-200"
                    }`}>
                      <div className={`text-lg mb-0.5 group-active:scale-75 transition-transform ${widgetTheme === "trustlayer" ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" : ""}`}>🎯</div>
                      <div className={`text-[10px] font-bold ${widgetTheme === "trustlayer" ? "text-red-300" : widgetTheme === "dark" ? "text-red-400" : "text-red-700"}`}>Micro Actions</div>
                      <div className={`text-[8px] mt-0.5 ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>press · lift · ripple</div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-center gap-1 mt-2 px-2 py-1 rounded text-[9px] font-semibold ${
                    widgetTheme === "trustlayer" ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" : widgetTheme === "dark" ? "bg-purple-900/20 text-purple-400" : "bg-purple-50 text-purple-600 border border-purple-200"
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>6 effect modules · ~420 lines · zero dependencies</span>
                  </div>
                </div>
              )}

              {widgetsList[selectedWidget].id === "compliance-engine" && (
                <div className="p-4 pt-10 lg:pt-4 h-full flex flex-col relative z-10">
                  <div className="text-center mb-2">
                    <div className={`text-lg font-bold ${widgetTheme === "trustlayer" ? "bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent" : widgetTheme === "dark" ? "text-white" : "text-gray-900"}`}>Compliance Status</div>
                    <div className={`text-xs ${widgetTheme === "trustlayer" ? "text-sky-300/70" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Workforce compliance</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg p-2 flex-1 text-center transition-all ${
                        widgetTheme === "trustlayer"
                          ? "bg-gradient-to-br from-sky-500/10 to-blue-500/10 backdrop-blur-sm border border-sky-400/20 shadow-lg shadow-sky-500/10"
                          : widgetTheme === "dark" ? "bg-slate-800/60 border border-sky-500/20" : "bg-sky-50 border border-sky-200"
                      }`}>
                        <div className={`text-2xl font-black ${widgetTheme === "trustlayer" ? "text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" : widgetTheme === "dark" ? "text-sky-400" : "text-sky-600"}`}>94%</div>
                        <div className={`text-[9px] ${widgetTheme === "trustlayer" ? "text-gray-400" : widgetTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Overall Compliant</div>
                        <div className={`text-[9px] font-semibold mt-0.5 ${widgetTheme === "trustlayer" ? "text-sky-300/70" : widgetTheme === "dark" ? "text-sky-400/70" : "text-sky-600"}`}>187 / 194 workers</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "I-9 Verified", icon: "✓", status: "green" },
                        { label: "Background Check", icon: "✓", status: "green" },
                        { label: "Safety Cert — 12 days", icon: "⚠️", status: "amber" },
                        { label: "CPR Cert — Expired", icon: "✗", status: "red" },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          widgetTheme === "trustlayer"
                            ? "bg-white/5 border border-white/5 backdrop-blur-sm"
                            : widgetTheme === "dark"
                              ? "bg-slate-800/40 border border-slate-700/50"
                              : "bg-white border border-gray-100"
                        }`}>
                          <span className={`${widgetTheme === "trustlayer" ? "text-gray-300" : widgetTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{item.label}</span>
                          <span className={`text-xs font-bold ${
                            item.status === "green"
                              ? widgetTheme === "trustlayer" ? "text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]" : widgetTheme === "dark" ? "text-green-400" : "text-green-600"
                              : item.status === "amber"
                                ? widgetTheme === "trustlayer" ? "text-amber-400" : widgetTheme === "dark" ? "text-amber-400" : "text-amber-600"
                                : widgetTheme === "trustlayer" ? "text-red-400" : widgetTheme === "dark" ? "text-red-400" : "text-red-600"
                          }`}>{item.icon}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded text-[9px] font-semibold ${
                      widgetTheme === "trustlayer" ? "bg-red-500/10 text-red-300 border border-red-500/20" : widgetTheme === "dark" ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      <span>7 Actions Required</span>
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold mt-3 transition-all ${
                    widgetTheme === "trustlayer"
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02]"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}>Run Audit</button>
                </div>
              )}

              </div>
            </div>
          </div>
          
          {/* Navigation Controls - Arrows with Cyan Dot Indicator */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-2">
            <button 
              onClick={() => setSelectedWidget((prev) => (prev - 1 + widgetsList.length) % widgetsList.length)}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400 transition-all group"
              data-testid="widget-prev"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            </button>
            
            {/* Cyan Dot Indicator */}
            <div className="flex items-center gap-1.5 px-4">
              {widgetsList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedWidget(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === selectedWidget 
                      ? 'w-8 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-lg shadow-cyan-500/50' 
                      : 'w-2.5 h-2.5 bg-white/20 hover:bg-cyan-400/40'
                  }`}
                  data-testid={`widget-dot-${index}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedWidget((prev) => (prev + 1) % widgetsList.length)}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400 transition-all group"
              data-testid="widget-next"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            </button>
          </div>
          
          {/* Current Widget Label */}
          <div className="text-center text-xs text-muted-foreground">
            <span className="text-cyan-400 font-medium">{selectedWidget + 1}</span> of <span className="text-cyan-400 font-medium">{widgetsList.length}</span> widgets
          </div>

          {/* Detailed Widget Info Panel */}
          <div className="mt-6 glass-card rounded-2xl p-4 lg:p-6 gradient-border" data-testid="widget-info-panel">
            {/* Trust Badge Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-white/10" data-testid="trust-badges">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold" data-testid="badge-trust-shield">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified by Trust Shield</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold" data-testid="badge-guardian-shield">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected by Guardian Shield</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold" data-testid="badge-blockchain">
                <FileText className="w-3.5 h-3.5" />
                <span>Blockchain Registered</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-4">
              <h4 className="font-bold text-sm text-primary mb-2">About This Widget</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {widgetsList[selectedWidget].fullDescription}
              </p>
            </div>

            {/* Tech Stack & Complexity */}
            <div className="mb-4 p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Tech Stack</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                  <Code2 className="w-3 h-3" />
                  {widgetsList[selectedWidget].linesOfCode}
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                  widgetsList[selectedWidget].complexity === "Beginner-friendly" 
                    ? "bg-green-500/20 text-green-400" 
                    : widgetsList[selectedWidget].complexity === "Intermediate"
                    ? "bg-amber-500/20 text-amber-400"
                    : widgetsList[selectedWidget].complexity === "Advanced"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}>
                  {widgetsList[selectedWidget].complexity}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {widgetsList[selectedWidget].techStack.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features, Requirements, Includes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Features */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Features
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Requirements
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Included */}
              <div className="bg-white/5 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  What's Included
                </h5>
                <ul className="space-y-1.5">
                  {widgetsList[selectedWidget].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customization Options - Only for Pulse products */}
            {widgetsList[selectedWidget].customizations && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl">
                <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">What We Can Customize For You</span>
                </h5>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlike off-the-shelf solutions, Pulse is tailored specifically to your needs. Here's what we can configure:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {widgetsList[selectedWidget].customizations.map((custom, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Zap className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{custom}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-red-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-red-300/70 italic">
                    Have a specific requirement not listed here? Tell us in your request form - our engineers can build custom solutions for your exact use case.
                  </p>
                  <a 
                    href="https://darkwavepulse.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] transition-all whitespace-nowrap"
                    data-testid="link-pulse-live"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    See Pulse in Action
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Trust & Security Footer */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-primary">DarkWave Smart Chain Verified</div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Every purchase is hashed to the DarkWave blockchain. Your transaction hash is stored in your account for permanent verification. Check authenticity anytime at trustshield.tech
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-white/5 font-mono">SHA-256 Secured</span>
                  <span className="px-2 py-1 rounded bg-white/5 font-mono">Immutable Record</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION 6: CTA - TRUE 3-COL MOBILE / 12-COL DESKTOP */}
        <section className="grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4">
          <div className="col-span-3 lg:col-span-12">
            <div className="glass-card rounded-xl lg:rounded-3xl p-4 lg:p-12 gradient-border text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <div className="relative z-10">
                <h3 className="text-lg lg:text-3xl font-bold font-display mb-2 lg:mb-4" data-testid="text-cta-title">
                  Join the <span className="gradient-text">Trust Layer</span>
                </h3>
                <p className="text-xs lg:text-base text-muted-foreground max-w-2xl mx-auto mb-4 lg:mb-8 line-clamp-2 lg:line-clamp-none">
                  Connect your app to the DarkWave ecosystem. Share code, sync data, and leverage blockchain-verified integrations.
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-1.5 lg:gap-2 bg-primary text-primary-foreground px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-lg"
                    data-testid="button-apply-access"
                  >
                    Apply for Access <Zap className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  </Link>
                  <a 
                    href="#"
                    className="inline-flex items-center gap-1.5 lg:gap-2 glass px-4 lg:px-8 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-sm hover:bg-white/10 transition-colors"
                    data-testid="button-docs"
                  >
                    Docs <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-strong mt-6 lg:mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="font-display font-bold text-sm lg:text-base gradient-text" data-testid="text-footer-brand">Trust Layer Hub</span>
          </div>
          <div className="text-muted-foreground text-[10px] lg:text-sm" data-testid="text-footer-tagline">Powered by DarkWave Trust Layer Blockchain</div>
        </div>
      </footer>

      {/* AI Chat Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50" data-testid="ai-chat-container">
        {/* Side Tab Button */}
        <button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className={`flex items-center justify-center w-10 h-24 bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-xl shadow-purple-500/30 transition-all rounded-l-xl border border-purple-400/30 ${
            aiChatOpen ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          }`}
          data-testid="ai-chat-tab"
          aria-label="Open AI Assistant"
        >
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>AI</span>
          </div>
        </button>

        {/* Full Chat Panel */}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-slate-950 via-purple-950/90 to-slate-950 border-l border-purple-500/30 shadow-2xl shadow-purple-500/20 transition-transform duration-300 flex flex-col ${
          aiChatOpen ? "translate-x-0" : "translate-x-full"
        }`} data-testid="ai-chat-panel">
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-500/20 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white">DarkWave AI</h3>
                <p className="text-xs text-purple-300">Powered by Trust Layer</p>
              </div>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              data-testid="ai-chat-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm"
                    : "bg-white/10 backdrop-blur-sm text-gray-100 rounded-bl-sm border border-purple-500/20"
                }`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2 text-purple-300">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-semibold">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleAiSubmit} className="p-4 border-t border-purple-500/20 bg-black/40">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 text-sm"
                data-testid="ai-chat-input"
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || aiLoading}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-center hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                data-testid="ai-chat-send"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-purple-300/60 mt-2 text-center">Powered by 11 Labs Voice AI</p>
          </form>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
          data-testid="floating-cart-button"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {cart.length}
          </span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50" data-testid="cart-drawer">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-white/10 flex flex-col">
            <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">Your Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-semibold">{cart.length} items</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 lg:p-6 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between" data-testid={`cart-item-${item.id}`}>
                  <div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">${item.price}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 lg:p-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${cartTotal}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleCheckout("stripe")}
                  disabled={checkoutLoading}
                  className="w-full btn-glow bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="checkout-stripe"
                >
                  {checkoutLoading ? "Processing..." : <><Zap className="w-4 h-4" /> Pay with Card</>}
                </button>
                <button
                  onClick={() => handleCheckout("coinbase")}
                  disabled={checkoutLoading}
                  className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  data-testid="checkout-coinbase"
                >
                  {checkoutLoading ? "Processing..." : <><Shield className="w-4 h-4" /> Pay with Crypto</>}
                </button>
              </div>
              
              <p className="text-[10px] text-muted-foreground text-center">
                Secure checkout powered by Stripe & Coinbase Commerce
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pulse Request Modal */}
      {pulseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="modal-pulse-request">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => { setPulseModalOpen(false); setPulseSubmitted(false); }}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="font-bold font-display text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Request Your Bespoke Solution
                </h3>
                <p className="text-sm text-muted-foreground">Handcrafted precision, tailored exclusively to your needs</p>
              </div>
              <button
                onClick={() => { setPulseModalOpen(false); setPulseSubmitted(false); }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="close-pulse-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {pulseSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Your Request Has Been Received</h4>
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-muted-foreground">
                      Thank you for choosing a premium, tailor-made solution. Unlike one-size-fits-all products, 
                      <span className="text-amber-400 font-medium"> every Pulse implementation is handcrafted specifically for you</span>.
                    </p>
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 text-left">
                      <h5 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> What Happens Next
                      </h5>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">1.</span>
                          <span>Our specialists will <strong className="text-white">carefully analyze your requirements</strong> within 24-48 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">2.</span>
                          <span>We'll craft a <strong className="text-white">custom proposal and pricing</strong> based on your specific use case</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">3.</span>
                          <span>Your solution will be <strong className="text-white">built and configured exclusively for your purposes</strong></span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Like a master luthier crafting a fine acoustic guitar from premium mahogany and rosewood, 
                      we take the time to build something exceptional - not mass-produced.
                    </p>
                  </div>
                  <button
                    onClick={() => { setPulseModalOpen(false); setPulseSubmitted(false); }}
                    className="mt-6 btn-glow bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePulseSubmit} className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-4 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-amber-400 mb-1">Why We Do It This Way</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Pulse is not a cookie-cutter, one-size-fits-all product. Each implementation is 
                          <strong className="text-white"> precision-crafted for your specific requirements</strong> - 
                          like a master craftsman building a fine instrument from premium materials. 
                          Tell us about your needs, and we'll design a solution as unique as your business.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={pulseFormData.companyName}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="Your company"
                        data-testid="input-company-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={pulseFormData.contactName}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="Your name"
                        data-testid="input-contact-name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={pulseFormData.email}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="email@company.com"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={pulseFormData.phone}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Use Case *</label>
                    <select
                      required
                      value={pulseFormData.useCase}
                      onChange={(e) => setPulseFormData(prev => ({ ...prev, useCase: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      data-testid="select-use-case"
                    >
                      <option value="">Select use case...</option>
                      <option value="trading">Trading / Investment Decisions</option>
                      <option value="analytics">Market Analytics & Insights</option>
                      <option value="forecasting">Business Forecasting</option>
                      <option value="risk">Risk Assessment</option>
                      <option value="research">Research & Backtesting</option>
                      <option value="platform">Platform Integration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Volume</label>
                      <select
                        value={pulseFormData.expectedVolume}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, expectedVolume: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        data-testid="select-volume"
                      >
                        <option value="">Select volume...</option>
                        <option value="low">Low ({"<"}100 predictions/day)</option>
                        <option value="medium">Medium (100-1000/day)</option>
                        <option value="high">High (1000-10000/day)</option>
                        <option value="enterprise">Enterprise (10000+/day)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Timeline</label>
                      <select
                        value={pulseFormData.timeline}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        data-testid="select-timeline"
                      >
                        <option value="">Select timeline...</option>
                        <option value="asap">ASAP</option>
                        <option value="1-2weeks">1-2 weeks</option>
                        <option value="1month">Within 1 month</option>
                        <option value="exploring">Just exploring</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Integration Needs</label>
                      <input
                        type="text"
                        value={pulseFormData.integrationNeeds}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, integrationNeeds: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="API, Webhook, White-label..."
                        data-testid="input-integration"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget Range</label>
                      <select
                        value={pulseFormData.budgetRange}
                        onChange={(e) => setPulseFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        data-testid="select-budget"
                      >
                        <option value="">Select budget...</option>
                        <option value="under-500">Under $500</option>
                        <option value="500-1500">$500 - $1,500</option>
                        <option value="1500-4000">$1,500 - $4,000</option>
                        <option value="4000-10000">$4,000 - $10,000</option>
                        <option value="10000+">$10,000+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Tools / Systems</label>
                    <input
                      type="text"
                      value={pulseFormData.currentTools}
                      onChange={(e) => setPulseFormData(prev => ({ ...prev, currentTools: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      placeholder="What tools/platforms do you currently use?"
                      data-testid="input-current-tools"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea
                      value={pulseFormData.additionalNotes}
                      onChange={(e) => setPulseFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                      placeholder="Tell us more about your specific requirements..."
                      data-testid="input-notes"
                    />
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs text-red-300">
                      <strong>Selected Tier:</strong> {pulseFormData.tier === "basic" ? "Pulse Basic" : pulseFormData.tier === "pro" ? "Pulse Pro API" : "Pulse Enterprise"} - Starting at ${
                        pulseFormData.tier === "basic" ? "499" : 
                        pulseFormData.tier === "pro" ? "1,499" : "3,999"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pricing is customized based on your specific requirements and volume.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={pulseSubmitting}
                    className="w-full btn-glow bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="submit-pulse-request"
                  >
                    {pulseSubmitting ? "Submitting..." : <><Zap className="w-4 h-4" /> Submit Request</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Code Modal */}
      {codeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="modal-full-code">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setCodeModal(prev => ({ ...prev, open: false }))}
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="font-bold font-display text-lg">{codeModal.title}</h3>
                <p className="text-sm text-muted-foreground">{codeModal.lines} lines of code</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyFullCode}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm"
                  data-testid="button-copy-full"
                >
                  {copiedId === "modal" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCodeModal(prev => ({ ...prev, open: false }))}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {codeModal.loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto text-xs lg:text-sm font-mono text-gray-300 leading-relaxed">
                  <code>{codeModal.code}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
