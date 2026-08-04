import { API_BASE_URL, SITE_URL } from '@/lib/config';
import { fetchBackend } from '@/lib/backend-fetch';

export const SITE_CONFIG = {
  url: SITE_URL,
  apiUrl: API_BASE_URL,
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
    const res = await fetchBackend(`/courses/${courseId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.course || data;
  } catch {
    return null;
  }
}
