'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Testimonials from '@/components/common/Testimonials';
import Navbar from '@/components/student/Navbar';
import { useGetCourses, useGetPublicStats } from '@/hooks/useCourses';
import { BookOpen, GraduationCap, Award, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import SiteFooter from '@/components/common/SiteFooter';

function formatStat(value: number, fallback: string): string {
  if (value <= 0) return fallback;
  if (value >= 1000) return `${Math.floor(value / 100) * 100}+`;
  if (value >= 100) return `${value}+`;
  return String(value);
}

export default function LandingPage() {
  const { data: courses, isLoading } = useGetCourses();
  const { data: stats } = useGetPublicStats();

  // Pick top 3 published courses as featured
  const featuredCourses = courses
    ?.filter((course) => course.status === 'PUBLISHED')
    ?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400/08 blur-[120px] pointer-events-none animate-float"></div>

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full hero-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 top-8 h-56 w-56 rounded-full bg-blue-300/15 blur-3xl animate-float"></div>
          <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-orange-300/08 blur-3xl animate-pulse-slow"></div>
          <div className="absolute left-1/2 top-12 text-[5rem] font-black text-slate-200/30 select-none">∑</div>
          <div className="absolute right-10 bottom-10 text-[6rem] font-black text-slate-200/25 select-none">π</div>
        </div>

        <div className="relative grid gap-10 xl:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 uppercase tracking-[0.28em] mb-6">
              <Zap className="w-4 h-4 text-blue-500" /> Mentor, Author, IITian
            </div>

            <h1 className="hero-heading text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-slate-900">
              Premium mentorship for ambitious learners who want top rank outcomes.
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl max-w-2xl leading-[1.75] mb-8">
              Learn Physics, Chemistry, Math and exam strategy from an IIT + IIM alumnus, bestselling author and global consultant. Every course is built for clarity, confidence and accelerated exam performance.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <BookOpen className="w-4 h-4 text-blue-500" />
                23+ years of mentorship
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <Target className="w-4 h-4 text-orange-500" />
                IIT + IIM curriculum alignment
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <Award className="w-4 h-4 text-emerald-500" />
                Proven exam strategies
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/courses"
                className="glow-button inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-blue-600 to-orange-600 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-blue-500 hover:to-orange-500"
              >
                Explore Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-300 bg-white text-slate-800 px-8 py-4 text-sm font-semibold transition-all duration-300 hover:bg-slate-50 hover:shadow-xl hover:scale-105 hover:border-slate-400"
              >
                Join Free Now
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">23+</p>
                <p className="text-sm text-slate-500 mt-2">Years of experience</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">Bestselling</p>
                <p className="text-sm text-slate-500 mt-2">UK & USA books</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">Global</p>
                <p className="text-sm text-slate-500 mt-2">Consulting exposure</p>
              </div>
            </div>
          </div>

          <div className="hero-card rounded-[2.25rem] p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <Image src="/images/pk-singh.svg" alt="PK Singh" width={80} height={80} className="object-cover" priority />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">PK Singh</p>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">IIT • IIM • Author</p>
                </div>
                <div className="ml-auto">
                  <Image src="/images/pk_sir_logo.jpg" alt="Brand Logo" width={80} height={24} className="w-[80px] h-auto rounded bg-white px-1.5 py-1 opacity-90" />
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold mb-4">High-impact mentorship</p>
                <p className="text-slate-600 text-sm leading-relaxed">One-to-one guidance, exam-ready routines, and strategically designed learning plans for maximum progress.</p>
              </div>
              <div className="grid gap-4">
                {[
                  { title: 'Smart Revision', description: 'Clear concept maps, memory anchors and problem templates for fast recall.' },
                  { title: 'Live Doubt Solving', description: 'Get answers, strategy checks and practice advice directly from the mentor.' },
                  { title: 'Real Exam Focus', description: 'Dedicated training for JEE, NEET, SAT, CAT and GMAT with real exam alignment.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 hover:bg-slate-50 transition shadow-sm">
                    <p className="text-sm text-blue-600 uppercase tracking-[0.24em] mb-2">{item.title}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-orange-700 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.16),transparent_20%)]"></div>
          <div className="relative grid gap-6 p-8 md:grid-cols-4">
            <div className="icon-card relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-400/15 text-sky-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-4xl font-extrabold text-white">
                {formatStat(stats?.enrollments ?? stats?.students ?? 0, 'Growing')}
              </p>
              <p className="mt-3 text-sm text-slate-100/90 uppercase tracking-[0.24em]">Learners enrolled</p>
            </div>
            <div className="icon-card relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-300/15 text-blue-200">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-4xl font-extrabold text-white">
                {formatStat(stats?.publishedCourses ?? 0, 'New')}
              </p>
              <p className="mt-3 text-sm text-slate-100 uppercase tracking-[0.24em]">Published courses</p>
            </div>
            <div className="icon-card relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-300/15 text-emerald-200">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-4xl font-extrabold text-white">
                {formatStat(stats?.publishedLessons ?? 0, 'Adding soon')}
              </p>
              <p className="mt-3 text-sm text-slate-100 uppercase tracking-[0.24em]">Lesson modules</p>
            </div>
            <div className="icon-card relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100/25 text-slate-100">
                <Target className="w-6 h-6" />
              </div>
              <p className="text-4xl font-extrabold text-white">100%</p>
              <p className="mt-3 text-sm text-slate-100 uppercase tracking-[0.24em]">Free Resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Short mid-page mentor blurb */}
      <section id="about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-600 uppercase tracking-[0.24em] mb-3">About the Mentor</h3>
        <p className="text-slate-600 text-xl sm:text-2xl leading-relaxed mb-6">
          Personal guidance from PK Singh — IIT + IIM alumnus, bestselling author, and mentor focused on exam-winning strategies.
        </p>
        <div>
          <Link href="/courses" className="inline-flex px-6 py-3 rounded-3xl bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 text-white font-semibold transition shadow-lg">
            Explore Courses
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 border-t border-slate-100">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-600 font-semibold mb-4">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Simple steps to start your high-impact preparation</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 hover:border-blue-300 hover:bg-blue-50 transition shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-6">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Explore the curriculum</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Review courses designed for exam clarity, concept mastery and problem-solving speed.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 hover:border-sky-300 hover:bg-sky-50 transition shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-600 mb-6">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Choose your path</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Select focused lessons for JEE, NEET, SAT or preparatory exams with proven teaching frameworks.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:bg-emerald-50 transition shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Track your progress</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Use the platform to track lessons, review tasks, and measure improvement every week.</p>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Browse by Subject shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <h2 className="text-3xl font-extrabold text-center tracking-tight mb-12">
          Master Your Core <span className="gradient-text">Subjects</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Physics */}
          <Link
            href="/courses?subject=PHYSICS"
            className="p-6 rounded-2xl subject-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Physics</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Explore mechanics, electrodynamics, optics, and wave theory with crystal clear visual derivations.
            </p>
            <span className="text-orange-600 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1 mt-auto">
              Explore physics courses <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Chemistry */}
          <Link
            href="/courses?subject=CHEMISTRY"
            className="p-6 rounded-2xl subject-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Chemistry</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Unlock organic synthesis mechanisms, chemical kinetics, atomic structures, and coordinate compounds.
            </p>
            <span className="text-sky-600 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1 mt-auto">
              Explore chemistry courses <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Math */}
          <Link
            href="/courses?subject=MATH"
            className="p-6 rounded-2xl subject-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mathematics</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Ace AP Calculus, JEE trigonometry, complex algebra, matrices, probability, and advanced coordinate geometry.
            </p>
            <span className="text-emerald-600 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1 mt-auto">
              Explore math courses <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Hand-picked interactive courses to kickstart your preparation</p>
          </div>
          <Link
            href="/courses"
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold tracking-wide flex items-center gap-1 group"
          >
            View all courses
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-80 flex flex-col p-6 justify-between rounded-2xl">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No courses have been published yet.</p>
            <p className="text-slate-400 text-sm mt-1">Check back later or register as admin to add new courses!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:-translate-y-1 transition-transform duration-300 overflow-hidden flex flex-col group justify-between"
              >
                {/* Course card banner with customized gradients */}
                <div className="h-40 bg-gradient-to-br from-blue-600 to-orange-600 relative p-6 flex flex-col justify-between">
                  <span className="self-start px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                    {course.subject}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-blue-200 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.examTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-semibold uppercase tracking-wider"
                      >
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center text-sm font-semibold tracking-wide transition-colors duration-300 block"
                  >
                    View Details
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Full Mentor Profile moved to page bottom (for conversions) */}
      <section id="mentor-profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14 border-t border-slate-100">
        <div className="grid gap-10 xl:grid-cols-[0.7fr_0.3fr] items-start">
          <div className="rounded-2xl p-8 bg-white border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">About PK Singh — Mentor & Author</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              PK Singh blends deep technical mastery with practical exam strategy. An IIT + IIM alumnus, bestselling author and experienced mentor, he focuses on clarity, speed and exam-specific problem solving to help ambitious students secure top ranks.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Over 23 years of professional leadership and 6+ years teaching; authored books for UK/USA audiences and consulted with global institutions. His teaching emphasizes core understanding, memory anchors and exam-smart practice.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/mentor-journey" className="btn btn-primary">
                Mentor's Journey
              </Link>
              <Link href="/courses" className="btn btn-ghost">
                View Courses
              </Link>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border border-slate-200">
              <Image src="/images/pk-singh.svg" alt="PK Singh" width={160} height={160} className="object-cover" />
            </div>
            <h4 className="text-sm uppercase text-blue-600 tracking-[0.24em] mb-3">Snapshot</h4>
            <ul className="text-slate-700 text-sm space-y-2 text-center">
              <li><strong>Credentials:</strong> IIT alumnus; IIM Calcutta MBA</li>
              <li><strong>Experience:</strong> 23+ years industry, 6+ years academia</li>
              <li><strong>Books:</strong> Bestselling titles in UK & USA</li>
              <li><strong>Roots:</strong> Based in Mumbai; teaching across India & globally</li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
