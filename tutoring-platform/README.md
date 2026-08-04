# PK Singh Tutoring Platform — Frontend

Next.js (App Router) frontend for the PK Singh tutoring platform. Served to
production on Vercel.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend talks to the backend API through `NEXT_PUBLIC_API_URL`, which is
read in a single source of truth at `src/lib/config.ts` (`API_BASE_URL`). If the
variable is not set, it falls back to the production backend:

- Production/Preview/Development value: `https://pksingh-backend.onrender.com/api`

> **Required env var:** set `NEXT_PUBLIC_API_URL` to the render backend base URL
> (with the trailing `/api`) in the Vercel project's environment for Production,
> Preview, and Development. If it is not set, the code falls back to the same
> production URL, so the app still works — but set it explicitly so the value is
> a deliberate single source of truth rather than an implicit default.

## Common env vars

See the root `.env.example` for the backend-side keys. Frontend-relevant ones:

- `NEXT_PUBLIC_API_URL` — backend base URL
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (used for sitemap/robots/SEO)
- `NEXT_PUBLIC_SENTRY_DSN` — client-side error reporting

Do not prefix secrets with `NEXT_PUBLIC_` — anything with that prefix is exposed
in the client bundle.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # typecheck
```

## Backend hosting & cold starts (Render free tier)

The backend runs on **Render's free tier**. Expect occasional **20-40s cold-start
delays** after ~15 minutes of inactivity. This is mitigated, not eliminated:

- **Warm-up cron** — `vercel.json` schedules `/api/cron/warmup` once daily
  (~7:45am IST) to ping the backend `/health` endpoint. Note: on Vercel **Hobby**
  plan, cron jobs are limited to once per day, so the warm-up cannot run every
  few minutes to fully prevent idle spin-down — it mainly pre-warms the first
  morning request.
- **Fast-fail frontend fallback** — all backend fetches use an 8s timeout + a
  single retry (`src/lib/backend-fetch.ts` for server routes, `src/lib/api-client.ts`
  for the browser API client), so a cold start fails fast into the existing
  static-data fallback (courses, quotes, testimonials, stats) instead of hanging
  the page for 30–60s.
- **Loading UI** — components that fetch from the backend (CoursesCatalog,
  homepage featured courses, testimonials, quotes, etc.) render skeleton/loading
  states while the fetch is in flight.

This is a **best-effort mitigation, not a guarantee** — Render free tier still
enforces a hard monthly runtime cap. Marketing content, hero CTAs, pricing, and
static course previews are deliberately served without waiting on the backend;
the API is only required for things that truly need it (auth, enrollment,
personalized dashboard data).

The backend service itself is reproducible from the repo via `render.yaml` at
the repo root (env var *keys* only — actual secrets stay in the Render
dashboard). See also `.github/workflows/deploy-and-e2e.yml`, which triggers
Render deploys via the Render API (`RENDER_API_KEY` / `RENDER_SERVICE_ID`).

## Deployment

Deployed on **Vercel** — see `AGENTS.md` in this folder for exact project
settings (framework `nextjs`, root directory `tutoring-platform/`, Node 24.x).
