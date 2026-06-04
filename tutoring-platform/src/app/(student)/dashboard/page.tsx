import React from 'react';
import { PlayCircle, Award, BookOpen, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-blue-100 text-lg mb-8">You're making great progress. Keep up the momentum!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <BookOpen className="text-blue-200 mb-2" size={24} />
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-blue-200">Enrolled Courses</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <Award className="text-blue-200 mb-2" size={24} />
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-blue-200">Certificates</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <Clock className="text-blue-200 mb-2" size={24} />
              <div className="text-2xl font-bold">12h</div>
              <div className="text-sm text-blue-200">Learning Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning - The most important CTA for a student */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Continue Learning</h2>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
          <div className="h-32 w-full md:w-56 bg-slate-100 rounded-xl flex-shrink-0 border border-slate-200 overflow-hidden relative group">
            {/* Mock Thumbnail */}
            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/20 transition-colors flex items-center justify-center">
              <PlayCircle className="text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" size={48} />
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Physics</span>
              <span className="text-sm text-slate-500 font-medium">Chapter 4: Work & Energy</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Physics Masterclass</h3>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-slate-700">65% Completed</span>
                <span className="text-slate-500">12/18 Lessons</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <Link href="/learn/course-123/lesson-456" className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all">
              Resume Lesson
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Enrolled Courses Grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard title="Advanced Mathematics" progress={30} tag="Math" />
          <CourseCard title="Organic Chemistry" progress={10} tag="Chemistry" />
          <CourseCard title="JEE Mains Mock Tests" progress={0} tag="Test Prep" />
        </div>
      </section>
    </div>
  );
}

function CourseCard({ title, progress, tag }: { title: string, progress: number, tag: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col">
      <div className="h-40 bg-slate-100 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-4">
           <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/30">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">{title}</h3>
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-700">Progress</span>
            <span className="text-slate-900">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
