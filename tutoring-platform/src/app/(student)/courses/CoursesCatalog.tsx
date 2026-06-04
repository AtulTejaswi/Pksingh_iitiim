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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Explore Our <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Browse and preview lessons without signing in. Create a free account to enroll and track progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)] focus:border-indigo-500/50 text-white text-sm outline-none transition-all placeholder:text-gray-500"
          />
        </div>

        <div className="md:col-span-3 relative">
          <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white text-sm outline-none appearance-none cursor-pointer"
          >
            {SUBJECTS.map((sub) => (
              <option key={sub.value} value={sub.value} className="bg-[#0b0f19] text-white">
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 relative">
          <BookOpenCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={examTag}
            onChange={(e) => setExamTag(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] focus:border-indigo-500/50 text-white text-sm outline-none appearance-none cursor-pointer"
          >
            {EXAMS.map((exam) => (
              <option key={exam.value} value={exam.value} className="bg-[#0b0f19] text-white">
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
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] h-80 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-panel">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No courses found matching your criteria.</p>
          <p className="text-gray-500 text-sm mt-1">Try resetting the filters or modifying your search query.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col group justify-between"
            >
              <div
                className={`h-40 relative p-6 flex flex-col justify-between border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-br ${
                  course.subject === 'PHYSICS'
                    ? 'from-purple-950/70 to-indigo-900/70'
                    : course.subject === 'CHEMISTRY'
                      ? 'from-sky-950/70 to-blue-900/70'
                      : 'from-emerald-950/70 to-cyan-900/70'
                }`}
              >
                <span className="self-start px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                  {course.subject}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                  {course.title}
                </h3>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{course.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {course.examTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-gray-300 text-[9px] font-semibold uppercase tracking-wider"
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-6 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <span>{course._count?.lessons || 0} lectures</span>
                  <span>{course._count?.enrollments || 0} enrolled</span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-center text-sm font-semibold block"
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
