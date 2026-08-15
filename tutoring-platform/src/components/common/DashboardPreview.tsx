'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, BookOpen, CheckCircle, Flame, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { CTA } from '@/lib/cta';

const DEMO_STATES = [
  { courses: 3, lessons: 47, streak: 12, progress: 68 },
  { courses: 4, lessons: 56, streak: 13, progress: 74 },
  { courses: 5, lessons: 68, streak: 14, progress: 81 },
];

/** Animated sample dashboard shown to visitors — clearly labeled as a preview. */
export default function DashboardPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % DEMO_STATES.length), 2400);
    return () => clearInterval(id);
  }, []);

  const demo = DEMO_STATES[step];

  return (
    <section className="py-24 bg-bg-subtle overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Mockup */}
          <div className="w-full lg:w-3/5" style={{ perspective: '1000px' }}>
            <div className="shadow-warm-lg rounded-card overflow-hidden bg-bg-base border border-border-subtle" style={{ transform: 'rotateY(-5deg) rotateX(5deg) rotate(-1deg)' }}>
              {/* Dashboard Top Bar */}
              <div className="bg-bg-base border-b border-border-subtle p-4 flex justify-between items-center">
                <div className="font-display font-bold text-ink">LearnPortal</div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Sample Preview
                  </span>
                  <span className="text-sm font-medium text-ink-secondary">Arjun M.</span>
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-bg-base/50">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-bg-card p-4 rounded-card border border-border-subtle shadow-warm-sm flex flex-col items-center justify-center">
                    <BookOpen className="w-5 h-5 text-brand-600 mb-2" />
                    <span className="text-2xl font-bold text-ink">{demo.courses}</span>
                    <span className="text-xs text-ink-muted mt-1 text-center">Courses Enrolled</span>
                  </div>
                  <div className="bg-bg-card p-4 rounded-card border border-border-subtle shadow-warm-sm flex flex-col items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-brand-600 mb-2" />
                    <span className="text-2xl font-bold text-ink">{demo.lessons}</span>
                    <span className="text-xs text-ink-muted mt-1 text-center">Lessons Completed</span>
                  </div>
                  <div className="bg-bg-card p-4 rounded-card border border-brand-200 shadow-warm-sm flex flex-col items-center justify-center bg-brand-50/30">
                    <Flame className="w-5 h-5 text-brand-600 mb-2" />
                    <span className="text-2xl font-bold text-brand-700">{demo.streak} days</span>
                    <span className="text-xs text-ink-muted mt-1 text-center">Current Streak</span>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-bg-card p-5 rounded-card border border-border-subtle shadow-warm-sm mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-display font-semibold text-ink">JEE Advanced Mechanics</h4>
                    <span className="text-sm font-bold text-brand-600">{demo.progress}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full" style={{ width: `${demo.progress}%` }}></div>
                  </div>
                </div>

                {/* Upcoming Sessions */}
                <div>
                  <h4 className="font-display font-semibold text-ink mb-4">Upcoming Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-bg-card rounded-lg border border-border-subtle shadow-warm-sm">
                      <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 mr-4">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-ink">Rotational Dynamics Doubt Class</h5>
                        <div className="flex items-center text-xs text-ink-muted mt-1">
                          <Clock className="w-3 h-3 mr-1" /> Today, 6:00 PM
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-muted" />
                    </div>
                    <div className="flex items-center p-3 bg-bg-card rounded-lg border border-border-subtle shadow-warm-sm">
                      <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 mr-4">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-ink">Weekly Mock Test Analysis</h5>
                        <div className="flex items-center text-xs text-ink-muted mt-1">
                          <Clock className="w-3 h-3 mr-1" /> Tomorrow, 10:00 AM
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Text & CTA */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border-subtle px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">
              Sample Dashboard Preview
            </span>
            <h2 className="font-display text-3xl font-semibold text-ink md:text-5xl mb-6 leading-tight">
              Your Personalized Learning Command Center
            </h2>
            <p className="text-lg text-ink-secondary mb-8">
              Track your progress, join live classes, and access all your study materials from one beautifully designed, easy-to-use dashboard.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-pill bg-brand-600 text-white font-semibold hover:bg-brand-500 transition-colors shadow-warm-md"
            >
              {CTA.FREE_SIGNUP} to Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
