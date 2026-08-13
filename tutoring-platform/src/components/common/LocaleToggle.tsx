'use client';

import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export default function LocaleToggle() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('locale');
    return saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const toggle = () => {
    const next: Locale = locale === 'en' ? 'hi' : 'en';
    setLocale(next);
    localStorage.setItem('locale', next);
    // TODO: implement i18n routing — for now just toggles the HTML lang attribute
    document.documentElement.lang = next;
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
      aria-label={`Switch language to ${locale === 'en' ? 'Hindi' : 'English'}`}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{locale === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}