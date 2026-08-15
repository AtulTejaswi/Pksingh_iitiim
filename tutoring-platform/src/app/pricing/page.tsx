import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import PricingSection from '@/components/common/PricingSection';
import { FaqAccordion } from '@/components/common/FaqSection';
import { faqs } from '@/data/faqs';
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import PublicPageShell from '@/components/common/PublicPageShell';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Pricing & Plans | PK Singh Mentorship',
  description:
    'Transparent pricing for PK Singh mentorship — Free Self-Paced plan, Live Cohort at ₹2,999/month, and 1:1 Mentorship at ₹9,999/month with 7-day refund policy.',
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
  openGraph: {
    title: 'Pricing & Plans | PK Singh Mentorship',
    description:
      'Free, Live Cohort and 1:1 Mentorship plans with a 7-day refund policy — from an IIT + IIM alumnus.',
    url: `${SITE_URL}/pricing`,
    siteName: 'PK Singh Mentorship',
    images: [{ url: '/og/pricing.jpg', width: 1200, height: 630, alt: 'PK Singh Mentorship pricing plans' }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <PublicPageShell>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pricing', url: '/pricing' },
        ]}
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-bg-base pt-24 pb-8 md:pt-32">
        <div className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full bg-brand-300/30 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
              Pricing
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink md:text-5xl">
              Simple, transparent plans for <span className="text-brand-600">every stage</span> of preparation
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary">
              Start free, upgrade when you are ready. Every paid plan comes with a 7-day full refund window.
            </p>
          </Reveal>
        </div>
      </section>

      <PricingSection />

      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">Pricing questions</h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </PublicPageShell>
  );
}
