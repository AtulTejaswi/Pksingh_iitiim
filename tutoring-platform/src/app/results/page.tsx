import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, BarChart3, FileCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verified Student Outcomes | PK Singh Mentorship',
  description:
    'Aggregated, verifiable exam outcomes from PK Singh mentorship — JEE, NEET, SAT and more. Every result is published with linked scorecard proof.',
};

const VERIFICATION_STEPS = [
  {
    title: 'Proof collected',
    text: 'A student submits their official scorecard or a recorded video walkthrough of their result.',
  },
  {
    title: 'Reviewed on file',
    text: 'The mentoring team checks the document against the student record before anything is marked verified.',
  },
  {
    title: 'Published with a link',
    text: 'Only fully verified results are published, always with a link to the proof so anyone can review it.',
  },
];

const TRACKED_METRICS = [
  'JEE Main percentile distribution',
  'JEE Advanced AIR ranges',
  'NEET score distribution',
  'SAT score distribution',
  'CBSE / board exam subject scores',
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-[0.2em] mb-6">
          Verified Outcomes
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Student Outcomes, <span className="text-amber-600">Verified by Proof</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-12">
          We believe trust is built with evidence, not anecdotes. This page will host aggregate
          score distributions across every exam track we mentor for. Nothing is published here
          without a linked scorecard or video on file.
        </p>

        {/* Honest current state */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 mb-14">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">The first verified batch is being aggregated</h2>
              <p className="text-slate-600 leading-relaxed">
                As results are collected and verified, they will appear here as score distributions —
                not cherry-picked top scores. In the meantime, this page explains exactly how we verify
                and what we track.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <div className="rounded-3xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
              <FileCheck className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">How results are verified</h3>
            <ol className="space-y-5">
              {VERIFICATION_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex-none w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">What will be tracked</h3>
            <ul className="space-y-3">
              {TRACKED_METRICS.map((metric) => (
                <li key={metric} className="flex items-start gap-3 text-slate-700">
                  <TrendingUp className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                  <span className="text-sm font-medium">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Start free to become a verified outcome <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
