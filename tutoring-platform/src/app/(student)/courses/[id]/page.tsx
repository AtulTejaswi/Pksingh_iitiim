'use client';

import React, { use } from 'react';
import { useGetCourse, useEnrollCourse, useGetMyEnrollments } from '@/hooks/useCourses';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Users, Play, Award, Download, Lock, AlertTriangle } from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Unwrap promise params in Next.js 15+ compatible way
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const { data: course, isLoading: isCourseLoading } = useGetCourse(courseId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
  const { data: myEnrollments, isLoading: isEnrollmentsLoading } = useGetMyEnrollments();

  const isEnrolled = myEnrollments?.some((enrollment) => enrollment.course.id === courseId) || false;

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

  if (isCourseLoading || isEnrollmentsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Loading Course Details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 rounded-2xl glass-panel">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Course not found.</p>
        <Link href="/courses" className="mt-4 inline-flex text-indigo-400 hover:text-white text-sm font-semibold">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Get the first lesson to redirect "Go to Course" button
  const firstLessonId = course.lessons && course.lessons.length > 0 ? course.lessons[0].id : null;

  return (
    <div className="w-full">
      {/* Back button */}
      <Link
        href="/courses"
        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-8 transition-colors self-start w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Main Course Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left column: Banner & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Visual card header */}
          <div className={`rounded-2xl p-8 relative overflow-hidden ${
            course.subject === 'PHYSICS' ? 'from-purple-950/70 to-indigo-905/70' :
            course.subject === 'CHEMISTRY' ? 'from-sky-950/70 to-blue-905/70' :
            'from-emerald-950/70 to-cyan-905/70'
          } bg-gradient-to-br border border-[rgba(255,255,255,0.08)] min-h-[220px] flex flex-col justify-between`}>
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-white/5 blur-[50px]"></div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                {course.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
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
                    className="px-2 py-0.5 rounded bg-black/30 border border-white/5 text-gray-300 text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 rounded-2xl glass-panel text-left">
            <h2 className="text-xl font-bold text-white mb-4">About This Course</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Curriculum / Lessons Outline */}
          <div className="p-8 rounded-2xl glass-panel text-left">
            <h2 className="text-xl font-bold text-white mb-6">Course Syllabus & Outline</h2>
            
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-indigo-500/20 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-indigo-400 transition-colors">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1">
                          <span className="inline-flex items-center gap-1">
                            {lesson.isFree ? (
                              <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wide">Free Preview</span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5"><Lock className="w-3 h-3" /> Enrolled Access</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isEnrolled && firstLessonId ? (
                      <Link
                        href={`/my-courses/${courseId}/lessons/${lesson.id}`}
                        className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </Link>
                    ) : (
                      lesson.isFree && firstLessonId ? (
                        <Link
                          href={`/my-courses/${courseId}/lessons/${lesson.id}`}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-wider"
                        >
                          Preview
                        </Link>
                      ) : (
                        <div className="text-gray-500">
                          <Lock className="w-4 h-4" />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
                <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Syllabus is being finalized. Lessons will appear shortly!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Action Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 rounded-2xl glass-panel relative overflow-hidden text-left border border-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent"></div>
            
            <h3 className="text-lg font-bold text-white mb-4">Join PK Singh's Program</h3>

            {isEnrolled ? (
              <Link
                href={firstLessonId ? `/my-courses/${courseId}/lessons/${firstLessonId}` : '#'}
                className="w-full py-3 rounded-xl glow-button bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all block text-center"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-3 rounded-xl glow-button bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="space-y-4 text-xs mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Syllabus Size</span>
                <span className="font-semibold text-white">{course.lessons?.length || 0} Lecture modules</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-400" /> Community Enrolled</span>
                <span className="font-semibold text-white">{course._count?.enrollments || 0} active student researchers</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-400 mt-4 leading-normal">
                <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Gain complete lifetime access to all worksheets and derived notes immediately upon joining.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
