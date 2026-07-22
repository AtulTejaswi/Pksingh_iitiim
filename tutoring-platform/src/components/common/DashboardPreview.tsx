import React from 'react';
import Link from 'next/link';
import { User, BookOpen, CheckCircle, Flame, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Mockup */}
          <div className="w-full lg:w-3/5" style={{ perspective: '1000px' }}>
            <div className="shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-200" style={{ transform: 'rotateY(-5deg) rotateX(5deg) rotate(-1deg)' }}>
              
              {/* Dashboard Top Bar */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                <div className="font-outfit font-bold text-slate-800">LearnPortal</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 font-inter">Arjun M.</span>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-slate-50/50">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-800">3</span>
                    <span className="text-xs text-slate-500 mt-1 text-center">Courses Enrolled</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-800">47</span>
                    <span className="text-xs text-slate-500 mt-1 text-center">Lessons Completed</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center justify-center bg-amber-50/30">
                    <Flame className="w-5 h-5 text-orange-500 mb-2" />
                    <span className="text-2xl font-bold text-orange-600">12 days</span>
                    <span className="text-xs text-slate-500 mt-1 text-center">Current Streak</span>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-slate-800 font-outfit">JEE Advanced Mechanics</h4>
                    <span className="text-sm font-bold text-amber-600">68% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[68%]"></div>
                  </div>
                </div>

                {/* Upcoming Sessions */}
                <div>
                  <h4 className="font-semibold text-slate-800 font-outfit mb-4">Upcoming Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-slate-800">Rotational Dynamics Doubt Class</h5>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" /> Today, 6:00 PM
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mr-4">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-slate-800">Weekly Mock Test Analysis</h5>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" /> Tomorrow, 10:00 AM
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Text & CTA */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-outfit mb-6 leading-tight">
              Your Personalized Learning Command Center
            </h2>
            <p className="text-lg text-slate-300 font-inter mb-8">
              Track your progress, join live classes, and access all your study materials from one beautifully designed, easy-to-use dashboard.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-400 transition-colors shadow-lg hover:shadow-amber-500/25"
            >
              Sign Up Free to Access
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
