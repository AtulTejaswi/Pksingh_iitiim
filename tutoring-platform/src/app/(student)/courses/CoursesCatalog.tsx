'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetCourses } from '@/hooks/useCourses';
import Link from 'next/link';
import { Search, Filter, BookOpen, BookOpenCheck } from 'lucide-react';

const SUBJECTS = [
  { value: '', label: 'All Subjects' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'MATH', label: 'Mathematics' },
];

const EXAMS = [
  { value: '', label: 'All Exams' },
  { value: 'JEE_MAINS', label: 'JEE Mains' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
  { value: 'NEET', label: 'NEET' },
  { value: 'MHT_CET', label: 'MHT-CET' },
  { value: 'SAT', label: 'SAT Prep' },
  { value: 'AP_PHYSICS', label: 'AP Physics' },
  { value: 'AP_CHEMISTRY', label: 'AP Chemistry' },
  { value: 'AP_CALCULUS', label: 'AP Calculus' },
];

const VALID_SUBJECTS = new Set(['PHYSICS', 'CHEMISTRY', 'MATH']);

export default function CoursesCatalog() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [examTag, setExamTag] = useState('');

  useEffect(() => {
    const subjectParam = searchParams.get('subject')?.toUpperCase() ?? '';
    if (VALID_SUBJECTS.has(subjectParam)) {
      setSubject(subjectParam);
    }
    const examParam = searchParams.get('exam') ?? searchParams.get('examTag') ?? '';
    if (examParam) {
      setExamTag(examParam);
    }
  }, [searchParams]);

  const { data: courses, isLoading } = useGetCourses({
    subject: subject || undefined,
    examTag: examTag || undefined,
  });

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && course.status === 'PUBLISHED';
    }) || [];

  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Explore Our <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Browse and preview lessons without signing in. Create a free account to enroll and track progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="md:col-span-3 relative">
          <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 text-slate-900 text-sm outline-none appearance-none cursor-pointer"
          >
            {SUBJECTS.map((sub) => (
              <option key={sub.value} value={sub.value} className="bg-white text-slate-900">
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 relative">
          <BookOpenCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={examTag}
            onChange={(e) => setExamTag(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 text-slate-900 text-sm outline-none appearance-none cursor-pointer"
          >
            {EXAMS.map((exam) => (
              <option key={exam.value} value={exam.value} className="bg-white text-slate-900">
                {exam.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white h-80 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-panel">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No courses found matching your criteria.</p>
          <p className="text-slate-400 text-sm mt-1">Try resetting the filters or modifying your search query.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group justify-between"
            >
              <div
                className={`h-40 relative p-6 flex flex-col justify-between border-b border-slate-100 bg-gradient-to-br ${
                  course.subject === 'PHYSICS'
                    ? 'from-blue-600 to-violet-600'
                    : course.subject === 'CHEMISTRY'
                      ? 'from-sky-600 to-blue-600'
                      : 'from-emerald-600 to-teal-600'
                }`}
              >
                <span className="self-start px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                  {course.subject}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-blue-200 transition-colors">
                  {course.title}
                </h3>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{course.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {course.examTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-semibold uppercase tracking-wider"
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-6 pb-4 border-b border-slate-100">
                  <span>{course._count?.lessons || 0} lectures</span>
                  <span>{course._count?.enrollments || 0} enrolled</span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="w-full py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center text-sm font-semibold block"
                >
                  View course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
