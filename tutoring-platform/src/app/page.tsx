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

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full hero-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/05 blur-[100px] animate-float"></div>
          <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-300/08 to-orange-500/05 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-blue-200/08 to-transparent blur-[80px]"></div>
          <svg className="absolute right-10 top-20 w-32 h-32 text-blue-200/15" viewBox="0 0 100 100"><text x="50" y="70" textAnchor="middle" fontSize="70" fontWeight="900" fontFamily="serif">∑</text></svg>
          <svg className="absolute left-1/4 bottom-10 w-24 h-24 text-orange-200/12" viewBox="0 0 100 100"><text x="50" y="70" textAnchor="middle" fontSize="70" fontWeight="900" fontFamily="serif">π</text></svg>
        </div>

        <div className="relative grid gap-16 xl:grid-cols-[1.1fr_0.9fr] items-center w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/60 px-5 py-2 text-sm font-semibold text-slate-700 uppercase tracking-[0.28em] mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 animate-pulse"></span>
              Mentor, Author, IITian
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-slate-900">
              Premium mentorship for<br />
              <span className="gradient-text">top rank outcomes</span>
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl max-w-2xl leading-[1.75] mb-10">
              Learn Physics, Chemistry, Math and exam strategy from an IIT + IIM alumnus, bestselling author and global consultant. Every course is built for clarity, confidence and accelerated exam performance.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 px-4 py-2 text-slate-700 shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-500" />
                23+ years of mentorship
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 px-4 py-2 text-slate-700 shadow-sm">
                <Target className="w-4 h-4 text-orange-500" />
                IIT + IIM curriculum
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 px-4 py-2 text-slate-700 shadow-sm">
                <Award className="w-4 h-4 text-emerald-500" />
                Proven exam strategies
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 px-10 py-4.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-105 hover:from-blue-500 hover:to-orange-500 shadow-lg"
              >
                Explore Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 backdrop-blur-sm text-slate-800 px-10 py-4.5 text-sm font-semibold transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-105 hover:border-slate-400 shadow-sm"
              >
                Join Free Now
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 text-center shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300">
                <p className="text-3xl font-bold gradient-text">23+</p>
                <p className="text-sm text-slate-500 mt-2">Years of experience</p>
              </div>
              <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 text-center shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300">
                <p className="text-3xl font-bold gradient-text">Bestselling</p>
                <p className="text-sm text-slate-500 mt-2">UK & USA books</p>
              </div>
              <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 text-center shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300">
                <p className="text-3xl font-bold gradient-text">Global</p>
                <p className="text-sm text-slate-500 mt-2">Consulting exposure</p>
              </div>
            </div>
          </div>

          <div className="hero-card p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/80 bg-white shadow-md overflow-hidden">
                  <Image src="/images/pk-singh.svg" alt="PK Singh" width={80} height={80} className="object-cover" priority />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">PK Singh</p>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-medium">IIT • IIM • Author</p>
                </div>
                <div className="ml-auto">
                  <Image src="/images/pk_sir_logo.jpg" alt="Brand Logo" width={80} height={24} className="w-[80px] h-auto rounded-lg bg-white/80 px-1.5 py-1" />
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100/50 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-bold mb-3">High-impact mentorship</p>
                <p className="text-slate-600 text-sm leading-relaxed">One-to-one guidance, exam-ready routines, and strategically designed learning plans for maximum progress.</p>
              </div>
              <div className="grid gap-3">
                {[
                  { title: 'Smart Revision', description: 'Clear concept maps, memory anchors and problem templates for fast recall.' },
                  { title: 'Live Doubt Solving', description: 'Get answers, strategy checks and practice advice directly from the mentor.' },
                  { title: 'Real Exam Focus', description: 'Dedicated training for JEE, NEET, SAT, CAT and GMAT with real exam alignment.' },
                ].map((item, i) => (
                  <div key={item.title} className="rounded-2xl bg-white/80 border border-slate-200/60 p-5 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed ml-10">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-blue-700 to-orange-700 text-white shadow-2xl relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.15),transparent_40%)]"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/05 to-transparent"></div>
          <div className="relative grid gap-5 p-10 md:grid-cols-4">
            {[
              { icon: BookOpen, value: formatStat(stats?.enrollments ?? stats?.students ?? 0, 'Growing'), label: 'Learners enrolled', color: 'from-sky-400/20 to-sky-500/10 text-sky-200' },
              { icon: Zap, value: formatStat(stats?.publishedCourses ?? 0, 'New'), label: 'Published courses', color: 'from-blue-400/20 to-blue-500/10 text-blue-200' },
              { icon: Award, value: formatStat(stats?.publishedLessons ?? 0, 'Adding soon'), label: 'Lesson modules', color: 'from-emerald-400/20 to-emerald-500/10 text-emerald-200' },
              { icon: Target, value: '100%', label: 'Free Resources', color: 'from-orange-400/20 to-orange-500/10 text-orange-200' },
            ].map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/08 p-7 backdrop-blur-md hover:bg-white/12 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 60%)` }}></div>
                <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="relative text-3xl font-extrabold text-white tracking-tight">{item.value}</p>
                <p className="relative mt-2 text-xs text-white/80 uppercase tracking-[0.24em] font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Short mid-page mentor blurb */}
      <section id="about" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-orange-700 p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%)]"></div>
          <div className="relative">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-[0.3em] mb-5">About the Mentor</span>
            <p className="text-2xl sm:text-3xl font-bold leading-[1.3] mb-8 max-w-3xl">
              Personal guidance from PK Singh — IIT + IIM alumnus, bestselling author, and mentor focused on exam-winning strategies.
            </p>
            <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-blue-50 shadow-lg">
              Explore Courses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-[0.3em] mb-5">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Simple steps to start your <span className="gradient-text">high-impact</span> preparation</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Zap, title: 'Explore the curriculum', desc: 'Review courses designed for exam clarity, concept mastery and problem-solving speed.', gradient: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', borderHover: 'hover:border-blue-300 hover:bg-blue-50/50' },
            { icon: Target, title: 'Choose your path', desc: 'Select focused lessons for JEE, NEET, SAT or preparatory exams with proven teaching frameworks.', gradient: 'from-orange-500 to-orange-600', bgLight: 'bg-orange-50', borderHover: 'hover:border-orange-300 hover:bg-orange-50/50' },
            { icon: CheckCircle2, title: 'Track your progress', desc: 'Use the platform to track lessons, review tasks, and measure improvement every week.', gradient: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50', borderHover: 'hover:border-emerald-300 hover:bg-emerald-50/50' },
          ].map((item) => (
            <div key={item.title} className={`group rounded-3xl border border-slate-200 bg-white p-8 ${item.borderHover} transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 shadow-sm`}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              <div className="mt-6 w-12 h-1 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${item.gradient.includes('blue') ? '#3B82F6' : item.gradient.includes('orange') ? '#F97316' : '#10B981'}, transparent)` }}></div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* Browse by Subject shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Master Your Core <span className="gradient-text">Subjects</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">Specialized courses designed for each discipline with real exam alignment</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { href: '/courses?subject=PHYSICS', icon: Target, title: 'Physics', desc: 'Explore mechanics, electrodynamics, optics, and wave theory with crystal clear visual derivations.', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', iconBg: 'bg-orange-100', gradient: 'from-orange-500 to-orange-600' },
            { href: '/courses?subject=CHEMISTRY', icon: Award, title: 'Chemistry', desc: 'Unlock organic synthesis mechanisms, chemical kinetics, atomic structures, and coordinate compounds.', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-100', gradient: 'from-blue-500 to-blue-600' },
            { href: '/courses?subject=MATH', icon: GraduationCap, title: 'Mathematics', desc: 'Ace AP Calculus, JEE trigonometry, complex algebra, matrices, probability, and advanced coordinate geometry.', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', iconBg: 'bg-emerald-100', gradient: 'from-emerald-500 to-emerald-600' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group p-8 rounded-3xl border ${item.border} ${item.bg} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-sm`}
            >
              <div className={`w-16 h-16 rounded-2xl ${item.iconBg} border ${item.border} flex items-center justify-center ${item.text} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
              <span className={`${item.text} text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 group`}>
                Explore {item.title.toLowerCase()} courses 
                <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
                  <ChevronRight className="w-3 h-3" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4 mb-14">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-[0.3em] mb-4">Featured</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-slate-500 mt-2">Hand-picked interactive courses to kickstart your preparation</p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            View all courses
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-white border border-slate-200 animate-pulse h-96 flex flex-col p-6 justify-between shadow-sm">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-semibold">No courses have been published yet.</p>
            <p className="text-slate-400 text-sm mt-1">Check back later or register as admin to add new courses!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="h-44 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-700 relative p-6 flex flex-col justify-between">
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
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.examTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-semibold uppercase tracking-wider"
                      >
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200/50 hover:from-blue-100 hover:to-orange-100 text-blue-700 text-center text-sm font-bold tracking-wide transition-all duration-300 block hover:shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full Mentor Profile */}
      <section id="mentor-profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid gap-10 xl:grid-cols-[0.7fr_0.3fr] items-start">
          <div className="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-[0.3em] mb-5">About</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 tracking-tight">PK Singh — <span className="gradient-text">Mentor & Author</span></h3>
            <p className="text-slate-600 leading-relaxed mb-4 text-lg">
              PK Singh blends deep technical mastery with practical exam strategy. An IIT + IIM alumnus, bestselling author and experienced mentor, he focuses on clarity, speed and exam-specific problem solving to help ambitious students secure top ranks.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Over 23 years of professional leadership and 6+ years teaching; authored books for UK/USA audiences and consulted with global institutions. His teaching emphasizes core understanding, memory anchors and exam-smart practice.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/mentor-journey" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 text-white font-bold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-md">
                Mentor's Journey <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-700 font-bold text-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md">
                View Courses
              </Link>
            </div>
          </div>

          <div className="rounded-3xl p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden mb-5 border-4 border-white shadow-lg">
              <Image src="/images/pk-singh.svg" alt="PK Singh" width={160} height={160} className="object-cover" />
            </div>
            <h4 className="text-sm uppercase text-blue-600 font-bold tracking-[0.24em] mb-4">Snapshot</h4>
            <ul className="text-slate-700 text-sm space-y-3 text-center w-full">
              {[
                { label: 'Credentials', value: 'IIT alumnus; IIM Calcutta MBA' },
                { label: 'Experience', value: '23+ years industry, 6+ years academia' },
                { label: 'Books', value: 'Bestselling titles in UK & USA' },
                { label: 'Roots', value: 'Based in Mumbai; teaching globally' },
              ].map((item) => (
                <li key={item.label} className="py-2.5 px-4 rounded-xl bg-white/60 border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
