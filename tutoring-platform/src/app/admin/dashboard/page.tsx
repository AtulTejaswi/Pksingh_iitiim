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
    <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-white mb-0.5">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      {sublabel && <p className="text-[10px] text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: courses, isLoading, error } = useGetCourses({ includeDrafts: true });

  const stats = useMemo(() => {
    if (!courses) return { total: 0, published: 0, drafts: 0, enrollments: 0, lessons: 0 };
    return {
      total: courses.length,
      published: courses.filter((c) => c.isPublished).length,
      drafts: courses.filter((c) => !c.isPublished).length,
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
      <div className="mb-6 p-6 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/20 to-sky-600/10 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">Welcome back, Admin!</h1>
          <p className="text-sm text-gray-400">{today}</p>
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-300">We&apos;re having trouble connecting. Please refresh the page.</p>
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
          value={isLoading ? <span className="inline-block w-8 h-7 bg-gray-700/50 rounded animate-pulse" /> : stats.published}
          sublabel={`${stats.drafts} in draft`}
          icon={BookOpen}
          color={{ bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' }}
        />
        <StatCard
          label="Draft Courses"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-gray-700/50 rounded animate-pulse" /> : stats.drafts}
          sublabel="Awaiting publication"
          icon={BookOpen}
          color={{ bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' }}
        />
        <StatCard
          label="Enrolled Students"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-gray-700/50 rounded animate-pulse" /> : stats.enrollments}
          sublabel="Across all courses"
          icon={Users}
          color={{ bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' }}
        />
        <StatCard
          label="Total Lessons"
          value={isLoading ? <span className="inline-block w-8 h-7 bg-gray-700/50 rounded animate-pulse" /> : stats.lessons}
          sublabel={`Across ${stats.total} courses`}
          icon={ListChecks}
          color={{ bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' }}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Add New Course</p>
              <p className="text-[10px] text-gray-500">Create a new course</p>
            </div>
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Manage Courses</p>
              <p className="text-[10px] text-gray-500">Edit, publish, or archive</p>
            </div>
          </Link>
          <Link
            href="/admin/students"
            className="flex items-center gap-3 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">View Students</p>
              <p className="text-[10px] text-gray-500">Manage enrollments</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Recent Activity</h2>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-700/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 text-sm">No courses yet. Create your first course to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {recentCourses.map((course: any, idx: number) => (
                <Link
                  key={course.id || idx}
                  href={`/admin/courses/${course.id}/edit`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0 bg-indigo-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{course.title}</p>
                      <p className="text-[10px] text-gray-500">
                        {course.isPublished ? (
                          <span className="text-emerald-400">Published</span>
                        ) : (
                          <span className="text-yellow-400">Draft</span>
                        )}
                        {' — '}{course.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
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
