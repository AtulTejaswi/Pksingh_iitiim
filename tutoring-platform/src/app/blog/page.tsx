import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Exam preparation tips, study strategies, and insights from PK Singh — IIT + IIM alumnus and mentor.',
};

const posts = [
  { slug: 'jee-2027-physics-syllabus-breakdown', title: 'JEE 2027 Physics Syllabus Breakdown', excerpt: 'Complete chapter-wise weightage, key topics, and study strategy for JEE Advanced Physics.', date: '2026-07-15' },
  { slug: 'neet-weightage-chapter-wise', title: 'NEET Weightage Chapter-Wise', excerpt: 'Understand which chapters matter most for NEET UG and how to allocate your study time effectively.', date: '2026-07-10' },
  { slug: 'how-to-build-a-study-timetable', title: 'How to Build a Study Timetable', excerpt: 'A step-by-step guide to creating a realistic, high-yield study schedule that actually sticks.', date: '2026-07-05' },
  { slug: 'sat-vs-cat-which-exam-fits-you', title: 'SAT vs CAT: Which Exam Fits You?', excerpt: 'Comparing the SAT and CAT exams — structure, difficulty, scoring, and which one aligns with your goals.', date: '2026-06-28' },
  { slug: '5-memory-techniques-for-organic-chemistry', title: '5 Memory Techniques for Organic Chemistry', excerpt: 'Proven mnemonic strategies to master reaction mechanisms, reagents, and named reactions.', date: '2026-06-20' },
  { slug: 'ashtavakra-gita-lesson-on-exam-anxiety', title: 'Ashtavakra Gita\'s Lesson on Exam Anxiety', excerpt: 'Ancient wisdom meets modern psychology: how detachment from outcomes can improve performance under pressure.', date: '2026-06-15' },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-[0.3em] mb-4">Blog</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Insights & Strategies
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Exam preparation tips, study techniques, and wisdom from PK Singh&apos;s decades of mentorship experience.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">{post.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{post.excerpt}</p>
                <span className="inline-block mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">Read more →</span>
              </article>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-12">
          More articles coming soon. Topics: JEE, NEET, SAT, CAT, GMAT, study techniques, and exam psychology.
        </p>
      </div>
    </div>
  );
}