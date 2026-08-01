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
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">FAQ</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-slate-600 mt-4 text-lg max-w-xl mx-auto">The answers students ask most before enrolling.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.q} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                aria-expanded={open}
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 hover:shadow-md transition-all duration-300"
        >
          View all FAQs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
