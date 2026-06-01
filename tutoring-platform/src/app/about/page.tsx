import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Award, BookOpen, Zap, Target } from 'lucide-react';
import PublicPageShell from '@/components/common/PublicPageShell';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet PK Singh — IIT + IIM alumnus, bestselling author, and mentor for JEE, NEET, SAT and more.',
};

export default function AboutPage() {
  return (
    <PublicPageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.65fr_0.95fr] items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm">
              <Zap className="w-4 h-4 text-sky-400" /> IIT • IIM • Bestselling Author
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
                Meet PK Singh — mentor for premium exam preparation.
              </h1>
              <p className="text-slate-300 text-lg leading-8 max-w-3xl">
                With 23+ years of industry leadership and 6+ years of mentorship, PK Singh blends academic rigor and
                real-world strategy into courses that build confidence, speed and dependable rank performance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: '23+ years', value: 'Industry & coaching leadership' },
                { label: '6+ years', value: 'Classroom and 1:1 mentorship' },
                { label: 'Bestselling', value: 'Books for UK & USA audiences' },
                { label: 'Global', value: 'Institutional consulting and workshops' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.75rem] border border-slate-700 bg-slate-900/80 p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400 font-semibold mb-2">{item.label}</p>
                  <p className="text-slate-200 leading-7">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500"
              >
                Explore Courses
              </Link>
              <Link
                href="/mentor-journey"
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 shadow-sm transition hover:bg-slate-800/90"
              >
                See Mentor Journey
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 shadow-2xl">
            <div className="mb-6 overflow-hidden rounded-[1.75rem] border border-slate-700/70 bg-slate-950">
              <Image src="/images/pk-singh.svg" alt="PK Singh" width={420} height={420} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 text-center">
              <p className="text-2xl font-semibold text-slate-100">PK Singh</p>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">IIT • IIM • Author</p>
            </div>
          </aside>
        </div>
      </div>
    </PublicPageShell>
  );
}
