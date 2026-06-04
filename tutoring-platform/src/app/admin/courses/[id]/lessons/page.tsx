'use client';

import React, { useState, use } from 'react';
import { useGetCourse } from '@/hooks/useCourses';
import { useDeleteLesson } from '@/hooks/useLessons';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import LessonResourcesPanel from '@/components/admin/LessonResourcesPanel';

export default function AdminLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const { data: course, isLoading } = useGetCourse(courseId);
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson();
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const handleDeleteLesson = (id: string, title: string) => {
    if (window.confirm(`Delete lesson "${title}"? This removes all attached files and notes.`)) {
      deleteLesson(
        { id, courseId },
        {
          onSuccess: () => {
            toast.success('Lesson deleted');
            if (expandedLessonId === id) setExpandedLessonId(null);
          },
          onError: (err: { response?: { data?: { error?: string } } }) => {
            toast.error(err.response?.data?.error || 'Failed to delete lesson');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 rounded-2xl glass-panel">
        <p className="text-slate-500 text-lg">Course not found.</p>
        <Link href="/admin/courses" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Back to courses
        </Link>
      </div>
    );
  }

  const lessons = course.lessons ?? [];

  return (
    <div className="w-full text-left">
      <Link
        href="/admin/courses"
        className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm mb-6 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase">
            {course.subject}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Course content: {course.title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Add lessons, then expand each lesson to upload PDFs, videos, YouTube links, and notes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
          >
            Course settings
          </Link>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add lesson
          </Link>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-slate-200 bg-white max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No lessons yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
            Create your first lesson, then expand it to attach lecture videos, PDF worksheets, and notes.
          </p>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Create first lesson
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lessonItem, idx) => {
            const isExpanded = expandedLessonId === lessonItem.id;
            const mediaCount = lessonItem.media?.length ?? 0;
            const notesCount = lessonItem.notes?.length ?? 0;

            return (
              <div
                key={lessonItem.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedLessonId(isExpanded ? null : lessonItem.id)}
                    className="flex items-center gap-4 text-left flex-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{lessonItem.title}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {lessonItem.isFree ? 'Free preview' : 'Enrolled only'} &middot; {mediaCount} file(s) &middot; {notesCount} note(s)
                        {lessonItem.status !== 'PUBLISHED' && ' &middot; Draft'}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/admin/courses/${courseId}/lessons/${lessonItem.id}/edit`}
                      className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800"
                      title="Edit lesson details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lessonItem.id, lessonItem.title)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedLessonId(isExpanded ? null : lessonItem.id)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <LessonResourcesPanel
                    lessonId={lessonItem.id}
                    courseId={courseId}
                    lessonTitle={lessonItem.title}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
