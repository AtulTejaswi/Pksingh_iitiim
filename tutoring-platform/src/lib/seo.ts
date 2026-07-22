const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const SITE_CONFIG = {
  url: siteUrl,
  apiUrl,
  name: 'PK Singh',
  fullName: 'PK Singh | Mentor, Author, IITian',
  description:
    'PK Singh is an IIT + IIM alumnus, mentor, bestselling author, and educator for JEE, NEET, SAT, CAT and GMAT aspirants.',
  locale: 'en_IN' as const,
  logo: '/images/pk_sir_logo.jpg',
};

export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  subject: string;
  examTags: string[];
  thumbnailUrl: string | null;
}

export async function fetchCourseMetadata(courseId: string): Promise<CourseMetadata | null> {
  try {
    const res = await fetch(`${apiUrl}/courses/${courseId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.course || data;
  } catch {
    return null;
  }
}
