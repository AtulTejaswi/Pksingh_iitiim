# PK Singh Tutoring Platform — Frontend

Next.js (App Router) frontend for the PK Singh tutoring platform. Served to
production on Vercel.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend talks to the backend API through `NEXT_PUBLIC_API_URL` (defaults to
`/api` in production, `http://localhost:4000/api` in development).

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

## Deployment

Deployed on **Vercel** — see `AGENTS.md` in this folder for exact project
settings (framework `nextjs`, root directory `tutoring-platform/`, Node 24.x).
