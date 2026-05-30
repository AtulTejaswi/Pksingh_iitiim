'use client';

import React, { useState } from 'react';
import { useGetAllEnrollments, useDeleteEnrollment, useGetCourses } from '@/hooks/useCourses';
import { toast } from 'sonner';
import { Users, Search, Filter, Trash2, ShieldAlert, BookOpen } from 'lucide-react';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const { data: courses } = useGetCourses();
  const { data: enrollments, isLoading } = useGetAllEnrollments(courseFilter || undefined);
  const { mutate: deleteEnrollment, isPending: isDeleting } = useDeleteEnrollment();

  const handleUnenroll = (id: string, userName: string, courseTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${userName}'s enrollment from "${courseTitle}"?`
      )
    ) {
      deleteEnrollment(id, {
        onSuccess: () => {
          toast.success(`Removed ${userName} from ${courseTitle}`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to remove enrollment');
        },
      });
    }
  };

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    const user = enrollment.user;
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="w-full text-left">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-indigo-400" /> Students Manager
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor enrolled students, manage course accessibility, and unenroll if necessary.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 p-6 rounded-2xl glass-panel relative overflow-hidden">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-500"
          />
        </div>

        {/* Course Filter */}
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0b0f19] text-white">All Courses</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id} className="bg-[#0b0f19] text-white">
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] animate-pulse w-full"
            ></div>
          ))}
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
          <ShieldAlert className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Enrollments Found</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            No student enrollments exist yet or match your search criteria.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#070a12]/40 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">Enrolled Course</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white leading-tight mb-1">
                          {enrollment.user.fullName}
                        </span>
                        <span className="text-gray-500 text-[10px]">{enrollment.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <span>{enrollment.course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleUnenroll(
                            enrollment.id,
                            enrollment.user.fullName,
                            enrollment.course.title
                          )
                        }
                        disabled={isDeleting}
                        className="p-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-all cursor-pointer"
                        title="Remove Student from Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
