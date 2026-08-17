# HANDOFF — PK Singh Mentorship Website

This document is the single source of truth for whoever owns the site next.
It was written for the **non-technical owner**: it explains what you own, what
runs itself, and exactly what to do when something looks wrong.

**Start here → then read `DEPLOYMENT_GUIDE.md` (one-time setup) and
`ADMIN_GUIDE.md` (day-to-day).**

---

## 1. What you own

| Piece | Service | Login | What it costs |
|---|---|---|---|
| Website (frontend) | **Vercel** — project `pksingh-iitiim` | vercel.com | Free plan |
| Backend (the brain) | **Render** — service `pksingh-backend` | render.com | Free plan (spins down after 15 min idle, wakes on visit) |
| Database (text data) | **Render** — `pksingh-db` (PostgreSQL) | part of Render | Free plan |
| File storage (videos/PDFs) | **Supabase** — project with `media` + `backups` buckets | supabase.com | Free plan (500 MB storage, 5 GB/month bandwidth) |
| Code & automatic backups | **GitHub** — repo `AtulTejaswi/Pksingh_iitiim` | github.com | Free |

**URLs you'll actually use:**
- Public website: <https://pksingh-iitiim.vercel.app>
- Admin panel (log in here): <https://pksingh-iitiim.vercel.app/admin>
- Backend health check (is the server alive): <https://pksingh-backend.onrender.com/api/health>

**Passwords you must keep safe** (in a password manager):
- Admin login for the website (email + password)
- Render / Vercel / GitHub / Supabase accounts
- The Supabase **service_role key** (it's a master key — anyone with it can
  read/write all your data and files)
- The **backup token** (`BACKUP_CRON_TOKEN`) — set in two places (Render +
  GitHub), must match
- Supabase database password (shown only once when you created the project)

---

## 2. What is automated (runs without you)

| Automation | What it does | When |
|---|---|---|
| **Daily backup** (GitHub Action `daily-backup`) | Exports ALL site data and saves two copies — one in the Supabase `backups` bucket (permanent), one in GitHub (90-day history) | Every day at 1:10 AM UTC, also runnable manually from GitHub → Actions → daily-backup |
| **Startup backup** (backend) | Every time the server restarts/redeploys, it saves a fresh backup first | On each deploy |
| **Auto-restore** (backend) | If the database is ever empty (e.g. a data-loss incident), the server automatically restores the latest backup on boot | On each startup, only when data is missing |
| **Auto-deploy** | When code changes are pushed to GitHub `main`, Vercel and Render rebuild and update themselves | On every push |
| **Health checks** | Render pings `/api/health`; the admin Dashboard shows a green/red "System Status" card | Continuously |
| **Warm-up ping** (frontend cron) | Keeps the free backend from cold-starting during traffic hours | 2:15 AM daily |

**Rule of thumb:** if you never change anything, the site runs itself. The
only manual tasks are adding content (ADMIN_GUIDE.md) and — once — completing
DEPLOYMENT_GUIDE.md if it hasn't been done.

---

## 3. What still needs a developer (be honest about these)

1. **Supabase setup is a one-time, owner-doable task** (DEPLOYMENT_GUIDE.md
   steps 1–5) — no developer needed, but it *must* be done for uploads to be
   permanent. Until `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and
   `SUPABASE_JWT_SECRET` are set on the Render backend, the site works but
   shows an amber **"File storage: Stored on server"** card on the admin
   Dashboard and prints a boot warning — uploaded videos are still wiped on
   every update until this is done. (Temporary override: the storage guard was
   relaxed from a hard fail to a loud warning so the backend could deploy
   before this setup; it should be made fatal again once Supabase is
   configured.)

   > **Status check — Aug 18, 2026:** verified live on the production backend
   > that Supabase is **still not configured** — no `SUPABASE_URL` /
   > `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_JWT_SECRET` exist on the Render
   > service, `/api/config` reports `storage: local`, and the boot log prints
   > the storage warning. **The override stays in place (intentionally).**
   > The moment the three keys are set and a test upload lands in the Supabase
   > `media` bucket, the guard should be made fatal again (one small commit in
   > `src/utils/envSecurity.ts`). Until then, do not delete the override — it
   > is what keeps the backend able to boot at all.
2. **Razorpay (online payments)** — the checkout is fully implemented
   (create-order → Razorpay Orders API → checkout modal → signature
   verification → webhook → automatic enrollment) and verified end-to-end
   against a mock gateway. Accepting *real* money just requires a Razorpay
   account + all three keys on the backend (DEPLOYMENT_GUIDE.md → Optional
   step). Until then, paid courses show a "Buy now" button and students get a
   friendly "payments aren't set up yet" message instead of paying nothing.
3. **Static pages** — the mentorship landing pages (IIT/NEET/JEE/SAT/CAT/GMAT,
   the /pricing page, blog articles) are hand-written content, not editable
   from the admin panel. To change their text you need a developer. Course
   pages, prices, lessons, materials, testimonials, and students are all
   admin-editable.
4. **Design/feature changes** — any new page, new field, or visual redesign
   needs a developer.

---

## 4. "If something looks wrong" — the runbook

Work through these in order. Stop when the problem is fixed.

### A. The website won't load at all
1. Open <https://pksingh-iitiim.vercel.app> on your phone (different
   network) — is it down for everyone or just you?
2. Open the backend health check:
   <https://pksingh-backend.onrender.com/api/health>
   - If it shows `{"status":"ok"...}` the server is fine — the problem is the
     frontend. Wait 5 minutes and retry (free plans can be slow to wake).
   - If it shows anything else or won't load, go to **Render →
     pksingh-backend → Logs**. Look at the newest lines:
     - A line starting with **`Fatal:`** tells you exactly what's wrong (e.g.
       "Cloud storage is not configured…"). This means an environment
       variable is missing — see DEPLOYMENT_GUIDE.md step 5 and paste the
       correct value, then **Manual Deploy**.
     - If you don't see "Fatal:" but the log shows an error, note the text
       and send it to a developer.

### B. The site loads, but "File storage: Stored on server (see note)" is amber
That's the admin Dashboard's System Status card. It means Supabase isn't
connected yet — uploads would be lost on the next update. Complete
DEPLOYMENT_GUIDE.md **step 5**, then re-check the card (should turn green:
"Files are safe in the cloud").

### C. A student says they can't see a course / video
1. Check the course is **Published** (Courses list shows "Published", not
   "Draft") — unpublishing is the #1 cause.
2. Check the file is actually attached: Courses → course → Course content →
   expand the lesson → "Attached content" should list it.
3. If the video is a YouTube link, open it yourself in a private/incognito
   browser tab — if *you* can't see it, the YouTube video is Private (must be
   **Unlisted**, not Private).
4. If a file shows but won't play, re-upload it (files uploaded before
   Supabase was connected may have been lost — see D).

### D. Uploaded files disappeared after a site update
This is the one scenario the new setup prevents *going forward*, but if it
already happened:
1. Open **Supabase → Storage → `media`** — if files are there, the course
   just lost its links (a developer can re-link them from the database).
2. If nothing is there, the files were uploaded before storage was configured
   and are unrecoverable (they lived on the server's temporary disk). The
   **text data** (courses, students, lessons) is safe — restore it if needed
   via E.
3. From now on, files upload straight to Supabase and survive every update —
   verify with the 2-minute test in DEPLOYMENT_GUIDE.md step 8.

### E. You accidentally deleted something, or the site is missing data
Your backups can bring it back. **This replaces ALL current data with the
backup** (any changes made after the backup are lost), so only do it when
something is genuinely wrong.

1. Open the GitHub repo → **Actions** → **daily-backup** → open the most
   recent successful run.
2. Download the **site-backup-…** artifact (it's a `.json` file).
3. You need a developer for this last step OR follow the manual restore:
   a. Log in to Render → **pksingh-backend** → **Environment** and confirm
      `ADMIN_EMAIL` + `ADMIN_PASSWORD` are set.
   b. The **auto-restore** feature does this automatically when the database
      is empty: if you ever want a full reset, empty the database (via
      Render's database shell, `psql`), restart the service, and it restores
      the newest Supabase backup by itself.
   c. If you prefer a point-in-time restore to a specific backup file, a
      developer can POST the file to the import endpoint.

   > ⚠️ The most important thing: **backups exist automatically every day** —
   > even if you do nothing, yesterday's copy is safe in Supabase
   > (`backups` bucket) and in GitHub. Take a breath; the data is almost
   > certainly recoverable.

### F. You forgot the admin password
1. Render → **pksingh-backend** → **Environment** → edit `ADMIN_PASSWORD` to
   a new strong password → **Save Changes** → **Manual Deploy** → wait for
   **Live**.
2. The server resets the admin password to this value on every start. Log in
   with your email + the new password.

### G. The red cross / "Failed" on GitHub after a push
GitHub shows a green check or red cross for each automated deployment.
- **Red cross on `deploy-and-test` (backend):** open the run, read the error.
  Most common cause: a `Fatal:` environment guard (see A). 
- **Red cross on the frontend:** the real frontend is on Vercel; the red
  cross usually comes from a secondary Render frontend service. Check
  **Vercel → Deployments** — if Vercel is green, the site is fine.
- When in doubt: does the website load? Then it's cosmetic — ignore it or ask
  a developer.

### H. The site is slow to load
Free plans "sleep" after ~15 minutes of no visitors and take 20–60 seconds to
wake up. This is normal and costs nothing. The site warms itself up every
morning to reduce it. If it's *always* slow during the day, consider the paid
plan ($7/month) on Render — ask a developer to switch.

---

## 5. Costs & limits (free plan reality check)

- **Render free:** server sleeps after 15 min idle; ~750 hours/month (the
  backend stays within it thanks to the warm-up). Disk is wiped on redeploy —
  that's why all *important* data lives in Supabase (files) and daily backups.
- **Supabase free:** 500 MB file storage, 5 GB/month bandwidth, unlimited
  database rows for a site this size. If storage gets close to full, delete
  old files from the admin panel first; a developer can also trim old
  backups in the `backups` bucket.
- **Vercel free:** plenty for this site.
- **GitHub free:** plenty; keeps 90 days of backup artifacts.

---

## 6. Repository map (for developers)

```
/                       Node/Express + Prisma backend (TypeScript)
  src/                  backend source
    utils/envSecurity.ts   startup guards (refuse-to-boot on dangerous config)
    utils/storage.ts       Supabase Storage layer (+ local-dev fallback)
    modules/backup/        export/import/cron backup endpoints
    modules/config/        GET /api/config (upload limits + mode, used by admin UI)
  tests/                backend jest suite (51 tests)
  .github/workflows/    CI, deploys, diagnostics, daily-backup cron
  render.yaml           backend blueprint (env var names live here)
tutoring-platform/      Next.js frontend (Vercel)
  src/app/admin/        admin panel (courses, students, testimonials, dashboard)
  src/components/admin/ CourseBuilder, LessonResourcesPanel, SystemStatusCard
  src/hooks/usePlatformConfig.ts  fetches live upload limits from /api/config
DEPLOYMENT_GUIDE.md     beginner one-time setup (Supabase → Render → GitHub)
ADMIN_GUIDE.md          day-to-day content management
HANDOFF.md              this file
```

---

## 7. Changelog of this handoff pass

- **Hard fail-safes added** (`src/utils/envSecurity.ts`): production refuses
  to start if (a) `DATABASE_URL` is missing or SQLite, (b) cloud storage is
  PARTIALLY configured (exactly one of `SUPABASE_URL` /
  `SUPABASE_SERVICE_ROLE_KEY` set), (c) `SUPABASE_JWT_SECRET` is missing when
  Supabase is set, (d) Razorpay is
  partially configured or uses a test key in production. All with
  plain-English messages.
- **DB connect failure now fatal in production** (`src/server.ts`) — a broken
  site no longer pretends to be healthy.
- **`GET /api/config`** exposes upload limits/mode; **admin System Status
  card** shows the owner website/database/storage/payments health in plain
  English.
- **Admin upload panel** now uses the *server's* real 500 MB limit and full
  file-type list (was hardcoded 50 MB), with a "Big video? use YouTube
  Unlisted" helper.
- **Scheduled backup**: GitHub Action `daily-backup` (1:10 AM UTC) +
  token-protected `POST /api/backup/cron` endpoint; backups also carry a
  GitHub artifact copy.
- **`/api/health`** now includes DB + storage status.
- **Real Razorpay integration**: `Course.price` (rupees) added end-to-end
  (schema → API → admin editor → course page); `createOrder` calls the
  Razorpay Orders API (`src/utils/razorpay.ts`, `RAZORPAY_API_BASE`
  overridable for tests) and persists `gatewayOrderId`; `verifyPayment` is
  user-scoped and both verify + webhook are idempotent (no double
  enrollment/double charge); friendly 503 (unconfigured) / 502 (gateway
  down) / 400 (no price, free course) errors; student course page has a
  Razorpay Checkout "Buy now — ₹…" flow. Verified end-to-end locally with a
  mock gateway (12 checks) incl. webhook signature + idempotency.
- Docs: `DEPLOYMENT_GUIDE.md`, `ADMIN_GUIDE.md`, this file.
- **Aug 18, 2026 — verification (no code change):** confirmed live that
  Supabase is not yet configured on the production backend (env vars absent,
  `/api/config` reports `storage: local`, boot warning fires). The temporary
  storage-guard override (`be00902`) remains in place and **must not be
  reverted until Supabase is fully configured and a real upload lands in the
  `media` bucket** — otherwise the backend refuses to boot.
- **Aug 18, 2026 — YouTube-Unlisted-first workflow:** the admin link panel
  now live-previews a YouTube video and rejects channel/playlist/search links
  with a plain-English message; the backend validates links (new
  `src/utils/youtube.ts`, unit-tested) and canonicalises every form
  (`youtu.be`, shorts, embed) to `watch?v=...`; the student player shows a
  friendly "Open in YouTube" fallback instead of a dead iframe. Full lecture
  recordings should be delivered as YouTube **Unlisted** links — free, no
  size limit, and they put zero pressure on the (still not configured)
  Supabase 1 GB free storage.
