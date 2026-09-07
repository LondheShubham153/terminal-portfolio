# CLAUDE.md — Complete Portfolio

Guide for working on this repo. Read `tasks.md` for current status before starting work.

## Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- Prisma 6 + SQLite (`prisma/dev.db`) for local dev
- Auth: bcrypt password hash + signed httpOnly session cookie (`jose`), no third-party auth provider
- Blog content: Markdown stored in DB, rendered with `react-markdown`
- Deployment: Vercel. Production DB will move to Turso (libSQL) — same Prisma schema, only `DATABASE_URL` changes. Production file uploads (resume, project images) go through Vercel Blob, never the local filesystem.

## Commands
- `npm run dev` — start dev server
- `npm run build` / `npm start` — production build/run
- `npx prisma migrate dev --name <change>` — create + apply a migration (never use `prisma db push` once real content exists)
- `npx prisma studio` — browse/edit the DB visually
- `npx prisma generate` — regenerate client after schema changes
- `npm run test` — Vitest unit tests (lib/utils)
- `npm run test:e2e` — Playwright smoke tests (once added)

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

## Known constraints
- SQLite file writes do NOT persist on Vercel's serverless runtime — production must run against Turso/Postgres, not the local `.db` file. Do not treat local `dev.db` behavior as proof it'll work in prod.
- Contact form must include a honeypot field and basic rate limiting — no captcha service for v1.
