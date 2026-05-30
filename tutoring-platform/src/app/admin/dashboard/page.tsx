'use client';

import React from 'react';
import { useGetCourses } from '@/hooks/useCourses';
import Link from 'next/link';
import { BookOpen, GraduationCap, LayoutDashboard, Plus, Users, Zap, ListChecks } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: courses, isLoading } = useGetCourses();

  // Derived dashboard stats
  const totalCourses = courses?.length || 0;
  const totalPublished = courses?.filter((c) => c.isPublished).length || 0;
  const totalEnrollments = courses?.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0) || 0;
  const totalLessons = courses?.reduce((sum, c) => sum + (c._count?.lessons || 0), 0) || 0;

  return (
    <div className="w-full text-left">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time status of your academic tutoring program.</p>
      </div>

      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 border border-indigo-500/20 relative overflow-hidden mb-8 shadow-xl shadow-indigo-500/10">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[150%] bg-white/5 blur-[50px] rotate-12"></div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Welcome Back, Instructor!</h2>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            Upload worksheets, add YouTube reference links, create new course subjects, and review student metrics from your control panel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/courses/new"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-indigo-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-900" /> Create Course
            </Link>
            <Link
              href="/admin/courses"
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ListChecks className="w-4 h-4" /> Manage Syllabus
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Stat 1 */}
        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-white mb-1">
            {isLoading ? <span className="inline-block w-8 h-6 bg-gray-700/50 rounded animate-pulse"></span> : totalCourses}
          </p>
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Total Courses</span>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-white mb-1">
            {isLoading ? <span className="inline-block w-8 h-6 bg-gray-700/50 rounded animate-pulse"></span> : totalEnrollments}
          </p>
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Enrolled Scholars</span>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
            <ListChecks className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-white mb-1">
            {isLoading ? <span className="inline-block w-8 h-6 bg-gray-700/50 rounded animate-pulse"></span> : totalLessons}
          </p>
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Total Lectures</span>
        </div>

        {/* Stat 4 */}
        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-white mb-1">
            {isLoading ? <span className="inline-block w-8 h-6 bg-gray-700/50 rounded animate-pulse"></span> : totalPublished}
          </p>
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Published Modules</span>
        </div>
      </div>

      {/* Subject Coverage & Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Subject Stats */}
        <div className="p-8 rounded-2xl glass-panel text-left">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" /> Subject Catalog Coverages
          </h3>
          
          <div className="space-y-4">
            {/* Physics */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>PHYSICS</span>
                <span className="font-semibold text-white">
                  {courses?.filter((c) => c.subject === 'PHYSICS').length || 0} Courses
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${
                      totalCourses > 0
                        ? ((courses?.filter((c) => c.subject === 'PHYSICS').length || 0) / totalCourses) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Chemistry */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>CHEMISTRY</span>
                <span className="font-semibold text-white">
                  {courses?.filter((c) => c.subject === 'CHEMISTRY').length || 0} Courses
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{
                    width: `${
                      totalCourses > 0
                        ? ((courses?.filter((c) => c.subject === 'CHEMISTRY').length || 0) / totalCourses) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Math */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>MATHEMATICS</span>
                <span className="font-semibold text-white">
                  {courses?.filter((c) => c.subject === 'MATH').length || 0} Courses
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      totalCourses > 0
                        ? ((courses?.filter((c) => c.subject === 'MATH').length || 0) / totalCourses) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operations tip */}
        <div className="p-8 rounded-2xl glass-panel text-left flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" /> Operations Guide
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              When creating courses or lessons, make sure they are set to "Published" to allow students to enroll and watch lectures immediately. Toggle publish states anytime in the Courses Manager table!
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-300 text-center text-sm font-semibold tracking-wide transition-colors"
          >
            Launch Courses Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
