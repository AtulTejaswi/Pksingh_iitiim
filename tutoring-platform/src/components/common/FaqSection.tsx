'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is the refund policy?', a: 'We offer a 7-day full refund window for all Live Cohort and 1:1 Mentorship plans. Self-Paced (Free) plans are not eligible for refunds. Contact support@pksingh.com to initiate a refund.' },
  { q: 'What are the live class timings and timezone?', a: 'Live classes are held in the evening (7:00 PM – 9:00 PM IST) on weekdays, with weekend doubt-solving sessions on Saturday and Sunday mornings. All timings are in Indian Standard Time (IST, UTC+5:30).' },
  { q: 'How quickly are doubts resolved?', a: 'For 1:1 Mentorship students, doubts are resolved within 4 hours via WhatsApp/chat. For Live Cohort students, doubts are addressed in the next live session or within 24 hours via the community forum.' },
  { q: 'What is the batch size?', a: 'Live Cohort batches are capped at 25 students to ensure individual attention. 1:1 Mentorship is strictly one student at a time.' },
  { q: 'Is there a demo class available?', a: 'Yes! You can watch a free sample lesson on our homepage. We also offer a free 15-minute discovery call for 1:1 Mentorship prospects — book it through the support page.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and bank transfers. EMI options are available for the 1:1 Mentorship plan.' },
  { q: 'Can I switch plans mid-month?', a: 'Yes, you can upgrade from Live Cohort to 1:1 Mentorship at any time. The prorated amount will be adjusted. Downgrades take effect from the next billing cycle.' },
  { q: 'Do you offer courses for exams other than JEE/NEET?', a: 'Yes. We cover SAT, CAT, GMAT, and CBSE board exams. Check our Courses page for the full catalog. If you don\'t see your exam, contact us.' },
];

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
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
}

export default function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">FAQ</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq) => <FaqItem key={faq.q} faq={faq} />)}
      </div>
    </section>
  );
}