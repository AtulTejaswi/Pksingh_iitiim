'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useGetCourse } from '@/hooks/useCourses';
import { useGetLesson, useMarkLessonProgress } from '@/hooks/useLessons';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle,
  FileText,
  List,
  Video,
  AlertCircle,
  Lock,
} from 'lucide-react';

export type LessonPlayerMode = 'public' | 'enrolled';

interface LessonPlayerProps {
  courseId: string;
  lessonId: string;
  mode: LessonPlayerMode;
}

function lessonPath(courseId: string, lessonId: string, mode: LessonPlayerMode) {
  const base = mode === 'public' ? '/courses' : '/my-courses';
  return `${base}/${courseId}/lessons/${lessonId}`;
}

function getYoutubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

export default function LessonPlayer({ courseId, lessonId, mode }: LessonPlayerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: course, isLoading: isCourseLoading } = useGetCourse(courseId);
  const { data: lesson, isLoading: isLessonLoading, error: lessonError } = useGetLesson(lessonId);
  const { mutate: markProgress, isPending: isMarking } = useMarkLessonProgress();

  const handleMarkComplete = () => {
    if (!user) {
      toast.error('Sign in to track your progress');
      router.push(`/login?redirect=${encodeURIComponent(lessonPath(courseId, lessonId, mode))}`);
      return;
    }
    markProgress(lessonId, {
      onSuccess: () => toast.success('Lesson marked as complete!'),
      onError: (err: { response?: { data?: { error?: string } } }) => {
        toast.error(err.response?.data?.error || 'Failed to update progress');
      },
    });
  };

  if (isCourseLoading || isLessonLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 font-medium">Loading lesson...</p>
      </div>
    );
  }

  if (!course || !lesson) {
    const errMsg = (lessonError as { response?: { data?: { error?: string } } })?.response?.data?.error;
    return (
      <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Lesson unavailable</h3>
        <p className="text-gray-400 text-sm mb-6">
          {errMsg || 'This lesson could not be loaded. Free previews are open to everyone; other lessons require enrollment.'}
        </p>
        <Link href={`/courses/${courseId}`} className="text-indigo-400 hover:text-white font-semibold">
          Back to course
        </Link>
      </div>
    );
  }

  const currentIdx = course.lessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIdx > 0 ? course.lessons?.[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < (course.lessons?.length ?? 0) - 1
      ? course.lessons?.[currentIdx + 1]
      : null;

  const videoResource = lesson.media?.find((m) => m.type === 'VIDEO' || m.type === 'YOUTUBE_LINK');

  const canOpenLesson = (l: { id: string; isFree?: boolean }) => {
    if (mode === 'enrolled') return true;
    return Boolean(l.isFree);
  };

  return (
    <div className="w-full">
      <Link
        href={`/courses/${courseId}`}
        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to course
      </Link>

      {mode === 'public' && !lesson.isFree && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm">
          This is a preview area. Enroll for free to unlock all lessons in this course.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {videoResource ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[rgba(255,255,255,0.08)] shadow-2xl">
              {videoResource.type === 'YOUTUBE_LINK' ? (
                <iframe
                  src={getYoutubeEmbedUrl(videoResource.url)}
                  title={videoResource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  src={videoResource.url}
                  className="w-full h-full object-contain"
                  poster={course.thumbnailUrl || undefined}
                />
              )}
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-indigo-950/20 to-sky-950/20 border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center p-8 text-center">
              <Video className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Reading module</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                No video is linked for this lesson. Review the notes and downloads below.
              </p>
            </div>
          )}

          <div className="p-8 rounded-2xl glass-panel text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">{lesson.title}</h1>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Lesson {currentIdx + 1} of {course.lessons?.length || 0}
              {lesson.isFree && (
                <span className="ml-2 text-emerald-400">· Free preview</span>
              )}
            </p>

            {lesson.description && (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line pb-6 border-b border-[rgba(255,255,255,0.06)] mb-6">
                {lesson.description}
              </p>
            )}

            {lesson.content && (
              <div className="text-gray-300 text-sm leading-relaxed mb-6">
                <h3 className="text-white font-bold mb-3 text-base">Lesson notes</h3>
                <div className="bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-[rgba(255,255,255,0.04)] whitespace-pre-line">
                  {lesson.content}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm">Finished this lesson?</p>
              </div>
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={isMarking}
                className="glow-button px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase disabled:opacity-50"
              >
                {isMarking ? 'Saving...' : user ? 'Mark complete' : 'Sign in to track'}
              </button>
            </div>
          </div>

          {(lesson.media?.some((m) => m.type === 'PDF') || (lesson.notes && lesson.notes.length > 0)) && (
            <div className="p-8 rounded-2xl glass-panel text-left">
              <h2 className="text-xl font-bold text-white mb-6">Downloads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.media
                  ?.filter((m) => m.type === 'PDF')
                  .map((mediaFile) => (
                    <a
                      key={mediaFile.id}
                      href={mediaFile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-indigo-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                        <span className="text-white font-semibold text-xs truncate">{mediaFile.title}</span>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 shrink-0" />
                    </a>
                  ))}
                {lesson.notes?.map((noteFile) => (
                  <div
                    key={noteFile.id}
                    className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
                  >
                    <p className="text-white font-semibold text-xs mb-2">{noteFile.title}</p>
                    <p className="text-gray-400 text-xs line-clamp-3 mb-3">{noteFile.content}</p>
                    {noteFile.fileUrl && (
                      <a
                        href={noteFile.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 text-[10px] font-bold uppercase"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            {prevLesson && canOpenLesson(prevLesson) ? (
              <Link
                href={lessonPath(courseId, prevLesson.id, mode)}
                className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-gray-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </Link>
            ) : (
              <div />
            )}
            {nextLesson && canOpenLesson(nextLesson) ? (
              <Link
                href={lessonPath(courseId, nextLesson.id, mode)}
                className="px-5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-24">
          <div className="p-6 rounded-2xl glass-panel">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
              <List className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Syllabus</h3>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
              {course.lessons?.map((outlineLesson, idx) => {
                const isActive = outlineLesson.id === lessonId;
                const open = canOpenLesson(outlineLesson);
                return open ? (
                  <Link
                    key={outlineLesson.id}
                    href={lessonPath(courseId, outlineLesson.id, mode)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-[rgba(255,255,255,0.04)] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center bg-indigo-500/20">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold truncate">{outlineLesson.title}</span>
                    {outlineLesson.isFree && (
                      <span className="ml-auto text-[8px] text-emerald-400 uppercase">Free</span>
                    )}
                  </Link>
                ) : (
                  <div
                    key={outlineLesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.04)] text-gray-500 opacity-70"
                  >
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center bg-gray-800">
                      {idx + 1}
                    </span>
                    <span className="text-xs truncate flex-1">{outlineLesson.title}</span>
                    <Lock className="w-3 h-3 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
