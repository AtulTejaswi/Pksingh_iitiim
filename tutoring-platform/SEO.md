# SEO Monitoring — Google Search Console Runbook

How to read Search Console reports for the exam-specific landing pages, and what
to do when a signal looks off. Site: `https://pksingh-iitiim.vercel.app`.

## The six exam pages

| Route | Canonical URL |
| --- | --- |
| JEE | `https://pksingh-iitiim.vercel.app/jee-mentorship` |
| NEET | `https://pksingh-iitiim.vercel.app/neet-mentorship` |
| IIT | `https://pksingh-iitiim.vercel.app/iit-mentorship` |
| CAT | `https://pksingh-iitiim.vercel.app/cat-mentorship` |
| GMAT | `https://pksingh-iitiim.vercel.app/gmat-mentorship` |
| SAT | `https://pksingh-iitiim.vercel.app/sat-mentorship` |

All six are in `sitemap.xml` (priority 0.8), linked from the site footer and
homepage, and each page emits `BreadcrumbList`, `Course` and `FAQPage` JSON-LD
plus its own canonical + OG image. If any of that is missing after a future
redesign, the pages will still rank, but rich results (FAQ) and crawl signals
(sitemap/footer) weaken.

## Prerequisites (one-time)

1. Verify ownership in [Search Console](https://search.google.com/search-console)
   — the recommended method for this site is the **HTML tag** one:
   `layout.tsx` renders `<meta name="google-site-verification">` from
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (see `src/lib/config.ts`).
   DNS-TXT verification does **not** work for `*.vercel.app` domains — Vercel
   owns that DNS and exposes no record editor.
2. Add the property (URL-prefix: `https://pksingh-iitiim.vercel.app`).
3. **Sitemaps** report → submit `sitemap.xml`.
4. **URL Inspection** → paste each of the six URLs → *Request Indexing*
   (about 10/day allowed, all six fit in one session).

## Reading the Sitemaps report

Search Console → **Indexing → Sitemaps**.

- **Submitted sitemaps** row: `sitemap.xml` should show *Success* (not
  *Couldn't fetch* or *Has errors*). A re-submit is only needed if the URL
  changes (it doesn't — `SITE_URL` is stable).
- **Discovered URLs**: the total count should be ≥ 17 static routes + 6 blog
  posts. If the exam pages are missing from the count after ~1 week, they were
  never discovered — re-check `/sitemap.xml` on the live site and resubmit.
- **Errors**: click the sitemap row to see which URLs failed. Every entry here
  should resolve with HTTP 200; if a route 404s (e.g. after a rename), fix the
  route or drop it from `src/app/sitemap.ts` — a sitemap entry pointing at a
  404 penalizes crawl trust.

## Reading URL Inspection

Search Console → **URL Inspection** → paste a page URL.

| Status | Meaning | Action |
| --- | --- | --- |
| *Page is indexed* | Crawled OK, in the index | None. Use *View Crawled Page* to sanity-check the rendered HTML (H1, canonical, JSON-LD present). |
| *URL is on Google, but we haven't crawled it yet* | Known, not crawled | *Request Indexing* once. Don't spam it. |
| *Crawled — currently not indexed* | Google chose not to index (thin/duplicate/low value) | Improve unique content on that page, add internal links, then re-request after 2–3 weeks. |
| *Discovered — currently not indexed* | Found via sitemap, not crawled yet | Normal for new pages; wait. If it persists > 4 weeks, request indexing. |
| *Page with redirect / soft 404* | Route broken | Check the route returns 200 and canonical matches. |

**Green flag**: all six pages show *Page is indexed* within ~1–3 weeks of
submission, and *View Crawled Page* shows the H1 + FAQ JSON-LD.

## Reading the Page Indexing report

Search Console → **Indexing → Pages**.

- The **site-wide indexed count** should roughly match the sitemap route count.
- The **"Why pages aren't indexed"** breakdown (Duplicate / Crawled-not-indexed
  / Not found, etc.) tells you *why* anything is excluded. For the six exam
  pages specifically, cross-check each in URL Inspection — a blanket report
  category (e.g. "Duplicate without user-selected canonical") affecting one
  exam page usually means its canonical tag is wrong.

## Reading the Performance report (search traffic)

Search Console → **Performance → Search results**.

The exam pages are most usefully read as one segment:

1. Click **+ New** → **Page** → *Custom (regex)* and enter:

   ```
   ^https://pksingh-iitiim\.vercel\.app/(jee|neet|iit|cat|gmat|sat)-mentorship$
   ```

   (or pick *URL containing* `-mentorship` for the same set plus the homepage
   anchor-free URLs — the regex above is exact.)

2. Metrics to watch (period ≥ 28 days, or filter by date range):

   - **Impressions** — how often the pages appear in results. Rising = good
     crawl/coverage. Near-zero after 4+ weeks with "indexed" status = weak
     ranking or the segment isn't in the query mix yet.
   - **Position** — median ranking. Movement from 20–50 → 1–10 is the normal
     trajectory for new pages; don't expect top-10 in week one.
   - **CTR** — below ~2–3% with high impressions usually means the title/description
     isn't compelling: review `title`/`description` in the page metadata.
   - **Clicks** — the business metric. Zero clicks with good impressions is a
     CTR problem; zero impressions is a coverage/ranking problem.
3. **Queries tab** (within the segment): shows which search terms actually pull
   the pages. Compare with the keywords in each page's `keywords` array — if a
   page ranks for unexpected terms, either the copy is doing extra work (fine)
   or the page title is misleading (fix the metadata).

## Health signals → actions

| Signal | Likely cause | Action |
| --- | --- | --- |
| Sitemap shows errors | Route moved/removed | Fix in `src/app/sitemap.ts` or restore the route. |
| Exam page "not indexed" > 4 weeks | Thin/duplicate content | Add more unique exam-specific body copy; strengthen internal links (footer already links all six). |
| Position 20+ with impressions | Normal for new pages | Wait + request indexing once; add long-tail content (blog posts linking to the page). |
| Low CTR, good impressions | Weak title/description | Edit metadata in `src/app/*-mentorship/page.tsx`. |
| FAQ rich result not showing | FAQPage JSON-LD invalid | Re-check `FaqJsonLd` output — the visible FAQ and schema share `src/data/exam-pages.ts` data, so if the accordion renders, the schema is populated. |

## Useful links

- Live sitemap: `https://pksingh-iitiim.vercel.app/sitemap.xml`
- Live robots: `https://pksingh-iitiim.vercel.app/robots.txt`
- Sitemap source: `src/app/sitemap.ts` · Exam content: `src/data/exam-pages.ts`
  · Exam pages: `src/app/{jee,neet,iit,cat,gmat,sat}-mentorship/page.tsx`
