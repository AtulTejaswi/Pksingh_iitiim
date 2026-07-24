import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/student/Navbar';
import SiteFooter from '@/components/common/SiteFooter';
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';

interface Post {
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  accent: string;
  accentBg: string;
  accentText: string;
  content: string;
}

const posts: Record<string, Post> = {
  'jee-2027-physics-syllabus-breakdown': {
    title: 'JEE 2027 Physics Syllabus Breakdown',
    date: '2026-07-15',
    category: 'JEE',
    readTime: '8 min read',
    excerpt: 'Complete chapter-wise weightage, high-yield topics, and a week-by-week study strategy for JEE Advanced Physics.',
    accent: 'from-orange-500 to-amber-500',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    content: `JEE Advanced Physics is where toppers are separated from aspirants. The syllabus has remained largely consistent, but knowing *where to invest your time* is the real edge.

**High-Yield Chapters (40% of questions)**
Mechanics (especially Rotational Dynamics and SHM), Electromagnetism (EMF, Electromagnetic Induction), and Modern Physics consistently deliver the highest question frequency.

**Medium-Yield Chapters (35% of questions)**
Optics, Waves and Sound, Thermal Physics, and Fluid Mechanics. These chapters reward conceptual clarity over formula memorisation.

**Strategic Tips**
1. Master problem templates for Rotational Mechanics — at least 2–3 questions appear every year.
2. In Electrostatics and Magnetism, visualisation is key. Draw field lines before writing equations.
3. Modern Physics (Photoelectric Effect, Nuclei, Atoms) is predictable — study past 10 years' questions and you'll see the patterns.
4. Do NOT skip Experimental Physics — 2–3 marks appear from graphs and measurement error.

**Recommended Weekly Allocation**
Dedicate 60% of physics study time to Mechanics + EM, and 40% to the remaining chapters. Revise one full past paper every two weeks.

*[Full article with detailed chapter breakdown, question analysis, and study schedule templates coming soon.]*`,
  },
  'neet-weightage-chapter-wise': {
    title: 'NEET Weightage Chapter-Wise',
    date: '2026-07-10',
    category: 'NEET',
    readTime: '6 min read',
    excerpt: 'Understand exactly which chapters matter most for NEET UG across Physics, Chemistry, and Biology.',
    accent: 'from-emerald-500 to-teal-500',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    content: `NEET UG tests 180 questions across Physics (45), Chemistry (45), and Biology (90). Since Biology carries the largest weight, strategic prioritisation here can add 50–80 marks.

**Biology: The 90-Mark Battleground**
Human Physiology and Genetics together account for ~30% of Biology questions. Plant Physiology and Cell Biology are next. Ecology is high-yield despite seeming peripheral.

**Chemistry: Strike Rate Matters**
Organic Chemistry (especially GOC, Carbonyl Compounds, and Biomolecules) is the most scoring section for prepared students. Physical Chemistry (Mole Concept, Equilibrium) rewards formula clarity. Inorganic Chemistry is largely memorisation-based.

**Physics: Aim for Accuracy**
Mechanics, Optics, and Modern Physics are the big three. NEET Physics questions are often concept-based rather than calculation-heavy — a relief compared to JEE.

**Key Insight**
Students who score 650+ typically do so by near-perfecting Biology (85+) rather than by being extraordinary at Physics or Chemistry. Plan accordingly.

*[Full article with year-wise chapter frequency data and scoring strategies coming soon.]*`,
  },
  'how-to-build-a-study-timetable': {
    title: 'How to Build a Study Timetable',
    date: '2026-07-05',
    category: 'Strategy',
    readTime: '7 min read',
    excerpt: 'A step-by-step framework for creating a realistic, high-yield study schedule that actually sticks.',
    accent: 'from-blue-500 to-indigo-500',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    content: `Most study timetables fail within a week — not because students lack discipline, but because the schedule was built wrong from the start.

**Step 1: Audit Before You Schedule**
Before writing anything, track how you actually spend your time for 3 days. Most aspirants overestimate their productive hours by 40%.

**Step 2: Block Time-Zones, Not Subjects**
Instead of "10 AM – Physics", use "Deep Focus Block (10–12 AM)" for your hardest subject. "Active Review Block (4–5 PM)" for revision. "Light Study (8–9 PM)" for notes and reading.

**Step 3: Apply the 3:1 Rule**
For every 3 days of new learning, spend 1 day on revision-only. Spaced repetition isn't optional — it's the mechanism of memory.

**Step 4: Weekly Mock Tests Are Non-Negotiable**
A timetable without a weekly full-length mock is just a reading schedule. Exam performance is a skill trained under time pressure.

**Step 5: Build Buffer Days**
Include 1 catch-up day per week. Life happens. Buffer prevents the cascade failure that derails most timetables.

**The Schedule Template**
Mon/Wed/Fri: Subject A (new content) + Subject B (revision)
Tue/Thu: Subject B (new content) + Subject C (revision)
Sat: Full mock test
Sun: Mock analysis + weak area drill

*[Full article with downloadable templates and customisation guide coming soon.]*`,
  },
  'sat-vs-cat-which-exam-fits-you': {
    title: 'SAT vs CAT: Which Exam Fits You?',
    date: '2026-06-28',
    category: 'SAT / CAT',
    readTime: '9 min read',
    excerpt: 'A comprehensive comparison of the SAT and CAT — structure, scoring, difficulty, and which path aligns with your long-term goals.',
    accent: 'from-violet-500 to-purple-500',
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-700',
    content: `The SAT and CAT both test quantitative reasoning and verbal ability, but they serve very different purposes and attract different profiles.

**The SAT**
The SAT (Scholastic Assessment Test) is for undergraduate admission — primarily to US universities. Scored 400–1600, it tests Reading & Writing (800) and Math (800). The digital SAT launched in 2024 is adaptive and significantly different from the old paper format.

Ideal if: You want to study undergraduate at US/UK universities, are in Class 11–12, and your goal is a science or business degree abroad.

**The CAT**
The CAT (Common Admission Test) is for IIM admission and India's top MBA programs. Scored percentile-wise (99+ percentile = ~155/198 raw marks), it tests VARC, DILR, and QA over 2 hours.

Ideal if: You want an MBA from an IIM, are a working professional (2–10 years experience) or fresh graduate targeting Indian B-schools.

**Key Differences**
| | SAT | CAT |
|---|---|---|
| For | Undergrad (US) | MBA (India) |
| Prep Time | 6–12 months | 6–18 months |
| Score | 400–1600 | Percentile |
| Difficulty | High school level | Graduate level |

**The Honest Answer**
If you're asking this question, you probably already know which career path you want — the exam follows the goal, not the other way around.

*[Full article with IIM alumni and US university applicant perspectives coming soon.]*`,
  },
  '5-memory-techniques-for-organic-chemistry': {
    title: '5 Memory Techniques for Organic Chemistry',
    date: '2026-06-20',
    category: 'Chemistry',
    readTime: '5 min read',
    excerpt: 'Proven mnemonic strategies to master reaction mechanisms, reagents, and named reactions — without rote memorisation.',
    accent: 'from-rose-500 to-pink-500',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    content: `Organic Chemistry terrifies most students because they approach it as a memorisation problem. It isn't — it's a pattern-recognition problem.

**Technique 1: The Mechanism Map**
Instead of memorising reactions individually, draw one large "mechanism map" connecting reactions that share the same intermediates (carbocations, carbanions, free radicals). See the family, not the individual.

**Technique 2: Electron-Push Arrows First**
Before learning a reaction name, understand *why* electrons move the way they do. Arrow-pushing is the grammar of Organic Chemistry. Get the grammar right, and sentences (reactions) make sense.

**Technique 3: Story Mnemonics for Reagents**
LiAlH4 reduces carbonyls — "LiAlH4: Lion Attacks Hydrogen (full reduction)". NaBH4 is gentler — "NaBH4: Nurse gently reduces ketones only". Absurd stories stick.

**Technique 4: Colour-Coded Summary Sheets**
Use one colour per reaction type (green = addition, red = substitution, blue = elimination). Your brain's visual memory is powerful — exploit it.

**Technique 5: Spaced Retrieval Practice**
After learning 10 reactions, close your notes and try to write all 10 from memory. Get a blank sheet. This is dramatically more effective than re-reading.

*[Full article with downloadable mechanism maps and flashcard templates coming soon.]*`,
  },
  'ashtavakra-gita-lesson-on-exam-anxiety': {
    title: "Ashtavakra Gita's Lesson on Exam Anxiety",
    date: '2026-06-15',
    category: 'Mindset',
    readTime: '10 min read',
    excerpt: 'Ancient wisdom meets modern psychology: how detachment from outcomes can transform your exam performance.',
    accent: 'from-amber-500 to-yellow-500',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    content: `The Ashtavakra Gita is a radical text. In it, the sage Ashtavakra tells King Janaka: "You are already free. Stop seeking."

This may sound like the worst advice for someone who has a JEE exam in 3 months. But applied carefully, it is some of the most powerful performance psychology available.

**The Core Teaching**
Exam anxiety comes almost entirely from attachment to outcome — "I must get AIR under 1000, or I have failed." The moment the exam result becomes your identity, performance deteriorates. The mind cannot think clearly when it is defending the ego.

Ashtavakra teaches: "Abandon the idea that you are the doer." In exam terms: do the work completely, but release yourself from the idea that you *are* your rank.

**The Paradox**
Students who detach from outcomes — who study because they love understanding, who sit exams to demonstrate mastery rather than to prove their worth — consistently outperform those who are outcome-obsessed. This is validated by modern sports psychology and cognitive science.

**Practical Application**
1. **Before studying**: Say internally, "I study to understand, not to perform." This shifts your cognitive mode from threat-response to curiosity.
2. **Before the exam**: "My job is to do my best work today. The result will follow." Release the grip.
3. **During the paper**: If you encounter a hard question, notice the anxiety, label it ("this is just an emotion"), and return to the problem.

**The Gita's Investment Insight**
Bhagavad Gita 2.47: "You have the right to perform your duties, but you are not entitled to the fruits." This is not passive advice — it is the highest performance principle. Do everything fully; control nothing beyond that.

*[Full article exploring more applications of Vedantic philosophy to exam psychology coming soon.]*`,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | PK Singh Blog`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['PK Singh'],
    },
  };
}

// Minimal markdown-like renderer for the content stubs
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      return <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">{line.slice(2, -2)}</h3>;
    }
    if (line.startsWith('| ')) {
      // Skip table lines — render as code for now
      return <code key={i} className="block text-sm font-mono text-slate-600 bg-slate-50 px-3 py-1 border-l-2 border-slate-300">{line}</code>;
    }
    if (line.match(/^\d+\. \*\*/)) {
      const text = line.replace(/^\d+\. \*\*(.+?)\*\*(.*)/, (_, bold, rest) => `${bold}${rest}`);
      return <li key={i} className="text-slate-700 leading-relaxed mb-2 ml-4">{text}</li>;
    }
    if (line.startsWith('*[') && line.endsWith(']*')) {
      return <p key={i} className="text-sm text-slate-400 italic mt-8 pt-6 border-t border-slate-100">{line.slice(2, -2)}</p>;
    }
    if (line.trim() === '') return <div key={i} className="h-4" />;
    // Bold inline
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-slate-700 leading-relaxed text-lg">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    );
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];
  if (!post) notFound();

  const slugKeys = Object.keys(posts);
  const currentIdx = slugKeys.indexOf(slug);
  const prevSlug = currentIdx > 0 ? slugKeys[currentIdx - 1] : null;
  const nextSlug = currentIdx < slugKeys.length - 1 ? slugKeys[currentIdx + 1] : null;
  const prevPost = prevSlug ? posts[prevSlug] : null;
  const nextPost = nextSlug ? posts[nextSlug] : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Article header accent */}
      <div className={`h-1.5 bg-gradient-to-r ${post.accent}`} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>

          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${post.accentBg} ${post.accentText}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <time dateTime={post.date} className="text-xs text-slate-400">
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10 pb-10 border-b border-slate-100">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">PK Singh</p>
                <p className="text-xs text-slate-500">IIT + IIM Alumnus · Bestselling Author · Mentor</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose-custom space-y-2">
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 rounded-3xl bg-slate-900 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.15),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold mb-3">Get personalised guidance from PK Singh</h3>
                <p className="text-slate-400 mb-6 text-sm">1:1 mentorship, live cohorts, and free courses — tailored for JEE, NEET, SAT, CAT and GMAT.</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-all duration-300"
                >
                  Explore Courses
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Prev / Next navigation */}
          {(prevPost || nextPost) && (
            <div className="mt-12 pt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
              {prevPost && prevSlug ? (
                <Link href={`/blog/${prevSlug}`} className="group p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                  <p className="text-xs text-slate-400 mb-1">← Previous</p>
                  <p className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors text-sm leading-snug">{prevPost.title}</p>
                </Link>
              ) : <div />}
              {nextPost && nextSlug ? (
                <Link href={`/blog/${nextSlug}`} className="group p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-right sm:col-start-2">
                  <p className="text-xs text-slate-400 mb-1">Next →</p>
                  <p className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors text-sm leading-snug">{nextPost.title}</p>
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}