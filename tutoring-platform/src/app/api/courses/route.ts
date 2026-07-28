import { NextResponse } from 'next/server';
import { staticCourses } from '@/data/courseData';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || 'https://pksingh-backend.onrender.com/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const examTag = searchParams.get('examTag');

  try {
    const res = await fetch(`${BACKEND_API}/courses?${searchParams.toString()}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  let filtered = staticCourses;
  if (subject) filtered = filtered.filter((c) => c.subject === subject);
  if (examTag) filtered = filtered.filter((c) => c.examTags.includes(examTag));

  return NextResponse.json({ courses: filtered });
}
