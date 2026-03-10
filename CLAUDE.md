# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Production-ready SaaS starter template powered by **TanStack Start** (full-stack SSR React framework) with Better Auth authentication, Drizzle ORM + PostgreSQL, Creem payments, i18n (i18next), fumadocs blog/docs, AI features (Vercel AI SDK + Replicate), Tailwind CSS v4, and shadcn/ui components. Uses Nitro as the server engine and Vite for bundling.

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — production build
- `pnpm test` — run tests (vitest)
- `pnpm check` — lint + format via Biome
- `pnpm lint` — lint only
- `pnpm format` — format only
- `pnpm dlx shadcn@latest add <component>` — add shadcn/ui components
- `pnpm db:push` — push schema to database
- `pnpm db:migrate` — run database migrations

## Architecture

**Routing:** File-based routing via TanStack Router with i18n locale prefix (`{-$locale}`). Route files live in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` (do not edit). Router config is in `src/router.tsx`.

**Layout system:** Uses pathless layout routes for different sections:
- `src/routes/{-$locale}/_marketing.tsx` — marketing layout with `AppHeader` + `AppFooter`
- `src/routes/{-$locale}/_dashboard.tsx` — dashboard layout with sidebar, auth-protected via `beforeLoad`
- `src/routes/{-$locale}/_docs/` — documentation layout with fumadocs sidebar
- `src/routes/auth.tsx` — auth pages layout (centered, minimal)

**Root layout:** `src/routes/__root.tsx` — provides HTML shell, ThemeProvider, fumadocs RootProvider, Toaster, and TanStack devtools. Does NOT render header/footer directly (handled by layout routes).

**Auth:** Better Auth with email/password, social OAuth (GitHub, Google), admin plugin, email verification, and password reset. Server config in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`. Auth API at `src/routes/api/auth/$.ts`. Route protection via `src/lib/auth-guard.ts` (client-side cookie check in `beforeLoad`).

**Database:** Drizzle ORM with PostgreSQL. Connection in `src/lib/db/index.ts`. Schemas in `src/lib/db/schema/` (auth tables, payment tables).

**Payments:** Creem SDK integration. Checkout, webhooks, and billing at `src/routes/api/payment/`.

**Email:** Resend with React Email templates in `src/lib/email/templates/`.

**i18n:** i18next + react-i18next with cookie/localStorage-based locale detection (no URL segment routing). Messages in `messages/en.json` and `messages/zh.json`. Initialized via side-effect import in root route.

**Blog/Docs:** fumadocs with MDX content in `content/blog/` and `content/docs/`. Source loaders in `src/lib/blog.ts` and `src/lib/source.ts`.

**AI:** Vercel AI SDK with OpenAI provider for chat, Replicate for image/audio/video generation. APIs at `src/routes/api/chat.ts` and `src/routes/api/ai/`.

**Server functions:** Use `createServerFn` from `@tanstack/react-start` for server-side logic callable from components.

**API routes:** Defined via `server.handlers` in route files (see `src/routes/api/auth/$.ts` for pattern).

## Code Style

- **Formatter/Linter:** Biome with tabs, double quotes, recommended rules
- **Path aliases:** `#/*` and `@/*` both map to `./src/*`
- **shadcn/ui:** New York style, no RSC, Zinc base color, CSS variables, components at `#/components/ui`, utils at `#/lib/utils`
- **CSS:** Tailwind CSS v4 via Vite plugin; styles in `src/styles.css`
- **TypeScript:** Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`

## Key Files & Directories

- `src/config/` — centralized config (website, routes, pricing, footer, sidebar, docs)
- `src/components/layout/app/` — marketing layout (AppHeader, AppFooter, AppNavMenu, AppMobileMenu)
- `src/components/layout/user/` — dashboard layout (DashboardSidebar, DashboardBreadcrumb)
- `src/components/home/` — home page sections (Hero, Features, Pricing, FAQ, etc.)
- `src/components/auth/` — auth forms (Login, Register, ForgotPassword, ResetPassword, OAuth)
- `src/components/ai/` — AI feature components (ChatBot, ImageGenerator, AudioGenerator, VideoGenerator)
- `src/components/blog/` — blog components (BlogCard, BlogFilter, BlogPagination)
- `src/components/contact/` — contact form
- `src/components/motion/` — animation components (AnimatedGroup, AuroraBackground, etc.)
- `src/components/common/` — shared components (ThemeToggle, LanguageToggle)
- `src/components/ui/` — shadcn/ui components
- `src/lib/` — core libraries (auth, db, email, payment, AI, blog, SEO)
- `src/hooks/` — React hooks
- `src/types/` — shared TypeScript types
- `content/` — MDX content (blog, docs, legal)
- `biome.json` — linter/formatter config
- `components.json` — shadcn/ui config
- `source.config.ts` — fumadocs MDX collection config

## Notes

- Package manager is pnpm
- Theme management uses `next-themes` with an inline hydration script in `__root.tsx`
- Legal pages (cookie, privacy, terms) served from MDX via fumadocs at `/legal/$slug`
- SEO metadata built via `src/lib/seo.ts` with `buildSeoMeta()` helper used in route `head()` functions
- Sitemap generated at `src/routes/sitemap[.]xml.ts`
