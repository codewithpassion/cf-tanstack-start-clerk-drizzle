# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TanStack Start application configured to deploy on Cloudflare Workers. It combines TanStack Router for file-based routing with Hono for API endpoints and server-side rendering, all running on Cloudflare's edge runtime.

## Key Architecture

### Deployment Architecture
- **Runtime**: Cloudflare Workers (not Node.js)
- **SSR Framework**: TanStack Start with React 19
- **Server Framework**: Hono wraps the TanStack Start server entry point
- **Entry Point**: `workers/app.ts` exports the Cloudflare Worker handler

### Server Entry Flow
1. `workers/app.ts` creates a Hono app that serves as the Cloudflare Worker
2. Hono handles custom API routes (e.g., `/api/health`)
3. All other requests are passed to TanStack Start's `serverEntry.fetch()`
4. TanStack Start handles SSR and routing via the generated `routeTree.gen.ts`

### Routing System
- **File-based routing** in `src/routes/`
- Routes are auto-generated into `src/routeTree.gen.ts` by TanStack Router
- Root layout: `src/routes/__root.tsx` (includes Header, devtools, and HTML shell)
- Router factory: `src/router.tsx` exports `getRouter()` function

### Environment Variables
- Development: Use `.env` file (VITE_ prefix for client-side)
- Production: Configure in `wrangler.jsonc` under `vars` section
- Cloudflare runtime: Access via `env` from `cloudflare:workers` import
- Server functions can access both `env.VARIABLE` (Cloudflare) and `process.env.VARIABLE`

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Enabled via `vite-tsconfig-paths` plugin in vite.config.ts

## Development Commands

```bash
# Install dependencies
bun install

# Development server (runs on port 3000)
bun run dev
# or
vite dev --port 3000

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

## Important Files

- `workers/app.ts` - Cloudflare Worker entry point with Hono integration
- `wrangler.jsonc` - Cloudflare Workers configuration (deployment, bindings, env vars)
- `src/router.tsx` - Router factory function
- `src/routes/__root.tsx` - Root layout with HTML shell
- `vite.config.ts` - Vite plugins: Cloudflare, TanStack Start, React, Tailwind

## Demo Files

Files prefixed with `demo` (in `src/routes/demo/` and `src/data/`) are examples and can be safely deleted.
