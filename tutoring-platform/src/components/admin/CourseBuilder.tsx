'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCreateCourse, useUpdateCourse, useGetCourse } from '@/hooks/useCourses';

import { useGetLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from '@/hooks/useLessons';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, GripVertical, Plus, Trash2, Edit3, X, Check, Upload, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import LessonResourcesPanel from '@/components/admin/LessonResourcesPanel';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SUBJECTS = [
  { value: 'PHYSICS', label: 'Physics', icon: '⚛️' },
  { value: 'CHEMISTRY', label: 'Chemistry', icon: '🧪' },
  { value: 'MATH', label: 'Mathematics', icon: '📐' },
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
];

const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner', icon: '🌱' },
  { value: 'INTERMEDIATE', label: 'Intermediate', icon: '📈' },
  { value: 'ADVANCED', label: 'Advanced', icon: '🚀' },
];

const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Media' },
  { num: 3, label: 'Curriculum' },
  { num: 4, label: 'Review & Publish' },
];

interface LessonFormData {
  title: string;
  videoUrl: string;
  duration: string;
  notes: string;
}

function SortableLessonCard({
  lesson,
  index,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  courseId,
}: {
  lesson: any;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (lesson: any) => void;
  onDelete: (id: string) => void;
  courseId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
      <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 hover:bg-[rgba(255,255,255,0.04)] transition-colors group relative">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300 transition-colors">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onPointerDown={(e) => { e.stopPropagation(); onToggleExpand(); }}>
          <p className="text-sm font-semibold text-white truncate">{lesson.title}</p>
          <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-0.5">
            {lesson.duration && <span>{lesson.duration} min</span>}
            {lesson.videoUrl && <span className="truncate max-w-[120px]">{lesson.videoUrl}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onPointerDown={(e) => { e.stopPropagation(); onEdit(lesson); }} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all opacity-0 group-hover:opacity-100">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onPointerDown={(e) => { e.stopPropagation(); onDelete(lesson.id); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onPointerDown={(e) => { e.stopPropagation(); onToggleExpand(); }} className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-all">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {isExpanded && courseId && (
        <div onPointerDown={(e) => e.stopPropagation()}>
          <LessonResourcesPanel lessonId={lesson.id} courseId={courseId} lessonTitle={lesson.title} />
        </div>
      )}
    </div>
  );
}

async function attachVideoToLesson(lessonId: string, videoUrl: string, videoTitle: string) {
  if (!videoUrl.trim()) return;
  const isYoutube = /youtube\.com|youtu\.be/i.test(videoUrl);
  await apiClient.post('/media/link', {
    lessonId,
    title: videoTitle || 'Lesson video',
    url: videoUrl.trim(),
    type: isYoutube ? 'YOUTUBE_LINK' : 'EXTERNAL_LINK',
  });
}

function CourseBuilderInner({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If this builder is mounted for /admin/courses/:id/edit, we must never
  // fall back into “create course” mode.
  const courseIdResolved = courseId ?? null;
  const isEdit = courseIdResolved !== null;

  const { data: existingCourse, isLoading: loadingCourse } = useGetCourse(courseIdResolved || '');

  const { data: existingLessons } = useGetLessons(courseId);

  const { mutateAsync: createCourseAsync, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: updateCourseAsync, isPending: isUpdating } = useUpdateCourse();
  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson();
  const { mutate: updateLessonMutation } = useUpdateLesson();
  const { mutate: deleteLessonMutation, isPending: isDeletingLesson } = useDeleteLesson();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [examTags, setExamTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Media
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');

  // Step 4: Publish
  const [publishMode, setPublishMode] = useState<'draft' | 'publish'>('draft');
  const [enrollmentType, setEnrollmentType] = useState<'open' | 'signup'>('open');

  // Lesson editing
  const [lessons, setLessons] = useState<any[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonFormData>({ title: '', videoUrl: '', duration: '', notes: '' });
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);

  const [dragKey, setDragKey] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const n = parseInt(stepParam, 10);
      if (n >= 1 && n <= 4) setStep(n);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isEdit && existingCourse) {
      setTitle(existingCourse.title || '');
      setDescription(existingCourse.description || '');
      setSubject(existingCourse.subject || '');
      setExamTags(Array.isArray(existingCourse.examTags) ? existingCourse.examTags : []);
      setThumbnailPreview(existingCourse.thumbnailUrl || '');
      setIsFree(existingCourse.isFree ?? true);
      setPublishMode(existingCourse.status === 'PUBLISHED' ? 'publish' : 'draft');
    }
  }, [isEdit, existingCourse]);

  useEffect(() => {
    if (isEdit && existingLessons) {
      const mapped = existingLessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        videoUrl: l.media?.find((m: any) => m.type === 'YOUTUBE_LINK' || m.type === 'EXTERNAL_LINK')?.url || '',
        duration: '',
        notes: l.description || '',
        sortOrder: l.sortOrder || 0,
      }));
      setLessons(mapped.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    }
  }, [isEdit, existingLessons]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!title.trim()) errs.title = 'Course title is required';
      if (!description.trim()) errs.description = 'Description is required';
      else if (description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
      if (!subject) errs.subject = 'Please select a subject';
      if (examTags.length === 0) errs.examTags = 'Select at least one exam target';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLessonForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!lessonForm.title.trim()) errs.lessonTitle = 'Lesson title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildCoursePayload = (published: boolean): CourseInput => {
    const payload: CourseInput = {
      title: title.trim(),
      description: description.trim(),
      subject: subject as CourseInput['subject'],
      examTags: examTags.length > 0 ? examTags : undefined,
      isFree,
      status: published ? 'PUBLISHED' : 'DRAFT',
    };
    if (thumbnailPreview && thumbnailPreview.startsWith('http')) {
      payload.thumbnailUrl = thumbnailPreview;
    }
    return payload;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    if (step === 1 && !isEdit) {
      setSaving(true);
      try {
        const course = await createCourseAsync(buildCoursePayload(false));
        toast.success('Course saved — continue with media and lessons');
        router.push(`/admin/courses/${course.id}/edit?step=2`);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: string } } };
        toast.error(e.response?.data?.error || 'Could not save course');
      } finally {
        setSaving(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddLessonSave = async () => {
    if (!validateLessonForm()) return;
    setSaving(true);
    try {
      if (editingLesson) {
        await updateLessonMutation({ id: editingLesson.id, data: { title: lessonForm.title, description: lessonForm.notes } });
        setLessons((prev) =>
          prev.map((l) => (l.id === editingLesson.id ? { ...l, title: lessonForm.title, videoUrl: lessonForm.videoUrl, duration: lessonForm.duration, notes: lessonForm.notes } : l))
        );
        toast.success('Lesson updated');
      } else {
        if (!courseId) {
          toast.error('Save the course first before adding lessons');
          return;
        }
        const newLesson: { id: string } = await new Promise((resolve, reject) => {
          createLesson(
            {
              courseId,
              title: lessonForm.title,
              description: lessonForm.notes || undefined,
              content: lessonForm.notes || undefined,
              isFree: false,
              status: 'PUBLISHED' as const,
              sortOrder: lessons.length,
            },
            {
              onSuccess: (data) => resolve(data),
              onError: (err: unknown) => reject(err),
            }
          );
        });
        if (lessonForm.videoUrl.trim()) {
          try {
            await attachVideoToLesson(newLesson.id, lessonForm.videoUrl, lessonForm.title);
          } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string } } };
            toast.error(e.response?.data?.error || 'Lesson saved but video link failed');
          }
        }
        setLessons((prev) => [
          ...prev,
          {
            id: newLesson.id,
            title: lessonForm.title,
            videoUrl: lessonForm.videoUrl,
            duration: lessonForm.duration,
            notes: lessonForm.notes,
            sortOrder: prev.length,
          },
        ]);
        toast.success('Lesson added');
      }
      setLessonForm({ title: '', videoUrl: '', duration: '', notes: '' });
      setEditingLesson(null);
      setShowAddLesson(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleEditLesson = (lesson: any) => {
    setLessonForm({ title: lesson.title, videoUrl: lesson.videoUrl || '', duration: lesson.duration || '', notes: lesson.notes || '' });
    setEditingLesson(lesson);
    setShowAddLesson(true);
  };

  const handleDeleteLessonConfirm = async () => {
    if (!deleteLessonId) return;
    try {
      await deleteLessonMutation({ id: deleteLessonId, courseId });
      setLessons((prev) => prev.filter((l) => l.id !== deleteLessonId));
      toast.success('Lesson removed');
      setDeleteLessonId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete lesson');
      setDeleteLessonId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(lessons, oldIndex, newIndex);
    setLessons(reordered);
    setDragKey((k) => k + 1);
    reordered.forEach((l, i) => {
      updateLessonMutation({ id: l.id, data: { sortOrder: i } });
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB. Please compress it and try again.');
      e.target.value = '';
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG files are accepted');
      e.target.value = '';
      return;
    }
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    setSaving(true);
    const courseData = buildCoursePayload(publishMode === 'publish');

    try {
      // Strictly use PUT for edit routes.
      if (isEdit) {
        const id = courseIdResolved;
        if (!id) {
          toast.error('Missing course id for edit');
          return;
        }
        await updateCourseAsync({ id, data: courseData });
        toast.success(publishMode === 'publish' ? 'Course published!' : 'Draft saved.');
        router.push(`/admin/courses/${id}/lessons`);
      } else {
        const course = await createCourseAsync(courseData);
        toast.success(publishMode === 'publish' ? 'Course published!' : 'Draft saved.');
        router.push(`/admin/courses/${course.id}/lessons`);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (isEdit && loadingCourse) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 font-medium">Loading course...</p>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((s) => (
        <React.Fragment key={s.num}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[rgba(255,255,255,0.05)] text-gray-500 border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${step === s.num ? 'text-white' : 'text-gray-500'}`}>
              {s.label}
            </span>
          </div>
          {s.num < 4 && <div className={`w-8 h-px ${step > s.num ? 'bg-emerald-500/50' : 'bg-[rgba(255,255,255,0.08)]'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full text-left max-w-3xl mx-auto">
      {renderStepIndicator()}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Basic Information</h2>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Course Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => { if (!title.trim()) setErrors((e) => ({ ...e, title: 'Course title is required' })); else setErrors((e) => { const { title, ...rest } = e; return rest; }); }}
              placeholder="e.g. JEE Physics — Electrostatics Masterclass"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-600 bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white ${errors.title ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.08)]'}`}
            />
            {errors.title && <p className="text-red-400 text-[10px] font-medium mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => { if (!description.trim()) setErrors((e) => ({ ...e, description: 'Description is required' })); else setErrors((e) => { const { description, ...rest } = e; return rest; }); }}
              rows={4}
              maxLength={2000}
              placeholder="Brief overview of what this course covers (at least 10 characters)..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-600 bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white resize-none ${errors.description ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.08)]'}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-red-400 text-[10px] font-medium">{errors.description}</p>}
              <span className="text-[10px] text-gray-500 ml-auto">{description.length}/2000</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Subject <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => { setSubject(s.value); setErrors((e) => { const { subject, ...rest } = e; return rest; }); }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    subject === s.value
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                      : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400 hover:text-white hover:border-[rgba(255,255,255,0.12)]'
                  }`}
                >
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <span className="text-xs font-semibold">{s.label}</span>
                </button>
              ))}
            </div>
            {errors.subject && <p className="text-red-400 text-[10px] font-medium mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Target Exams <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXAMS.map((exam) => {
                const isSelected = examTags.includes(exam.value);
                return (
                  <button
                    key={exam.value}
                    type="button"
                    onClick={() => {
                      setExamTags((prev) =>
                        prev.includes(exam.value) ? prev.filter((t) => t !== exam.value) : [...prev, exam.value]
                      );
                      setErrors((e) => { const { examTags, ...rest } = e; return rest; });
                    }}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400 hover:text-white'
                    }`}
                  >
                    {exam.label}
                  </button>
                );
              })}
            </div>
            {errors.examTags && <p className="text-red-400 text-[10px] font-medium mt-1">{errors.examTags}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Difficulty Level
            </label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                    difficulty === d.value
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                      : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{d.icon}</span>
                  <span className="text-xs font-semibold">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Media */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Media</h2>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Thumbnail Image
            </label>
            <div
              className="border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl p-6 text-center hover:border-indigo-500/30 transition-all cursor-pointer relative"
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
            >
              {thumbnailPreview ? (
                <div className="relative inline-block">
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="max-h-40 rounded-lg mx-auto" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setThumbnailPreview(''); setThumbnailFile(null); }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">Drop an image or click to browse</p>
                  <p className="text-[10px] text-gray-500 mt-1">JPG / PNG under 2MB</p>
                </div>
              )}
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Preview Video URL (YouTube or Google Drive)
            </label>
            <input
              type="text"
              value={previewVideoUrl}
              onChange={(e) => setPreviewVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
            />
            {isYouTubeUrl(previewVideoUrl) && getYouTubeEmbedUrl(previewVideoUrl) && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
                <iframe
                  src={getYouTubeEmbedUrl(previewVideoUrl)!}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Total Duration
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Hours"
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="Minutes"
                  min="0"
                  max="59"
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
            <div>
              <p className="text-sm font-semibold text-white">Free Course</p>
              <p className="text-[10px] text-gray-500">Toggle off to set a price</p>
            </div>
            {!isFree && (
              <div className="ml-auto">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499"
                    min="0"
                    className="w-28 pl-7 pr-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Curriculum */}
      {step === 3 && (
        <div className="space-y-6">
          {courseId && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10">
              <p className="text-sm text-sky-100">
                You can now expand any lesson to upload PDFs, attach MP4 videos, and add notes inline.
              </p>
            </div>
          )}
          {!courseId && (
            <p className="text-amber-300 text-sm p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
              Complete Step 1 and save the course before adding lessons.
            </p>
          )}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Curriculum — Lessons</h2>
            {!showAddLesson && (
              <button
                type="button"
                onClick={() => { setEditingLesson(null); setLessonForm({ title: '', videoUrl: '', duration: '', notes: '' }); setShowAddLesson(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Lesson
              </button>
            )}
          </div>

          {lessons.length === 0 && !showAddLesson && (
            <div className="text-center py-12 rounded-xl border border-[rgba(255,255,255,0.06)]">
              <p className="text-gray-500 text-sm mb-4">No lessons yet. Start building your curriculum.</p>
              <button
                type="button"
                onClick={() => { setEditingLesson(null); setLessonForm({ title: '', videoUrl: '', duration: '', notes: '' }); setShowAddLesson(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Your First Lesson
              </button>
            </div>
          )}

          <DndContext key={dragKey} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <SortableLessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    isExpanded={expandedLessonId === lesson.id}
                    onToggleExpand={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}
                    onEdit={handleEditLesson}
                    onDelete={(id) => setDeleteLessonId(id)}
                    courseId={courseId || ''}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {showAddLesson && (
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-4">
              <h3 className="text-sm font-bold text-white">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Lesson Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Introduction to Electrostatics"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none bg-[rgba(255,255,255,0.03)] text-white ${errors.lessonTitle ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.08)]'}`}
                />
                {errors.lessonTitle && <p className="text-red-400 text-[10px] mt-1">{errors.lessonTitle}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Video URL</label>
                <input
                  type="text"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="YouTube or Google Drive link"
                  className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm((f) => ({ ...f, duration: e.target.value }))}
                    placeholder="45"
                    className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Notes</label>
                <textarea
                  value={lessonForm.notes}
                  onChange={(e) => setLessonForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Optional notes or description..."
                  className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddLessonSave}
                  disabled={saving || isCreatingLesson || isDeletingLesson}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : editingLesson ? 'Update Lesson' : 'Save Lesson'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddLesson(false); setEditingLesson(null); setLessonForm({ title: '', videoUrl: '', duration: '', notes: '' }); }}
                  className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-gray-400 text-xs font-semibold hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Review & Publish</h2>

          {/* Preview Card */}
          <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] space-y-4">
            <div className="flex items-start gap-4">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">{title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">{title || 'Untitled Course'}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description || 'No description'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subject && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {SUBJECTS.find((s) => s.value === subject)?.label || subject}
                    </span>
                  )}
                  {examTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,255,255,0.05)] text-gray-300">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-[rgba(255,255,255,0.04)]">
              <span>{lessons.length} lessons</span>
              <span>{isFree ? 'Free' : `₹${price || '0'}`}</span>
              {difficulty && <span>{DIFFICULTIES.find((d) => d.value === difficulty)?.label || difficulty}</span>}
            </div>
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPublishMode('draft')}
                className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                  publishMode === 'draft'
                    ? 'border-yellow-500/50 bg-yellow-500/10 text-white'
                    : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400'
                }`}
              >
                <span className="text-lg block mb-1">📝</span>
                <span className="text-sm font-bold">Save as Draft</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Not visible to students</p>
              </button>
              <button
                type="button"
                onClick={() => setPublishMode('publish')}
                className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                  publishMode === 'publish'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                    : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400'
                }`}
              >
                <span className="text-lg block mb-1">🚀</span>
                <span className="text-sm font-bold">Publish Now</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Visible to all students</p>
              </button>
            </div>
          </div>

          {/* Enrollment Type */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">Enrollment</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEnrollmentType('open')}
                className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                  enrollmentType === 'open'
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                    : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400'
                }`}
              >
                <span className="text-sm font-semibold">Open to All</span>
              </button>
              <button
                type="button"
                onClick={() => setEnrollmentType('signup')}
                className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                  enrollmentType === 'signup'
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                    : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-gray-400'
                }`}
              >
                <span className="text-sm font-semibold">Requires Free Sign-Up</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-gray-300 text-sm font-semibold hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-500 text-sm font-semibold hover:text-gray-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || isCreating || isUpdating}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all disabled:opacity-50 ${
                publishMode === 'publish'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  : 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20'
              }`}
            >
              {saving || isCreating || isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {publishMode === 'publish' ? 'Publish Course' : 'Save Draft'}
                </>
              )}
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl text-gray-400 text-sm font-semibold hover:text-gray-300 transition-all"
            >
              Back to Edit
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteLessonId}
        title="Remove this lesson?"
        message="This action cannot be undone."
        confirmLabel="Yes, Remove"
        variant="danger"
        loading={isDeletingLesson}
        onConfirm={handleDeleteLessonConfirm}
        onCancel={() => setDeleteLessonId(null)}
      />
    </div>
  );
}

export default function CourseBuilder({ courseId }: { courseId?: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      }
    >
      <CourseBuilderInner courseId={courseId} />
    </Suspense>
  );
}
