import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

const features = [
  { title: 'Live Interactive Classes', desc: 'Real-time sessions with PK Singh. Ask doubts, solve problems together.', big: true },
  { title: 'Recorded Lecture Library', desc: 'Access all past sessions anytime. Rewatch, revise, repeat.' },
  { title: 'Doubt Support', desc: 'Get personalized answers within 24 hours from the mentor.' },
  { title: 'Progress Tracking', desc: 'Dashboard with streaks, completion analytics, and weekly reports.' },
  { title: 'Mock Tests & Analysis', desc: 'Exam-pattern practice tests with detailed performance breakdown.' },
];

export default function WhatYouGet() {
  return (
    <section className="py-24 bg-bg-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              What&apos;s Included
            </span>
            <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              Everything You Need to Succeed
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className={f.big ? 'md:col-span-2 md:row-span-2' : ''}>
              <div
                className={`h-full rounded-card border border-border-subtle bg-bg-card p-8 shadow-warm-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-md ${
                  f.big
                    ? 'flex flex-col justify-end bg-gradient-to-br from-brand-500 to-brand-700 text-white'
                    : ''
                }`}
              >
                <h3 className={`font-display text-xl font-semibold ${f.big ? 'text-white' : 'text-ink'}`}>
                  {f.title}
                </h3>
                <p className={`mt-3 leading-relaxed ${f.big ? 'text-brand-50' : 'text-ink-secondary'}`}>
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
