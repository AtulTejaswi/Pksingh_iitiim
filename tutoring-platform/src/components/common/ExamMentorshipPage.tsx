import Link from 'next/link';
import { CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { StatCounter } from '@/components/ui/StatCounter';
import PricingSection from '@/components/common/PricingSection';
import { FaqAccordion } from '@/components/common/FaqSection';
import { BreadcrumbJsonLd, ExamCourseJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { CTA } from '@/lib/cta';
import { SITE_STATS } from '@/data/site-config';
import type { ExamPageConfig } from '@/data/exam-pages';

// 0 / undefined means "not yet verified" → honest "Coming soon" (no fabricated numbers)
const verified = (raw: number) => (raw && raw > 0 ? raw : null);

export default function ExamMentorshipPage({ exam }: { exam: ExamPageConfig }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: `${exam.exam} Mentorship`, url: `/${exam.slug}` },
        ]}
      />
      <ExamCourseJsonLd
        name={exam.courseName}
        description={exam.courseDescription}
        examName={exam.exam}
      />
      <FaqJsonLd items={exam.faqs} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-bg-base pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-brand-300/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-brand-100/50 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-ink-muted">
              <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-secondary">{exam.exam} Mentorship</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
              {exam.badge}
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-ink md:text-5xl">
              {exam.h1}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary">{exam.lead}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-pill bg-brand-600 px-8 py-4 font-semibold text-white shadow-warm-md transition-all duration-300 hover:shadow-warm-glow hover:-translate-y-0.5"
              >
                {CTA.FREE_SIGNUP}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/support"
                className="rounded-pill px-8 py-4 font-semibold text-ink-secondary transition-colors hover:text-brand-600"
              >
                {CTA.PAID_ENROLL} &rarr;
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-muted">{exam.heroNote}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="mx-auto max-w-7xl rounded-card bg-bg-card py-10 shadow-warm-lg border border-border-subtle">
          <div className="grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
            <StatCounter value={verified(SITE_STATS.learnersMentored)} suffix="+" label="Learners mentored" />
            <StatCounter value={verified(SITE_STATS.interactiveCourses)} label="Courses in catalog" />
            <StatCounter value={verified(SITE_STATS.lessonModules)} label="Lesson modules" />
            <StatCounter value={verified(SITE_STATS.freeResources)} label="Free study guides" />
          </div>
        </div>
      </section>

      {/* ── Why this mentorship ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <span className="inline-block rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              Why {exam.exam} Mentorship
            </span>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold text-ink md:text-5xl">
              One mentor, one plan, <span className="text-brand-600">your exam</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {exam.intro.map((paragraph, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="text-ink-secondary leading-relaxed">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="bg-bg-subtle py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              What the <span className="text-brand-600">{exam.exam}</span> plan is built on
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {exam.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 80}>
                <div className="h-full rounded-card border border-border-subtle bg-bg-card p-8 shadow-warm-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-md">
                  <h3 className="font-display text-xl font-semibold text-ink">{pillar.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-secondary">{pillar.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              What&apos;s inside {exam.exam} mentorship
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {exam.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-card border border-border-subtle bg-bg-card p-5 shadow-warm-sm">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-600" />
                  <span className="text-ink-secondary leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-muted">{exam.includesNote}</p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                FAQ
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold text-ink md:text-5xl">
                {exam.exam} mentorship — common questions
              </h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <FaqAccordion items={exam.faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── Final CTA ── */}
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-brand-500 to-brand-700 p-10 text-white shadow-warm-lg md:p-14">
              <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/20 blur-[80px]" />
              <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <h2 className="font-display text-3xl font-semibold md:text-4xl">
                    Ready to crack {exam.exam}?
                  </h2>
                  <p className="mt-3 max-w-xl text-brand-50">
                    Start free with the recorded lecture library and study guide, then upgrade to the plan that fits your target.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-white px-8 py-4 font-semibold text-brand-700 shadow-warm-md transition-all duration-300 hover:shadow-warm-glow hover:-translate-y-0.5"
                >
                  {CTA.FREE_SIGNUP}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
