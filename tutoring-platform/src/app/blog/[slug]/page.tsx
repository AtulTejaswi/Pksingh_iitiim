import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const posts = {
  'jee-2027-physics-syllabus-breakdown': {
    title: 'JEE 2027 Physics Syllabus Breakdown',
    date: '2026-07-15',
    content: 'This article provides a complete breakdown of the JEE 2027 Physics syllabus with chapter-wise weightage, key topics to focus on, and a strategic study plan. [Content to be written]',
  },
  'neet-weightage-chapter-wise': {
    title: 'NEET Weightage Chapter-Wise',
    date: '2026-07-10',
    content: 'A detailed analysis of chapter-wise weightage for NEET UG, helping you prioritize high-yield topics across Physics, Chemistry, and Biology. [Content to be written]',
  },
  'how-to-build-a-study-timetable': {
    title: 'How to Build a Study Timetable',
    date: '2026-07-05',
    content: 'Learn how to create a realistic and effective study schedule that balances revision, practice tests, and breaks. Includes templates and time-blocking strategies. [Content to be written]',
  },
  'sat-vs-cat-which-exam-fits-you': {
    title: 'SAT vs CAT: Which Exam Fits You?',
    date: '2026-06-28',
    content: 'A comprehensive comparison of the SAT and CAT exams — structure, scoring, difficulty levels, and guidance on which exam aligns with your career goals. [Content to be written]',
  },
  '5-memory-techniques-for-organic-chemistry': {
    title: '5 Memory Techniques for Organic Chemistry',
    date: '2026-06-20',
    content: 'Master Organic Chemistry with these five proven memory techniques: mnemonics, spaced repetition, reaction maps, active recall, and story-based learning. [Content to be written]',
  },
  'ashtavakra-gita-lesson-on-exam-anxiety': {
    title: 'Ashtavakra Gita\'s Lesson on Exam Anxiety',
    date: '2026-06-15',
    content: 'How the ancient wisdom of the Ashtavakra Gita — particularly its teaching on detachment from outcomes — can help students overcome exam anxiety and perform at their peak. [Content to be written]',
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];
  if (!post) return {};
  return { title: post.title, description: post.content.slice(0, 160) };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors">
          ← Back to Blog
        </Link>
        <article>
          <time dateTime={post.date} className="text-xs text-slate-400 uppercase tracking-wider">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-6">{post.title}</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg">{post.content}</p>
            <p className="text-sm text-slate-400 mt-8">This article is a stub. Full content coming soon.</p>
          </div>
        </article>
      </div>
    </div>
  );
}