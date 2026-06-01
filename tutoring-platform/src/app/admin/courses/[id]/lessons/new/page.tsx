'use client';

import React from 'react';
import { useCreateLesson } from '@/hooks/useLessons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonInput } from '@/lib/validators';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function NewLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const courseId = params.id;

  const { mutate: createLesson, isPending } = useCreateLesson();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId,
      sortOrder: 0,
      isFree: false,
      isPublished: true,
    },
  });

  const onSubmit = (data: LessonInput) => {
    createLesson(data, {
      onSuccess: () => {
        toast.success('Lecture module created successfully!');
        router.push(`/admin/courses/${courseId}/lessons`);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || 'Failed to create lesson');
      },
    });
  };

  return (
    <div className="w-full text-left">
      <Link href={`/admin/courses/${courseId}/lessons`} className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors self-start w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Syllabus
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" /> Add Lecture Module
        </h1>
        <p className="text-gray-400 text-sm mt-1">Insert a new lesson module into this course syllabus.</p>
      </div>

      <div className="rounded-2xl glass-panel p-8 max-w-3xl border border-[rgba(255,255,255,0.06)] shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register('courseId')} value={courseId} />

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Lecture Title *</label>
            <input type="text" {...register('title')} placeholder="e.g. Lesson 1: Atomic Structures and Spectra" className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none focus:border-indigo-500/50" />
            {errors.title && <p className="text-red-400 text-[10px] font-medium mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none focus:border-indigo-500/50 resize-none" />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Content (Markdown)</label>
            <textarea {...register('content')} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none focus:border-indigo-500/50 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Sort Order</label>
              <input type="number" {...register('sortOrder', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none" />
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-8">
              <input type="checkbox" {...register('isFree')} id="isFree" className="w-4.5 h-4.5 rounded" />
              <label htmlFor="isFree" className="text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer">Free Preview</label>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-8">
              <input type="checkbox" {...register('isPublished')} id="isPublished" className="w-4.5 h-4.5 rounded" />
              <label htmlFor="isPublished" className="text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer">Published</label>
            </div>
          </div>

          <button type="submit" disabled={isPending} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50">
            {isPending ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Creating...</>
            ) : (
              <><Save className="w-4 h-4" /> Create Lecture</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
