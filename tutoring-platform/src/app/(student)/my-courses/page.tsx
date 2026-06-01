'use client';

import React from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useGetMyEnrollments } from '@/hooks/useCourses';
import Link from 'next/link';
import { BookOpen, GraduationCap, Play, ChevronRight } from 'lucide-react';

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useGetMyEnrollments(true);

  return (
    <ProtectedRoute>
      <div className="w-full">
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            My Enrolled <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-gray-400 text-sm">Resume where you left off and track your syllabus progress.</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-[rgba(255,255,255,0.08)] h-72 animate-pulse" />
            ))}
          </div>
        ) : !enrollments || enrollments.length === 0 ? (
          <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
            <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No enrolled courses yet</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Browse the catalog — you can preview free lessons without enrolling. Enroll free to unlock full courses.
            </p>
            <Link
              href="/courses"
              className="glow-button px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold inline-flex items-center gap-1.5"
            >
              Browse catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const progress = enrollment.progress;
              const resumeHref =
                progress?.resumeLessonId && course.id
                  ? `/my-courses/${course.id}/lessons/${progress.resumeLessonId}`
                  : `/courses/${course.id}`;

              return (
                <div
                  key={enrollment.id}
                  className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-32 bg-gradient-to-br from-indigo-900/50 to-sky-950/50 relative p-6 flex flex-col justify-between border-b border-[rgba(255,255,255,0.06)]">
                    <span className="self-start px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">
                      Enrolled
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug truncate">{course.title}</h3>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {progress && progress.totalLessons > 0 && (
                      <div className="mb-5">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Progress</span>
                          <span className="text-indigo-300 font-semibold">{progress.percentComplete}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all"
                            style={{ width: `${progress.percentComplete}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">
                          {progress.completedLessons} of {progress.totalLessons} lessons completed
                        </p>
                      </div>
                    )}

                    <Link
                      href={resumeHref}
                      className="w-full py-2.5 rounded-xl glow-button bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 mt-auto"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {progress?.completedLessons ? 'Continue learning' : 'Start course'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
