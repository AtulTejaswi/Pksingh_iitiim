import type { Metadata } from 'next';
import { SITE_CONFIG, fetchCourseMetadata } from '@/lib/seo';
import CourseDetailClient from './CourseDetailClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await fetchCourseMetadata(id);
  if (!course) {
    return { title: 'Course Not Found' };
  }
  return {
    title: course.title,
    description: course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.description.slice(0, 160),
      url: `${SITE_CONFIG.url}/courses/${id}`,
      images: course.thumbnailUrl
        ? [{ url: course.thumbnailUrl, width: 1200, height: 630 }]
        : [{ url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`, width: 1200, height: 630 }],
    },
  };
}

export default function Page({ params }: Props) {
  return <CourseDetailClient params={params} />;
}
