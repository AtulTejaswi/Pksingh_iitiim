'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/data/faqs';
import type { FaqItem } from '@/data/faqs';

export { faqs };
export type { FaqItem };

export function FaqAccordion({ items, singleColumn = true }: { items: FaqItem[]; singleColumn?: boolean }) {
  return (
    <div className={singleColumn ? 'space-y-3' : 'grid gap-3 md:grid-cols-2'}>
      {items.map((faq) => <FaqItem key={faq.q} faq={faq} />)}
    </div>
  );
}

function FaqItem({ faq }: { faq: FaqItem }) {
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
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
      </div>
      <FaqAccordion items={faqs} />
    </section>
  );
}
