'use client';

import React, { useState, useMemo } from 'react';
import { useGetCourses, useDeleteCourse } from '@/hooks/useCourses';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Search, Edit3, Eye, Trash2, BookOpen, ArrowUpDown, Filter, Download } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const SUBJECT_COLORS: Record<string, string> = {
  PHYSICS: 'bg-blue-100 text-blue-600 border-blue-200',
  CHEMISTRY: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  MATH: 'bg-orange-100 text-orange-600 border-orange-200',
};

const SUBJECT_LABELS: Record<string, string> = {
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  MATH: 'Mathematics',
};

type FilterTab = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
type SortKey = 'newest' | 'oldest' | 'az' | 'za';

export default function AdminCoursesPage() {
  const { data: courses, isLoading } = useGetCourses({ includeDrafts: true });
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL');
  const [sort, setSort] = useState<SortKey>('newest');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCourses = async () => {
    setIsExporting(true);
    try {
      const response = await apiClient.get('/courses/export', {
        params: { format: 'csv' },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'courses-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Courses exported successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to export courses');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteCourse(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Course deleted successfully');
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || 'Failed to delete course');
        setDeleteTarget(null);
      },
    });
  };

  const filtered = useMemo(() => {
    if (!courses) return [];
    let result = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }

    if (filterTab === 'PUBLISHED') result = result.filter((c) => c.status === 'PUBLISHED');
    else if (filterTab === 'DRAFT') result = result.filter((c) => c.status === 'DRAFT');
    else if (filterTab === 'ARCHIVED') result = result.filter((c) => c.status === 'ARCHIVED');

    if (sort === 'newest') result.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    else if (sort === 'oldest') result.sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    else if (sort === 'az') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'za') result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [courses, search, filterTab, sort]);

  const getInitials = (title: string) => title.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">All Courses</h1>
          <p className="text-slate-500 text-sm mt-0.5">{courses?.length || 0} total courses</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={handleExportCourses}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Course
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800 border border-transparent'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs outline-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-slate-200 bg-white">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Try a different filter or add your first course.
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const initials = getInitials(course.title);
            const examTags = Array.isArray(course.examTags) ? course.examTags : [];
            return (
              <div
                key={course.id}
                className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all overflow-hidden group shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-36 w-full">
                  <ImageWithFallback
                    src={course.thumbnailUrl}
                    alt={course.title}
                    initials={initials}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                          : course.status === 'ARCHIVED'
                          ? 'bg-red-100 border-red-200 text-red-700'
                          : 'bg-yellow-100 border-yellow-200 text-yellow-700'
                      }`}
                    >
                      {course.status === 'PUBLISHED' ? 'Published' : course.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${SUBJECT_COLORS[course.subject] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {SUBJECT_LABELS[course.subject] || course.subject}
                    </span>
                    {examTags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {examTags.length > 2 && (
                      <span className="text-[10px] text-slate-400">+{examTags.length - 2}</span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3">
                    <span>{course._count?.lessons || 0} lessons</span>
                    <span>{course._count?.enrollments || 0} students</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link
                      href={`/admin/courses/${course.id}/lessons`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Content
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all"
                      title="Edit course settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={`/courses/${course.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all"
                      title="Preview as student"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                      className="flex items-center justify-center px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Course?"
        message="This action cannot be undone. All lessons and enrollments will be permanently removed."
        itemName={deleteTarget?.title}
        confirmLabel="Yes, Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
