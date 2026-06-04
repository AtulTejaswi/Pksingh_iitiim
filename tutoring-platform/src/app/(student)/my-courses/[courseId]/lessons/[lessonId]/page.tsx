'use client';

import { use } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LessonPlayer from '@/components/student/LessonPlayer';

export default function EnrolledLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = use(params);
  return (
    <ProtectedRoute>
      <LessonPlayer courseId={courseId} lessonId={lessonId} mode="enrolled" />
    </ProtectedRoute>
  );
}
