'use client';

import React from 'react';
import { COHORT_CONFIG } from '@/data/site-config';
import { Users, Calendar } from 'lucide-react';

export default function CohortBanner() {
  const seatsLeft = COHORT_CONFIG.totalSeats - COHORT_CONFIG.filledSeats;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold">Next Cohort: {COHORT_CONFIG.cohortLabel}</p>
              <p className="text-sm text-white/80">Starts {new Date(COHORT_CONFIG.upcomingStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-bold">{seatsLeft} seats left</span>
            </div>
            <a href="/signup" className="bg-white text-amber-700 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-amber-50 transition-colors shadow-md whitespace-nowrap">
              Reserve Your Spot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}