'use client';

import React from 'react';
import { PlayCircle, Award, BookOpen, Clock, ChevronRight, Flame, TrendingUp, Calendar, CheckCircle2, Lock, Video } from 'lucide-react';
import Link from 'next/link';
import WeeklyDigestToggle from '@/components/common/WeeklyDigestToggle';

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-blue-100 text-lg mb-8">You're making great progress. Keep up the momentum!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <BookOpen className="text-blue-300 mb-2" size={24} />
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-blue-200">Enrolled Courses</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <Award className="text-amber-300 mb-2" size={24} />
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-blue-200">Certificates</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <Clock className="text-emerald-300 mb-2" size={24} />
              <div className="text-2xl font-bold">12h</div>
              <div className="text-sm text-blue-200">Learning Time</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Continue Learning</h2>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
              <div className="h-36 w-full md:w-64 bg-slate-100 rounded-2xl flex-shrink-0 border border-slate-200 overflow-hidden relative group">
                {/* Mock Thumbnail Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <PlayCircle className="text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" size={56} />
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">Physics</span>
                  <span className="text-sm text-slate-500 font-medium">Chapter 4: Work & Energy</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Physics Masterclass</h3>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-700">65% Completed</span>
                    <span className="text-slate-500">12/18 Lessons</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <Link href="/learn/course-123/lesson-456" className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm">
                  Resume
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </section>

          {/* Streaks & Gamification */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Streaks Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100">
                        <Flame size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Your Streak</h2>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="text-5xl font-extrabold text-slate-900 tracking-tight">5<span className="text-xl text-slate-500 font-medium ml-1">days</span></div>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Current Streak</p>
                    </div>
                    <div className="text-right pb-1">
                        <div className="text-xl font-bold text-slate-900">12 days</div>
                        <p className="text-sm text-slate-500 font-medium">Longest Streak</p>
                    </div>
                </div>

                {/* Heatmap (last 7 days dots) */}
                <div className="flex justify-between items-center gap-2 pt-4 border-t border-slate-100">
                    {['M','T','W','T','F','S','S'].map((day, i) => {
                        const isCompleted = i < 5;
                        const isToday = i === 4;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isCompleted 
                                ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md shadow-orange-500/20' 
                                : 'bg-slate-50 text-slate-400 border border-slate-200'
                              } ${isToday ? 'ring-4 ring-orange-50' : ''}`}>
                                  {isCompleted ? <Flame size={18} /> : <span className="text-sm font-medium">{day}</span>}
                              </div>
                              <span className={`text-xs font-bold ${isToday ? 'text-orange-600' : 'text-slate-400'}`}>{day}</span>
                          </div>
                        );
                    })}
                </div>
            </div>

            {/* Badges */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                            <Award size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Badges</h2>
                    </div>
                    <Link href="#" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">View all</Link>
                </div>
                
                <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                    <Badge icon={<CheckCircle2 size={24} />} title="First Lesson" earned={true} color="emerald" />
                    <Badge icon={<Flame size={24} />} title="Week Warrior" earned={true} color="orange" />
                    <Badge icon={<TrendingUp size={24} />} title="Ten Down" earned={false} />
                    <Badge icon={<Calendar size={24} />} title="Month Master" earned={false} />
                    <Badge icon={<BookOpen size={24} />} title="Subject Ace" earned={false} />
                </div>
            </div>
          </section>

          {/* Enrolled Courses Grid */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CourseCard title="Advanced Mathematics" progress={30} tag="Math" color="blue" />
              <CourseCard title="Organic Chemistry" progress={10} tag="Chemistry" color="emerald" />
              <CourseCard title="JEE Mains Mock Tests" progress={0} tag="Test Prep" color="indigo" />
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
            
            {/* Weekly Report Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Weekly Report</h2>
                    <WeeklyDigestToggle />
                  </div>
                  <p className="text-sm text-slate-500">Your learning statistics for this week compared to last week.</p>
                </div>
                
                <div className="space-y-4">
                    <ReportRow 
                      icon={<BookOpen size={20} className="text-indigo-600" />} 
                      label="Lessons Completed" 
                      value="8" 
                      trend="+2 from last week" 
                      trendPositive={true} 
                    />
                    <ReportRow 
                      icon={<Clock size={20} className="text-emerald-600" />} 
                      label="Time Spent" 
                      value="12h 45m" 
                      trend="+1.5h from last week" 
                      trendPositive={true} 
                    />
                    <ReportRow 
                      icon={<Award size={20} className="text-amber-600" />} 
                      label="Average Quiz Score" 
                      value="92%" 
                      trend="+5% improvement" 
                      trendPositive={true} 
                    />
                </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                        <Video size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Upcoming Sessions</h2>
                </div>
                
                <div className="space-y-4">
                    <SessionCard 
                      title="Physics Doubt Clearing" 
                      time="Today, 5:00 PM" 
                      host="Prof. Sharma" 
                      urgent={true} 
                    />
                    <SessionCard 
                      title="Math Mock Test Review" 
                      time="Tomorrow, 10:00 AM" 
                      host="Dr. Gupta" 
                    />
                </div>
                
                <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  View Full Schedule
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}

function CourseCard({ title, progress, tag, color }: { title: string, progress: number, tag: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
  };
  const barColor = colorMap[color] || 'bg-slate-500';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group cursor-pointer flex flex-col">
      <div className="h-32 bg-slate-100 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity ${barColor}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
           <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2 text-lg">{title}</h3>
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-slate-500 uppercase tracking-wider">Progress</span>
            <span className="text-slate-900">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className={`${barColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, title, earned, color = "amber" }: { icon: React.ReactNode, title: string, earned: boolean, color?: string }) {
  const colorGradients: Record<string, string> = {
    amber: 'from-amber-300 to-yellow-500 text-amber-900',
    emerald: 'from-emerald-300 to-green-500 text-emerald-900',
    orange: 'from-orange-300 to-red-400 text-orange-900',
  };
  const gradient = colorGradients[color] || colorGradients.amber;

  return (
    <div className="flex flex-col items-center gap-2 group cursor-help">
      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
        earned 
        ? `bg-gradient-to-br ${gradient} shadow-lg shadow-${color}-500/20` 
        : 'bg-slate-100 text-slate-300 border-2 border-slate-200 border-dashed'
      }`}>
        {earned ? icon : <Lock size={20} />}
      </div>
      <span className={`text-xs text-center font-semibold leading-tight ${earned ? 'text-slate-800' : 'text-slate-400'}`}>
        {title}
      </span>
    </div>
  );
}

function ReportRow({ icon, label, value, trend, trendPositive }: { icon: React.ReactNode, label: string, value: string, trend: string, trendPositive: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
          {icon}
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
          <div className="font-bold text-slate-900">{value}</div>
        </div>
      </div>
      <div className={`text-xs font-semibold px-2.5 py-1 rounded-md ${trendPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {trend}
      </div>
    </div>
  );
}

function SessionCard({ title, time, host, urgent }: { title: string, time: string, host: string, urgent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${urgent ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-white shadow-sm'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        {urgent && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Live Soon</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className={urgent ? 'text-blue-500' : ''} />
          <span className={urgent ? 'text-blue-700' : ''}>{time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
            {host.charAt(0)}
          </div>
          {host}
        </div>
      </div>
    </div>
  );
}
