import React from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { PRICING_CONFIG } from '@/data/site-config';

type Tier = {
  name: string;
  price: string;
  priceSuffix: string;
  cta: string;
  ctaHref: string;
  badge?: string;
  features: readonly string[];
};

function PricingCard({ tier, highlighted }: { tier: Tier; highlighted: boolean }) {
  return (
    <Reveal className={`relative rounded-card p-8 transition-all duration-300 hover:-translate-y-1 ${
      highlighted
        ? 'border-2 border-brand-500 bg-bg-cardTint shadow-warm-lg'
        : 'border border-border-subtle bg-bg-card shadow-warm-sm'
    }`}>
      {highlighted && tier.badge && (
        <span className="absolute -top-3 left-8 rounded-pill bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
          {tier.badge}
        </span>
      )}
      <h3 className="font-display text-xl font-semibold text-ink">{tier.name}</h3>
      <p className="mt-2 font-display text-4xl font-semibold text-ink">{tier.price}<span className="text-base font-medium text-ink-muted">{tier.priceSuffix}</span></p>
      <ul className="mt-6 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={tier.ctaHref}
        className={`mt-8 block rounded-pill px-6 py-3 text-center font-semibold transition-all ${
          highlighted
            ? 'bg-brand-600 text-white shadow-warm-md hover:shadow-warm-glow'
            : 'border border-border-strong text-ink hover:border-brand-500 hover:text-brand-600'
        }`}
      >
        {tier.cta}
      </a>
    </Reveal>
  );
}

export default function PricingSection() {
  const { selfPaced, liveCohort, oneOnOne } = PRICING_CONFIG;
  const tiers: Tier[] = [selfPaced, liveCohort, oneOnOne];

  return (
    <section className="py-24 bg-bg-subtle" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-sm font-semibold tracking-wider mb-4">
              Pricing
            </span>
            <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              Choose Your Learning Path
            </h2>
            <p className="text-ink-secondary mt-4 text-lg font-sans">
              Select the plan that best fits your goals and learning style.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12" delay={80}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {tiers.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                highlighted={Boolean(tier.badge)}
              />
            ))}
          </div>
        </Reveal>

        {/* Trust badges near pricing */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 2v3M16 2v3M5 12h14" /></svg>
            Secure payment
          </span>
          <span className="w-1 h-1 rounded-full bg-border-strong hidden sm:block" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeWidth="2" /><circle cx="12" cy="12" r="9" /></svg>
            7-day refund policy
          </span>
          <span className="w-1 h-1 rounded-full bg-border-strong hidden sm:block" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            SSL encrypted
          </span>
        </div>
      </div>
    </section>
  );
}
