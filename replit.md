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

The frontend follows a page-based architecture with shared components. Pages include Home, Services, Projects, About, Contact, Compare, Quote, Book, Admin, Blog, Analytics, BlogAdmin, Mission, Investors, Terms, Privacy, and Documents. The design uses a dark theme with gradient accents and glass-morphism effects.

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
- **Widget Marketplace**: 12+ embeddable widgets (analytics, booking, lead capture, estimators, etc.)
- **Live Widget Previews**: Interactive widget demonstrations
- **Full Code View**: Modal displaying complete widget source code
- **Categories**: Components, utilities, hooks, API, auth

### Guardian AI
AI agent certification platform for the crypto ecosystem:
- **Certification Tiers**: Basic ($999), Professional ($4,999), Enterprise ($14,999)
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