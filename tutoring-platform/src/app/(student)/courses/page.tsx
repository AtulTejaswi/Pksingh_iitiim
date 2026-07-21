import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesCatalog from './CoursesCatalog';

export const metadata: Metadata = {
  title: 'Free JEE, NEET & Competitive Exam Courses',
  description:
    'Browse free courses for JEE Main & Advanced, NEET, SAT, CAT and GMAT. Learn Physics, Chemistry and Math from IIT + IIM alumnus PK Singh.',
  openGraph: {
    title: 'Free JEE, NEET & Competitive Exam Courses | PK Singh',
    description: 'Browse free courses taught by IIT + IIM alumnus PK Singh.',
  },
};

function CoursesLoading() {
  return (
    <div className="w-full">
      <div className="h-10 w-64 bg-slate-200 rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesLoading />}>
      <CoursesCatalog />
    </Suspense>
  );
}
