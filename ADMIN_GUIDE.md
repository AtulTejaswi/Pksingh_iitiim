# Admin Guide — Managing Your Website (PK Singh Mentorship)

> **Who this is for:** the website owner. This guide shows you how to do every
> day-to-day task from your **admin panel** — no code, no database, no
> developer needed.
>
> **Where is the admin panel?** Log in at
> <https://pksingh-iitiim.vercel.app/admin> with your admin email and
> password. You'll land on the **Dashboard**.

---

## The Dashboard (your control room)

The first thing you see is **System Status** — a plain-English health check:

| Row | Green means | Amber/red means |
|---|---|---|
| Website / server | Your site's brain is online | The site is down (see HANDOFF.md) |
| Database | Your data is being stored | A serious problem — call a developer |
| File storage | **Files are safe in the cloud** | Files are only on temporary disk — finish DEPLOYMENT_GUIDE.md step 5 |
| Online payments | Students can pay | Payments are turned off (fine unless you want to sell) |

Below that: **stat cards** (published courses, drafts, enrolled students,
lessons), **quick actions** (add course, manage courses, view students), and
**recent activity**.

---

## Adding a new course

1. Dashboard → **Add New Course** (or sidebar → **Courses** → **+ New course**).
2. The editor has **4 steps** across the top: *Basics → Content → Pricing →
   Review & Publish*.

### Step 1: Basics
- **Title** — the course name students will see.
- **Subject** — Physics / Chemistry / Mathematics / Biology, etc.
- **Description** — 1–3 sentences about the course (at least 10 characters).
- **Level** — Beginner / Intermediate / Advanced.
- **Thumbnail** — a picture shown on the course card (click to upload; if you
  skip it, a default image is used).

### Step 2: Content (lessons)
- Click **Add lesson**, type a title and description, and press Enter.
- Each lesson appears in a list. You can:
  - **Expand** a lesson to add files, videos and notes (see "Adding material
    to a lesson" below).
  - **Reorder** lessons by dragging the handle (⋮⋮) up/down.
  - **Edit** a lesson's title/description, or **delete** it.
- Tip: name lessons in order — "1. Electric Charge", "2. Coulomb's Law" — so
  students see a clear sequence.

### Step 3: Pricing
- **Free course?** Leave the free toggle ON.
- **Paid course?** Toggle it off, then enter a price in rupees (e.g. `1999`).
  *Note: students can only pay once you've set up Razorpay
  (DEPLOYMENT_GUIDE.md → Optional step).*

### Step 4: Review & Publish
- Choose **Save as draft** (students can't see it yet — you can keep editing)
  or **Publish** (visible to everyone on the Courses page).
- You can switch between draft and published any time from the **Courses**
  list (see "Publish / unpublish a course" below).

---

## Adding material to a lesson

Open **Courses** → click a course → click **Course content** (or the
lesson-count button) → **expand** the lesson you want.

You'll see three panels:

### 1. Upload PDF / video / image ("Click or drop file here")
- Works for: PDF worksheets, MP4/WebM videos, MOV/MKV (phone recordings),
  JPEG/PNG images, Word and PowerPoint documents.
- **Size limit: 500 MB per file** (shown on the panel).
- If a file is too big or the wrong type, you'll get a clear red message
  telling you why — just read it and try a different file.

> **Big videos (like full lectures)?** Don't upload them here. Instead:
> 1. Upload the video to YouTube as **Unlisted** (YouTube → Upload →
>    Visibility → *Unlisted* — only people with the link can watch it, and it
>    won't appear in search or on your channel).
> 2. Paste the YouTube link in the **"YouTube or web link"** box (panel 2).
>
> This is free, has **no size limit**, and streams better for students than
> a downloaded file. This is the recommended way to deliver lecture
> recordings.

### 2. YouTube or web link
- **Title:** e.g. "Lecture 3 recording".
- **URL:** the YouTube link (`https://youtube.com/watch?v=...` or
  `https://youtu.be/...`) or any other web link.
- The site automatically recognises YouTube links.
- Click **Attach link**.

### 3. Instructor note (text)
- A short text note under the lesson — summaries, formulas, instructions.
- Click **Add note** to save it.

**Managing what's attached:** the "Attached content" list shows every file and
link in the lesson. Use the **trash icon** to remove something, or the **open
icon** to preview it.

---

## Editing an existing course

**Courses** → click the course → **Edit course** (pencil icon). The editor
opens with all your saved content. Change anything, then **Save draft** or
**Publish**. Students see updates immediately.

---

## Publish / unpublish a course

**Courses** → the course card shows **Published** or **Draft** with a
publish/unpublish button. One click:
- **Publish** → visible to everyone.
- **Unpublish** (make draft) → hidden from students but everything is kept
  safely — you can publish again later.

---

## Deleting a course

**Courses** → open the course → **Delete** (trash icon). The site asks you to
confirm first. **This permanently deletes the course, its lessons, and its
files** — if in doubt, **unpublish** instead of delete.

---

## Managing students

**Sidebar → Students.** You can:
- **Search** students by name or email.
- **Filter** by course.
- **Unenroll** a student (remove them from a course). Use this if a student's
  access is misbehaving — they can re-enroll afterwards.
- **Export** the student list as a spreadsheet (Excel-compatible CSV) — great
  for attendance or records.

---

## Managing testimonials (student reviews shown on the site)

**Sidebar → Testimonials.** Add, edit, or delete the review quotes shown on
your homepage. Fields: student name, quote text, course, rating. Click
**Add Testimonial**, or the pencil/trash icons on existing ones.

---

## Good habits (30 seconds each)

- **After uploading a file, refresh the page** once to confirm it saved.
- **Before a big update**, you can trigger a backup yourself: go to the GitHub
  repo → **Actions** → **daily-backup** → **Run workflow** → **Run
  workflow**. Wait a minute; the daily automatic backup also runs every night
  at 1:10 AM.
- **Check the Dashboard's System Status card** once a week — all four rows
  should be green (or payments amber if you haven't set up Razorpay yet).

---

## If you get stuck

- **A red error message appears:** read it — it's written for you, not for a
  computer. It tells you exactly what to change (e.g. "file is too big",
  "wrong file type").
- **The site looks broken or won't load:** see **HANDOFF.md → "If something
  looks wrong"**.
- **You want to undo a mistake:** your automatic backups can restore the site
  (HANDOFF.md → "Restoring from a backup"). Deleting something you didn't
  mean to is the most common reason to use this.
