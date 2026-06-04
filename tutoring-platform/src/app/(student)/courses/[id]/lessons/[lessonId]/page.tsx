'use client';

import { use } from 'react';
import LessonPlayer from '@/components/student/LessonPlayer';

export default function PublicLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = use(params);
  return <LessonPlayer courseId={courseId} lessonId={lessonId} mode="public" />;
}
