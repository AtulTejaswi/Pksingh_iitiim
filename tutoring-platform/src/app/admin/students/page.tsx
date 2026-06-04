'use client';

import React, { useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { useGetAllEnrollments, useDeleteEnrollment, useGetCourses } from '@/hooks/useCourses';
import { toast } from 'sonner';
import { Users, Search, Filter, Trash2, BookOpen, ShieldAlert, Mail, Calendar, Download } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; course: string } | null>(null);

  const { data: courses } = useGetCourses({ includeDrafts: true });
  const { data: enrollments, isLoading } = useGetAllEnrollments(courseFilter || undefined);
  const { mutate: deleteEnrollment, isPending: isDeleting } = useDeleteEnrollment();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportEnrollments = async () => {
    setIsExporting(true);
    try {
      const response = await apiClient.get('/enrollments/export', {
        params: { format: 'csv', courseId: courseFilter || undefined },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', courseFilter ? `enrollments-${courseFilter}.csv` : 'enrollments-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Enrollments exported successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to export enrollments');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteEnrollment(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Removed ${deleteTarget.name} from ${deleteTarget.course}`);
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || 'Failed to unenroll student');
        setDeleteTarget(null);
      },
    });
  };

  const filteredEnrollments = useMemo(() => {
    if (!enrollments) return [];
    return enrollments.filter((enrollment: any) => {
      const user = enrollment.user;
      const matchesSearch =
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [enrollments, search]);

  return (
    <div className="w-full text-left">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Students
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student enrollments across all courses.</p>
        </div>
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExportEnrollments}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm outline-none appearance-none cursor-pointer"
          >
            <option value="">All Courses</option>
            {courses?.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-slate-200 bg-white">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Enrollments Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            No student enrollments match your search criteria.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3 hidden md:table-cell">Enrolled</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.map((enrollment: any) => (
                  <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-pink-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold uppercase">
                            {enrollment.user.fullName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{enrollment.user.fullName}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {enrollment.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-sm text-slate-700">{enrollment.course.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: enrollment.id,
                            name: enrollment.user.fullName,
                            course: enrollment.course.title,
                          })
                        }
                        disabled={isDeleting}
                        className="p-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                        title="Unenroll student"
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Unenroll Student?"
        itemName={deleteTarget ? `${deleteTarget.name} — ${deleteTarget.course}` : undefined}
        message="This action cannot be undone."
        confirmLabel="Yes, Unenroll"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
