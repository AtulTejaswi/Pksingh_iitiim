import React from 'react';
import { Check, X, UserCheck } from 'lucide-react';

export default function MentorshipComparison() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Why Mentorship?
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          The <span className="text-blue-600">1-on-1</span> Advantage
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Mass classes teach the syllabus. Mentorship teaches you how to think, adapt, and maximize your specific potential.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
          
          {/* Features Column */}
          <div className="hidden md:block bg-slate-50 p-8 border-r border-slate-200">
            <div className="h-20"></div> {/* Spacer for header */}
            <div className="space-y-12">
              <div className="font-semibold text-slate-700 h-10 flex items-center">Pace of Learning</div>
              <div className="font-semibold text-slate-700 h-10 flex items-center">Doubt Resolution</div>
              <div className="font-semibold text-slate-700 h-10 flex items-center">Study Strategy</div>
              <div className="font-semibold text-slate-700 h-10 flex items-center">Accountability</div>
              <div className="font-semibold text-slate-700 h-10 flex items-center">Exam Analysis</div>
            </div>
          </div>

          {/* Mass Classes Column */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-white relative">
            <div className="md:hidden font-bold text-slate-900 mb-6 text-xl">Mass Classes</div>
            <div className="hidden md:flex h-20 items-center justify-center font-bold text-slate-500 text-lg">
              Typical Coaching
            </div>
            
            <div className="space-y-6 md:space-y-12">
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-1">Pace of Learning</span>
                <div className="flex items-center text-slate-600"><X className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" /> Fixed for 100+ students</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-1">Doubt Resolution</span>
                <div className="flex items-center text-slate-600"><X className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" /> Queued or answered by TAs</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-1">Study Strategy</span>
                <div className="flex items-center text-slate-600"><X className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" /> One-size-fits-all generic plan</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-1">Accountability</span>
                <div className="flex items-center text-slate-600"><X className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" /> You're just a roll number</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-1">Exam Analysis</span>
                <div className="flex items-center text-slate-600"><X className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" /> Automated scorecard only</div>
              </div>
            </div>
          </div>

          {/* PK Singh Mentorship Column */}
          <div className="p-8 bg-blue-900 text-white relative shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            
            <div className="md:hidden flex items-center gap-3 font-bold text-white mb-6 text-xl">
              <UserCheck className="w-6 h-6 text-amber-400" /> 1:1 Mentorship
            </div>
            
            <div className="hidden md:flex h-20 items-center justify-center font-extrabold text-white text-xl gap-2">
              <UserCheck className="w-6 h-6 text-amber-400" /> PK Singh Mentorship
            </div>
            
            <div className="space-y-6 md:space-y-12 relative z-10">
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-blue-300 uppercase mb-1">Pace of Learning</span>
                <div className="flex items-center font-medium"><Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" /> Adapted to your grasping speed</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-blue-300 uppercase mb-1">Doubt Resolution</span>
                <div className="flex items-center font-medium"><Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" /> Direct access to the expert</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-blue-300 uppercase mb-1">Study Strategy</span>
                <div className="flex items-center font-medium"><Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" /> Highly targeted weak-area focus</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-blue-300 uppercase mb-1">Accountability</span>
                <div className="flex items-center font-medium"><Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" /> Weekly check-ins & habit tracking</div>
              </div>
              <div className="flex flex-col md:block h-auto md:h-10 justify-center">
                <span className="md:hidden text-xs font-semibold text-blue-300 uppercase mb-1">Exam Analysis</span>
                <div className="flex items-center font-medium"><Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" /> Detailed behavioral & error review</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
