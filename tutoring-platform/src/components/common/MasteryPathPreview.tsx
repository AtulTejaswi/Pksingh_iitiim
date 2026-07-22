import React from 'react';
import { BookOpen, Target, Zap, Award, CheckCircle2 } from 'lucide-react';

export default function MasteryPathPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Gamified Learning
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Your path to <span className="text-emerald-600">Mastery</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Progress from foundational concepts to advanced problem-solving with a structured, step-by-step roadmap. Earn streaks and unlock new levels as you master each topic.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Winding path SVG background (desktop) */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-full pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 200 600" preserveAspectRatio="none" className="text-emerald-200" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="12 12">
            <path d="M100,50 C150,150 50,250 100,350 C150,450 50,550 100,600" className="animate-pulse" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-12 sm:gap-20">
          
          {/* Level 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 group">
            <div className="w-full md:w-1/2 flex justify-end">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full max-w-sm text-right shadow-sm group-hover:shadow-md transition-all group-hover:-translate-x-1">
                <h4 className="font-bold text-lg text-slate-900">Foundations</h4>
                <p className="text-sm text-slate-500 mt-1">Core concepts and formula derivations.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center text-white z-10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              {/* Vertical line for mobile */}
              <div className="md:hidden absolute top-16 bottom-[-3rem] w-1 bg-emerald-200 left-1/2 -translate-x-1/2 -z-10"></div>
            </div>
            <div className="w-full md:w-1/2 md:block hidden"></div>
          </div>

          {/* Level 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 group">
            <div className="w-full md:w-1/2 flex justify-start">
              <div className="bg-white border-2 border-amber-400 p-5 rounded-2xl w-full max-w-sm text-left shadow-lg transform group-hover:scale-105 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Current</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900">Pattern Recognition</h4>
                <p className="text-sm text-slate-500 mt-1">Identify question types and select the fastest solving method.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-white shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center text-white z-10 animate-pulse-glow">
                <Zap className="w-10 h-10" />
              </div>
              {/* Vertical line for mobile */}
              <div className="md:hidden absolute top-20 bottom-[-3rem] w-1 bg-slate-200 left-1/2 -translate-x-1/2 -z-10"></div>
            </div>
            <div className="w-full md:w-1/2 md:block hidden"></div>
          </div>

          {/* Level 3 */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 group opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-full md:w-1/2 flex justify-end">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full max-w-sm text-right border-dashed">
                <h4 className="font-bold text-lg text-slate-700">Advanced Applications</h4>
                <p className="text-sm text-slate-500 mt-1">Multi-concept problems typical of JEE Advanced.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-slate-400 z-10">
                <Target className="w-8 h-8" />
              </div>
              {/* Vertical line for mobile */}
              <div className="md:hidden absolute top-16 bottom-[-3rem] w-1 bg-slate-200 left-1/2 -translate-x-1/2 -z-10"></div>
            </div>
            <div className="w-full md:w-1/2 md:block hidden"></div>
          </div>

          {/* Level 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 group opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-full md:w-1/2 flex justify-start">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full max-w-sm text-left border-dashed">
                <h4 className="font-bold text-lg text-slate-700">Exam Mastery</h4>
                <p className="text-sm text-slate-500 mt-1">Time management, accuracy, and full-length mock tests.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-slate-400 z-10">
                <Award className="w-8 h-8" />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:block hidden"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
