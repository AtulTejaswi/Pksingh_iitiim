import { NextResponse } from 'next/server';
import { SITE_STATS } from '@/data/site-config';
import { staticCourses } from '@/data/courseData';

export async function GET() {
  return NextResponse.json({
    stats: {
      students: SITE_STATS.learnersMentored,
      publishedCourses: staticCourses.length,
      publishedLessons: SITE_STATS.lessonModules,
      enrollments: SITE_STATS.learnersMentored,
    },
  });
}
