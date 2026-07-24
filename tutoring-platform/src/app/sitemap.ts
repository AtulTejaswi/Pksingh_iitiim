import type { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Blog slugs — keep in sync with src/app/blog/[slug]/page.tsx
const blogSlugs = [
  'jee-2027-physics-syllabus-breakdown',
  'neet-weightage-chapter-wise',
  'how-to-build-a-study-timetable',
  'sat-vs-cat-which-exam-fits-you',
  '5-memory-techniques-for-organic-chemistry',
  'ashtavakra-gita-lesson-on-exam-anxiety',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mentor-journey`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  try {
    const res = await fetch(`${API_URL}/courses`);
    const data = await res.json();
    const courses = data.courses || data;
    if (Array.isArray(courses)) {
      const courseRoutes: MetadataRoute.Sitemap = courses.map((course: { id: string; updatedAt?: string; createdAt?: string }) => ({
        url: `${base}/courses/${course.id}`,
        lastModified: new Date(course.updatedAt || course.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...blogRoutes, ...courseRoutes];
    }
  } catch { /* API unavailable — use static routes only */ }

  return [...staticRoutes, ...blogRoutes];
}
