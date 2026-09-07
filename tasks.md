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

## In Progress
- [~] Public layout + Terminal Noir theme setup (fonts, Tailwind theme tokens)

## TODO
- [ ] Seed script (`prisma/seed.ts`) with placeholder content
- [ ] Public layout + navigation + theme
- [ ] Hero + About section
- [ ] Projects list + detail pages
- [ ] Skills section
- [ ] Experience timeline
- [ ] Testimonials section
- [ ] Blog list + post page (Markdown rendering)
- [ ] Contact form (honeypot + rate limit, writes ContactMessage)
- [ ] Resume download (serves active Resume record)
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
