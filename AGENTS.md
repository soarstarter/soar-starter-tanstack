# Repository Guidelines

## Project Structure & Module Organization
This repository is a TanStack Start app using Vite, React 19, Tailwind CSS v4, and Better Auth. Application code lives in `src/`. Use `src/routes/` for file-based routes, `src/components/` for shared UI, `src/lib/` for utilities and auth clients, and `src/integrations/` for feature-specific integration code. Static assets belong in `public/`. Do not edit `src/routeTree.gen.ts`; TanStack Router regenerates it.

## Build, Test, and Development Commands
Use `pnpm` throughout.

- `pnpm dev` starts the local dev server on port `3000`.
- `pnpm build` creates the production build.
- `pnpm preview` serves the built app locally.
- `pnpm test` runs Vitest once.
- `pnpm lint` runs Biome lint rules.
- `pnpm format` applies Biome formatting.
- `pnpm check` runs Biome’s combined checks.

## Coding Style & Naming Conventions
Biome is the source of truth for formatting: tabs for indentation, double quotes in JS/TS, and import organization enabled. Prefer TypeScript and keep code inside `src/`. Use PascalCase for React components (`Header.tsx`), camelCase for helpers (`authClient`), and route filenames that match URL structure (`src/routes/about.tsx`, `src/routes/api/auth/$.ts`). Keep shared Tailwind helpers in `src/lib/utils.ts`, and avoid manual edits to generated files.

## Testing Guidelines
Vitest with Testing Library is installed. Add tests next to the code they cover as `*.test.ts` or `*.test.tsx`. Favor route, auth, and component behavior tests over snapshot-heavy coverage. Run `pnpm test` before opening a PR. There is no enforced coverage gate yet, so add focused tests for new logic and regressions.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `add TODO.md with full SaaS feature migration plan from Next.js` and `rename TODO sections from numbered to Step N format`. Follow that style: lower-case verb first, concise scope, no trailing period. PRs should describe the change, note config or auth impacts, link related issues, and include screenshots for UI work.

## Security & Configuration Tips
Secrets live in `.env.local`; do not commit `BETTER_AUTH_SECRET` or local URLs. When changing auth, verify both `src/lib/auth.ts` and `src/lib/auth-client.ts`, and keep the API handler in `src/routes/api/auth/$.ts` aligned.
