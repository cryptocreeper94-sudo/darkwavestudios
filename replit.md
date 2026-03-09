# DarkWave Studios

## Overview
DarkWave Studios is a freelance web development agency portfolio and lead generation platform. It showcases services, projects, and pricing, while capturing leads through various forms like contact, quote requests, bookings, and newsletter subscriptions. The platform functions as both a marketing site and a CRM, designed to manage potential clients. It also integrates with various AI-powered tools and an extensive ecosystem of 35 interconnected applications and widgets (~1.74M+ total LOC), including an AI agent marketplace, a security scanner, and a media editing studio. The long-term vision includes a comprehensive ecosystem of interconnected applications and services built on a shared Trust Layer.

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
- **Key Tables**: `users`, `leads`, `subscribers`, `blogPosts`, `testimonials`, `caseStudies`, `quoteRequests`, `bookings`, `pageViews`, `analyticsEvents`, `seoKeywords`, `chatChannels`, `chatUsers`, `chatMessages`, `guardianScans`, `aiCreditBalances`, `aiCreditTransactions`, `hallmarks`, `trustStamps`, `hallmarkCounter`, `affiliateReferrals`, `affiliateCommissions`.

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

### Hallmark System
Blockchain-native audit trail for the Trust Layer ecosystem. Every significant event (registration, purchases, certifications) generates a numbered hallmark with SHA-256 hash verification. App prefix: DS. Genesis hallmark: DS-00000001. Trust stamps provide lightweight automatic audit entries for routine actions (logins, profile updates, wallet events). Implementation: `server/hallmark.ts`, tables: `hallmarks`, `trust_stamps`, `hallmark_counter`.

### Affiliate & Referral Program
5-tier commission system (Base 10% → Diamond 20%) paid in SIG. Users get a unique referral hash for cross-app referral links. Tracks referrals, conversions, and commissions with trust stamp audit trail. Minimum payout: 10 SIG. Implementation: `server/affiliate.ts`, tables: `affiliate_referrals`, `affiliate_commissions`. Dashboard: `/affiliate`.

### Trust Layer Hub
A blockchain-verified code marketplace offering 96 embeddable widgets with live previews and full code access.

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

### Lume Language API
Connects darkwavestudios.io to lume-lang.org, providing a full server-side interpreter (v1.0.0) with lexer, parser, transpiler, and AST generator. 13 milestones (M1-6 complete + Phase 14B finalization, 552 tests passing; M7-13 spec complete). Phase 14B adds prompt injection defense (8 patterns), output sanitization (11 patterns), rate limiting, REPL v1.0.0 (tab autocomplete, persistent history, .scope/.run), VS Code extension (19 snippets, TextMate grammar), AST-aware merge driver, and documentation suite (CLI, patterns, API, voice). Master spec: `attached_assets/Pasted-LUME-The-AI-Native-Programming-Language-Complete-Master_1773008480139.txt` (1,503 lines, 305 acceptance criteria). Includes API endpoints for platform connection, code execution, transpilation (Lume→JS), tokenization, AST generation, formatting, health checks, examples, docs, and intent resolution info. CORS configured for lume-lang.org, lume-lang.com, darkwavestudios.io, and academy.tlid.io.
- **Keywords (spec section 4.1)**: Core (let, define, set, to, return, if, else, when, is, and, or, not, for, each, in, while, break, continue, show, log, then, by), AI (ask, think, generate, as), Modules (use, export, from, all), Types (text, number, boolean, list, map, of, any, nothing, maybe), Error Handling (ok, error, fail, with, try), Testing (test, expect, equal, intent, given, expects), Literals (true, false, null), Pattern Matching (default), Self-Sustaining (monitor, heal, healable, optimize, evolve, rollback, suggest, auto, daemon).
- **Pipelines**: Standard: Lume Source → Lexer → Parser → AST → Transpiler → JavaScript. English Mode: English Source → Auto-Correct → Intent Resolver (7-step Tolerance Chain) → Security Check → AST → Transpiler → Certified JavaScript.
- **Source**: github.com/cryptocreeper94-sudo/lume. Domains: lume-lang.com (primary), lume-lang.org (secondary).
- **Handoff doc**: `attached_assets/LUME-API-HANDOFF-TO-VERCEL.md` — spec for all 10 API endpoints lume-lang.org needs to expose.
- **Whitepaper**: `attached_assets/Pasted-LUME-Eliminating-Cognitive-Distance-An-AI-Native-Progra_1773010858832.txt` — 830 lines, formal academic paper "Eliminating Cognitive Distance." Covers Tolerance Chain, Guardian Output Scanner, Transcription Cleanup Layer, compile-lock system, cognitive distance framework, 3-layer security architecture, and voice-to-code pipeline.

### Lume Intent Resolver (English Mode / Natural Mode)
Implements Milestone 7 (English Mode) and Milestone 8 (Natural Mode) of the Lume Natural Language Evolution roadmap. The Intent Resolver is a front-end stage that converts plain English (or any human language) into Lume AST, which then transpiles to JavaScript. Two layers: Layer A (Pattern Library) with 50+ deterministic phrase-to-code mappings across 18 categories (output, variable, math, conditional, loop, function, list, object, AI, data, time, string, comparison, monitor, heal, optimize, evolve, debug, comment, greeting, help), and Layer B (AI-Powered Resolution, planned) for complex/ambiguous input via LLM. Mode detection via `mode: english` or `mode: natural` file headers. Self-sustaining keywords (monitor, heal, optimize, evolve) map to natural language equivalents. Synonym rings for natural language normalization (get=fetch/grab/pull/obtain, show=display/render/present/print, save=store/persist/write/keep, delete=remove/destroy/erase/clear, create=make/build/construct, send=dispatch/fire/emit, calculate=compute/process/evaluate). Implementation: `server/lume-api.ts` (IntentResolver class). Endpoint: `/api/lume/intent-info`.

### Lume Playground
Interactive page (`/lume/playground`) with a code editor, output panel, transpiled JS view, token stream view, AST view, resolved Lume view (for English/Natural mode), 12 loadable examples (8 standard + 4 English Mode), keyboard shortcuts (Ctrl+Enter run, Ctrl+S transpile), connection status indicator, and mode selector (Standard Lume / English Mode / Natural Mode). Mode switching auto-loads appropriate default code and shows mode-specific UI indicators and reference documentation.

### Lume Natural Language Evolution Roadmap
Milestones 7-13 displayed on the Lume page (`/lume`): M7 English Mode (active), M8 Multilingual Mode, M9 Voice-to-Code, M10 Visual Context Awareness, M11 Reverse Mode (Code-to-Language), M12 Collaborative Intent, M13 Zero-Dependency Runtime. Launch date: August 23, 2026. Academy updated with Natural Language Programming track and CNLD (Certified Lume Natural Language Developer) certification.

### TrustGen
AI-powered 3D creation platform with blockchain provenance (Three.js + Meshy.ai text-to-3D, keyframe animation, post-processing, GLTF/GLB/FBX export). Includes Studio IDE (Monaco editor, 9 templates, AI code assistant, command palette, deploy), auto-rigging engine, skeletal animation player, and GPU particle system.

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