'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, GraduationCap, Sparkles } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { useGetCourses } from '@/hooks/useCourses';

// The auto-synced free course (kept in sync with the PKSir Classes channel).
const FREE_SERIES_TITLE = 'JEE is EASY — Free YouTube Series';
const FALLBACK_LESSON_COUNT = 20;

/**
 * Prominent full-width banner for the free "JEE is EASY" YouTube series.
 * Uses the live course (so the lesson count stays accurate as the daily
 * YouTube sync adds new videos) and links to the /free-videos grid.
 */
export default function FreeSeriesBanner() {
  const { data: courses } = useGetCourses();
  const course = (courses || []).find((c) => c.title === FREE_SERIES_TITLE);
  const lessonCount = course?._count?.lessons ?? FALLBACK_LESSON_COUNT;
  const thumbnail = course?.thumbnailUrl;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" aria-label="Free JEE is EASY video series">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-warm-lg border border-slate-700/50">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-500/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-red-500/15 blur-[100px]" />

          <div className="relative z-10 grid items-center gap-10 p-8 sm:p-12 md:grid-cols-[1.2fr_1fr] lg:p-16">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-pill border border-red-400/40 bg-red-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-red-300 mb-5">
                <FaYoutube className="w-4 h-4" />
                100% Free · No sign-up needed
              </div>

              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                JEE is <span className="text-brand-400">EASY</span> — watch the
                full video series free
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {lessonCount}{' '}complete lectures from the PKSir Classes channel — Units &amp;
                Dimensions, Motion, Rotational Dynamics, Nuclear Physics, Wave Optics and more.
                New videos are added automatically as they&apos;re uploaded.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/free-videos"
                  className="inline-flex items-center gap-2.5 rounded-pill bg-red-600 px-7 py-3.5 font-semibold text-white shadow-warm-md transition-all duration-300 hover:bg-red-500 hover:-translate-y-0.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
                  </span>
                  Watch all videos
                </Link>
                {course && (
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                  >
                    <GraduationCap className="w-4.5 h-4.5" />
                    Course page
                  </Link>
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-400" /> {lessonCount} lectures
                </span>
                <span className="flex items-center gap-1.5">
                  <FaYoutube className="w-4 h-4 text-red-400" /> Streams on YouTube
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-400" /> Free for everyone
                </span>
              </div>
            </div>

            {/* Visual: thumbnail with play button */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 -rotate-3 rounded-[24px] bg-gradient-to-br from-brand-500 to-red-600 opacity-80" />
              <div className="relative aspect-video overflow-hidden rounded-[24px] border border-white/15 shadow-warm-lg">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt="JEE is EASY — Free YouTube Series"
                    width={640}
                    height={360}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <FaYoutube className="h-12 w-12 text-red-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Link
                  href="/free-videos"
                  aria-label="Watch all free JEE is EASY videos"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-7 w-7 text-white sm:h-8 sm:w-8" fill="currentColor" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
