import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh.netlify.app';
  const routes = ['', '/about', '/courses', '/mentor-journey', '/privacy', '/terms', '/support', '/login', '/signup'];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/courses' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
