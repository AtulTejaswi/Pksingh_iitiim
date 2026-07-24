'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import { wisdomQuotes, type WisdomQuote } from '@/data/wisdom-quotes';

const SLIDE_INTERVAL = 7000;
const categoryLabels: Record<string, string> = {
  'bhagavad-gita': 'Bhagavad Gita',
  'ashtavakra-gita': 'Ashtavakra Gita',
  'vedas': 'Vedas',
  'upanishads': 'Upanishads',
};

export default function WisdomSlideshow({ variant = 'section' }: { variant?: 'section' | 'strip' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!prefersReducedMotion && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % wisdomQuotes.length);
      }, SLIDE_INTERVAL);
    }
  }, [prefersReducedMotion, isPaused]);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    startInterval();
  };

  const handleNext = () => goTo((currentIndex + 1) % wisdomQuotes.length);
  const handlePrev = () => goTo((currentIndex - 1 + wisdomQuotes.length) % wisdomQuotes.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dist = touchStartX.current - touchEndX.current;
    if (dist > 50) handleNext();
    else if (dist < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (dismissed && variant === 'strip') return null;

  const q = wisdomQuotes[currentIndex] as WisdomQuote | undefined;
  if (wisdomQuotes.length === 0) return null;

  const quote = wisdomQuotes[currentIndex];

  return (
    <section
      role="region"
      aria-label="Wisdom quotes"
      className={
        variant === 'strip'
          ? 'relative bg-slate-900 border-b border-slate-700/50'
          : 'relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FDFBF7]'
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {variant === 'strip' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0" aria-live="polite" aria-atomic="true">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs uppercase tracking-[0.2em] font-bold text-amber-400/80 whitespace-nowrap">
                Wisdom
              </span>
              <div className="h-3 w-px bg-slate-700 shrink-0"></div>
              <p className="text-sm text-slate-300 truncate">
                &ldquo;{quote.text}&rdquo;
              </p>
              <span className="shrink-0 text-xs text-slate-500 whitespace-nowrap font-medium">
                — {quote.source}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handlePrev} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors" aria-label="Previous quote">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNext} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors" aria-label="Next quote">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setDismissed(true)} className="p-1 rounded text-slate-600 hover:text-slate-400 transition-colors ml-2" aria-label="Dismiss wisdom strip">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {variant === 'section' && (
        <>
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
               style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/60 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-amber-800 text-xs font-bold uppercase tracking-[0.3em] mb-12 backdrop-blur-sm shadow-sm">
              Wisdom & Mindset
            </span>

            <div className="w-full relative min-h-[220px] flex items-center justify-center">
              {wisdomQuotes.map((q, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={`${q.category}-${idx}`}
                    className={`absolute w-full px-8 md:px-16 transition-all duration-700 ease-in-out flex flex-col items-center text-center ${
                      isActive ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'
                    }`}
                    aria-hidden={!isActive}
                  >
                    <Quote className="w-10 h-10 text-amber-200 mb-6" />
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-slate-800 leading-[1.4] mb-8 font-medium">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {categoryLabels[q.category] || q.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-center mt-3">
                      <div className="w-12 h-px bg-amber-300 mb-3"></div>
                      <p className="text-sm uppercase tracking-widest font-bold text-slate-500">{q.source}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-12">
              <button onClick={handlePrev} className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:shadow-md transition-all" aria-label="Previous quote">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {wisdomQuotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'bg-amber-500 w-6' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to quote ${idx + 1}`}
                  />
                ))}
              </div>
              <button onClick={handleNext} className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:shadow-md transition-all" aria-label="Next quote">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}