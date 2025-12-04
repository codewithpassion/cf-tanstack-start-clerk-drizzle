# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TanStack Start application configured to deploy on Cloudflare Workers. It combines TanStack Router for file-based routing with Hono for API endpoints and server-side rendering, all running on Cloudflare's edge runtime.

**Key Stack**: TanStack Start + React 19 + Hono + Cloudflare Workers + Clerk (auth) + Cloudflare D1 (database) + Drizzle ORM

**RULES:**: Always read @ai_docs/rules.md

## Key Architecture

### Deployment Architecture
- **Runtime**: Cloudflare Workers (not Node.js)
- **SSR Framework**: TanStack Start with React 19
- **Server Framework**: Hono wraps the TanStack Start server entry point
- **Entry Point**: `workers/app.ts` exports the Cloudflare Worker handler
- **Auth Provider**: Clerk for authentication
- **Database**: Cloudflare D1 (SQLite-based edge database)
- **ORM**: Drizzle ORM with D1 adapter

### Server Entry Flow
1. `workers/app.ts` creates a Hono app that serves as the Cloudflare Worker
2. D1 database middleware (`D1DbMiddleware`) initializes the Drizzle client and attaches it to context
3. Clerk middleware is applied globally via `@hono/clerk-auth`
4. Hono handles custom API routes (e.g., `/api/health`)
5. All other requests are passed to TanStack Start's `serverEntry.fetch()`
6. TanStack Start handles SSR and routing via the generated `routeTree.gen.ts`

### Routing System
- **File-based routing** in `src/routes/`
- Routes are auto-generated into `src/routeTree.gen.ts` by TanStack Router
- Root layout: `src/routes/__root.tsx` (includes Header, devtools, and HTML shell)
- Router factory: `src/router.tsx` exports `getRouter()` function
- Protected routes use `_authed.tsx` layout with `beforeLoad` auth check

### Authentication & Authorization
- **Clerk**: Handles sign-in/sign-up, session management, JWT tokens
- **D1 Database**: Stores user data and application state
- **RBAC**: Role-based access control with `user`, `admin`, `superadmin` roles
- **Permissions**: Granular permission system defined in `workers/types.ts`

**Auth check pattern in routes:**
```tsx
import { auth } from '@clerk/tanstack-react-start/server'

const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw redirect({ to: '/sign-in' })
  return { userId }
})

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => await checkAuth(),
})
```

### Environment Variables
- Development: Use `.env` file (VITE_ prefix for client-side)
- Production: Configure in `wrangler.jsonc` under `vars` section
- Cloudflare runtime: Access via `env` from `cloudflare:workers` import
- Server functions can access both `env.VARIABLE` (Cloudflare) and `process.env.VARIABLE`

**Required env vars:**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (client-side)
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key (server-side)
- `CLERK_SECRET_KEY` - Clerk secret (server-only)
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer domain

### D1 Database Binding
- D1 database is bound to the Worker via the `DB` binding
- Configure in `wrangler.jsonc` under `d1_databases` section
- Access via `c.env.DB` in Hono routes or `env.DB` in server functions
- Database binding is typed in `workers/worker-configuration.d.ts`

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Enabled via `vite-tsconfig-paths` plugin in vite.config.ts

## Development Commands

```bash
# Install dependencies
bun install

# Development server (runs on port 3000)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Run tests
bun run test

# Deploy to Cloudflare
bun run deploy

# Generate Cloudflare Worker types
bun run cf-typegen

# Code quality checks
bun run check              # Run all checks (types, build, biome)
bun run check:tsc          # TypeScript type checking only
bun run biome:check        # Biome lint + format

# Database management (Drizzle + D1)
bun run db:gen             # Generate Drizzle migrations
bun run db:update          # Generate and apply migrations locally
bun run db:apply           # Apply migrations to local D1 database
bun run db:deploy:prod     # Deploy migrations to production D1
bun run db:deploy:staging  # Deploy migrations to staging D1

# Production logs
bun run tail:prod          # View production Worker logs
bun run tail:staging       # View staging Worker logs
```

## Testing

- Test framework: Vitest with jsdom
- Testing library: @testing-library/react
- Run single test: `vitest run <test-file-pattern>`
- Watch mode: `vitest` (instead of `vitest run`)

## Adding New Routes

1. Create a new file in `src/routes/` (e.g., `src/routes/about.tsx`)
2. TanStack Router automatically regenerates `src/routeTree.gen.ts`
3. Use `createFileRoute` to define the route component and loaders
4. Link to routes using `<Link to="/about">` from `@tanstack/react-router`

## Database Access Patterns

### Accessing D1 Database in Hono Routes

```tsx
// In workers/app.ts
import { demo } from '@/database/schema'

app.get("/api/data", async (c) => {
  const db = c.get("Database")
  const results = await db.select().from(demo)
  return c.json({ data: results })
})
```

### Accessing Database in Server Functions

```tsx
import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { createDbWithSchema } from '@/database/db'
import { demo } from '@/database/schema'

const getDataFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const db = createDbWithSchema(env.DB)
    const results = await db.select().from(demo)
    return { data: results }
  })
```

## Server Functions vs API Routes

**Server Functions** (preferred for data loading):
```tsx
import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

const myServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Access Cloudflare env bindings
    return { data: env.MY_VARIABLE }
  })
```

**Hono API Routes** (for REST APIs):
```tsx
// In workers/app.ts
app.get("/api/endpoint", (c) => {
  return c.json({ data: "value" })
})
```

## Cloudflare-Specific Considerations

- No Node.js APIs available (Workers runtime only)
- Enable `nodejs_compat` in wrangler.jsonc for limited Node.js compatibility
- Use `cloudflare:workers` imports for runtime APIs and environment bindings
- Worker types are in `workers/worker-configuration.d.ts`
- D1 database binding (`DB`) is configured in `wrangler.jsonc` under `d1_databases`

## Important Files

- `workers/app.ts` - Cloudflare Worker entry point with Hono + Clerk + D1 middleware
- `workers/middleware.ts` - D1 database middleware (attaches Drizzle client to context)
- `workers/types.ts` - TypeScript types for Workers (includes RBAC and permissions)
- `workers/worker-configuration.d.ts` - Generated Cloudflare bindings types
- `wrangler.jsonc` - Cloudflare Workers configuration (deployment, D1 bindings, env vars)
- `src/router.tsx` - Router factory function
- `src/routes/__root.tsx` - Root layout with HTML shell
- `src/routes/_authed.tsx` - Protected route layout with auth check
- `src/database/schema.ts` - Drizzle database schema definitions (SQLite/D1)
- `src/database/db.ts` - Drizzle client factory function
- `src/database/index.ts` - Database exports
- `drizzle.config.ts` - Drizzle Kit configuration for migrations
- `migrations/` - Generated SQL migration files
- `vite.config.ts` - Vite plugins: Cloudflare, TanStack Start, React, Tailwind

## Database Schema & Migrations

### Defining Schema

Define database tables in `src/database/schema.ts` using Drizzle ORM:

```tsx
import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name'),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
)
```

### Migration Workflow

1. **Update schema**: Edit `src/database/schema.ts`
2. **Generate migration**: Run `bun run db:gen` to create SQL migration files
3. **Apply locally**: Run `bun run db:update` to apply to local D1 database
4. **Deploy to production**: Run `bun run db:deploy:prod` to apply to production D1

### Querying with Drizzle

```tsx
// Select all users
const allUsers = await db.select().from(users)

// Select with conditions
const user = await db.select().from(users).where(eq(users.id, userId))

// Insert
await db.insert(users).values({ id: '1', email: 'user@example.com', name: 'John' })

// Update
await db.update(users).set({ name: 'Jane' }).where(eq(users.id, userId))

// Delete
await db.delete(users).where(eq(users.id, userId))
```

## Demo Files

Files prefixed with `demo` (in `src/routes/demo/` and `src/data/`) are examples and can be safely deleted.
