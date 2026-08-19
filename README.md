# PK Singh Tutoring Platform

Online coaching platform for JEE, NEET, SAT, CAT and GMAT preparation —
structured courses, mentorship and live classes by PK Singh.

- **Live site:** https://pksingh-iitiim.vercel.app/
- **Frontend:** Next.js app in [`tutoring-platform/`](tutoring-platform/)
- **Backend API:** Express + Prisma + PostgreSQL (Supabase) at the repo root

## Repo layout

```
tutoring-platform/   Next.js frontend (deployed on Vercel)
src/                 Express backend API (routes, middleware, modules)
prisma/              Database schema and migrations
tests/               Jest unit/integration tests + Playwright e2e
scripts/             Maintenance and data scripts
```

## Quick start (contributors)

Prerequisites: Node.js 20+, PostgreSQL (local or remote).

### 1. Backend

```bash
npm install
cp .env.example .env        # then fill in your own values
npm run db:push             # sync DB schema (prisma db push)
npm run dev                 # API on http://localhost:4000
```

> **Never paste real secrets (SUPABASE_SERVICE_ROLE_KEY, JWT secrets, etc.) into
> a `.env` file that gets committed or shared.** Use your hosting platform's
> secret manager instead (Render → Environment, Vercel → Settings → Environment
> Variables). The `.env` file is for local development only and is gitignored.
>
> In production the server refuses to start if required secrets (`SUPABASE_URL`,
> `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`) or `ADMIN_PASSWORD` are
> missing or still set to example values. See `.env.example` for the full list.

### 2. Frontend

```bash
cd tutoring-platform
cp .env.local.example .env.local   # if present
npm install
npm run dev                # UI on http://localhost:3000
```

Frontend deploy instructions (Vercel project settings) live in
[`tutoring-platform/AGENTS.md`](tutoring-platform/AGENTS.md).

## Environment variables

See `.env.example` for names and comments. Never commit real values.

## Tests

```bash
npm test                 # backend unit/integration tests (Jest)
npm run test:e2e         # Playwright e2e (needs E2E_ADMIN_PASSWORD)
```

E2E tests require a real admin credential via `E2E_ADMIN_PASSWORD` — they
refuse to run with example passwords.

## Deployment

- Frontend: **Vercel** (project `pksingh-iitiim`, root directory `tutoring-platform/`)
- Backend API: hosted separately; `FRONTEND_URL`/`BACKEND_URL` env vars point the
  frontend at it.
- Vercel is the single production deployment target. If you add a second host,
  document why here and keep this section current.

## Monitoring & errors

- `SENTRY_DSN` (backend) and `NEXT_PUBLIC_SENTRY_DSN` (frontend) enable Sentry.
- `/health` reports DB connectivity; Prometheus metrics at `/metrics`.
- See `monitoring/` for sample scrape and alerting configs.

## Reporting issues

Open an issue or PR. For security-sensitive bugs (secrets, auth, payments),
contact the maintainers privately — do not paste real credentials into issues.
