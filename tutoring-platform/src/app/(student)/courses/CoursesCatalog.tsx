'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetCourses } from '@/hooks/useCourses';
import Link from 'next/link';
import { Search, Filter, BookOpen, Clock, Video, MonitorPlay, User, ChevronDown, ChevronUp } from 'lucide-react';
import { staticCourses, mergeWithApiCourses } from '@/data/courseData';

const SUBJECTS = [
  { value: '', label: 'All Subjects' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'MATH', label: 'Mathematics' },
];

const EXAM_PILLS = [
  { value: '', label: 'All' },
  { value: 'JEE_MAINS', label: 'JEE Mains' },
  { value: 'JEE_ADVANCED', label: 'JEE Adv' },
  { value: 'NEET', label: 'NEET' },
  { value: 'SAT', label: 'SAT' },
  { value: 'CAT', label: 'CAT' },
  { value: 'GMAT', label: 'GMAT' },
];

const VALID_SUBJECTS = new Set(['PHYSICS', 'CHEMISTRY', 'MATH']);

function CourseCard({ course }: { course: any }) {
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Live Cohort':
        return <MonitorPlay className="w-4 h-4 mr-1.5" />;
      case 'Recorded':
        return <Video className="w-4 h-4 mr-1.5" />;
      case '1:1 Mentorship':
        return <User className="w-4 h-4 mr-1.5" />;
      default:
        return <BookOpen className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group relative">
      <div
        className={`h-40 relative p-6 flex flex-col justify-between border-b border-slate-100 bg-gradient-to-br ${
          course.subject === 'PHYSICS'
            ? 'from-slate-800 to-slate-900'
            : course.subject === 'CHEMISTRY'
              ? 'from-amber-600 to-amber-700'
              : 'from-slate-700 to-slate-800'
        }`}
      >
        <span className="self-start px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
          {course.subject}
        </span>
        <h3 className="text-xl font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
          {course.title}
        </h3>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {course.level && (
          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold uppercase tracking-wider mb-3 w-fit">
            {course.level}
          </span>
        )}
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-slate-500 text-sm">
            <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
            <span>{course.duration || 'Flexible duration'}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            {getFormatIcon(course.format)}
            <span>{course.format || 'Online'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm font-semibold mb-6 pb-4 border-b border-slate-100">
          <span className="text-slate-900">{course.price === 0 ? 'Free' : course.priceLabel || `₹${course.price}`}</span>
          <span className="text-slate-500 font-normal text-xs">{course.lessonCount || course._count?.lessons || 0} lessons</span>
        </div>
        
        <div className="mt-auto flex flex-col gap-3">
          {(course.syllabusTopics && course.syllabusTopics.length > 0) && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button 
                onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
              >
                <span>View Syllabus</span>
                {isSyllabusOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isSyllabusOpen && (
                <div className="px-4 py-3 bg-white border-t border-slate-200">
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    {course.syllabusTopics.map((topic: string, i: number) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <Link
            href={`/courses/${course.id}`}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center text-sm font-semibold block transition-colors shadow-sm"
          >
            View course
          </Link>
        </div>
      </div>
    </div>
  );
}

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

  const { data: apiCourses, isLoading } = useGetCourses({
    subject: subject || undefined,
    examTag: examTag || undefined,
  });

  const allCourses = mergeWithApiCourses(apiCourses || [], staticCourses);

  const filteredCourses =
    allCourses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesSubject = subject ? course.subject === subject : true;
      const matchesExam = examTag ? course.examTags?.includes(examTag) : true;

      return matchesSearch && matchesSubject && matchesExam && course.status === 'PUBLISHED';
    }) || [];

  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Explore Our <span className="text-amber-500">Courses</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Browse and preview lessons without signing in. Create a free account to enroll and track progress.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="md:col-span-4 relative">
            <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 text-sm outline-none appearance-none cursor-pointer"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.value} value={sub.value} className="bg-white text-slate-900">
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-sm font-semibold text-slate-700 mr-2">Target Exam:</span>
          {EXAM_PILLS.map((exam) => (
            <button
              key={exam.value}
              onClick={() => setExamTag(exam.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                examTag === exam.value
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-slate-900'
              }`}
            >
              {exam.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-slate-50 h-96 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-24 px-6 rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Courses launching soon</h3>
          <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
            We're currently building out our premium curriculum for this category. Join the waitlist to get early access and exclusive founding-member pricing when we launch.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
              required
            />
            <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shadow-md">
              Join Waitlist
            </button>
          </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
