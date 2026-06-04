'use client';

import React, { use } from 'react';
import CourseBuilder from '@/components/admin/CourseBuilder';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  return (
    <div className="w-full text-left">
      <CourseBuilder courseId={courseId} />
    </div>
  );
}
