# Data Persistence — Permanent Fix

## Why your courses kept vanishing

The backend was using **SQLite** (`file:./dev.db`) as its database. On Render's
free tier the entire container filesystem is **ephemeral** — every restart or
redeploy wipes all local files, including the SQLite database. That's why your
courses disappeared after each deploy.

The JWT secret was also set with `generateValue: true` in `render.yaml`, which
**regenerates the secret on every deploy** and instantly invalidates every
user's login token — which is why you kept getting logged out.

## The permanent fix (now shipped)

1. **Database switched from SQLite to PostgreSQL**
   - The Prisma schema now uses `provider = "postgresql"`.
   - On Render, a free PostgreSQL database is **auto-provisioned** by
     `render.yaml` (the `pksingh-db` service). It is persistent across
     restarts, deploys, and container recycling.
   - For local development, use the included `docker-compose.yml` to run a
     local PostgreSQL via Docker.

2. **Stable JWT secret**
   - The auth secret in `render.yaml` is now a fixed value, not auto-generated.
   - Users will no longer be logged out on every deploy.
   - You should change this to a strong random value for production (see below).

3. **Supabase Storage backup (belt + suspenders)**
   - The `/api/backup/export` endpoint now also uploads the JSON backup to
     Supabase Storage (if `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set).
   - On server startup, if the local DB is empty, the server first tries to
     restore from Supabase Storage (persistent cloud), then falls back to the
     local `backups/` directory.

## Local development setup

```bash
# 1. Start a local PostgreSQL via Docker
docker compose up -d

# 2. Create the schema in your local DB
npx prisma db push

# 3. Run the backend
npm run dev
```

The default `DATABASE_URL` in `.env` is
`postgresql://postgres:postgres@localhost:5432/pksingh?schema=public`, which
matches the Docker compose service.

## Production deployment (Render)

When you push to the `main` branch on the connected GitHub repo, Render will:

1. Read the new `render.yaml` and auto-provision a free PostgreSQL database
   (`pksingh-db`).
2. Run `npx prisma db push` to create the tables in the new database.
3. Connect the web service (`pksingh-backend`) to that database.
4. Run `npm start` to start the API.

**Important:** after the first deploy, change the `LOCAL_JWT_SECRET` env var in
the Render dashboard to a strong random value. The default in `render.yaml` is
intentionally a placeholder so that users must replace it.

## Migrating existing data

If you have course data in the old SQLite DB that you want to preserve:

1. From the **old** deployment, call `POST /api/backup/export` (as SUPER_ADMIN)
   to download a JSON backup of all data.
2. After the new PostgreSQL deployment is live, call `POST /api/backup/import`
   with the filename to restore the data into the new PostgreSQL database.

## Why SQLite could never be made to work

SQLite is a single-file database. There's no way to make a file persist on
Render's free tier — the entire container filesystem is destroyed on every
restart by design. The only true fix is to use a managed database with its own
persistent storage, which is what PostgreSQL on Render provides.
