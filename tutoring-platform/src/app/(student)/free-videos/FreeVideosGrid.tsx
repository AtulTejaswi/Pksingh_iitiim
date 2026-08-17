'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { useGetCourses } from '@/hooks/useCourses';
import { useGetCourseVideos } from '@/hooks/useCourseVideos';

// The auto-synced free course (kept in sync with the PKSir Classes channel).
const FREE_SERIES_TITLE = 'JEE is EASY — Free YouTube Series';

export default function FreeVideosGrid() {
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useGetCourses();
  const course = (courses || []).find((c) => c.title === FREE_SERIES_TITLE);
  const courseId = course?.id || '';

  const { data, isLoading: videosLoading, error: videosError } = useGetCourseVideos(courseId);

  if (coursesLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-medium">Loading videos…</p>
      </div>
    );
  }

  if (coursesError || !course) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Videos not available yet</h3>
        <p className="text-slate-500 text-sm mb-6">
          The free video series isn&apos;t published yet. Please check back soon — or browse the courses below.
        </p>
        <Link href="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">
          Browse all courses
        </Link>
      </div>
    );
  }

  const videos = data?.videos ?? [];
  const errorMessage =
    videosError && !videosLoading
      ? 'Couldn\'t load the video list. Refresh the page or try again in a minute.'
      : null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wider mb-3">
          <FaYoutube className="w-3.5 h-3.5" /> Free YouTube series
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          JEE is EASY — All {videos.length > 0 ? videos.length : ''} Videos
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
          Every lecture from the free series, in order. Click any video to watch — no sign-up, no enrollment needed.
          New videos are added automatically as they&apos;re uploaded to YouTube.
        </p>
      </div>

      {videosLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700 text-sm mb-6">
          {errorMessage}
        </div>
      )}

      {!videosLoading && videos.length === 0 && !errorMessage && (
        <div className="text-center py-16">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No videos in the series yet.</p>
        </div>
      )}

      {/* Grid */}
      {!videosLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <Link
              key={video.lessonId}
              href={`/courses/${courseId}/lessons/${video.lessonId}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={480}
                    height={270}
                    unoptimized
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <FaYoutube className="w-10 h-10 text-red-500" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:scale-110 transition-all duration-200">
                    <Play className="w-6 h-6 text-slate-900 group-hover:text-white ml-0.5" fill="currentColor" />
                  </span>
                </div>
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Free
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1.5 uppercase tracking-wide">Lesson {String(idx + 1).padStart(2, '0')} · YouTube</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold mb-1">Want the full course experience?</h3>
          <p className="text-sm text-slate-300">Enroll free to track your progress across all {videos.length} lectures.</p>
        </div>
        <Link
          href={`/courses/${courseId}`}
          className="shrink-0 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
        >
          Enroll for free →
        </Link>
      </div>
    </div>
  );
}
