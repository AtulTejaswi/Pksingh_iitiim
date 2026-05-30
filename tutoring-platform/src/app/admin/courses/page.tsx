'use client';

import React from 'react';
import { useGetCourses, useDeleteCourse, useTogglePublishCourse } from '@/hooks/useCourses';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Edit3, Trash2, BookOpen, AlertTriangle, Eye, EyeOff, LayoutGrid } from 'lucide-react';

export default function AdminCoursesPage() {
  const { data: courses, isLoading } = useGetCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const { mutate: togglePublish, isPending: isPublishing } = useTogglePublishCourse();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete "${title}"? This will permanently delete the course and all associated lessons.`)) {
      deleteCourse(id, {
        onSuccess: () => {
          toast.success('Course deleted successfully');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to delete course');
        },
      });
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    togglePublish(
      { id, isPublished: !currentStatus },
      {
        onSuccess: () => {
          toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to update publish state');
        },
      }
    );
  };

  return (
    <div className="w-full text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Courses Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, or adjust courses publishing status.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="glow-button px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Course
        </Link>
      </div>

      {/* Course List Grid */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] animate-pulse w-full"></div>
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-white mb-2">No Courses Created</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
            Create your very first educational course to start building your lesson syllabus.
          </p>
          <Link
            href="/admin/courses/new"
            className="glow-button px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create First Course
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#070a12]/40 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-4">Title & Subject</th>
                  <th className="px-6 py-4">Syllabus Lectures</th>
                  <th className="px-6 py-4">Students Enrolled</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    {/* Title & Subject */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white leading-tight mb-1">{course.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                            {course.subject}
                          </span>
                          <span className="text-gray-500 text-[10px]">
                            {course.examTags.slice(0, 2).map((t) => t.replace('_', ' ')).join(', ')}
                            {course.examTags.length > 2 && ' +'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Lectures */}
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      📚 {course._count?.lessons || 0} Lectures
                    </td>

                    {/* Enrolled */}
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      🎓 {course._count?.enrollments || 0} Students
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(course.id, course.isPublished)}
                        disabled={isPublishing}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          course.isPublished
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        {course.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manage Syllabus */}
                        <Link
                          href={`/admin/courses/${course.id}/lessons`}
                          className="px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-300 font-semibold flex items-center gap-1 text-[11px] transition-all"
                          title="Manage Syllabus"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Syllabus
                        </Link>

                        {/* Edit metadata */}
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.05)] text-gray-300 transition-all"
                          title="Edit Course Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-all"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
