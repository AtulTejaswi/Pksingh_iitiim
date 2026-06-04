import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';

export const metadata: Metadata = {
  title: "Mentor's Journey",
  description: 'The professional journey of PK Singh — IIT-JEE, IIM Calcutta, global consulting, and mentorship.',
};

export default function MentorJourneyPage() {
  return (
    <PublicPageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-4">
            A Journey of Excellence, Leadership & Mentorship
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            From securing an All India Rank of 1386 in IIT-JEE to earning an MBA from IIM Calcutta and later pursuing a
            PhD, PK Singh&apos;s journey reflects a relentless pursuit of knowledge and excellence.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-8 space-y-4 text-slate-600 text-sm leading-relaxed shadow-sm">
          <p>
            With over 30 years of combined experience across industry and academia, he has built a distinguished career
            spanning engineering, strategy, operations, business development, marketing, consulting, and education.
          </p>
          <p>
            His professional journey began at Bharat Heavy Electricals Limited (BHEL), where he spent a decade managing
            large-scale energy projects. He later worked with PwC, Abengoa, Black & Veatch, and Choice Consultancy
            Services, leading projects across India, the Middle East, and Southeast Asia.
          </p>
          <p>
            Driven by a passion for shaping future leaders, he transitioned into academia and mentoring, teaching at
            institutions such as NMIMS and other leading universities.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Timeline</h2>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><strong className="text-slate-900">1993</strong> – AIR 1386 in IIT-JEE</li>
            <li><strong className="text-slate-900">1997</strong> – B.Tech, IIT (BHU) Varanasi</li>
            <li><strong className="text-slate-900">2008</strong> – MBA, IIM Calcutta</li>
            <li><strong className="text-slate-900">2020–Present</strong> – Mentor, educator & consultant</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Home
          </Link>
          <Link href="/courses" className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-violet-500">
            Explore courses
          </Link>
        </div>
      </div>
    </PublicPageShell>
  );
}
