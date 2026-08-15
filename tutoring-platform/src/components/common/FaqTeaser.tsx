'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

const faqs = [
  { q: 'What is the refund policy?', a: 'We offer a 7-day full refund window for all Live Cohort and 1:1 Mentorship plans. Self-Paced (Free) plans are not eligible for refunds. Contact support@pksingh.com to initiate a refund.' },
  { q: 'What are the live class timings and timezone?', a: 'Live classes are held in the evening (7:00 PM – 9:00 PM IST) on weekdays, with weekend doubt-solving sessions on Saturday and Sunday mornings. All timings are in Indian Standard Time (IST, UTC+5:30).' },
  { q: 'How quickly are doubts resolved?', a: 'For 1:1 Mentorship students, doubts are resolved within 4 hours via WhatsApp/chat. For Live Cohort students, doubts are addressed in the next live session or within 24 hours via the community forum.' },
  { q: 'What is the batch size?', a: 'Live Cohort batches are capped at 25 students to ensure individual attention. 1:1 Mentorship is strictly one student at a time.' },
];

export default function FaqTeaser() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">
          FAQ
        </span>
        <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="text-ink-secondary mt-4 text-lg max-w-xl mx-auto">The answers students ask most before enrolling.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.q} className="border border-border-subtle rounded-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-bg-card hover:bg-bg-subtle transition-colors"
                aria-expanded={open}
              >
                <span className="font-semibold text-ink pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-ink-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-5 pb-5 text-ink-secondary text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-subtle bg-bg-card text-ink-secondary font-bold text-sm hover:bg-bg-subtle hover:shadow-md transition-all duration-300"
        >
          View all FAQs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
