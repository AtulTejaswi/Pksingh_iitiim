'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Testimonials from '@/components/common/Testimonials';
import Navbar from '@/components/student/Navbar';
import PricingSection from '@/components/common/PricingSection';
import FreePreview from '@/components/common/FreePreview';
import TrustBadges from '@/components/common/TrustBadges';
import WhatYouGet from '@/components/common/WhatYouGet';
import DashboardPreview from '@/components/common/DashboardPreview';
import WisdomSlideshow from '@/components/common/WisdomSlideshow';

import MentorshipComparison from '@/components/common/MentorshipComparison';
import MediaLogos from '@/components/common/MediaLogos';
import CohortBanner from '@/components/common/CohortBanner';
import FaqTeaser from '@/components/common/FaqTeaser';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ExitIntentModal from '@/components/common/ExitIntentModal';
import ScrollDepthCta from '@/components/common/ScrollDepthCta';
import ReferralSection from '@/components/common/ReferralSection';
import { Reveal } from '@/components/ui/Reveal';
import { StatCounter } from '@/components/ui/StatCounter';
import { CTA } from '@/lib/cta';
import { getStaticFeaturedCourses } from '@/data/courseData';
import { useGetCourses, useGetPublicStats } from '@/hooks/useCourses';
import { useState, useEffect } from 'react';
import { GraduationCap, Award, CheckCircle2, ChevronRight, Zap, Target, Search, Flame } from 'lucide-react';
import SiteFooter from '@/components/common/SiteFooter';
import { SITE_STATS } from '@/data/site-config';

function SectionShell({ title, eyebrow, children }: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="text-center mb-14">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700 mb-4">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">{title}</h2>
      </div>
      {children}
    </Reveal>
  );
}

export default function LandingPage() {
  const { data: courses, isLoading } = useGetCourses();
  const { data: stats } = useGetPublicStats();
  const [showBottomCta, setShowBottomCta] = useState(true);

  // Treat 0 / undefined as "not yet verified" → graceful "Coming soon".
  // Stats below MIN_DISPLAY_THRESHOLD are also hidden: at the current catalog
  // size a real "1 course" / "4 learners" reads worse than an honest
  // placeholder and undermines the premium positioning.
  const MIN_DISPLAY_THRESHOLD = 10;
  const verified = (raw: number | undefined) => (raw && raw >= MIN_DISPLAY_THRESHOLD ? raw : null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBottomCta(window.scrollY < window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pick top 3 published courses from API, fallback to static featured courses
  const apiPublished = courses?.filter((course) => course.status === 'PUBLISHED') || [];
  const featuredCourses = apiPublished.length > 0
    ? apiPublished.slice(0, 3)
    : getStaticFeaturedCourses().slice(0, 3);

  return (
    <div id="main-content" role="main" className="flex flex-col min-h-screen bg-bg-base text-ink font-sans antialiased">
      <Navbar />

      {/* ───────────────────────────────────── Hero ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-bg-base pt-20 pb-20 md:pt-28 md:pb-32">
        {/* ambient warm orange glow */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-brand-300/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-brand-100/50 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-pill border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
              Premium Mentorship
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
              Learn Physics, Chemistry, Math and exam strategy from an{" "}
              <span className="text-brand-600">IIT + IIM alumnus</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary">
              Learn Physics, Chemistry, Math and exam strategy from an IIT + IIM alumnus, bestselling author and global consultant. Every course is built for clarity, confidence and accelerated exam performance — one-to-one, exam-focused, no fluff.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-pill bg-brand-600 px-8 py-4 font-semibold text-white shadow-warm-md transition-all duration-300 hover:shadow-warm-glow hover:-translate-y-0.5"
              >
                Explore Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="#free-preview"
                className="rounded-pill px-8 py-4 font-semibold text-ink-secondary transition-colors hover:text-brand-600"
              >
                Get the Free Study Guide &rarr;
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-muted">
              <span>23+ years of mentorship</span>
              <span>IIT + IIM curriculum</span>
              <span>Proven exam strategies</span>
            </div>

            {/* Interactive Search Bar (preserved content, warm restyle) */}
            <div className="relative mt-10 max-w-xl group mb-12">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-ink-muted group-focus-within:text-brand-600 transition-colors" />
              </div>
              <input
                id="site-search"
                type="text"
                placeholder="What do you want to learn today? (e.g. Physics, JEE)"
                className="w-full pl-12 pr-32 py-4 rounded-pill border border-border-subtle bg-bg-card text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-brand-500 transition-all"
              />
              <button className="absolute inset-y-1.5 right-1.5 px-6 rounded-pill bg-ink text-white font-semibold text-sm hover:bg-ink-secondary transition-colors">
                Search
              </button>
            </div>

            {/* Credibility mini-cards (preserved content, warm restyle) */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-card bg-bg-card border border-border-subtle p-6 text-center shadow-warm-sm">
                <p className="text-3xl font-bold text-ink">JEE · NEET · SAT</p>
                <p className="mt-2 text-sm text-ink-muted">Exam-focused curriculum</p>
              </div>
              <div className="rounded-card bg-bg-card border border-border-subtle p-6 text-center shadow-warm-sm">
                <p className="text-3xl font-bold text-ink">Bestselling</p>
                <p className="text-sm text-ink-muted mt-2">UK &amp; USA books</p>
              </div>
              <div className="rounded-card bg-bg-card border border-border-subtle p-6 text-center shadow-warm-sm">
                <p className="text-3xl font-bold text-ink">6+ years</p>
                <p className="text-sm text-ink-muted mt-2">Teaching experience</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md">
              <div className="absolute inset-0 -rotate-3 rounded-[32px] bg-gradient-to-br from-brand-500 to-brand-700 opacity-90" />
              <Image
                src="/images/pk-singh-photo.jpg"
                alt="PK Singh"
                width={400}
                height={500}
                className="relative z-10 h-full w-full rounded-[32px] object-cover shadow-warm-lg"
                priority
              />
              <div className="absolute -bottom-6 -left-6 z-20 rounded-2xl bg-bg-card px-5 py-4 shadow-warm-lg border border-border-subtle">
                <p className="font-display text-sm font-semibold text-ink">PK Singh</p>
                <p className="text-xs text-ink-muted">IIT • IIM • Author</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────────────────── Infinite Marquee Engagement Loop ───────────────────────────────────── */}
      <section className="border-y border-border-subtle bg-bg-subtle py-4 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee flex items-center gap-12 px-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-secondary whitespace-nowrap"><Target className="w-4 h-4 text-brand-600" /> JEE · NEET · SAT · CAT · GMAT</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-secondary whitespace-nowrap"><Award className="w-4 h-4 text-brand-600" /> #1 Bestselling Author</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-secondary whitespace-nowrap"><Zap className="w-4 h-4 text-brand-600" /> IIT &amp; IIM Alumni Network</span>
        </div>
      </section>

      {/* ───────────────────────────────────── Free Study Guide Lead Magnet ───────────────────────────────────── */}
      <FreePreview />

      {/* ───────────────────────────────────── Gamification / Streaks Callout ───────────────────────────────────── */}
      <SectionShell title="Active Streaks: Building the Habit of Success" eyebrow="Habit Builder">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-card bg-gradient-to-r from-brand-600 to-brand-500 p-8 sm:p-12 text-white relative overflow-hidden shadow-warm-lg">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold tracking-tight">Consistency beats intensity.</p>
              </div>
              <p className="text-white/90 text-lg leading-relaxed">
                Our platform tracks your daily learning streak. Watch a lesson, solve a problem, or complete a quiz every day to keep your streak alive. The longest streaks unlock exclusive 1:1 strategy sessions with PK Singh!
              </p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white text-brand-600 px-6 py-3 font-semibold shadow-warm-sm hover:shadow-warm-glow transition-all"
                >
                  {CTA.FREE_SIGNUP}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ───────────────────────────────────── Trust Badges ───────────────────────────────────── */}
      <TrustBadges />

      {/* ───────────────────────────────────── Media Logos Strip ───────────────────────────────────── */}
      <MediaLogos />

      {/* ───────────────────────────────────── Stats Section (animated counters) ───────────────────────────────────── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-card bg-bg-card py-12 shadow-warm-lg border border-border-subtle">
          <div className="grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
            <StatCounter value={verified(stats?.students ?? SITE_STATS.learnersMentored)} suffix="+" label="Learners mentored" />
            <StatCounter value={verified(stats?.publishedCourses ?? SITE_STATS.interactiveCourses)} label="Courses in catalog" />
            <StatCounter value={verified(stats?.publishedLessons ?? SITE_STATS.lessonModules)} label="Lesson modules" />
            <StatCounter value={verified(stats?.enrollments ?? SITE_STATS.freeResources)} label="Free study guides" />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────── Cohort Banner ───────────────────────────────────── */}
      <CohortBanner />

      {/* ───────────────────────────────────── What You Get (bento Features) ───────────────────────────────────── */}
      <WhatYouGet />

      {/* ───────────────────────────────────── Cinematic Mentor Story ───────────────────────────────────── */}
      <section id="about" className="relative bg-bg-subtle py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src="/images/pk-singh-photo.jpg" alt="Mentor Background" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent"></div>
        </div>

        <Reveal className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                Meet Your Mentor
              </span>
              <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
                &ldquo;Excellence is not an act, but a <span className="text-brand-600 italic">daily habit.</span>&rdquo;
              </h2>
              <div className="mt-8 space-y-6 text-lg text-ink-secondary leading-relaxed max-w-xl">
                <p>
                  As an IIT and IIM alumnus, I&apos;ve walked the path you are on right now. The pressure, the overwhelming syllabus, the fear of falling behind — I know it intimately.
                </p>
                <p>
                  But over my 23 years of professional leadership and teaching, I&apos;ve distilled the noise into a clear, repeatable framework. I don&apos;t just teach you formulas; I teach you how to think, how to break down complex problems, and how to build the unshakable confidence required to conquer JEE, NEET, SAT, and beyond.
                </p>
                <p className="text-brand-700 font-semibold italic">
                  Welcome to the mentorship that changes the trajectory of your career.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <Link href="/mentor-journey" className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100 group">
                  <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center cursor-pointer hover:bg-brand-500 transition-colors shadow-warm-glow group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </Link>
                <div>
                  <Link href="/about" className="text-ink font-bold hover:text-brand-600 transition-colors">
                    About PK Singh
                  </Link>
                  <p className="text-ink-muted text-sm">From IIT &amp; IIM to mentoring thousands</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {/* Space for the cinematic portrait */}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────────────────────── Mentorship vs Mass Classes Comparison ───────────────────────────────────── */}
      <MentorshipComparison />

      {/* ───────────────────────────────────── Dynamic Wisdom Quotes Carousel ───────────────────────────────────── */}
      <WisdomSlideshow />

      {/* ───────────────────────────────────── How It Works ───────────────────────────────────── */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-pill bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-[0.3em] mb-5">
                How It Works
              </span>
              <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
                Simple steps to start your <span className="text-brand-600">high-impact</span> preparation
              </h2>
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Zap, title: 'Explore the curriculum', desc: 'Review courses designed for exam clarity, concept mastery and problem-solving speed.' },
                { icon: Target, title: 'Choose your path', desc: 'Select focused lessons for JEE, NEET, SAT or preparatory exams with proven teaching frameworks.' },
                { icon: CheckCircle2, title: 'Track your progress', desc: 'Use the platform to track lessons, review tasks, and measure improvement every week.' },
              ].map((item) => (
                <div key={item.title} className="group rounded-card border border-border-subtle bg-bg-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-warm-md shadow-warm-sm">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink mb-3">{item.title}</h3>
                  <p className="text-ink-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────────────────── Pricing Section ───────────────────────────────────── */}
      <PricingSection />

      {/* ───────────────────────────────────── Testimonials (Upgraded) ───────────────────────────────────── */}
      <Testimonials />

      {/* ───────────────────────────────────── Browse by Subject shortcuts ───────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
                Master Your Core <span className="text-brand-600">Subjects</span>
              </h2>
              <p className="text-ink-secondary mt-4 text-lg max-w-xl mx-auto">
                Specialized courses designed for each discipline with real exam alignment
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-12" delay={80}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { href: '/courses?subject=PHYSICS', icon: Target, title: 'Physics', desc: 'Explore mechanics, electrodynamics, optics, and wave theory with crystal clear visual derivations.', iconColor: 'text-brand-600', iconBg: 'bg-brand-50', border: 'border-brand-100' },
                { href: '/courses?subject=CHEMISTRY', icon: Award, title: 'Chemistry', desc: 'Unlock organic synthesis mechanisms, chemical kinetics, atomic structures, and coordinate compounds.', iconColor: 'text-brand-600', iconBg: 'bg-brand-50', border: 'border-brand-100' },
                { href: '/courses?subject=MATH', icon: GraduationCap, title: 'Mathematics', desc: 'Ace AP Calculus, JEE trigonometry, complex algebra, matrices, probability, and advanced coordinate geometry.', iconColor: 'text-brand-600', iconBg: 'bg-brand-50', border: 'border-brand-100' },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group p-8 rounded-card border ${item.border} bg-bg-card transition-all duration-300 hover:shadow-warm-md hover:-translate-y-2 shadow-warm-sm flex flex-col`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${item.iconBg} border ${item.border} flex items-center justify-center ${item.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink mb-3">{item.title}</h3>
                  <p className="text-ink-secondary text-sm leading-relaxed mb-6 flex-grow">{item.desc}</p>
                  <span className={`${item.iconColor} text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5`}>
                    Explore {item.title.toLowerCase()} courses
                    <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────────────────── Featured Courses Showcase ───────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 mb-14">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                  Featured
                </span>
                <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
                  Featured <span className="text-brand-600">Courses</span>
                </h2>
                <p className="text-ink-secondary mt-2">Hand-picked interactive courses to kickstart your preparation</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-ink text-white text-sm font-semibold hover:bg-ink-secondary transition-all shadow-warm-sm"
              >
                View all courses
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-card bg-bg-card border border-border-subtle animate-pulse h-96 flex flex-col p-6 justify-between shadow-warm-sm">
                  <div className="h-4 bg-border-subtle rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-border-subtle rounded w-full"></div>
                    <div className="h-4 bg-border-subtle rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-border-subtle rounded-pill w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <Reveal className="mt-8" delay={80}>
              <div className="grid md:grid-cols-3 gap-8">
                {featuredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-card border border-border-subtle bg-bg-card shadow-warm-sm hover:shadow-warm-md hover:-translate-y-2 hover:border-brand-300 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer"
                  >
                    <div className={`h-44 relative p-6 flex flex-col justify-between bg-brand-700 border-b border-border-subtle`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
                      <span className="relative self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                        {course.subject}
                      </span>
                      <div className="relative">
                        <h3 className="text-xl font-bold text-white leading-snug">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <p className="text-ink-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {course.examTags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-[9px] font-semibold uppercase tracking-wider"
                          >
                            {tag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/courses/${course.id}`}
                        className="w-full py-3 rounded-pill bg-ink text-white hover:bg-brand-600 group-hover:text-white text-center text-sm font-semibold transition-all duration-300 block"
                      >
                        <span className="flex items-center justify-center gap-2">
                          View Details
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────── Dashboard Preview Section ───────────────────────────────────── */}
      <DashboardPreview />

      {/* ───────────────────────────────────── Referral Section ───────────────────────────────────── */}
      <ReferralSection />

      {/* ───────────────────────────────────── FAQ teaser ───────────────────────────────────── */}
      <FaqTeaser />

      {/* ───────────────────────────────────── Fixed Position Components ───────────────────────────────────── */}
      <WhatsAppButton />
      <ExitIntentModal />
      <ScrollDepthCta />

      <SiteFooter />

      {/* ───────────────────────────────────── Sticky Bottom Engagement Bar ───────────────────────────────────── */}
      {showBottomCta && (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center animate-slide-up">
          <div className="pointer-events-auto bg-ink backdrop-blur-md border border-border-subtle rounded-pill px-6 py-3 shadow-warm-md flex items-center gap-4 sm:gap-6 transition-all">
            <span className="hidden sm:inline text-ink-secondary text-sm font-medium">Ready to start your journey?</span>
            <Link
              href="/courses"
              className="shrink-0 px-6 py-2 rounded-pill bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500 transition-all shadow-warm-sm"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
