'use client';

import React from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useGetMyEnrollments } from '@/hooks/useCourses';
import Link from 'next/link';
import { BookOpen, GraduationCap, Play, ChevronRight } from 'lucide-react';

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useGetMyEnrollments();

  return (
    <ProtectedRoute>
      <div className="w-full">
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            My Enrolled <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-gray-400 text-sm">Resume your training modules and track your syllabus progress.</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] h-72 animate-pulse p-6 flex flex-col justify-between">
                <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gray-700/50 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : !enrollments || enrollments.length === 0 ? (
          <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
            <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">No Enrolled Courses</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              You haven't enrolled in any educational modules yet. Head over to our catalog and join any course free!
            </p>
            <Link
              href="/courses"
              className="glow-button px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold tracking-wide shadow-md transition-all inline-flex items-center gap-1.5"
            >
              Browse Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              return (
                <div
                  key={enrollment.id}
                  className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-32 bg-gradient-to-br from-indigo-900/50 to-sky-950/50 relative p-6 flex flex-col justify-between border-b border-[rgba(255,255,255,0.06)]">
                    <span className="self-start px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">
                      Enrolled
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug truncate">
                      {course.title}
                    </h3>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                      Lifetime access to syllabus lectures, media links, attached theory booklets, and progress evaluations.
                    </p>

                    <Link
                      href={`/courses/${course.id}`}
                      className="w-full py-2.5 rounded-xl glow-button bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-colors block text-center"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      Continue Learning
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
