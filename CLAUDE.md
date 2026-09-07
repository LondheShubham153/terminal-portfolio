# CLAUDE.md — Complete Portfolio

Guide for working on this repo. Read `tasks.md` for current status before starting work.

## Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- Prisma 6 + SQLite (`prisma/dev.db`) for local dev
- Auth: bcrypt password hash + signed httpOnly session cookie (`jose`), no third-party auth provider
- Blog content: Markdown stored in DB, rendered with `react-markdown`
- Deployment: Vercel. Production DB is Turso (libSQL) — the Prisma Client always runs through `@prisma/adapter-libsql` (`lib/db.ts`), so the only thing that changes between local and prod is `DATABASE_URL`/`TURSO_AUTH_TOKEN`. Resume upload (`app/admin/(protected)/resume/actions.ts`) uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (production), falling back to `public/uploads` locally — Vercel's runtime filesystem is otherwise read-only.

## Commands
- `npm run dev` — start dev server
- `npm run build` / `npm start` — production build/run
- `npx prisma migrate dev --name <change>` — create + apply a migration (never use `prisma db push` once real content exists)
- `npx prisma studio` — browse/edit the DB visually
- `npx prisma generate` — regenerate client after schema changes
- `npm run test` — Vitest unit tests (`lib/**/*.test.ts`)
- `npm run test:e2e` — Playwright e2e suite (`e2e/`). Runs against a disposable `prisma/e2e-test.db`, migrated + seeded fresh by `e2e/setup-test-db.mjs` before the dev server starts (chained in `playwright.config.ts`'s `webServer.command` — do NOT switch this back to Playwright's `globalSetup`, it races the server start and the app boots before migrations exist).

## Conventions
- Server Components by default; mark `"use client"` only where interactivity is required.
- All DB access goes through `lib/db.ts`'s shared Prisma client — never instantiate `PrismaClient` elsewhere.
- Route handlers under `app/api/` validate input with `zod` before touching the DB.
- Admin routes live under `app/admin/`; every route/action there must check the session via `lib/auth.ts` before reading/writing data.
- When a convention or lint rule is introduced, it applies repo-wide unless stated otherwise — state scope explicitly in comments/PR notes rather than leaving it implied (e.g. "apply to every route handler, not just this one").

## Design direction
- No generic AI-aesthetic defaults: no Inter/Roboto/system-font fallback as the primary font, no purple-gradient-on-white/dark clichés, no cookie-cutter hero+3-card layouts.
- Before building any new UI surface, propose 3-4 concrete visual directions (bg hex / accent hex / typeface / one-line rationale) and get a pick before implementing.
- Follow the `frontend-design`, `tailwind-design-system`, and `ui-ux-pro-max` skills for layout, type, and color decisions.

## Task & review workflow
1. Check `tasks.md`, move the task to "In Progress".
2. Implement.
3. Run `/code-review` on the diff. Instruct it for **coverage, not filtering**: report every issue found, including low-severity or uncertain ones, each with a confidence + severity estimate — do not self-filter for importance at this stage.
4. Fix confirmed issues, then move the task to "Done" in `tasks.md` with a one-line note on what the review found/fixed.
5. Never mark a task Done without a `/code-review` pass noted.

## Model/tooling notes (Claude Sonnet 5)
- Prefer `high`/`xhigh` effort for implementation work in this repo — this is a real multi-file coding task, not a lookup.
- Instructions are interpreted literally/narrowly — state the intended scope explicitly rather than relying on the model to generalize a pattern.
- No need for manual "summarize every N tool calls" scaffolding; progress updates are already calibrated.

## Form validation UX
Any `httpUrl`-typed field (`lib/validation.ts`) auto-prepends `https://` to a bare domain like
`github.com/me/repo` instead of rejecting it — the earlier strict-reject behavior caused a real
bug where submitting a URL without a protocol silently failed with no visible error. Every
mutating admin Server Action wraps its work in `runAdminAction` (`lib/admin-actions.ts`), which
catches validation/DB errors and redirects to `?error=1` instead of crashing (Server Actions
called from a plain `<form action>` have no error boundary); the corresponding page must render
`<ErrorBanner show={error === "1"} />` or a failure will look like nothing happened.

## Known constraints
- SQLite file writes do NOT persist on Vercel's serverless runtime — production must run against Turso, not the local `.db` file. Do not treat local `dev.db` behavior as proof it'll work in prod.
- Contact form must include a honeypot field and basic rate limiting — no captcha service for v1.
- A local relative `file:./dev.db` `DATABASE_URL` is resolved by `lib/db-url.ts` against `<cwd>/prisma/`, matching where Prisma CLI puts it — do not "simplify" this back to passing the raw env var straight to `@libsql/client`, which resolves relative paths against cwd directly and would silently point at a different, empty database (see `lib/db-url.test.ts` for the exact regression).

## Deployment (Vercel + Turso)

One-time setup:
1. **Turso database**: `turso db create portfolio-prod` (or via the Turso dashboard), then `turso db show portfolio-prod --url` and `turso db tokens create portfolio-prod` for `DATABASE_URL` (a `libsql://...` URL) and `TURSO_AUTH_TOKEN`.
2. **Apply the schema to Turso**: `DATABASE_URL="libsql://..." npx prisma migrate deploy` from a machine with that env var set — this creates the tables on the fresh Turso DB. Re-run this after every future migration.
3. **Seed the admin account on Turso** (once): `DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." npm run db:seed`.
4. **Vercel project**: `vercel link` (or import the repo in the Vercel dashboard), then set these Environment Variables in the Vercel project settings (Production, and Preview if desired):
   - `DATABASE_URL` — the Turso `libsql://...` URL
   - `TURSO_AUTH_TOKEN`
   - `AUTH_SECRET` — a **different** random value than local dev (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `SITE_URL` — the production domain, e.g. `https://your-domain.vercel.app`
   - `BLOB_READ_WRITE_TOKEN` — from Vercel Blob (Storage tab → create a Blob store, then copy its token). Required for resume upload to work in production; `app/admin/(protected)/resume/actions.ts` already switches to Vercel Blob automatically when this is set.
5. **Deploy**: push to `main` (or `vercel --prod`). CI (`.github/workflows/ci.yml`) gates merges with lint/build/unit/e2e; Vercel's own build runs `next build` again at deploy time.
6. **Smoke test production**: visit the deployed URL, confirm `/sitemap.xml` and `/robots.txt` resolve, log into `/admin/login` with the seeded credentials, and confirm a change made there appears on the live site immediately (no redeploy) — this is the core requirement of the whole project.
