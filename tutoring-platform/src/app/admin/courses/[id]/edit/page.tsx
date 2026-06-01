'use client';

import React from 'react';
import CourseBuilder from '@/components/admin/CourseBuilder';

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full text-left">
      <CourseBuilder courseId={params.id} />
    </div>
  );
}
