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

The frontend follows a page-based architecture with shared components. Pages include Home, Services, Projects, About, Contact, Compare, Quote, Book, and Admin. The design uses a dark theme with gradient accents and glass-morphism effects.

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
- `blogPosts` - Content management
- `testimonials` - Client reviews
- `caseStudies` - Portfolio pieces
- `quoteRequests` - Pricing calculator submissions
- `bookings` - Consultation scheduling

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