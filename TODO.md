# TanStack Start SaaS Template — TODO

Reference project: `D:\project\webstorm\soar-next-cc` (Next.js SaaS starter)

## Background

This project aims to build a production-ready SaaS starter template powered by **TanStack Start** (full-stack SSR React framework), mirroring the feature set of an existing **Next.js SaaS starter** (`soar-next-cc`). The Next.js version is a complete template with authentication, payments, dashboards, AI features, blog/docs, i18n, and marketing pages. This TanStack project starts from a base scaffold (TanStack Start + Better Auth + Tailwind CSS v4 + shadcn/ui) and needs to be built out to feature parity.

**Core principle:** Since both frameworks use React, most UI components, hooks, and client-side libraries can be directly reused. The main migration work is in framework-specific areas — routing (file-based layouts, route groups, middleware), server-side APIs (Next.js route handlers → TanStack server handlers), data loading patterns, and meta/head management. Some Next.js-specific packages (e.g. `next-intl`, `next-themes`) need TanStack-compatible alternatives.

### Tech Stack

| Layer | Next.js Project | TanStack Project |
|-------|----------------|-----------------|
| Framework | Next.js (App Router) | TanStack Start + Nitro |
| Routing | Next.js file-based (`app/`) | TanStack Router file-based (`src/routes/`) |
| Auth | Better Auth + drizzle adapter | Better Auth + drizzle adapter (same) |
| Database | Drizzle ORM + PostgreSQL | Drizzle ORM + PostgreSQL (same) |
| Payment | Creem SDK | Creem SDK (same) |
| Email | Resend + React Email | Resend + React Email (same) |
| AI | Vercel AI SDK + Replicate | Vercel AI SDK + Replicate (same) |
| i18n | next-intl (URL segment) | TBD — needs research |
| Blog/Docs | fumadocs (Next.js adapter) | fumadocs (TanStack adapter) |
| UI | shadcn/ui + Tailwind CSS v4 | shadcn/ui + Tailwind CSS v4 (same) |
| Animations | motion (framer-motion) | motion (same) |
| Forms | react-hook-form + zod | react-hook-form + zod (same) |
| Theme | next-themes | Custom context provider |
| Middleware | Next.js middleware | beforeLoad / Nitro middleware |

---

## Step 1. Project Foundation & Config

- [x] Add shared types (`MenuItem`, `NestedMenuItem`, `WebsiteConfig`, `MailConfig`, `SocialConfig`, etc.) → `src/types/index.ts`
- [x] Create centralized config files:
  - [x] `src/config/website-config.ts` — site metadata, mail, social links
  - [x] `src/config/route-config.ts` — routes enum
  - [x] `src/config/social-config.ts` — social media links
  - [x] `src/config/footer-config.ts` — footer link groups
  - [x] `src/config/price-config.ts` — pricing plans (free/pro/lifetime)
  - [x] `src/config/user-sidebar-config.ts` — dashboard sidebar nav
- [x] Set up environment variables (`.env.local` / `.env.example`):
  - `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `RESEND_API_KEY`
  - `CREEM_API_KEY`, `CREEM_SERVER_IDX`
  - Creem product IDs for pricing plans
  - `IS_DEMO` flag

## Step 2. Database

- [ ] Install `drizzle-orm` and `pg` (PostgreSQL driver)
- [ ] Install `drizzle-kit` as devDependency
- [ ] Create DB connection — `src/lib/db/index.ts` (drizzle + pg Pool)
- [ ] Create auth schema — `src/lib/db/schema/auth.ts` (Better Auth tables)
- [ ] Create payment schema — `src/lib/db/schema/payment.ts` (subscription, payment tables with enums: provider, plan_interval, subscription_status, order_status)
- [ ] Add `drizzle.config.ts` for migrations
- [ ] Add `db:migrate` and `db:push` scripts to `package.json`

## Step 3. Authentication (Better Auth — enhanced)

- [ ] Upgrade `src/lib/auth.ts` to full config:
  - [ ] Add drizzle adapter with pg provider
  - [ ] Enable email verification with Resend emails
  - [ ] Add reset password flow with email
  - [ ] Add social providers (GitHub, Google)
  - [ ] Add account linking
  - [ ] Add admin plugin
- [ ] Upgrade `src/lib/auth-client.ts` — add `adminClient` plugin, export `signIn`, `signUp`, `signOut`, `useSession`
- [ ] Auth API route already exists at `src/routes/api/auth/$.ts` — verify it works with enhanced config

### Auth Pages (under `src/routes/auth/`)

- [ ] Create auth layout route (`src/routes/auth.tsx` or `src/routes/_auth.tsx`) — centered layout with back button
- [ ] `src/routes/auth/login.tsx` — login form (email/password + OAuth buttons)
- [ ] `src/routes/auth/register.tsx` — register form
- [ ] `src/routes/auth/register-success.tsx` — registration success page
- [ ] `src/routes/auth/forgot-password.tsx` — forgot password form
- [ ] `src/routes/auth/reset-password.tsx` — reset password form
- [ ] `src/routes/auth/confirm.tsx` — email confirmation page

### Auth Components

- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/RegisterForm.tsx`
- [ ] `src/components/auth/ForgotPasswordForm.tsx`
- [ ] `src/components/auth/ResetPasswordForm.tsx`
- [ ] `src/components/auth/OAuthButtons.tsx` (GitHub, Google)
- [ ] `src/components/auth/LoginFormDialog.tsx` (modal login)

### Auth Middleware / Route Protection

- [ ] **[NEEDS RESEARCH]** Implement route protection for `/dashboard`, `/admin`, `/setting`, `/account` paths
  - In Next.js this uses `middleware.ts`; TanStack Start uses `beforeLoad` on route definitions or a server middleware approach
  - Option A: use `beforeLoad` in each protected route layout to check session cookie
  - Option B: use Nitro server middleware for cookie-based redirect
  - Decide and implement

## Step 4. Email System

- [ ] Install `resend` and `@react-email/components`
- [ ] Create email service — `src/lib/email/index.ts` (Resend integration)
- [ ] Create email templates:
  - [ ] `src/lib/email/templates/email-layout.tsx` — base layout
  - [ ] `src/lib/email/templates/email-button.tsx` — CTA button component
  - [ ] `src/lib/email/templates/verify-email.tsx`
  - [ ] `src/lib/email/templates/forgot-password.tsx`
  - [ ] `src/lib/email/templates/contact-message.tsx`
  - [ ] `src/lib/email/templates/subscribe-newsletter.tsx`

## Step 5. Payment System (Creem)

- [ ] Install `creem` SDK
- [ ] Create payment lib — `src/lib/payment/creem.ts` (checkout creation, webhook handling)
- [ ] Create order number generator — `src/lib/payment/order-no.ts`
- [ ] API routes (using TanStack Start server route handlers):
  - [ ] `src/routes/api/payment/create.ts` — create checkout
  - [ ] `src/routes/api/payment/notify/creem.ts` — webhook handler
  - [ ] `src/routes/api/payment/query.ts` — query payment status
- [ ] User API routes:
  - [ ] `src/routes/api/user/billing.ts`
  - [ ] `src/routes/api/user/subscription.ts`
  - [ ] `src/routes/api/user/profile.ts`
  - [ ] `src/routes/api/user/settings.ts`
- [ ] Admin API routes:
  - [ ] `src/routes/api/admin/users.ts`

## Step 6. Internationalization (i18n)

- [ ] **[NEEDS RESEARCH]** Choose i18n solution for TanStack Start
  - Next.js project uses `next-intl` with `[locale]` segment routing + JSON message files
  - Options for TanStack Start:
    - `react-i18next` / `i18next` — most popular React i18n (no built-in routing)
    - `@tanstack/react-router` locale param route — manual `$locale` segment
    - `typesafe-i18n` — type-safe alternative
  - Need to decide: locale in URL path vs cookie/header based
- [ ] Create message files (`messages/en.json`, `messages/zh.json`) — can reuse from Next.js project
- [ ] Set up i18n provider and hook
- [ ] Implement locale routing (if URL-based)
- [ ] Create `LanguageToggle` component

## Step 7. Layout System

### Marketing Layout

- [ ] Create marketing layout route (equivalent to Next.js `(marketing)/layout.tsx`)
  - TanStack Router: use a pathless layout route like `src/routes/_marketing.tsx`
  - Includes `AppHeader` + main + `AppFooter`
- [ ] `src/components/layout/app/AppHeader.tsx` — site header with nav, auth status, mobile menu
- [ ] `src/components/layout/app/AppNavMenu.tsx` — desktop navigation menu
- [ ] `src/components/layout/app/AppMobileMenu.tsx` — mobile hamburger menu
- [ ] `src/components/layout/app/AppFooter.tsx` — site footer with link groups
- [ ] `src/components/layout/app/UserPopover.tsx` — logged-in user dropdown

### Dashboard Layout

- [ ] Create dashboard layout route (`src/routes/_dashboard.tsx`) — sidebar + header with breadcrumb
- [ ] Install shadcn/ui components needed: `sidebar`, `breadcrumb`, `separator`, `sheet`
- [ ] `src/components/layout/user/DashboardSidebar.tsx` — collapsible sidebar with nav groups
- [ ] `src/components/layout/user/DashboardBreadcrumb.tsx` — auto breadcrumb from route
- [ ] `src/components/layout/user/DashboardSideHeader.tsx` — sidebar header (logo/brand)
- [ ] `src/components/layout/user/DashboardSideUser.tsx` — user avatar + info in sidebar
- [ ] `src/components/layout/user/DashboardSideContent.tsx` — sidebar nav content

## Step 8. Marketing Pages (under marketing layout)

### Home Page

- [ ] `src/routes/_marketing/index.tsx` — home page composing sections:
  - [ ] `src/components/home/HeroSection.tsx`
  - [ ] `src/components/home/FeatureSection.tsx`
  - [ ] `src/components/home/StaticSection.tsx` (stats/numbers)
  - [ ] `src/components/home/IntegrateSection.tsx`
  - [ ] `src/components/home/ContentSection.tsx`
  - [ ] `src/components/home/LogoCloud.tsx`
  - [ ] `src/components/home/PriceSection.tsx`
  - [ ] `src/components/home/PricingCard.tsx`
  - [ ] `src/components/home/Testimonials.tsx`
  - [ ] `src/components/home/FaqSection.tsx`
  - [ ] `src/components/home/CallToAction.tsx`

### Other Marketing Pages

- [ ] `src/routes/_marketing/about.tsx` — about page
- [ ] `src/routes/_marketing/contact.tsx` — contact page with form
- [ ] `src/routes/_marketing/pay-success.tsx` — payment success page
- [ ] `src/routes/_marketing/legal/$slug.tsx` — legal pages (cookie/privacy/terms from MDX)

### Contact

- [ ] `src/components/contact/ContactFormCard.tsx` — contact form with validation
- [ ] `src/routes/api/contact.ts` — contact form submission API (sends email via Resend)

## Step 9. Blog System

- [ ] **[NEEDS RESEARCH]** Set up fumadocs with TanStack Start
  - fumadocs has a TanStack Start adapter — need to verify setup steps
  - Reference: fumadocs docs for TanStack integration
- [ ] Create blog content directory (`content/blog/`) — can copy MDX files from Next.js project
- [ ] Create blog source/loader — `src/lib/blog.ts` (post listing, pagination, tags, slug lookup)
- [ ] Blog routes:
  - [ ] `src/routes/_marketing/blog/index.tsx` — blog listing with tag filter + pagination
  - [ ] `src/routes/_marketing/blog/$slug.tsx` — individual blog post
- [ ] Blog components:
  - [ ] `src/components/blog/BlogCard.tsx`
  - [ ] `src/components/blog/BlogFilter.tsx` (tag filter)
  - [ ] `src/components/blog/BlogPagination.tsx`
  - [ ] `src/components/blog/BlogToc.tsx` (table of contents)

## Step 10. Documentation System

- [ ] **[NEEDS RESEARCH]** Set up fumadocs docs with TanStack Start
  - Need fumadocs TanStack adapter for docs (similar to blog)
  - Requires fumadocs-mdx collections setup
- [ ] Create docs content directory (`content/docs/`) — can copy from Next.js project
- [ ] Create docs source/loader — `src/lib/source.ts` (fumadocs loader with i18n)
- [ ] Docs config:
  - [ ] `src/config/docs-common-config.ts`
  - [ ] `src/config/docs-sidebar-config.ts`
- [ ] Docs routes:
  - [ ] Docs layout route with sidebar navigation
  - [ ] `src/routes/_docs/docs/$slug.tsx` — doc page (catch-all slug)

## Step 11. Dashboard Pages (under dashboard layout)

- [ ] `src/routes/_dashboard/dashboard/index.tsx` — dashboard home (charts, stats cards)
- [ ] Dashboard components:
  - [ ] `src/components/dashboard/SectionCards.tsx` — stat cards
  - [ ] `src/components/dashboard/ChartAreaInteractive.tsx` — interactive area chart (recharts)
  - [ ] `src/components/dashboard/DataTable.tsx` — data table component
  - [ ] Install `recharts` and `@tanstack/react-table`

### Account Pages

- [ ] `src/routes/_dashboard/account/order.tsx` — order history
- [ ] `src/routes/_dashboard/account/subscription.tsx` — subscription management

### Settings Pages

- [ ] `src/routes/_dashboard/setting/profile.tsx` — profile edit (name, avatar, etc.)
- [ ] `src/routes/_dashboard/setting/security.tsx` — change password, manage sessions
- [ ] `src/routes/_dashboard/setting/billing.tsx` — billing info, invoices

### Admin Pages

- [ ] `src/routes/_dashboard/admin/users.tsx` — user management table (admin only)

## Step 12. AI Features

- [ ] Install `ai` (Vercel AI SDK) and `@ai-sdk/openai`
- [ ] Create AI lib modules:
  - [ ] `src/lib/ai/index.ts` — shared AI config
  - [ ] `src/lib/ai/image/` — image generation (Replicate provider)
  - [ ] `src/lib/ai/audio/` — audio generation (Replicate provider)
  - [ ] `src/lib/ai/video/` — video generation (Replicate provider)
- [ ] Install `replicate` SDK
- [ ] AI API routes:
  - [ ] `src/routes/api/chat.ts` — chat completion (streaming)
  - [ ] `src/routes/api/ai/image.ts` + `src/routes/api/ai/image/query.ts`
  - [ ] `src/routes/api/ai/audio.ts` + `src/routes/api/ai/audio/query.ts`
  - [ ] `src/routes/api/ai/video.ts` + `src/routes/api/ai/video/query.ts`
- [ ] AI pages (under marketing layout):
  - [ ] `src/routes/_marketing/ai/chat.tsx`
  - [ ] `src/routes/_marketing/ai/image.tsx`
  - [ ] `src/routes/_marketing/ai/audio.tsx`
  - [ ] `src/routes/_marketing/ai/video.tsx`
- [ ] AI components:
  - [ ] `src/components/ai/ChatBot.tsx`
  - [ ] `src/components/ai/ImageGenerator.tsx`
  - [ ] `src/components/ai/AudioGenerator.tsx`
  - [ ] `src/components/ai/VideoGenerator.tsx`
  - [ ] `src/components/ai-elements/` — shared UI (message, prompt-input, conversation, attachments, reasoning, shimmer, sources)
- [ ] Install chat UI dependencies: `@ai-sdk/react`, `react-markdown`, `remark-gfm`, `streamdown` + plugins, `use-stick-to-bottom`

## Step 13. Storage

- [ ] `src/routes/api/storage/upload-image.ts` — image upload API route
- [ ] **[NEEDS RESEARCH]** Decide storage provider (S3, Cloudflare R2, etc.) — check what Next.js project uses

## Step 14. UI Components & Libraries

### shadcn/ui Components to Install

Already configured via `components.json`. Install as needed:

- [ ] `button`, `card`, `input`, `label`, `form`, `textarea`
- [ ] `dialog`, `sheet`, `popover`, `dropdown-menu`, `command`
- [ ] `avatar`, `badge`, `separator`, `skeleton`, `spinner`
- [ ] `tabs`, `accordion`, `collapsible`
- [ ] `table`, `pagination`, `scroll-area`, `select`, `checkbox`, `switch`
- [ ] `sidebar`, `breadcrumb`, `navigation-menu`
- [ ] `tooltip`, `hover-card`, `alert`, `progress`
- [ ] `sonner` (toast notifications)
- [ ] `chart` (recharts wrapper)
- [ ] `button-group`, `input-group`

### Motion / Animation Components

- [ ] Install `motion` (framer-motion)
- [ ] `src/components/motion/AnimatedGroup.tsx`
- [ ] `src/components/motion/AnimatedList.tsx`
- [ ] `src/components/motion/AuroraBackground.tsx`
- [ ] `src/components/motion/backgrounds/interactive-grid-pattern.tsx`
- [ ] `src/components/motion/special-effects/border-beam.tsx`
- [ ] `src/components/motion/text/aurora-text.tsx`

### Common Components

- [ ] `src/components/Logo.tsx`
- [ ] `src/components/common/ThemeToggle.tsx` — already exists, may need update
- [ ] `src/components/common/LanguageToggle.tsx`
- [ ] `src/components/theme-provider.tsx` — **[NEEDS RESEARCH]** TanStack Start equivalent of `next-themes`; current project uses inline script approach — may use a context-based provider instead

## Step 15. Form Handling

- [ ] Install `react-hook-form`, `@hookform/resolvers`, `zod`
- [ ] shadcn `form` component uses react-hook-form — install it for all forms (auth, contact, settings)

## Step 16. Legal Content

- [ ] Create `content/legal/` directory with MDX files:
  - [ ] `cookie-policy.mdx`
  - [ ] `privacy-policy.mdx`
  - [ ] `terms-of-service.mdx`
- [ ] Set up fumadocs collection for legal content
- [ ] Dynamic legal page route: `src/routes/_marketing/legal/$slug.tsx`

## Step 17. SEO & Metadata

- [ ] **[NEEDS RESEARCH]** TanStack Start head/meta management
  - Currently uses `head()` in route definitions — extend for per-page SEO
  - Open Graph, Twitter cards, canonical URLs
  - Sitemap generation (Next.js uses `next-sitemap` or app router metadata)

## Step 18. Hooks

- [ ] `src/hooks/use-mobile.ts` — mobile viewport detection hook (can reuse from Next.js)

## Step 19. Cleanup & Polish

- [ ] Remove demo files (`about.tsx`, `demo/better-auth.tsx`, demo content in `index.tsx`)
- [ ] Update `__root.tsx` — replace demo Header/Footer with new AppHeader/AppFooter via layout routes
- [ ] Update `CLAUDE.md` with new architecture
- [ ] Verify all Biome lint/format passes
- [ ] Test full build (`pnpm build`)

---

## Summary of Items Needing Research

| Topic | Question |
|-------|----------|
| Route protection | `beforeLoad` vs Nitro middleware for auth guards |
| i18n | Which i18n library to use and URL routing strategy |
| fumadocs + TanStack | Verify fumadocs TanStack Start adapter setup for blog + docs |
| Theme provider | Context-based theme vs current inline script approach |
| SEO / sitemap | TanStack Start head management + sitemap generation |
| Storage provider | Which cloud storage to use for file uploads |
| Streaming / SSE | Verify Vercel AI SDK streaming works with TanStack Start / Nitro |

---

## Recommended Implementation Order

1. **Foundation** — types, configs, env vars (Step 1)
2. **Database** — drizzle + schemas (Step 2)
3. **Auth (enhanced)** — full Better Auth + pages (Step 3)
4. **Email** — Resend integration (Step 4)
5. **UI components** — install shadcn components + motion (Step 14)
6. **Layouts** — marketing + dashboard layouts (Step 7)
7. **Marketing pages** — home, about, contact (Step 8)
8. **Forms** — react-hook-form + zod (Step 15)
9. **Payment** — Creem integration (Step 5)
10. **Dashboard pages** — dashboard, settings, admin (Step 11)
11. **Blog** — fumadocs blog (Step 9)
12. **Docs** — fumadocs docs (Step 10)
13. **Legal** — MDX legal pages (Step 16)
14. **i18n** — internationalization (Step 6)
15. **AI features** — chat, image, audio, video (Step 12)
16. **Storage** — file upload (Step 13)
17. **SEO** — metadata, sitemap (Step 17)
18. **Cleanup** — remove demos, final polish (Step 19)
