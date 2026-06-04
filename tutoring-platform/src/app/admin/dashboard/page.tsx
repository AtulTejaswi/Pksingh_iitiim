'use client';

import React, { useMemo } from 'react';
import { useGetCourses } from '@/hooks/useCourses';
import Link from 'next/link';
import { BookOpen, Users, Plus, ListChecks, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

function StatCard({ label, value, sublabel, icon: Icon, color }: {
  label: string; value: React.ReactNode; sublabel?: string; icon: React.ComponentType<{ className?: string }>; color: { bg: string; border: string; text: string };
}) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      {sublabel && <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: courses, isLoading, error } = useGetCourses({ includeDrafts: true });

  const stats = useMemo(() => {
    if (!courses) return { total: 0, published: 0, drafts: 0, enrollments: 0, lessons: 0 };
    return {
      total: courses.length,
      published: courses.filter((c) => c.status === 'PUBLISHED').length,
      drafts: courses.filter((c) => c.status === 'DRAFT').length,
      enrollments: courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0),
      lessons: courses.reduce((sum, c) => sum + (c._count?.lessons || 0), 0),
    };
  }, [courses]);

  const recentCourses = useMemo(() => {
    if (!courses) return [];
    return [...courses]
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  }, [courses]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (error) {
    toast.error('Could not connect. Please check your internet and try again.');
  }

  return (
    <div className="w-full text-left">
      {/* Welcome Banner */}
      <div className="mb-6 p-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-blue-200/30 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">Welcome back, Admin!</h1>
          <p className="text-sm text-slate-500">{today}</p>
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
          <p className="text-sm text-red-700">We&apos;re having trouble connecting. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Published Courses"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" /> : stats.published}
          sublabel={`${stats.drafts} in draft`}
          icon={BookOpen}
          color={{ bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-600' }}
        />
        <StatCard
          label="Draft Courses"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" /> : stats.drafts}
          sublabel="Awaiting publication"
          icon={BookOpen}
          color={{ bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-600' }}
        />
        <StatCard
          label="Enrolled Students"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" /> : stats.enrollments}
          sublabel="Across all courses"
          icon={Users}
          color={{ bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-600' }}
        />
        <StatCard
          label="Total Lessons"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" /> : stats.lessons}
          sublabel={`Across ${stats.total} courses`}
          icon={ListChecks}
          color={{ bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-600' }}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add New Course</p>
              <p className="text-[10px] text-slate-400">Create a new course</p>
            </div>
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Manage Courses</p>
              <p className="text-[10px] text-slate-400">Edit, publish, or archive</p>
            </div>
          </Link>
          <Link
            href="/admin/students"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">View Students</p>
              <p className="text-[10px] text-slate-400">Manage enrollments</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Recent Activity</h2>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-500 text-sm">No courses yet. Create your first course to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCourses.map((course: any, idx: number) => (
                <Link
                  key={course.id || idx}
                  href={`/admin/courses/${course.id}/edit`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0 bg-blue-500" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{course.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {course.status === 'PUBLISHED' ? (
                          <span className="text-emerald-600">Published</span>
                        ) : course.status === 'ARCHIVED' ? (
                          <span className="text-red-600">Archived</span>
                        ) : (
                          <span className="text-yellow-600">Draft</span>
                        )}
                        {' — '}{course.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
