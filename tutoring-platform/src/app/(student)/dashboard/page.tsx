'use client';

import React from 'react';
import { Play, BookOpen, ChevronRight, GraduationCap, Flame, Clock } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import WeeklyDigestToggle from '@/components/common/WeeklyDigestToggle';
import { useAuth } from '@/lib/auth-context';
import { useGetMyEnrollments } from '@/hooks/useCourses';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: enrollments, isLoading } = useGetMyEnrollments(true);

  const firstName = user?.fullName?.trim().split(' ')[0] || 'Student';

  const lessonsCompleted = (enrollments || []).reduce(
    (sum, e) => sum + (e.progress?.completedLessons || 0),
    0
  );
  const inProgressCount = (enrollments || []).filter(
    (e) => e.progress && e.progress.completedLessons > 0 && e.progress.percentComplete < 100
  ).length;

  const continueEnrollment = (enrollments || []).find(
    (e) => e.progress && e.progress.completedLessons > 0
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 w-full">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>

          <div className="max-w-3xl relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
            <p className="text-blue-100 text-lg mb-8">Your enrolled courses and progress are shown below.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <BookOpen className="text-blue-300 mb-2" size={24} />
                <div className="text-2xl font-bold">{enrollments?.length ?? '—'}</div>
                <div className="text-sm text-blue-200">Enrolled courses</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <Clock className="text-emerald-300 mb-2" size={24} />
                <div className="text-2xl font-bold">{lessonsCompleted}</div>
                <div className="text-sm text-blue-200">Lessons completed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <Flame className="text-amber-300 mb-2" size={24} />
                <div className="text-2xl font-bold">{inProgressCount}</div>
                <div className="text-sm text-blue-200">In progress</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            {continueEnrollment && !isLoading && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Continue Learning</h2>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                  <div className="h-36 w-full md:w-64 bg-slate-100 rounded-2xl flex-shrink-0 border border-slate-200 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" size={48} />
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {continueEnrollment.course.subject}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{continueEnrollment.course.title}</h3>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-700">{continueEnrollment.progress?.percentComplete || 0}% Completed</span>
                        <span className="text-slate-500">
                          {continueEnrollment.progress?.completedLessons || 0}/{continueEnrollment.progress?.totalLessons || 0} Lessons
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${continueEnrollment.progress?.percentComplete || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <Link
                      href={
                        continueEnrollment.progress?.resumeLessonId && continueEnrollment.course.id
                          ? `/my-courses/${continueEnrollment.course.id}/lessons/${continueEnrollment.progress.resumeLessonId}`
                          : `/courses/${continueEnrollment.course.id}`
                      }
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm"
                    >
                      Resume
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Enrolled Courses */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
                <Link href="/my-courses" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white h-64 animate-pulse" />
                  ))}
                </div>
              ) : !enrollments || enrollments.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-slate-200 bg-white">
                  <GraduationCap className="w-14 h-14 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No enrolled courses yet</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                    Browse the catalog and enroll free to unlock full courses and start tracking progress.
                  </p>
                  <Link
                    href="/courses"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center gap-1.5"
                  >
                    Browse catalog <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {enrollments.slice(0, 4).map((enrollment) => {
                    const course = enrollment.course;
                    const progress = enrollment.progress;
                    return (
                      <Link
                        key={enrollment.id}
                        href={progress?.resumeLessonId ? `/my-courses/${course.id}/lessons/${progress.resumeLessonId}` : `/courses/${course.id}`}
                        className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col"
                      >
                        <div className="h-32 bg-gradient-to-br from-blue-600 to-violet-600 relative p-5 flex flex-col justify-between">
                          <span className="self-start px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[9px] font-bold uppercase tracking-wider">
                            {course.subject}
                          </span>
                          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">{course.title}</h3>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          {progress && progress.totalLessons > 0 ? (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs text-slate-500 mb-2">
                                <span>Progress</span>
                                <span className="text-blue-600 font-semibold">{progress.percentComplete}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                                  style={{ width: `${progress.percentComplete}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2">
                                {progress.completedLessons} of {progress.totalLessons} lessons completed
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 mb-4">Not started yet — open the course to begin.</p>
                          )}
                          <span className="mt-auto text-xs font-bold text-indigo-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            <Play className="w-3 h-3 fill-current" /> {progress?.completedLessons ? 'Continue' : 'Start'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <WeeklyDigestToggle />

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Need help?</h2>
              <p className="text-sm text-slate-500 mb-5">
                Stuck on a lesson or have a doubt? Get support from the team or browse the FAQ.
              </p>
              <div className="space-y-3">
                <Link
                  href="/support"
                  className="block w-full py-3 text-center rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="block w-full py-3 text-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
