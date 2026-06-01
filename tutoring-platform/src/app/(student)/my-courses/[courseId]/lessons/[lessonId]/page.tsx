'use client';

import React from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useGetCourse } from '@/hooks/useCourses';
import { useGetLesson, useMarkLessonProgress } from '@/hooks/useLessons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Play, ArrowRight, ArrowLeftSquare, Download, CheckCircle, FileText, CheckCircle2, List, Video, AlertCircle } from 'lucide-react';

export default function LessonPlayerPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const router = useRouter();
  const { courseId, lessonId } = params;

  const { data: course, isLoading: isCourseLoading } = useGetCourse(courseId);
  const { data: lesson, isLoading: isLessonLoading } = useGetLesson(lessonId);
  const { mutate: markProgress, isPending: isMarking } = useMarkLessonProgress();

  const handleMarkComplete = () => {
    markProgress(lessonId, {
      onSuccess: () => {
        toast.success('Lesson marked as complete! Keep it up.');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || 'Failed to update progress');
      },
    });
  };

  if (isCourseLoading || isLessonLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Booting Lesson Player...</p>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Lesson Not Found</h3>
        <p className="text-gray-400 text-sm mb-6">This lesson module could not be loaded or is restricted.</p>
        <Link href={`/courses/${courseId}`} className="text-indigo-400 hover:text-white font-semibold">
          Return to Syllabus
        </Link>
      </div>
    );
  }

  // Get index and adjacent lessons for next/prev navigation
  const currentIdx = course.lessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIdx > 0 ? course.lessons?.[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < (course.lessons?.length ?? 0) - 1 
    ? course.lessons?.[currentIdx + 1] 
    : null;

  // Find a video resource to play
  const videoResource = lesson.media?.find(
    (m) => m.type === 'VIDEO' || m.type === 'YOUTUBE_LINK'
  );

  // Helper to extract YouTube video ID if URL is Youtube
  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <ProtectedRoute>
      <div className="w-full">
        {/* Back Link */}
        <Link
          href={`/courses/${courseId}`}
          className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors self-start w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Syllabus details
        </Link>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video & Content Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Player Box */}
            {videoResource ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[rgba(255,255,255,0.08)] shadow-2xl relative">
                {videoResource.type === 'YOUTUBE_LINK' ? (
                  <iframe
                    src={getYoutubeEmbedUrl(videoResource.url)}
                    title={videoResource.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
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
              <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-indigo-950/20 to-sky-950/20 border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center p-8 text-center shadow-lg">
                <Video className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-2">Reading Assignment Module</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  There is no lecture recording linked for this lesson. Please explore the written course notes and worksheets below!
                </p>
              </div>
            )}

            {/* Lesson Info Header */}
            <div className="p-8 rounded-2xl glass-panel text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                {lesson.title}
              </h1>
              <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
                Lecture Module {currentIdx + 1} of {course.lessons?.length || 0}
              </p>
              
              {lesson.description && (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line pb-6 border-b border-[rgba(255,255,255,0.06)] mb-6">
                  {lesson.description}
                </p>
              )}

              {/* Lesson body text markdown content if any */}
              {lesson.content && (
                <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed mb-6">
                  <h3 className="text-white font-bold mb-3 text-base">Lesson Outline & Material Notes</h3>
                  <div className="bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-[rgba(255,255,255,0.04)] whitespace-pre-line">
                    {lesson.content}
                  </div>
                </div>
              )}

              {/* Progress Completion Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-gray-300 text-xs sm:text-sm">Have you parsed this lecture material and solved related problem sets?</p>
                </div>
                <button
                  onClick={handleMarkComplete}
                  disabled={isMarking}
                  className="glow-button px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all shrink-0"
                >
                  {isMarking ? 'Updating...' : 'Mark Done'}
                </button>
              </div>
            </div>

            {/* Resources / Notes Downloads List */}
            {(lesson.media?.some((m) => m.type === 'PDF') || (lesson.notes && lesson.notes.length > 0)) && (
              <div className="p-8 rounded-2xl glass-panel text-left">
                <h2 className="text-xl font-bold text-white mb-6">Downloadable Theory Booklets & Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Media PDF Files */}
                  {lesson.media
                    ?.filter((m) => m.type === 'PDF')
                    .map((mediaFile) => (
                      <a
                        key={mediaFile.id}
                        href={mediaFile.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-indigo-500/20 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-white font-semibold text-xs leading-tight truncate group-hover:text-indigo-400 transition-colors">
                              {mediaFile.title}
                            </p>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5 block">Worksheet PDF</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    ))}

                  {/* Notes PDF Files */}
                  {lesson.notes?.map((noteFile) => (
                    <div
                      key={noteFile.id}
                      className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] flex flex-col justify-between text-left"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-xs leading-tight">
                            {noteFile.title}
                          </p>
                          <span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5 block">Instructor Note</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
                        {noteFile.content}
                      </p>
                      {noteFile.fileUrl && (
                        <a
                          href={noteFile.fileUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500 hover:text-white text-pink-400 text-[10px] font-bold uppercase tracking-wider transition-all text-center w-full block mt-auto"
                        >
                          Download Attachment PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              {prevLesson ? (
                <Link
                  href={`/my-courses/${courseId}/lessons/${prevLesson.id}`}
                  className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] text-gray-300 text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Lecture
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/my-courses/${courseId}/lessons/${nextLesson.id}`}
                  className="px-5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-300 text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all"
                >
                  Next Lecture <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Right Sidebar: Syllabus outline list */}
          <div className="lg:col-span-4 sticky top-24 space-y-6 text-left">
            <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                <List className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Course Syllabus</h3>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {course.lessons?.map((outlineLesson, idx) => {
                  const isActive = outlineLesson.id === lessonId;
                  return (
                    <Link
                      key={outlineLesson.id}
                      href={`/my-courses/${courseId}/lessons/${outlineLesson.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left block w-full group ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5'
                          : 'border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.12)] text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-[rgba(255,255,255,0.05)] text-gray-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden pr-2">
                        <p className={`text-xs font-semibold leading-snug truncate ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {outlineLesson.title}
                        </p>
                      </div>
                      {outlineLesson.isFree && !isActive && (
                        <span className="ml-auto text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wide">
                          Free
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
