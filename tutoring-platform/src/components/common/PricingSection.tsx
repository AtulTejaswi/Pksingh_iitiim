import React from 'react';
import Link from 'next/link';
import { CheckCircle2, User, Users, GraduationCap } from 'lucide-react';

export default function PricingSection() {
  // TODO: Replace prices with actual pricing from site owner
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wider mb-4">
            Pricing
          </span>
          <h2 className="text-4xl font-bold text-slate-900 font-outfit mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-slate-600 font-inter">
            Select the plan that best fits your goals and learning style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Tier 1: Self-Paced */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 font-outfit">Self-Paced</h3>
              <User className="w-6 h-6 text-slate-400" />
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Free</span>
            </div>
            <ul className="space-y-4 mb-8 font-inter">
              {[
                'Access to recorded lecture library',
                'Downloadable study notes & formulas',
                'Community discussion forum',
                'Basic progress tracking',
                'Email support',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 px-6 text-center rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-colors"
            >
              Start Learning Free
            </Link>
          </div>

          {/* Tier 2: Live Cohort (Most Popular) */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-amber-500 p-8 relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 font-outfit">Live Cohort</h3>
              <Users className="w-6 h-6 text-amber-500" />
            </div>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-bold text-slate-900">₹2,999</span>
              <span className="text-slate-500 ml-2">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 font-inter">
              {[
                'Everything in Self-Paced',
                'Live interactive classes with PK Singh',
                'Weekly doubt-solving sessions',
                'Chapter-wise mock tests with analysis',
                'Recorded backup of all live sessions',
                'Priority doubt support',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 px-6 text-center rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
            >
              Join Live Cohort
            </Link>
          </div>

          {/* Tier 3: 1:1 Mentorship */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 font-outfit">1:1 Mentorship</h3>
              <GraduationCap className="w-6 h-6 text-purple-500" />
            </div>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-bold text-slate-900">₹9,999</span>
              <span className="text-slate-500 ml-2">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 font-inter">
              {[
                'Everything in Live Cohort',
                'Personal 1:1 sessions with PK Singh',
                'Custom study plan & timeline',
                'Mock test review with detailed feedback',
                'Direct WhatsApp/call access',
                'Guaranteed doubt resolution within 4 hours',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 px-6 text-center rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
