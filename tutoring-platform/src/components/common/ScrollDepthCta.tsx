'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';
import Link from 'next/link';
import { CTA } from '@/lib/cta';

export default function ScrollDepthCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (dismissed || shownRef.current) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct > 0.5 && !shownRef.current) {
        shownRef.current = true;
        setShow(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-slide-up">
      <div className="mx-4 mb-28 rounded-card bg-bg-card border border-border-subtle shadow-warm-lg p-5">
        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-bg-subtle flex items-center justify-center hover:bg-border-strong transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-ink-muted" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink">Free Study Guide</p>
            <p className="text-xs text-ink-muted">JEE/NEET/SAT prep notes</p>
          </div>
          <Link
            href="#free-preview"
            onClick={() => { setShow(false); setDismissed(true); }}
            className="shrink-0 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-colors"
          >
            {CTA.FREE_SIGNUP}
          </Link>
        </div>
      </div>
    </div>
  );
}
