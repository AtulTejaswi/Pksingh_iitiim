import { Suspense } from 'react';
import CoursesCatalog from './CoursesCatalog';

function CoursesLoading() {
  return (
    <div className="w-full">
      <div className="h-10 w-64 bg-slate-800/50 rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-2xl bg-slate-800/30 animate-pulse" />
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
