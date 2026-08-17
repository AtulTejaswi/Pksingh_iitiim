import type { Metadata } from 'next';
import { Suspense } from 'react';
import FreeVideosGrid from './FreeVideosGrid';

export const metadata: Metadata = {
  title: 'Free JEE is EASY Videos — Watch All Lectures',
  description:
    'Watch every lecture from the free JEE is EASY YouTube series by PK Singh — Units & Dimensions, Motion in 1D, Rotational Dynamics, Nuclear Physics, Wave Optics, Electromagnetic Waves and Gravitation. Free for everyone.',
  openGraph: {
    title: 'Free JEE is EASY Videos | PK Singh',
    description: 'Watch all the free JEE is EASY lectures, one click each.',
  },
};

function GridLoading() {
  return (
    <div className="w-full">
      <div className="h-10 w-72 bg-slate-200 rounded animate-pulse mb-3" />
      <div className="h-5 w-96 bg-slate-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function FreeVideosPage() {
  return (
    <Suspense fallback={<GridLoading />}>
      <FreeVideosGrid />
    </Suspense>
  );
}
