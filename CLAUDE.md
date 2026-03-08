# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TanStack Start (full-stack SSR React framework) starter app with Better Auth authentication, Tailwind CSS v4, and shadcn/ui components. Uses Nitro as the server engine and Vite for bundling.

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — production build
- `pnpm test` — run tests (vitest)
- `pnpm check` — lint + format via Biome
- `pnpm lint` — lint only
- `pnpm format` — format only
- `pnpm dlx shadcn@latest add <component>` — add shadcn/ui components

## Architecture

**Routing:** File-based routing via TanStack Router. Route files live in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` (do not edit). Router config is in `src/router.tsx`.

**Root layout:** `src/routes/__root.tsx` — renders `<Header>`, page content, `<Footer>`, and TanStack devtools. Includes a theme init script for light/dark mode from localStorage.

**Auth:** Better Auth with email/password enabled. Server-side config in `src/lib/auth.ts`, client-side in `src/lib/auth-client.ts`. Auth API routes handled by the catch-all at `src/routes/api/auth/$.ts`. Env vars in `.env.local` (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`).

**Server functions:** Use `createServerFn` from `@tanstack/react-start` for server-side logic callable from components.

**API routes:** Defined via `server.handlers` in route files (see `src/routes/api/auth/$.ts` for pattern).

## Code Style

- **Formatter/Linter:** Biome with tabs, double quotes, recommended rules
- **Path aliases:** `#/*` and `@/*` both map to `./src/*`
- **shadcn/ui:** New York style, no RSC, Zinc base color, CSS variables, components at `#/components/ui`, utils at `#/lib/utils`
- **CSS:** Tailwind CSS v4 via Vite plugin; styles in `src/styles.css`
- **TypeScript:** Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`

## Key Files

- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/components/` — shared layout components (Header, Footer, ThemeToggle)
- `src/integrations/better-auth/` — auth UI components
- `biome.json` — linter/formatter config (excludes `routeTree.gen.ts` and `styles.css`)
- `components.json` — shadcn/ui config

## Notes

- Files prefixed with `demo` are examples and can be safely deleted
- Package manager is pnpm
