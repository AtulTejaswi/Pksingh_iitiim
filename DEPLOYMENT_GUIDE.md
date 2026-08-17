# Deployment Guide — PK Singh Mentorship Website

> **Who this is for:** the website owner. No technical background needed.
> Follow the steps **in order**, and copy the values exactly where the guide
> says to. If a step says "screenshot here", that's where a picture belongs in
> a future version of this guide — the text below tells you exactly what to do.

---

## What you are about to do (in plain English)

Your website has three "machines" that need to exist:

| Machine | What it does | Where it lives |
|---|---|---|
| **Frontend** | The website people see | Vercel (already set up) |
| **Backend** | The brain — stores courses, students, payments | Render (already set up) |
| **File storage** | Stores your uploaded videos/PDFs **permanently** | Supabase (you must create this) |
| **Database** | Stores all your text data (courses, students) | Render (already set up) |

Steps 1–3 create the **file storage** (Supabase). Steps 4–5 connect it to your
backend. Steps 6–7 turn on automatic daily backups. Step 8 confirms everything
works.

> ⏱️ **Total time:** about 30–45 minutes, most of it clicking through sign-up
> forms.

---

## Step 1 — Create a Supabase account and project

1. Open <https://supabase.com> in your browser and click **Start your project**.
2. Sign up with your Google or GitHub account (or email).
3. You'll be asked to **Create a new project**:
   - **Organization:** pick a name (e.g. "PK Singh Tutoring")
   - **Project name:** type `pksingh` (or anything you like)
   - **Database password:** click **Generate a password** and **save it
     somewhere safe** — you will not see it again. (A note or password manager
     is fine.)
   - **Region:** choose a region close to your students (e.g. `Singapore` or
     `Mumbai`). *This can't be changed later, so pick carefully.*
4. Click **Create new project** and wait ~2 minutes for it to finish setting up.

*[Screenshot here: the "New project" form with the fields above]*

---

## Step 2 — Create the two storage buckets

Your uploaded files (videos, PDFs, images) go into a "bucket" called `media`,
and your automatic daily backups go into a bucket called `backups`.

### Bucket 1: `media` (your course files — MUST be Public)

1. In your Supabase project, click **Storage** in the left menu.
2. Click **New bucket**.
3. **Name:** type exactly `media` (lowercase, no spaces).
4. **Public bucket:** turn this **ON** (this is what lets students watch your
   videos without logging in to Supabase).
5. Click **Create bucket**.

*[Screenshot here: Storage → New bucket with name "media" and Public on]*

### Bucket 2: `backups` (automatic daily backups)

1. Click **New bucket** again.
2. **Name:** type exactly `backups`.
3. Leave **Public bucket OFF** (backups are private).
4. Click **Create bucket**.

---

## Step 3 — Copy your Supabase keys

1. In Supabase, click **Project Settings** (bottom of the left menu) → **API**.
2. You'll see a table with keys. Copy these three values into a temporary note
   file (you'll paste them in Step 5):

| Key in Supabase | Copy this value |
|---|---|
| **Project URL** | The long `https://....supabase.co` URL |
| **service_role** (secret) | The very long `eyJ...` string. **Treat it like a password.** |
| **JWT Secret** | Click **JWT settings** and copy the **JWT Secret** value |

> ⚠️ **Important:** copy the **service_role** key, **not** the anon/public key.
> The service role key starts with `eyJ` and is much longer. If you use the
> wrong one, the site will work but uploads will not be saved permanently.

*[Screenshot here: Project Settings → API, with the three values highlighted]*

---

## Step 4 — Set up Render and connect GitHub (if not already done)

Your backend already runs on Render. This step makes sure GitHub and Render
are connected so the site updates itself whenever code changes.

1. Open <https://render.com> and sign in.
2. Click your **pksingh-backend** service.
3. Check that it says **Deploy** is connected to the GitHub repo
   `AtulTejaswi/Pksingh_iitiim` on branch `main`. If it isn't, click
   **Connect** and follow the prompts.

*(If you're re-reading this guide because the site already works — skip to
Step 5. You're just double-checking.)*

---

## Step 5 — Paste the Supabase keys into your backend (the important step)

1. In Render, open your **pksingh-backend** service.
2. Click the **Environment** tab.
3. Click **Add Environment Variable** for each of these three, and paste the
   value from Step 3:

| Variable name (copy exactly) | Value to paste |
|---|---|
| `SUPABASE_URL` | The `https://....supabase.co` URL from Step 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | The long `eyJ...` service_role key from Step 3 |
| `SUPABASE_JWT_SECRET` | The JWT Secret from Step 3 |

4. Double-check there are no spaces and no trailing spaces.
5. Click **Save Changes**, then **Manual Deploy** → **Deploy latest commit**.
6. Wait for the deploy to finish (2–3 minutes). The status should go from
   "In Progress" to "Live".

> ⚠️ **Why this matters:** until these three values are set, uploaded files are
> saved to the server's temporary disk and **deleted on the next update**.
> The site keeps working but shows an amber "File storage: Stored on server"
> warning on the admin Dashboard and prints a warning in the server logs until
> this step is done. If a deploy says "failed", check that all three values
> are set — a partial set (e.g. only one of the two keys) makes the site
> refuse to start with a message naming the missing one.

*[Screenshot here: Render → Environment tab with the three variables]*

---

## Step 6 — Turn on automatic daily backups

Your site saves a full backup of all its data **every day at 1:10 AM**.
Two copies are made: one in Supabase (the `backups` bucket) and one saved in
your GitHub repository. You need to create one shared "password" (called a
token) that lets the backup system talk to the site.

### 6a. Create the token

Open <https://passwordsgenerator.net> (or any password generator) and create a
**32-character** password with a mix of letters, numbers and symbols. Copy it
into a note — you'll paste it in the next two places.

### 6b. Add the token to Render (backend)

1. Render → **pksingh-backend** → **Environment** → **Add Environment Variable**.
2. **Name:** `BACKUP_CRON_TOKEN`
3. **Value:** paste the 32-character password you created.
4. **Save Changes**, then **Manual Deploy** → **Deploy latest commit**.
   Wait until it's **Live**.

### 6c. Add the token to GitHub

1. Open <https://github.com/AtulTejaswi/Pksingh_iitiim/settings/secrets/actions>
   (you may need to sign in to GitHub first).
2. Click **New repository secret**.
3. **Name:** `BACKUP_CRON_TOKEN`
4. **Value:** paste the **same** 32-character password.
5. Click **Add secret**.

*[Screenshot here: GitHub → Settings → Secrets → "New repository secret"]*

> 🔁 Both places must have the **exact same** value. The daily backup runs on
> GitHub's servers and uses this token to ask your site for a backup.

---

## Step 7 — Verify your site is healthy

1. Open <https://pksingh-iitiim.vercel.app> — the website should load.
2. Log in as admin at <https://pksingh-iitiim.vercel.app/admin>
   (email: the admin email, password: the admin password).
3. Open the **Dashboard**. You should see the **System Status** card showing:
   - **Website / server:** Online (green)
   - **Database:** Connected (green)
   - **File storage:** *Files are safe in the cloud* (green) — if it still says
     "Stored on server", the Supabase keys from Step 5 aren't right yet.
   - **Online payments:** Turned off (this is normal until you add Razorpay)

*[Screenshot here: the admin Dashboard with the green System Status card]*

---

## Step 8 — The 2-minute real-world test (do this once)

1. In the admin panel, open **Courses** → open any course → open any lesson.
2. Upload a small PDF or image. Wait for "File uploaded".
3. **Refresh the page.** The file should still be there.
4. In Render, trigger **Manual Deploy** → **Deploy latest commit** and wait
   until it's **Live** again (this simulates a website update).
5. Open the lesson again. **The file must still be there.**

If the file is still there after the redeploy — congratulations, your
permanent file storage is working and your website is fully set up. ✅

---

## Optional: turn on online payments (Razorpay)

Your site has a "course price" field in the admin panel, but collecting money
online is **turned off** until you add a Razorpay account (this is a separate
service that handles card/UPI payments, like a shop's card machine).

1. Create an account at <https://razorpay.com> (India-based, free to start).
2. In your Razorpay dashboard, open **Settings → API Keys** and click
   **Generate Key**.
3. You'll get three values. Add them to Render → **pksingh-backend** →
   **Environment**:

| Variable name | Value |
|---|---|
| `RAZORPAY_KEY_ID` | The key starting with `rzp_live_` (for real payments) |
| `RAZORPAY_KEY_SECRET` | The secret shown with it |
| `RAZORPAY_WEBHOOK_SECRET` | A long random string you create yourself |

4. **Save Changes** → **Manual Deploy** → wait for **Live**.
5. The admin Dashboard's System Status card should now show
   **Online payments: Enabled**.

> ⚠️ Use the **live** key (`rzp_live_...`) only when you're actually ready to
> receive real money. Use the test key (`rzp_test_...`) while practicing. The
> site will refuse to start if you mix them up (live key outside production).

---

## What if something goes wrong?

See **HANDOFF.md → "If something looks wrong"** — it walks you through the
most common problems in plain English and how to recover from a backup.
