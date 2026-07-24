import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/student/Navbar';
import SiteFooter from '@/components/common/SiteFooter';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Exam preparation tips, study strategies, ancient wisdom applied to modern academics — insights from PK Singh, IIT + IIM alumnus and bestselling author.',
  openGraph: {
    title: 'Blog | PK Singh Mentorship',
    description: 'Exam tips, study strategies, and wisdom from PK Singh — IIT + IIM alumnus.',
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  accent: string;
  accentBg: string;
  accentText: string;
}

const posts: BlogPost[] = [
  {
    slug: 'jee-2027-physics-syllabus-breakdown',
    title: 'JEE 2027 Physics Syllabus Breakdown',
    excerpt: 'Complete chapter-wise weightage, high-yield topics, and a week-by-week study strategy for JEE Advanced Physics — from mechanics to modern physics.',
    date: '2026-07-15',
    category: 'JEE',
    readTime: '8 min read',
    accent: 'from-orange-500 to-amber-500',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
  },
  {
    slug: 'neet-weightage-chapter-wise',
    title: 'NEET Weightage Chapter-Wise',
    excerpt: 'Understand exactly which chapters matter most for NEET UG and how to intelligently allocate study time across Physics, Chemistry, and Biology.',
    date: '2026-07-10',
    category: 'NEET',
    readTime: '6 min read',
    accent: 'from-emerald-500 to-teal-500',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
  },
  {
    slug: 'how-to-build-a-study-timetable',
    title: 'How to Build a Study Timetable',
    excerpt: 'A step-by-step framework for creating a realistic, high-yield study schedule that balances revision, practice tests, and essential recovery time.',
    date: '2026-07-05',
    category: 'Strategy',
    readTime: '7 min read',
    accent: 'from-blue-500 to-indigo-500',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
  },
  {
    slug: 'sat-vs-cat-which-exam-fits-you',
    title: 'SAT vs CAT: Which Exam Fits You?',
    excerpt: 'Comparing the SAT and CAT exams — structure, scoring, difficulty, preparation timeline, and which path aligns with your long-term career goals.',
    date: '2026-06-28',
    category: 'SAT / CAT',
    readTime: '9 min read',
    accent: 'from-violet-500 to-purple-500',
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-700',
  },
  {
    slug: '5-memory-techniques-for-organic-chemistry',
    title: '5 Memory Techniques for Organic Chemistry',
    excerpt: 'Proven mnemonic strategies to master reaction mechanisms, reagents, and named reactions — without rote memorisation.',
    date: '2026-06-20',
    category: 'Chemistry',
    readTime: '5 min read',
    accent: 'from-rose-500 to-pink-500',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    slug: 'ashtavakra-gita-lesson-on-exam-anxiety',
    title: "Ashtavakra Gita's Lesson on Exam Anxiety",
    excerpt: 'Ancient wisdom meets modern psychology: how the Ashtavakra Gita\'s teaching on detachment from outcomes can help students overcome anxiety and perform at their peak.',
    date: '2026-06-15',
    category: 'Mindset',
    readTime: '10 min read',
    accent: 'from-amber-500 to-yellow-500',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogIndex() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4 text-center border-b border-slate-100">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-[0.3em] mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Insights &amp; Strategies
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Exam preparation tips, study techniques, and wisdom from PK Singh&apos;s decades of mentorship experience.
          </p>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Post */}
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Latest Post</p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className={`rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white`}>
                <div className={`h-3 bg-gradient-to-r ${featured.accent}`} />
                <div className="p-8 sm:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${featured.accentBg} ${featured.accentText}`}>
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </span>
                    <time dateTime={featured.date} className="text-xs text-slate-400">
                      {formatDate(featured.date)}
                    </time>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-3xl">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                    Read full article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>
          </div>

          {/* Post Grid */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">More Articles</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className={`h-1.5 bg-gradient-to-r ${post.accent}`} />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${post.accentBg} ${post.accentText}`}>
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <time dateTime={post.date} className="text-xs text-slate-400">
                          {formatDate(post.date)}
                        </time>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                          Read more
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 rounded-3xl bg-slate-900 p-8 sm:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.15),transparent_60%)] pointer-events-none" />
            <div className="relative z-10">
              <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Get articles delivered to your inbox</h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">Weekly exam tips, study strategies, and mindset insights from PK Singh. No spam — unsubscribe anytime.</p>
              <Link
                href="/#free-preview"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-amber-500/30"
              >
                Subscribe for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}