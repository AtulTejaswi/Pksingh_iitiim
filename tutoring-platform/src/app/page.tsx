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
import QuotesCarousel from '@/components/common/QuotesCarousel';
import MasteryPathPreview from '@/components/common/MasteryPathPreview';
import MentorshipComparison from '@/components/common/MentorshipComparison';
import { getStaticFeaturedCourses } from '@/data/courseData';
import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation';
import { useGetCourses, useGetPublicStats } from '@/hooks/useCourses';
import { BookOpen, GraduationCap, Award, CheckCircle2, ChevronRight, Zap, Target, Search, Flame } from 'lucide-react';
import SiteFooter from '@/components/common/SiteFooter';

function StatCard({ icon: Icon, value, targetValue, label, color, span, isVisible }: any) {
  const animatedValue = useCountUp(targetValue, 2000, isVisible);
  const displayValue = targetValue > 0 ? `${animatedValue}+` : value;

  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-white/05 p-7 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${span}`}>
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 60%)` }}></div>
      <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-inner`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="relative mt-auto">
        <p className="text-4xl font-black text-white tracking-tight">{displayValue}</p>
        <p className="mt-2 text-xs text-white/70 uppercase tracking-[0.2em] font-bold">{label}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: courses, isLoading } = useGetCourses();
  const { data: stats } = useGetPublicStats();

  const statsAnim = useScrollAnimation();

  // Pick top 3 published courses from API, fallback to static featured courses
  const apiPublished = courses?.filter((course) => course.status === 'PUBLISHED') || [];
  const featuredCourses = apiPublished.length > 0 
    ? apiPublished.slice(0, 3) 
    : getStaticFeaturedCourses().slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full hero-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-[120px]"></div>
          <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-slate-100/60 blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-amber-50/50 blur-[100px]"></div>
        </div>

        <div className="relative grid gap-16 xl:grid-cols-[1.1fr_0.9fr] items-center w-full animate-slide-up">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-5 py-2 text-sm font-bold text-amber-800 uppercase tracking-[0.25em] mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Premium Mentorship
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-slate-900">
              Premium mentorship for<br />
              <span className="text-amber-600">top rank outcomes</span>
            </h1>
            <p className="text-slate-700 text-lg sm:text-xl max-w-2xl leading-[1.8] mb-10">
              Learn Physics, Chemistry, Math and exam strategy from an IIT + IIM alumnus, bestselling author and global consultant. Every course is built for clarity, confidence and accelerated exam performance.
            </p>

            <div className="flex flex-wrap gap-3 text-sm mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-800 font-medium">
                <BookOpen className="w-4 h-4 text-slate-600" />
                23+ years of mentorship
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-800 font-medium">
                <Target className="w-4 h-4 text-amber-600" />
                IIT + IIM curriculum
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-800 font-medium">
                <Award className="w-4 h-4 text-emerald-600" />
                Proven exam strategies
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/courses"
                className="btn btn-primary px-10 py-4 text-sm font-bold"
              >
                Explore Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="#free-preview"
                className="btn btn-ghost px-10 py-4 text-sm font-bold flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                Watch Free Lesson
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              </a>
            </div>

            {/* Interactive Search Bar */}
            <div className="relative max-w-xl group mb-12">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="What do you want to learn today? (e.g. Physics, JEE)" 
                className="w-full pl-12 pr-32 py-4 rounded-full border-2 border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <button className="absolute inset-y-1.5 right-1.5 px-6 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors">
                Search
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:shadow-md hover:border-slate-300 transition-all duration-300">
                <p className="text-3xl font-bold text-slate-900">23+</p>
                <p className="text-sm text-slate-600 mt-2">Years of experience</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:shadow-md hover:border-slate-300 transition-all duration-300">
                <p className="text-3xl font-bold text-slate-900">Bestselling</p>
                <p className="text-sm text-slate-600 mt-2">UK & USA books</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center hover:shadow-md hover:border-slate-300 transition-all duration-300">
                <p className="text-3xl font-bold text-slate-900">Global</p>
                <p className="text-sm text-slate-600 mt-2">Consulting exposure</p>
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
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-bold mb-3">High-impact mentorship</p>
                <p className="text-slate-700 text-sm leading-relaxed">One-to-one guidance, exam-ready routines, and strategically designed learning plans for maximum progress.</p>
              </div>
              <div className="grid gap-3">
                {[
                  { title: 'Smart Revision', description: 'Clear concept maps, memory anchors and problem templates for fast recall.' },
                  { title: 'Live Doubt Solving', description: 'Get answers, strategy checks and practice advice directly from the mentor.' },
                  { title: 'Real Exam Focus', description: 'Dedicated training for JEE, NEET, SAT, CAT and GMAT with real exam alignment.' },
                ].map((item, i) => (
                  <div key={item.title} className="rounded-2xl bg-white/80 border border-slate-200/60 p-5 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed ml-10">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Engagement Loop */}
      <section className="border-y border-slate-200 bg-white py-4 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee flex items-center gap-12 px-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap"><Target className="w-4 h-4 text-amber-600" /> 10,000+ Students Mentored</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap"><Award className="w-4 h-4 text-slate-600" /> #1 Bestselling Author</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap"><Zap className="w-4 h-4 text-emerald-600" /> IIT & IIM Alumni Network</span>
              <span className="flex items-center gap-2 text-sm font-bold text-amber-800 whitespace-nowrap bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">"Focus on effort, not the outcome."</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Free Sample Lesson / Lead Magnet */}
      <div id="free-preview">
        <FreePreview />
      </div>

      {/* Gamification / Streaks Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-amber-500 p-8 sm:p-12 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Active Streaks: Building the Habit of Success</h3>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              Consistency beats intensity. Our platform tracks your daily learning streak. Watch a lesson, solve a problem, or complete a quiz every day to keep your streak alive. The longest streaks unlock exclusive 1:1 strategy sessions with PK Singh!
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <Flame className="w-12 h-12 text-amber-200 mx-auto mb-2 animate-pulse" />
              <div className="text-4xl font-black text-white">12 Day</div>
              <div className="text-sm font-semibold text-amber-200 uppercase tracking-widest mt-1">Current Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Stats Section with Scroll Animation & Live / Fallback counters */}
      <section ref={statsAnim.ref} className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,119,6,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(148,163,184,0.08),transparent_40%)]"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/03 to-transparent"></div>
          <div className="relative grid gap-5 p-10 md:grid-cols-4 grid-rows-[auto]">
            <StatCard 
              icon={BookOpen} 
              value="10,000+" 
              targetValue={stats?.enrollments ?? stats?.students ?? 10000} 
              label="Learners mentored" 
              color="from-sky-400/20 to-sky-500/10 text-sky-200" 
              span="md:col-span-2 md:row-span-2" 
              isVisible={statsAnim.isVisible} 
            />
            <StatCard 
              icon={Flame} 
              value="9+" 
              targetValue={stats?.publishedCourses ?? 9} 
              label="Interactive Courses" 
              color="from-orange-400/20 to-red-500/10 text-orange-200" 
              span="md:col-span-1 md:row-span-1" 
              isVisible={statsAnim.isVisible} 
            />
            <StatCard 
              icon={Award} 
              value="200+" 
              targetValue={stats?.publishedLessons ?? 250} 
              label="Lesson modules" 
              color="from-emerald-400/20 to-emerald-500/10 text-emerald-200" 
              span="md:col-span-1 md:row-span-1" 
              isVisible={statsAnim.isVisible} 
            />
            <StatCard 
              icon={Target} 
              value="100% Free Resources" 
              targetValue={0} 
              label="Available Study Guides" 
              color="from-blue-400/20 to-blue-500/10 text-blue-200" 
              span="md:col-span-2 md:row-span-1" 
              isVisible={statsAnim.isVisible} 
            />
          </div>
        </div>
      </section>

      {/* What You Get Breakdown */}
      <WhatYouGet />

      {/* Cinematic Mentor Story (MasterClass Style) */}
      <section id="about" className="relative bg-slate-950 py-24 sm:py-32 overflow-hidden">
        {/* Background Image / Video Placeholder */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/pk-singh.svg" alt="Mentor Background" fill className="object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold uppercase tracking-[0.3em] mb-6">Meet Your Mentor</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
              "Excellence is not an act, but a <span className="text-amber-500 italic font-serif">daily habit.</span>"
            </h2>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed max-w-xl">
              <p>
                As an IIT and IIM alumnus, I've walked the path you are on right now. The pressure, the overwhelming syllabus, the fear of falling behind — I know it intimately.
              </p>
              <p>
                But over my 23 years of professional leadership and teaching, I've distilled the noise into a clear, repeatable framework. I don't just teach you formulas; I teach you how to think, how to break down complex problems, and how to build the unshakable confidence required to conquer JEE, NEET, SAT, and beyond.
              </p>
              <p className="text-amber-400 font-semibold italic">
                Welcome to the mentorship that changes the trajectory of your career.
              </p>
            </div>
            
            <div className="mt-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-[12px] border-t-transparent border-b-transparent border-l-slate-900 ml-1"></div>
                </div>
              </div>
              <div>
                <p className="text-white font-bold">Watch My Story</p>
                <p className="text-slate-400 text-sm">2 min masterclass</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            {/* Space for the cinematic portrait */}
          </div>
        </div>
      </section>

      {/* Mentorship vs Mass Classes Comparison */}
      <MentorshipComparison />

      {/* Mastery Path Visual */}
      <MasteryPathPreview />

      {/* Dynamic Wisdom Quotes Carousel */}
      <QuotesCarousel />

      {/* How It Works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-[0.3em] mb-5">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Simple steps to start your <span className="text-amber-600">high-impact</span> preparation</h2>
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
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              <div className="mt-6 w-12 h-1 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${item.gradient.includes('blue') ? '#3B82F6' : item.gradient.includes('orange') ? '#F97316' : '#10B981'}, transparent)` }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials (Upgraded) */}
      <Testimonials />

      {/* Browse by Subject shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Master Your Core <span className="text-amber-600">Subjects</span>
          </h2>
          <p className="text-slate-600 mt-4 text-lg max-w-xl mx-auto">Specialized courses designed for each discipline with real exam alignment</p>
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
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.desc}</p>
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
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-[0.3em] mb-4">Featured</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="text-amber-600">Courses</span>
            </h2>
            <p className="text-slate-600 mt-2">Hand-picked interactive courses to kickstart your preparation</p>
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
        ) : (
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
            {featuredCourses.map((course: any) => (
              <div
                key={course.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className={`h-44 relative p-6 flex flex-col justify-between ${
                  course.subject === 'PHYSICS' ? 'bg-orange-950' : 
                  course.subject === 'CHEMISTRY' ? 'bg-sky-950' : 'bg-emerald-950'
                }`}>
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
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.examTags.map((tag: string) => (
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
                    className="w-full py-3 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 text-slate-700 text-center text-sm font-bold tracking-wide transition-all duration-300 block relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Details
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dashboard Preview Section */}
      <DashboardPreview />

      {/* Full Mentor Profile */}
      <section id="mentor-profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid gap-10 xl:grid-cols-[0.7fr_0.3fr] items-start">
          <div className="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-[0.3em] mb-5">About</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 tracking-tight">PK Singh — <span className="text-amber-600">Mentor & Author</span></h3>
            <p className="text-slate-700 leading-relaxed mb-4 text-lg">
              PK Singh blends deep technical mastery with practical exam strategy. An IIT + IIM alumnus, bestselling author and experienced mentor, he focuses on clarity, speed and exam-specific problem solving to help ambitious students secure top ranks.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Over 23 years of professional leadership and 6+ years teaching; authored books for UK/USA audiences and consulted with global institutions. His teaching emphasizes core understanding, memory anchors and exam-smart practice.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/mentor-journey" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 text-white font-bold text-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg shadow-md">
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
            <h4 className="text-sm uppercase text-amber-700 font-bold tracking-[0.24em] mb-4">Snapshot</h4>
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

      {/* Sticky Bottom Engagement Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-slate-900 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 sm:gap-6 animate-slide-up transition-all">
          <span className="hidden sm:inline text-white text-sm font-medium">Ready to start your journey?</span>
          <Link href="/courses" className="btn bg-amber-500 text-white border-none py-2 px-6 rounded-full text-sm font-bold hover:bg-amber-600 transition-colors">
            Explore Courses Now
          </Link>
        </div>
      </div>
    </div>
  );
}

