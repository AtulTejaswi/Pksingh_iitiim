import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { fetchBackend } from "@/lib/backend-fetch";

// Static public routes. Keep in sync with the App Router pages.
const routes = [
  "",
  "about",
  "mentor-journey",
  "faq",
  "results",
  "support",
  "terms",
  "privacy",
  "jee-mentorship",
  "neet-mentorship",
  "iit-mentorship",
  "cat-mentorship",
  "gmat-mentorship",
  "sat-mentorship",
  "courses",
  "pricing",
  "blog",
];

// Blog slugs — keep in sync with src/app/blog/[slug]/page.tsx
const blogSlugs = [
  "jee-2027-physics-syllabus-breakdown",
  "neet-weightage-chapter-wise",
  "how-to-build-a-study-timetable",
  "sat-vs-cat-which-exam-fits-you",
  "5-memory-techniques-for-organic-chemistry",
  "ashtavakra-gita-lesson-on-exam-anxiety",
  "how-i-cracked-jee-and-got-into-iit",
  "jee-vs-neet-choosing-your-path",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === "blog" || route === "courses" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  try {
    const res = await fetchBackend("/courses");
    const data = await res.json();
    const courses = data.courses || data;
    if (Array.isArray(courses)) {
      const courseRoutes: MetadataRoute.Sitemap = courses.map(
        (course: { id: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${base}/courses/${course.id}`,
          lastModified: new Date(course.updatedAt || course.createdAt || Date.now()),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );
      return [...staticRoutes, ...blogRoutes, ...courseRoutes];
    }
  } catch {
    /* API unavailable — use static routes only */
  }

  return [...staticRoutes, ...blogRoutes];
}
