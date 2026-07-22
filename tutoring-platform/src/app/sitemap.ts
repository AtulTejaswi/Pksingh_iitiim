import type { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';

  const staticRoutes = [
    { url: `${base}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/courses`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/mentor-journey`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${base}/support`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  try {
    const res = await fetch(`${API_URL}/courses`);
    const data = await res.json();
    const courses = data.courses || data;
    if (Array.isArray(courses)) {
      const courseRoutes = courses.map((course: any) => ({
        url: `${base}/courses/${course.id}`,
        lastModified: new Date(course.updatedAt || course.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...courseRoutes];
    }
  } catch {}

  return staticRoutes;
}
