'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import LessonPlayer from '@/components/student/LessonPlayer';

export default function EnrolledLessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  return (
    <ProtectedRoute>
      <LessonPlayer courseId={params.courseId} lessonId={params.lessonId} mode="enrolled" />
    </ProtectedRoute>
  );
}
