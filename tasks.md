# Tasks

Status legend: `[x]` Done · `[~]` In Progress · `[ ]` TODO. Every Done task must note its `/code-review` result.

## Done
- [x] Project setup — Next.js (TS, App Router, Tailwind) scaffolded, git initialized.
- [x] Prisma + SQLite installed (pinned to stable Prisma 6, avoided unstable v8 RC), schema drafted (Project, BlogPost, Skill, Experience, Testimonial, Resume, ContactMessage, AdminUser), initial migration applied.
- [x] `CLAUDE.md` written with stack, conventions, task/review workflow, Sonnet 5 tuning notes, known constraints.
- [x] `tasks.md` created.

## Done (cont.)
- [x] Auth lib (`lib/auth.ts`): bcrypt hashing + jose-signed session cookie + login rate limiting; seed script + .env/.env.example. `/code-review` (medium) found 6 issues — fixed: `.env.example` gitignore exclusion, seed.ts reusing `lib/db.ts` singleton, rate-limiter eviction, admin email case-normalization. Left as-is (low severity, noted): `getSession` blanket catch, `db:seed`/`prisma.seed` duplication.
- [x] Design direction: proposed 4 concrete style options (Terminal Noir, Editorial Warm, Blueprint Structural, Deep Ink Motion) — user picked **Terminal Noir** (bg #0B0D0E, accent #7FFFA1/#E8A33D, JetBrains Mono headings + Charter body).

## Done (cont. 2)
- [x] Terminal Noir theme, layout, NavBar, Hero, Footer.
- [x] Public sections: Projects, Skills, Experience, Testimonials — all reading live from SQLite via `lib/content.ts`, `page.tsx` set to `force-dynamic` so admin edits show without redeploy.
- [x] Contact form (honeypot + rate limit) + `/api/contact` route, `lib/rate-limit.ts` shared limiter.
- [x] Blog list (`/blog`) + post page (`/blog/[slug]`, Markdown via `react-markdown`).
- [x] Resume download route (`/resume`, redirects to active Resume record; 404 if none uploaded).
- `/code-review` (medium) on this chunk found 5 issues — fixed: rate-limit bucket cross-contamination (login/contact evicting each other early), restored `resetLoginRateLimit` (was dropped, would've caused false lockouts after successful logins), honeypot dead-code (zod was rejecting filled honeypot before the silent-success branch could run — now schema allows it through so the deception actually works), renamed Next.js font CSS vars to avoid self-referential `@theme inline` names. Left as noted-only: unused `getProjectBySlug`/`getPostBySlug` helpers (will be used by admin detail views next).
- Verified: `npm run build` clean, dev server smoke-tested (`/` 200 with seeded skills rendering, `/blog` 200, `/resume` 404 as expected with no upload yet).

## In Progress
- [~] Admin: login page + session cookie flow

## TODO
- [ ] Admin: login page + session middleware
- [ ] Admin: Projects CRUD
- [ ] Admin: Blog CRUD
- [ ] Admin: Skills/Experience/Testimonials CRUD
- [ ] Admin: Resume upload (local disk dev / Vercel Blob prod)
- [ ] SEO: per-page metadata, sitemap.xml, robots.txt, OG images
- [ ] Accessibility + performance + Core Web Vitals pass
- [ ] Vitest unit tests for lib/
- [ ] Playwright e2e smoke tests
- [ ] GitHub Actions CI (lint + build + test)
- [ ] `.env.example` + secrets documentation
- [ ] Production DB decision + migration to Turso/Postgres
- [ ] Vercel deployment + final smoke test
