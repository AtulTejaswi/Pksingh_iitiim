import { NextResponse } from 'next/server';
import { staticCourses } from '@/data/courseData';

const lessonTotal = staticCourses.reduce((sum, c) => sum + (c.lessonCount || 0), 0);

// Confirmed business numbers only. No fabricated marketing figures — with env
// vars unset, students/enrollments report 0 so the UI shows honest states.
const confirmedStudents = Number(process.env.NEXT_PUBLIC_LEARNERS_MENTORED) || 0;

export async function GET() {
  return NextResponse.json({
    stats: {
      students: confirmedStudents,
      publishedCourses: staticCourses.length,
      publishedLessons: lessonTotal,
      enrollments: 0,
    },
  });
}
