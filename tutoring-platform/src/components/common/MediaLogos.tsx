'use client';

import React from 'react';
import Image from 'next/image';

const placeholderLogos = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  label: `Media Logo ${i + 1}`,
}));

export default function MediaLogos() {
  return (
    <section className="py-12 border-y border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-8">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {placeholderLogos.map((logo) => (
            <div
              key={logo.id}
              className="h-10 w-28 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold tracking-wider"
            >
              {logo.label}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          {/* TODO: Replace placeholder logo slots above with real media logos */}
          Logo placeholder — replace with actual publication logos
        </p>
      </div>
    </section>
  );
}