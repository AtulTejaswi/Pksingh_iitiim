'use client';

import React, { useState, useEffect, use } from 'react';
import { useGetCourse, useUpdateCourse } from '@/hooks/useCourses';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseInput } from '@/lib/validators';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Edit3, Sparkles, BookOpenCheck, AlertTriangle } from 'lucide-react';

const SUBJECTS = [
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'MATH', label: 'Mathematics' },
];

const EXAMS = [
  { value: 'JEE_MAINS', label: 'JEE Mains' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
  { value: 'NEET', label: 'NEET' },
  { value: 'MHT_CET', label: 'MHT-CET' },
  { value: 'SAT', label: 'SAT Prep' },
  { value: 'AP_PHYSICS', label: 'AP Physics' },
  { value: 'AP_CHEMISTRY', label: 'AP Chemistry' },
  { value: 'AP_CALCULUS', label: 'AP Calculus' },
  { value: 'GENERAL', label: 'General / Boards' },
];

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const { data: course, isLoading } = useGetCourse(courseId);
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [examError, setExamError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
  });

  // Prepopulate form when course loads
  useEffect(() => {
    if (course) {
      setValue('title', course.title);
      setValue('description', course.description);
      setValue('subject', course.subject);
      setValue('isFree', course.isFree);
      setValue('thumbnailUrl', course.thumbnailUrl || '');
      setSelectedExams(course.examTags);
      setValue('examTags', course.examTags as any);
    }
  }, [course, setValue]);

  const handleExamToggle = (value: string) => {
    setExamError('');
    let updated: string[] = [];
    if (selectedExams.includes(value)) {
      updated = selectedExams.filter((t) => t !== value);
    } else {
      updated = [...selectedExams, value];
    }
    setSelectedExams(updated);
    setValue('examTags', updated as any);
  };

  const onSubmit = (data: CourseInput) => {
    if (selectedExams.length === 0) {
      setExamError('Select at least one exam tag');
      return;
    }

    updateCourse(
      { id: courseId, data },
      {
        onSuccess: () => {
          toast.success('Course details updated successfully!');
          router.push('/admin/courses');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to update course details');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Hydrating Form Details...</p>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {/* Back button */}
      <Link
        href="/admin/courses"
        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors self-start w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Edit3 className="w-7 h-7 text-indigo-400" /> Edit Course Metadata
        </h1>
        <p className="text-gray-400 text-sm mt-1">Adjust course details, price classifications, and targets.</p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl glass-panel p-8 relative overflow-hidden max-w-3xl border border-[rgba(255,255,255,0.06)] shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Course Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. JEE Mains Trigonometry Complete Guide"
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
            />
            {errors.title && (
              <p className="text-red-400 text-[10px] font-medium mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Course Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Provide a comprehensive summary of this course's syllabus details..."
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-[10px] font-medium mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subject Select */}
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Subject Classification *
              </label>
              <select
                {...register('subject')}
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all cursor-pointer"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub.value} value={sub.value} className="bg-[#0b0f19]">
                    {sub.label}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-red-400 text-[10px] font-medium mt-1">{errors.subject.message}</p>
              )}
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Thumbnail Image URL (Optional)
              </label>
              <input
                type="text"
                {...register('thumbnailUrl')}
                placeholder="https://example.com/thumbnail.png"
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
              />
              {errors.thumbnailUrl && (
                <p className="text-red-400 text-[10px] font-medium mt-1">{errors.thumbnailUrl.message}</p>
              )}
            </div>
          </div>

          {/* Exam Target Badges Selection */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Target Competitions & Exams * <span className="text-[10px] text-gray-500 normal-case">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXAMS.map((exam) => {
                const isSelected = selectedExams.includes(exam.value);
                return (
                  <button
                    key={exam.value}
                    type="button"
                    onClick={() => handleExamToggle(exam.value)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5'
                        : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400 hover:text-white hover:border-[rgba(255,255,255,0.12)]'
                    }`}
                  >
                    {exam.label}
                  </button>
                );
              })}
            </div>
            {examError && (
              <p className="text-red-400 text-[10px] font-medium mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {examError}
              </p>
            )}
          </div>

          {/* Pricing classification */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <input
              type="checkbox"
              id="isFree"
              {...register('isFree')}
              className="w-4.5 h-4.5 rounded border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-indigo-600 focus:ring-indigo-500 outline-none cursor-pointer"
            />
            <div className="text-left">
              <label htmlFor="isFree" className="block text-white font-bold text-xs uppercase tracking-wider cursor-pointer">
                100% Free Open Syllabus
              </label>
              <span className="text-[10px] text-gray-400 leading-normal block mt-0.5">
                Checking this makes this course available for instant enrollment without pricing restrictions.
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isUpdating}
            className="glow-button px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Updating details...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Course Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
