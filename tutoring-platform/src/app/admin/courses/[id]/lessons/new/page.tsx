'use client';

import React, { use } from 'react';
import { useCreateLesson } from '@/hooks/useLessons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonInput } from '@/lib/validators';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function NewLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

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
      {/* Back button */}
      <Link
        href={`/admin/courses/${courseId}/lessons`}
        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors self-start w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Syllabus
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" /> Add Lecture Module
        </h1>
        <p className="text-gray-400 text-sm mt-1">Insert a new lesson module into this course syllabus outline.</p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl glass-panel p-8 relative overflow-hidden max-w-3xl border border-[rgba(255,255,255,0.06)] shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* hidden input for courseId */}
          <input type="hidden" {...register('courseId')} value={courseId} />

          {/* Lesson Title */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Lesson 1: Atomic Structures and Spectra"
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
            />
            {errors.title && (
              <p className="text-red-400 text-[10px] font-medium mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Lecture Summary / Subtext (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide a brief summary of topics covered in this specific lecture..."
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Content / Markdown Text */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Lecture Markdown Outline / Details (Optional)
            </label>
            <textarea
              {...register('content')}
              rows={5}
              placeholder="Detail the complete topic breakdown, prerequisites, key formulas, or written study notes here..."
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Sort Order */}
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Sort Order (Index)
              </label>
              <input
                type="number"
                {...register('sortOrder', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all"
              />
            </div>

            {/* Is Free (Preview) Toggle */}
            <div className="flex items-center gap-3 mt-4 sm:mt-8">
              <input
                type="checkbox"
                id="isFree"
                {...register('isFree')}
                className="w-4.5 h-4.5 rounded border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-indigo-600 focus:ring-indigo-500 outline-none cursor-pointer"
              />
              <label htmlFor="isFree" className="text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Free Preview Module
              </label>
            </div>

            {/* Is Published Toggle */}
            <div className="flex items-center gap-3 mt-4 sm:mt-8">
              <input
                type="checkbox"
                id="isPublished"
                {...register('isPublished')}
                className="w-4.5 h-4.5 rounded border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-indigo-600 focus:ring-indigo-500 outline-none cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Publish module
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPending}
            className="glow-button px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Creating lecture...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save & Create Lecture
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
