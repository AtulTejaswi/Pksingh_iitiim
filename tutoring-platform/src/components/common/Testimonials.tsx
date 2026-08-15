'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Star, BadgeCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface Testimonial {
  id: string;
  name: string;
  studentPhoto: string | null;
  rank: string | null;
  achievement: string | null;
  review: string;
  proofUrl: string | null;
  verifiedAt: string | null;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<Testimonial[]>('/cms/testimonials')
      .then((res) => {
        if (!cancelled) setTestimonials(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setTestimonials([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayed = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 mb-4 shadow-sm">
          Student Success
        </div>
        <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          What Our Students Achieve
        </h2>
        <p className="text-ink-secondary max-w-2xl mx-auto text-lg mt-4">
          We publish only <span className="font-semibold text-ink">verified</span> student results, each with a linked scorecard or video proof.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-card border border-border-subtle bg-bg-card p-8 animate-pulse">
              <div className="h-4 bg-border-subtle rounded w-10 mb-5"></div>
              <div className="space-y-3">
                <div className="h-4 bg-border-subtle rounded w-full"></div>
                <div className="h-4 bg-border-subtle rounded w-5/6"></div>
              </div>
              <div className="h-12 bg-border-subtle rounded-full w-2/3 mt-8"></div>
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center rounded-card border border-border-subtle bg-bg-card p-10 shadow-warm-sm">
          <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">Verified results are on their way</h3>
          <p className="text-ink-secondary text-sm leading-relaxed mb-6">
            We only publish student results that have been verified with a linked scorecard or video. As soon as the first batch is verified, you&apos;ll see them here.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-bold text-sm hover:bg-ink-secondary transition-colors"
          >
            See how we verify outcomes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {displayed.map((t) => (
              <div
                key={t.id}
                className="p-8 rounded-card border border-border-subtle bg-bg-card shadow-warm-sm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <Quote className="w-10 h-10 text-brand-100 mb-5" />

                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-ink-secondary mb-8 flex-grow leading-relaxed font-medium">&ldquo;{t.review}&rdquo;</p>

                <div className="flex items-center gap-4 mt-auto">
                  {t.studentPhoto ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                      <Image src={t.studentPhoto} alt={t.name} width={48} height={48} className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0">
                      {t.name.trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-ink truncate">{t.name}</span>
                      <BadgeCheck className="w-4 h-4 text-sky-500 shrink-0" aria-label="Verified" />
                    </div>
                    <div className="text-sm text-ink-muted font-medium truncate">{t.rank}</div>
                  </div>
                </div>

                {t.proofUrl && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <a
                      href={t.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      <BadgeCheck className="w-3.5 h-3.5" />
                      View proof{t.achievement ? ` — ${t.achievement}` : ''}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showAll && testimonials.length > 3 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-3 rounded-full border border-border-subtle bg-bg-card text-ink-secondary font-semibold hover:bg-bg-subtle hover:shadow-md transition-all duration-300"
              >
                Read more verified stories
              </button>
            </div>
          )}
        </>
      )}

      {/* Video Spotlight → cross-linked to the Results/Outcomes page */}
      <div className="mt-20 rounded-card bg-bg-card border border-border-subtle p-8 sm:p-12 text-ink relative overflow-hidden shadow-warm-lg flex flex-col md:flex-row items-center gap-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.12),transparent_40%)] pointer-events-none"></div>
        <div className="md:w-1/2 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100/30 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Student Stories
          </span>
          <h3 className="font-display text-3xl font-semibold text-ink mb-4 leading-tight">
            Every result here is backed by a verified scorecard.
          </h3>
          <p className="text-ink-secondary mb-6 text-lg">
            Explore our outcomes page for aggregate score distributions and the exact proof we hold on file for each published result.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-white font-bold text-sm hover:bg-brand-500 transition-colors shadow-warm-sm"
          >
            Explore Verified Outcomes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:w-1/2 w-full relative z-10">
          <div className="aspect-video bg-bg-subtle rounded-2xl border border-border-subtle overflow-hidden relative flex flex-col items-center justify-center p-8 text-center">
            <ShieldCheck className="w-14 h-14 text-brand-600 mb-4" />
            <p className="text-ink font-semibold mb-2">Verification-first publishing</p>
            <p className="text-ink-muted text-sm max-w-sm">
              Scorecards and testimonials are reviewed against proof before they are ever shown on this site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
