'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface QuoteData {
  id?: string;
  text: string;
  source: string;
  reference?: string | null;
}

// Fallback quotes in case API fails or DB is empty
const fallbackQuotes: QuoteData[] = [
  {
    text: "There is only one single-pointed determination; many-branched and endless are the thoughts of the indecisive.",
    source: "Bhagavad Gita",
    reference: "2.41"
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    source: "Marcus Aurelius",
    reference: "Meditations"
  },
  {
    text: "The mind is everything. What you think you become.",
    source: "Buddha",
    reference: "Dhammapada"
  }
];

export default function QuotesCarousel() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // For touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch('/api/quotes');
        const data = await res.json();
        if (data.success && data.quotes.length > 0) {
          setQuotes(data.quotes);
        } else {
          setQuotes(fallbackQuotes);
        }
      } catch (err) {
        setQuotes(fallbackQuotes);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [quotes.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (isLoading) {
    return (
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-amber-50/50 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </section>
    );
  }

  if (quotes.length === 0) return null;

  return (
    <section 
      className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FDFBF7]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle texture/gradient background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/60 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative max-w-5xl mx-auto z-10 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-amber-800 text-xs font-bold uppercase tracking-[0.3em] mb-12 backdrop-blur-sm shadow-sm">
          Wisdom & Mindset
        </span>
        
        <div className="w-full relative min-h-[220px] flex items-center justify-center">
          {quotes.map((quote, idx) => {
            const isActive = idx === currentIndex;
            // Simple fade and slight slide transition
            return (
              <div 
                key={quote.id || idx}
                className={`absolute w-full px-8 md:px-16 transition-all duration-700 ease-in-out flex flex-col items-center text-center ${
                  isActive 
                    ? 'opacity-100 translate-y-0 z-10' 
                    : 'opacity-0 translate-y-8 z-0 pointer-events-none'
                }`}
              >
                <Quote className="w-10 h-10 text-amber-200 mb-6" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-slate-800 leading-[1.4] mb-8 font-medium">
                  "{quote.text}"
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-px bg-amber-300 mb-4"></div>
                  <p className="text-sm uppercase tracking-widest font-bold text-slate-500">
                    {quote.source}
                  </p>
                  {quote.reference && (
                    <p className="text-xs tracking-wider text-slate-400 mt-1">
                      {quote.reference}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-12">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:shadow-md transition-all"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-amber-500 w-6' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:shadow-md transition-all"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
