# DarkWave Studios

## Overview

DarkWave Studios is a freelance web development agency portfolio and lead generation platform. The application showcases services, projects, and pricing while capturing leads through contact forms, quote requests, booking systems, and newsletter subscriptions. It serves as both a marketing site and a CRM for managing potential clients.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: Shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based architecture with shared components. Pages include Home, Services, Projects, About, Contact, Compare, Quote, Book, Admin, Blog, Analytics, BlogAdmin, Mission, Investors, Terms, Privacy, Documents, and SignalChat. The design uses a dark theme with gradient accents and glass-morphism effects.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints prefixed with `/api/`
- **Development**: Hot module replacement via Vite middleware in dev mode
- **Production**: Static file serving from built assets

The server handles form submissions for leads, quote requests, bookings, subscribers, and testimonials. Each entity has CRUD operations exposed through REST endpoints.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Managed via `drizzle-kit push`

Database tables include:
- `users` - Admin authentication
- `leads` - Contact form submissions
- `subscribers` - Newsletter signups
- `blogPosts` - AI-generated blog content with SEO optimization
- `testimonials` - Client reviews
- `caseStudies` - Portfolio pieces
- `quoteRequests` - Pricing calculator submissions
- `bookings` - Consultation scheduling
- `pageViews` - Analytics page view tracking
- `analyticsEvents` - Custom event tracking
- `seoKeywords` - SEO keyword position monitoring
- `chatChannels` - Signal Chat channels (ecosystem + app-support)
- `chatUsers` - Signal Chat user identities
- `chatMessages` - Signal Chat real-time messages
- `guardianScans` - Guardian AI security scan results and trust scores

### Analytics System
The platform includes a comprehensive analytics system:
- **Page View Tracking**: Captures visits with path, referrer, device info, browser, and geolocation
- **Event Tracking**: Custom events (button clicks, form submissions, etc.)
- **SEO Monitoring**: Keyword position tracking with historical data
- **Real-time Dashboard**: Charts and metrics for traffic analysis

### AI Blog Generator
- **OpenAI Integration**: Uses GPT-4o for content generation
- **SEO Optimization**: Auto-generates meta descriptions, tags, and slugs
- **Tone Selection**: Professional, conversational, technical, or persuasive
- **Draft System**: Save as draft or publish immediately

### Trust Layer SSO Authentication
Signal Chat uses a Trust Layer SSO system for cross-app identity:
- **Registration**: Username, email, display name, password with strict validation
- **Password Policy**: Minimum 8 characters, at least 1 capital letter, 1 special character
- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Management**: JWT tokens (7-day expiry) stored in localStorage
- **Trust Layer ID**: Unique ecosystem identity (tl-{timestamp}-{random}) assigned at registration
- **WebSocket Auth**: JWT verified on WebSocket join to prevent impersonation
- **SSO Module**: `server/trustlayer-sso.ts` handles all auth logic
- **Endpoints**: POST /api/chat/auth/register, POST /api/chat/auth/login, GET /api/chat/auth/me
- **JWT_SECRET**: Set via environment variable for token persistence across restarts

### Admin Authentication
Admin routes are protected with X-Admin-Key header middleware. Protected routes include:
- Analytics viewing (stats, pageviews, events)
- SEO keyword management
- Blog post management
- Document management
- Note: Public tracking endpoints remain unprotected for client-side analytics

### Documents System
The platform includes a documents management system for:
- Business Plan (living document)
- Executive Summary / Mission Statement
- Roadmap for future additions
- Categories: business, roadmap, legal

### Trust Layer Hub
The platform includes a blockchain-verified code marketplace:
- **Widget Marketplace**: 30+ embeddable widgets (analytics, booking, lead capture, estimators, VIN decoder, payroll, delivery tracking, effects kit, etc.)
- **Live Widget Previews**: Interactive widget demonstrations
- **Full Code View**: Modal displaying complete widget source code
- **Categories**: Components, utilities, hooks, API, auth

### AI Agent Marketplace
External platform for creating, deploying, and discovering AI agents:
- **URL**: https://dwsc.io/ai-agents
- **Agent Types**: Trading bots, DeFi agents, NFT agents, social agents, analytics agents
- **Features**: Agent builder, smart contract integration, Trust Layer recording, revenue sharing
- **Integration**: Cross-links to Guardian AI for agent certification

### Guardian AI
AI agent security scanner and certification platform for the crypto ecosystem:
- **AI Bot Scanner**: Free real-time security scan using OpenAI to detect scams, honeypots, rug pulls, and fraud
- **Scan API**: POST /api/guardian/scan analyzes agents and returns trust scores with Zod validation
- **Scan Persistence**: Results stored in guardian_scans table with full score breakdown
- **Certification Tiers**: Basic ($999), Advanced ($4,999), Enterprise ($14,999)
- **Trust Score System**: 4 dimensions (Security, Transparency, Reliability, Compliance)
- **Certified Agent Registry**: Searchable database of verified AI agents
- **Certification Request Form**: Lead capture for certification inquiries

### Public Information Pages
- **Mission Page**: Company vision, mission statement, core values, and strategic goals
- **Investors Page**: Key metrics, growth opportunities, investment highlights
- **Terms of Service**: Legal terms and conditions
- **Privacy Policy**: Data collection and privacy practices

### Storage Pattern
The application uses a storage abstraction layer (`server/storage.ts`) that implements an `IStorage` interface. This pattern allows for potential swapping of database implementations while maintaining consistent API contracts.

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Connection pooling with `pg` package

### UI Framework
- Radix UI primitives for accessible components
- Lucide React for iconography
- Class Variance Authority for component variants
- Embla Carousel for carousels

### Development Tools
- Replit-specific Vite plugins for development banners and cartography
- Custom meta images plugin for OpenGraph tags

### Fonts
- Space Grotesk (display)
- Inter (body)
- JetBrains Mono (code)

Loaded via Google Fonts CDN.

### UI/UX Effects System
The platform includes a complete effects library applied across all pages:

**Glassmorphism** (CSS classes):
- `glass` — basic glass panel (backdrop-blur + semi-transparent bg)
- `glass-card` — card variant with border glow and hover lift
- `glass-strong` — heavy blur for modals/overlays

**3D Card Hover** (`card-3d` class):
- CSS perspective + translateZ on hover for depth tilt effect
- Applied to project cards, service cards, widget cards

**Shimmer/Skeleton Loading** (CSS animation):
- Purple gradient shimmer sweep animation for loading states
- Classes: `shimmer-skeleton`, `shimmer-text`, `shimmer-circle`, `shimmer-card`

**Scroll-Triggered Animations** (IntersectionObserver-based):
- Hook: `useScrollAnimation` in `client/src/hooks/use-scroll-animation.tsx`
- Component: `ScrollReveal` wrapper for declarative usage
- Animation types: `scroll-fade-in`, `scroll-slide-left`, `scroll-slide-right`, `scroll-scale-in`
- Triggered once when element enters viewport (`.visible` class toggle)
- Applied to Home page sections: projects, services, FAQ, testimonials, newsletter

**Haptic Feedback** (`client/src/lib/haptics.ts`):
- Utility: `haptic(pattern)` using `navigator.vibrate()`
- Patterns: light (10ms), medium (25ms), heavy (50ms), success, error, selection
- Applied to hero CTAs and key interactive buttons

**Micro-Interactions** (CSS classes):
- `btn-press` — scale-down press effect on click
- `hover-elevate` — lift + shadow on hover
- `ripple-effect` — expanding ripple on click (CSS animation)
- `toggle-switch` — animated toggle with smooth transition

### Purchase Delivery System
- Stripe webhook creates secure download tokens on successful payment
- Coinbase Commerce uses API status check at verification endpoint
- Download tokens: one-time use, 24-hour expiry, stored in DB
- PaymentSuccess page verifies session, displays download links
- Expired/used tokens show re-purchase prompt

## Recent Changes (Feb 2026)
- Implemented complete UI/UX effects system (glassmorphism, 3D hover, shimmer, scroll animations, haptic feedback, micro-interactions)
- Fixed purchase delivery gaps: route mismatch, Coinbase fulfillment, expired session handling
- Added Affiliate Disclosure page (/affiliate-disclosure) with FTC compliance — linked from footer
- Added Support & FAQ page (/support) with searchable FAQ, category filters, expandable answers
- Added PWA manifest (manifest.json) and service worker (sw.js) for offline support
- Updated Privacy Policy to explicitly mention Google AdSense cookies, opt-out links, third-party services list
- Updated Footer to include Affiliates and Support links in legal row
- Updated Terms, Privacy, and Affiliate Disclosure pages to use shared Footer component
- Updated sitemap.xml with new pages, robots.txt with /ws/ and /marketing disallows
- Added manifest.json link and service worker registration to index.html
- Fixed booking form date serialization (ISO string to Date coercion before Zod validation)
- Fixed Coinbase Commerce redirect URL (uses successUrl/cancelUrl from request body instead of undefined req.headers.origin)
- Updated all 3 business documents (Business Plan, Executive Summary, Roadmap) to reflect current ecosystem features
- Full platform audit completed: all 25 pages return 200, all form endpoints verified, Stripe/Coinbase payments confirmed working, admin portal tested, analytics tracking verified, AI endpoints operational, ecosystem images confirmed