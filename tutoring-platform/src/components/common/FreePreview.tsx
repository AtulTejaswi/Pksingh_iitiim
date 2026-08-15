'use client';

import React from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, MessageCircle, BookOpen, FileText, PenLine } from 'lucide-react';
import EmailCaptureForm from '@/components/common/EmailCaptureForm';
import { WHATSAPP_CONFIG } from '@/data/site-config';
import { CTA } from '@/lib/cta';

const GUIDE_POINTS = [
  'Chapter-wise exam weightage for JEE / NEET / SAT',
  'Formula sheets and memory anchors',
  'Weekly study tips from the mentor',
];

export default function FreePreview() {
  return (
    <section id="free-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="bg-brand-50 rounded-card overflow-hidden shadow-warm-sm border border-brand-200">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Content + Email Capture */}
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink mb-4">
              Get the Free Study Guide
            </h2>
            <p className="text-lg text-ink-secondary mb-8">
              Download the exam-prep essentials and join the student community — no payment needed.
            </p>

            <ul className="space-y-3 mb-8">
              {GUIDE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-ink-secondary">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                  <span className="font-medium">{point}</span>
                </li>
              ))}
            </ul>

            <EmailCaptureForm />
          </div>

          {/* Right Side: Free access card */}
          <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-card bg-bg-card border border-border-subtle shadow-warm-md p-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-5">
                <BookOpen className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-3">Everything free when you start</h3>
              <ul className="space-y-3 mb-6 text-sm text-ink-secondary">
                <li className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  Access to the recorded lecture library
                </li>
                <li className="flex items-start gap-3">
                  <Download className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  Downloadable study notes &amp; formula sheets
                </li>
                <li className="flex items-start gap-3">
                  <PenLine className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  Basic progress tracking on the dashboard
                </li>
              </ul>
              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="block w-full text-center px-6 py-3 bg-ink text-white font-semibold rounded-card hover:bg-ink-secondary transition-colors shadow-warm-sm"
                >
                  {CTA.FREE_SIGNUP}
                </Link>
                <a
                  href={WHATSAPP_CONFIG.communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-card hover:bg-green-600 transition-colors shadow-warm-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join the WhatsApp Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
