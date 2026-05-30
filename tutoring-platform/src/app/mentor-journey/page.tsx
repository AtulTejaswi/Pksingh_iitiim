"use client";

import React from 'react';
import Link from 'next/link';

export default function MentorJourneyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-[color:var(--text-primary)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-4">A Journey of Excellence, Leadership & Mentorship</h1>
          <p className="muted text-lg leading-relaxed">
            From securing an All India Rank of 1386 in IIT-JEE to earning an MBA from IIM Calcutta and later pursuing a PhD, Pramod Kumar Singh's journey reflects a relentless pursuit of knowledge and excellence.
          </p>
        </div>

        <div className="card mb-8">
          <p className="text-secondary mb-4">
            With over 30 years of combined experience across industry and academia, he has built a distinguished career spanning engineering, strategy, operations, business development, marketing, consulting, and education.
          </p>

          <p className="text-secondary mb-4">
            His professional journey began at Bharat Heavy Electricals Limited (BHEL), where he spent a decade managing large-scale energy projects and strategic initiatives. He later worked with globally renowned organizations including PwC, Abengoa, Black & Veatch, and Choice Consultancy Services, leading projects and business expansion across India, the Middle East, and Southeast Asia.
          </p>

          <p className="text-secondary mb-4">
            Throughout his career, he has collaborated with global CEOs, government agencies, international development organizations, and industry leaders on projects funded by the World Bank, Asian Development Bank, JICA, DfID, EXIM Bank, and various ministries across multiple countries.
          </p>

          <p className="text-secondary">
            Driven by a passion for shaping future leaders, he transitioned into academia and mentoring, teaching at prestigious institutions such as NMIMS and other leading universities. His expertise spans Strategy, Operations Management, Supply Chain Analytics, Project Management, Marketing Analytics, Quantitative Techniques, and Research Methodology.
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold high-contrast mb-4">Website Timeline</h2>
          <ul className="space-y-3 text-secondary">
            <li><strong>1993</strong> – AIR 1386 in IIT-JEE</li>
            <li><strong>1997</strong> – B.Tech, Mechanical Engineering, IIT (BHU) Varanasi</li>
            <li><strong>1997–2007</strong> – Strategic Planning & Project Management at BHEL</li>
            <li><strong>2008</strong> – MBA (Operations & Strategy), IIM Calcutta</li>
            <li><strong>2008–2011</strong> – Senior Consultant at PwC</li>
            <li><strong>2011–2014</strong> – Head of Business Development, Asia & Middle East, Abengoa</li>
            <li><strong>2014–2017</strong> – Strategy, Marketing & Growth Leadership at Black & Veatch</li>
            <li><strong>2017–2019</strong> – International Business Development & Consulting Leadership</li>
            <li><strong>2020–Present</strong> – Mentor, Educator, Consultant & PhD Researcher</li>
            <li><strong>Today</strong> – Guiding students, professionals, and future leaders through knowledge, strategy, and real-world insights</li>
          </ul>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold high-contrast mb-4">Industry & Academic Highlights</h2>
          <p className="text-secondary mb-3">He has worked on projects funded and supported by international and national agencies including:</p>
          <div className="grid sm:grid-cols-2 gap-3 text-secondary">
            <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)]">World Bank</div>
            <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)]">Asian Development Bank (ADB)</div>
            <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)]">JICA</div>
            <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)]">DfID, EXIM Bank & multiple Ministries</div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Link href="/" className="btn btn-ghost">Back</Link>
          <Link href="/my-courses" className="btn btn-primary">Explore Courses</Link>
        </div>
      </div>
    </div>
  );
}
