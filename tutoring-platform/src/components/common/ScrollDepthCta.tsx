'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';
import Link from 'next/link';

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
      <div className="mx-4 mb-4 rounded-2xl bg-white border border-slate-200 shadow-2xl p-5">
        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900">Free Study Guide</p>
            <p className="text-xs text-slate-500">JEE/NEET/SAT prep notes</p>
          </div>
          <Link
            href="#free-preview"
            onClick={() => { setShow(false); setDismissed(true); }}
            className="shrink-0 px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}