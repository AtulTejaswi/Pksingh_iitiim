'use client';

import React, { use } from 'react';
import { useGetCourse, useEnrollCourse, useGetMyEnrollments } from '@/hooks/useCourses';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Users, Play, Award, Lock, AlertTriangle } from 'lucide-react';
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export default function CourseDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, verified } = useAuth();
  const { id: courseId } = use(params);

  const { data: course, isLoading: isCourseLoading, isError, refetch } = useGetCourse(courseId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
  const { data: myEnrollments, isLoading: isEnrollmentsLoading } = useGetMyEnrollments(!!user && verified);

  const isEnrolled = user
    ? myEnrollments?.some((enrollment) => enrollment.course.id === courseId) || false
    : false;

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please sign in to enroll in this course');
      router.push('/login');
      return;
    }

    enroll(courseId, {
      onSuccess: () => {
        toast.success('Successfully enrolled! Let\'s begin training.');
        router.push('/my-courses');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || 'Failed to enroll');
      },
    });
  };

  if (isCourseLoading || (user && isEnrollmentsLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading Course Details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 rounded-2xl glass-panel">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">{isError ? 'Failed to load course. Please try again.' : 'Course not found.'}</p>
        {isError ? (
          <button onClick={() => refetch()} className="mt-4 inline-flex text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Try Again
          </button>
        ) : (
          <Link href="/courses" className="mt-4 inline-flex text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Back to Courses
          </Link>
        )}
      </div>
    );
  }

  const firstLessonId = course.lessons && course.lessons.length > 0 ? course.lessons[0].id : null;

  return (
    <div className="w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Courses', url: '/courses' },
          { name: course.title, url: `/courses/${courseId}` },
        ]}
      />
      <CourseJsonLd
        title={course.title}
        description={course.description}
        courseId={courseId}
        subject={course.subject}
        examTags={course.examTags}
      />

      <Link
        href="/courses"
        className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm mb-8 transition-colors self-start w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        <div className="lg:col-span-8 space-y-8">
          <div className={`rounded-2xl p-8 relative overflow-hidden ${
            course.subject === 'PHYSICS' ? 'from-blue-600 to-violet-700' :
            course.subject === 'CHEMISTRY' ? 'from-sky-600 to-blue-700' :
            'from-emerald-600 to-teal-700'
          } bg-gradient-to-br border border-slate-200 min-h-[220px] flex flex-col justify-between shadow-sm`}>
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-white/10 blur-[50px]"></div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
                {course.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
                100% Free Course
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
                {course.title}
              </h1>
              <div className="flex flex-wrap gap-1.5">
                {course.examTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-black/20 border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl glass-panel text-left">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About This Course</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-panel text-left">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Course Syllabus & Outline</h2>

            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-all flex items-center justify-between gap-4 group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1">
                          <span className="inline-flex items-center gap-1">
                            {lesson.isFree ? (
                              <span className="text-emerald-600 font-bold uppercase text-[9px] tracking-wide">Free Preview</span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5"><Lock className="w-3 h-3" /> Enrolled Access</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isEnrolled ? (
                      <Link
                        href={`/my-courses/${courseId}/lessons/${lesson.id}`}
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </Link>
                    ) : lesson.isFree ? (
                      <Link
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-wider"
                      >
                        Preview
                      </Link>
                    ) : (
                      <div className="text-slate-300" title="Sign in and enroll to unlock">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Syllabus is being finalized. Lessons will appear shortly!</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent"></div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Join PK Singh's Program</h3>

            {isEnrolled ? (
              <Link
                href={firstLessonId ? `/my-courses/${courseId}/lessons/${firstLessonId}` : '#'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all block text-center"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnrolling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Enrolling...
                  </>
                ) : (
                  'Enroll for Free'
                )}
              </button>
            )}

            <div className="space-y-4 text-xs mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> Syllabus Size</span>
                <span className="font-semibold text-slate-900">{course.lessons?.length || 0} Lecture modules</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-500" /> Community Enrolled</span>
                <span className="font-semibold text-slate-900">{course._count?.enrollments || 0} active student researchers</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-400 mt-4 leading-normal">
                <Award className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Gain complete lifetime access to all worksheets and derived notes immediately upon joining.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
