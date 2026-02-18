# DarkWave Studios

## Overview
DarkWave Studios is a freelance web development agency portfolio and lead generation platform. It showcases services, projects, and pricing, while capturing leads through various forms like contact, quote requests, bookings, and newsletter subscriptions. The platform functions as both a marketing site and a CRM, designed to manage potential clients. It also integrates with various AI-powered tools and an extensive ecosystem of 27 interconnected applications and widgets (1.6M+ total LOC), including an AI agent marketplace, a security scanner, and a media editing studio. The long-term vision includes a comprehensive ecosystem of interconnected applications and services built on a shared Trust Layer.

## Recent Changes
- **Feb 2026**: Updated Trust Layer LOC from 673,309 → 282,494 (accurate count: 160,671 frontend / 61,375 server / 9,460 shared / 50,988 other). Ecosystem total now ~1.6M+ across 27 apps.
- **Feb 2026**: Added DarkWave Academy (dwsc.io/academy) and ChronoChat (chronochat.io) as new ecosystem apps (25 → 27).
- **Feb 2026**: Updated Trust Layer highlights: 233 pages, 158 components, 749 endpoints, 544 schema exports, 12 PWA manifests, 7 domains, 12 arcade games.
- **Feb 2026**: Updated Arcade description to list all 12 games.
- **Feb 2026**: All count/LOC references updated across Home, Explore, Ecosystem, EcosystemMetrics, Developers, CommandCenter, TrustLayerHub.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS v4 with custom CSS variables, Shadcn/ui (New York style)
- **Build Tool**: Vite
- **UI/UX**: Dark theme with gradient accents and glass-morphism effects, incorporating a comprehensive effects system (glassmorphism, 3D card hover, shimmer loading, scroll-triggered animations, haptic feedback, micro-interactions).

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints
- **Lead Management**: Server handles form submissions for leads, quote requests, bookings, subscribers, and testimonials with CRUD operations.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod
- **Key Tables**: `users`, `leads`, `subscribers`, `blogPosts`, `testimonials`, `caseStudies`, `quoteRequests`, `bookings`, `pageViews`, `analyticsEvents`, `seoKeywords`, `chatChannels`, `chatUsers`, `chatMessages`, `guardianScans`, `aiCreditBalances`, `aiCreditTransactions`.

### Analytics System
Includes page view tracking, custom event tracking, SEO keyword monitoring, and a real-time dashboard.

### AI Blog Generator
Uses OpenAI (GPT-4o) for content generation, with SEO optimization and tone selection.

### Trust Layer SSO Authentication
- **System**: Cross-application identity using JWT tokens for authentication and session management.
- **SSO Module**: `server/trustlayer-sso.ts` handles registration, login, and identity management.

### Admin Authentication
Admin routes are protected using an `X-Admin-Key` header middleware.

### Documents System
Manages business documents such as the Business Plan, Executive Summary, Roadmap, Terms of Service, and Privacy Policy.

### Trust Layer Hub
A blockchain-verified code marketplace offering 60 embeddable widgets with live previews and full code access.

### AI Agent Marketplace
An external platform (`https://dwsc.io/ai-agents`) for creating, deploying, and discovering AI agents, integrated with Guardian AI for certification.

### Guardian AI
An AI agent security scanner and certification platform for the crypto ecosystem, providing real-time security scans, trust scores, and certification tiers.

### AI Credits System
A pay-as-you-go credit system for AI features, including credit packages, Stripe integration for purchases, and a detailed transaction log.

### TrustVault Studio Integration
A cross-application media editor integrated via Trust Layer SSO, with a dedicated API client, proxy routes, and webhook handling.

### Public Information Pages
Pages for Mission, Investors, Terms of Service, and Privacy Policy.

### Storage Pattern
Utilizes a storage abstraction layer (`server/storage.ts`) with an `IStorage` interface for flexible database integration.

## External Dependencies

### Database
- PostgreSQL

### UI Framework
- Radix UI primitives
- Lucide React (iconography)
- Class Variance Authority
- Embla Carousel

### Development Tools
- Replit-specific Vite plugins
- Google Fonts CDN (Space Grotesk, Inter, JetBrains Mono)