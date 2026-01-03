# H&K Leather Craft - E-commerce Web Application

## Overview

H&K Leather Craft is a premium leather goods e-commerce brochure website built as a full-stack application. The site showcases handcrafted leather products including jackets, wallets, and accessories with a focus on luxury, craftsmanship, and durability. The application follows a catalog/inquiry model rather than a traditional cart-based checkout system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and scroll effects
- **Icons**: Lucide React

The frontend follows a component-based architecture with:
- Reusable UI primitives in `client/src/components/ui/`
- Page components in `client/src/pages/`
- Custom hooks in `client/src/hooks/` for auth, products, and cart logic
- Path aliases configured: `@/` for client source, `@shared/` for shared code

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server, Vite for client
- **API Design**: RESTful endpoints defined in `shared/routes.ts` as a typed API contract

Key backend components:
- `server/routes.ts`: API route handlers
- `server/auth.ts`: Passport.js local strategy authentication with session management
- `server/storage.ts`: Database abstraction layer implementing `IStorage` interface
- `server/db.ts`: PostgreSQL connection via node-postgres

### Authentication
- Session-based authentication using express-session with MemoryStore
- Passport.js with local strategy (username/password)
- Password hashing using Node.js crypto scrypt
- Admin-only product management (no public registration)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's pgTable
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit with `db:push` command

Database tables:
- `users`: Admin authentication (id, username, password, role, createdAt)
- `products`: Product catalog (id, name, description, price, category, imageUrl, createdAt)

### Build Configuration
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server to `dist/index.cjs`, Vite builds client to `dist/public`
- Certain dependencies are bundled to reduce cold start syscalls

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- Connection pooling via node-postgres `Pool`

### Third-Party Integrations
- **Vapi AI SDK**: Voice AI support widget embedded in the client HTML for customer assistance
- **Unsplash**: External image hosting for product and hero images

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `express` / `express-session`: Web server and session handling
- `passport` / `passport-local`: Authentication
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animations
- `zod`: Runtime validation

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Optional, defaults to hardcoded value for development