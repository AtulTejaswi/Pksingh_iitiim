import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

const rows = [
  { label: 'Pace of Learning', mass: 'Fixed for 100+ students', mentor: 'Adapted to your grasping speed' },
  { label: 'Doubt Resolution', mass: 'Queued or answered by TAs', mentor: 'Direct access to the expert' },
  { label: 'Study Strategy', mass: 'One-size-fits-all generic plan', mentor: 'Highly targeted weak-area focus' },
  { label: 'Accountability', mass: 'You\'re just a roll number', mentor: 'Weekly check-ins & habit tracking' },
  { label: 'Exam Analysis', mass: 'Automated scorecard only', mentor: 'Detailed behavioral & error review' },
];

export default function MentorshipComparison() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-base">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Why Mentorship?
            </span>
            <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              The <span className="text-brand-600">1-on-1</span> Advantage
            </h2>
            <p className="text-ink-secondary mt-4 max-w-2xl mx-auto">
              Mass classes teach the syllabus. Mentorship teaches you how to think, adapt, and maximize your specific potential.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="overflow-hidden rounded-card border border-border-subtle shadow-warm-sm">
            <div className="grid grid-cols-3 bg-bg-subtle text-sm font-semibold text-ink-secondary">
              <div className="p-5" />
              <div className="p-5">Mass Classes</div>
              <div className="p-5 bg-brand-50 text-brand-700">1:1 Mentorship</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-bg-card' : 'bg-bg-base'}`}
              >
                <div className="p-5 font-medium text-ink">{r.label}</div>
                <div className="p-5 text-ink-muted">{r.mass}</div>
                <div className="p-5 bg-brand-50/40 font-medium text-ink">{r.mentor}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
