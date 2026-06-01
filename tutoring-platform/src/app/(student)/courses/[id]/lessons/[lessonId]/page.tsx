'use client';

import LessonPlayer from '@/components/student/LessonPlayer';

export default function PublicLessonPage({
  params,
}: {
  params: { id: string; lessonId: string };
}) {
  return <LessonPlayer courseId={params.id} lessonId={params.lessonId} mode="public" />;
}
