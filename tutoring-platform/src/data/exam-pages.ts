// ─────────────────────────────────────────────────────────────────────────
// Per-exam mentorship landing page content.
// Each exam has its own unique body copy (300+ words), pillars, checklist
// and FAQ block — no shared boilerplate — so the pages rank for distinct
// long-tail queries instead of duplicating the homepage.
// ─────────────────────────────────────────────────────────────────────────

import type { FaqItem } from '@/data/faqs';

export interface ExamPageConfig {
  /** Route slug, e.g. "jee-mentorship" */
  slug: string;
  /** Short exam name used in CTAs and headings, e.g. "JEE" */
  exam: string;
  /** Keyword-specific H1 for the page */
  h1: string;
  /** Badge shown above the H1 */
  badge: string;
  /** Lead paragraph under the H1 */
  lead: string;
  /** Trust line under the hero CTAs */
  heroNote: string;
  /** 2–3 paragraphs for the "Why {exam} mentorship" section */
  intro: string[];
  /** Feature cards for the bento section */
  pillars: { title: string; desc: string }[];
  /** Checklist for "What's inside" */
  includes: string[];
  /** Closing paragraph of "What's inside" */
  includesNote: string;
  /** Exam-specific FAQ block (drives both the visible accordion and FAQPage schema) */
  faqs: FaqItem[];
  /** Course schema data */
  courseName: string;
  courseDescription: string;
}

export const examPages: Record<string, ExamPageConfig> = {
  jee: {
    slug: 'jee-mentorship',
    exam: 'JEE',
    h1: 'JEE Mentorship by PK Singh — 1-on-1 Coaching for JEE Main & Advanced',
    badge: 'JEE Main + Advanced',
    lead: 'From securing an All India Rank of 1386 in IIT-JEE to an MBA from IIM Calcutta and a PhD, PK Singh has walked the exact path you are preparing for. Get a personalized 1-on-1 JEE mentorship built around your current level, your target rank, and the syllabus that actually matters.',
    heroNote: '23+ years of mentorship · IIT + IIM alumnus · Proven exam strategy',
    intro: [
      'Most JEE preparation fails not because students are lazy, but because the syllabus is vast and the noise is louder than the signal. Physics, Chemistry and Mathematics each demand different skills — visualization, mechanism-memorization, and pattern-recognition — and a one-size-fits-all classroom cannot adapt to how your brain learns each one. A dedicated JEE mentor can.',
      'PK Singh\'s JEE mentorship starts with a diagnostic: where you stand in every chapter of JEE Main and Advanced, which topics you can convert into marks within weeks, and which ones need a longer runway. From there you get a weekly plan that balances new concepts, problem practice, and mock-test review — reviewed with you personally, not by a teaching assistant.',
      'The result is a preparation loop that mirrors how toppers actually study: learn the concept once, drill it in exam conditions, analyse every mistake, and fix the exact weak areas before the next cycle. That loop, repeated weekly with accountability, is what turns a promising student into a rank-worthy one.',
    ],
    pillars: [
      { title: 'Concept-first teaching', desc: 'Every Physics, Chemistry and Math topic built from first principles with visual derivations, so you can solve unseen problems — not just recall solved ones.' },
      { title: 'JEE-pattern problem drills', desc: 'Daily practice sets matched to JEE Main & Advanced difficulty, with solutions reviewed line-by-line in your 1-on-1 sessions.' },
      { title: 'Mock test analysis', desc: 'Full-syllabus tests with detailed error review — the difference between your score in practice and on exam day is analysed and closed.' },
      { title: 'Personal strategy sessions', desc: 'Weekly 1:1 check-ins to recalibrate the plan: which chapters to prioritize, how to allocate time, and how to stay calm under pressure.' },
    ],
    includes: [
      'Chapter-wise study notes and formula sheets for the complete JEE syllabus',
      'Daily practice problems with step-by-step video solutions',
      'Previous-year JEE Main & Advanced question analysis by topic',
      'Weekly mock tests with performance breakdown and error log',
      'Doubt resolution within 4 hours on 1:1 plans (24 hours on Live Cohort)',
      'A mentor who reads your test papers and tells you exactly what to fix',
    ],
    includesNote: 'Whether you are in Class 11, Class 12, or a dropper year, the plan is built from your starting point — not from a fixed classroom calendar.',
    faqs: [
      { q: 'Does JEE mentorship cover both JEE Main and JEE Advanced?', a: 'Yes. The plan covers the full JEE Main syllabus and extends into Advanced-level problem solving for students targeting top NITs and IITs. Your diagnostic decides how the weeks are split between the two.' },
      { q: 'I am in Class 11. Is it too early to start?', a: 'Class 11 is actually the ideal time — it lets us build concepts properly instead of patching gaps in a hurry. Many of our strongest mentees started in Class 11 with two focused years.' },
      { q: 'I am a dropper / repeat student. Can you help?', a: 'Yes. Repeat students get a compressed revision-first plan: high-yield topics first, full syllabus coverage in 4–5 months, and weekly mock tests from month one. The biggest lever for droppers is disciplined test analysis, which is built into the plan.' },
      { q: 'How quickly are doubts resolved?', a: 'On 1:1 Mentorship plans, doubts are resolved within 4 hours via WhatsApp or chat. Live Cohort students get doubts answered in the next live session or within 24 hours on the community forum.' },
      { q: 'How is 1-on-1 JEE mentorship different from a coaching institute?', a: 'A batch of 100+ students moves at one speed. A 1:1 mentor adapts to yours — your weak chapters, your timing, your mistakes. You are not a roll number; you are an individual with a plan reviewed weekly.' },
      { q: 'Can I start free?', a: 'Yes. Create a free account to access the recorded lecture library and free study guide, then decide if the Live Cohort or 1:1 Mentorship plan is right for you.' },
    ],
    courseName: 'JEE 1-on-1 Mentorship',
    courseDescription: 'Personalized JEE Main & Advanced mentorship by PK Singh — live classes, doubt support, mock tests and exam strategy for JEE aspirants.',
  },

  neet: {
    slug: 'neet-mentorship',
    exam: 'NEET',
    h1: 'NEET Mentorship by PK Singh — 1-on-1 Coaching for NEET UG & MBBS Aspirants',
    badge: 'NEET UG',
    lead: 'NEET is a race against time as much as it is a test of knowledge — 180 questions, 200 minutes, and one all-important percentile. PK Singh\'s NEET mentorship builds your Physics, Chemistry and Biology to NCERT depth, then trains your speed and accuracy with timed mock-test cycles.',
    heroNote: 'IIT + IIM alumnus · Biology-first strategy · Verified practice cycles',
    intro: [
      'In NEET, 45% of the paper is Biology — and Biology is the section where most marks are thrown away through careless reading rather than lack of knowledge. Our mentorship treats NCERT as the holy text, maps every line to previous-year questions, and drills the exact MCQ-reading discipline that separates a 600 from a 650.',
      'Physics and Chemistry in NEET are a different game from JEE: the questions are faster, more formula-driven, and heavily weighted toward predictable chapters. PK Singh\'s plan identifies the high-yield chapters, keeps your revision of them on a strict rotation, and uses weekly mock tests to measure whether speed and accuracy are actually improving.',
      'Every month ends with a full-syllabus simulated test, a percentile projection against real NEET cut-offs, and a one-on-one review where your errors are categorised — conceptual, careless, or time-pressure — so the next month targets the real bottleneck.',
    ],
    pillars: [
      { title: 'NCERT-first Biology', desc: 'Every Biology line mapped to previous-year NEET questions, with diagrams, tables and mnemonics that stick.' },
      { title: 'Formula-speed Physics', desc: 'NEET Physics is solved fast or not at all — high-yield chapters drilled for speed and accuracy together.' },
      { title: 'Chemistry without rote panic', desc: 'Organic mechanisms, inorganic exceptions and physical chemistry formulas organised into a revision-friendly system.' },
      { title: 'Mock-test discipline', desc: 'Weekly timed tests with error categorisation — conceptual, careless, or time-pressure — and a fix for each.' },
    ],
    includes: [
      'Complete NEET syllabus coverage across Physics, Chemistry and Biology',
      'Chapter-wise NCERT annotations and high-yield summary sheets',
      'Weekly full-syllabus mock tests with percentile projection',
      'Error log review in weekly 1:1 sessions',
      'Doubt resolution within 4 hours on 1:1 plans',
      'Strategy sessions on exam-day time allocation and question selection',
    ],
    includesNote: 'Whether you are a Class 11 student starting fresh or a repeat aspirant chasing your target score, the plan starts from your current level — measured, not assumed.',
    faqs: [
      { q: 'Does the mentorship cover all three subjects of NEET?', a: 'Yes — Physics, Chemistry and Biology are all planned together. Biology gets the NCERT-first treatment it needs, while Physics and Chemistry are taught for the speed and accuracy NEET actually rewards.' },
      { q: 'How is Biology taught differently from school?', a: 'School teaches Biology chapter by chapter. We teach it question by question — every NCERT line is annotated with how it has appeared in past papers, so you read with exam intent instead of passive note-making.' },
      { q: 'I scored well in board exams but struggle with mock tests. Why?', a: 'Boards reward recall; NEET rewards speed under time pressure. The gap is almost always test-taking discipline — question selection, time allocation, and careless-error control. That is exactly what the weekly mock-test review works on.' },
      { q: 'What is the batch size for Live Cohort?', a: 'Live Cohort batches are capped at 25 students. 1:1 Mentorship is strictly one student at a time with direct access to PK Singh.' },
      { q: 'Can I start free and upgrade later?', a: 'Yes. The free plan gives you the recorded lecture library and study guide. You can upgrade to Live Cohort or 1:1 Mentorship any time, with the prorated amount adjusted on upgrades.' },
      { q: 'How quickly are doubts resolved?', a: '1:1 Mentorship students get doubts resolved within 4 hours via WhatsApp or chat. Live Cohort students get answers in the next session or within 24 hours on the forum.' },
    ],
    courseName: 'NEET UG 1-on-1 Mentorship',
    courseDescription: 'Personalized NEET UG mentorship by PK Singh — Biology-first strategy, MCQ speed drills, mock tests and MBBS admission guidance.',
  },

  iit: {
    slug: 'iit-mentorship',
    exam: 'IIT',
    h1: 'IIT Mentorship by PK Singh — Crack JEE Advanced and Get Into IIT',
    badge: 'IIT JEE Advanced',
    lead: 'Getting into an IIT is not about studying more hours — it is about studying the right things in the right order, and being coached by someone who has actually been there. PK Singh is an IIT alumnus, IIM Calcutta MBA and PhD holder who mentors students specifically for the JEE Advanced leap.',
    heroNote: 'AIR 1386 in IIT-JEE · IIT + IIM alumnus · Advanced problem-solving coach',
    intro: [
      'JEE Advanced is a different examination from JEE Main. Main tests whether you know the syllabus; Advanced tests whether you can think — multi-concept problems, unfamiliar framings, and traps laid for the memorisers. Most students who clear Main with a good rank still miss IIT because nobody trained them for that shift in difficulty. That is the gap IIT mentorship exists to close.',
      'The IIT mentorship plan front-loads the Advanced way of thinking: every topic is taught to the depth required by the last ten years of Advanced papers, not the depth required by coaching modules. Problem sets are built from actual Advanced and Olympiad-adjacent questions, so the exam never feels like a format shock.',
      'Weekly one-on-one sessions review your solutions — not just your answers. We look at how you approached a problem, where the first wrong turn happened, and how to recognise the intended path faster. That meta-skill — thinking about your own thinking — is the real differentiator for Advanced toppers.',
    ],
    pillars: [
      { title: 'Advanced-depth teaching', desc: 'Every topic covered to the depth of the last decade of JEE Advanced — not a diluted Main-first version.' },
      { title: 'Multi-concept problem sets', desc: 'Problems that combine two or three topics the way Advanced does, with guided solution review.' },
      { title: 'Solution-process coaching', desc: 'Weekly 1:1 reviews of your written solutions to fix approach errors, not just answer errors.' },
      { title: 'Rank-focused test cycles', desc: 'Full Advanced-pattern tests with ranking analysis against realistic Advanced cut-offs.' },
    ],
    includes: [
      'Complete JEE Advanced syllabus with multi-concept problem practice',
      'Previous-year Advanced paper analysis, topic by topic',
      'Written-solution review in weekly 1:1 sessions',
      'Advanced-pattern mock tests with predicted rank bands',
      'Doubt resolution within 4 hours on 1:1 plans',
      'Personal mentorship from an IIT + IIM alumnus who cracked it himself',
    ],
    includesNote: 'IIT mentorship is the natural next step after JEE Main readiness — or the parallel track for students who want to aim at IITs from day one of Class 11.',
    faqs: [
      { q: 'How is IIT mentorship different from JEE mentorship?', a: 'JEE mentorship covers Main and Advanced together. IIT mentorship focuses on the Advanced leap — the multi-concept problems, solution process, and test strategy that separate IIT admits from the rest.' },
      { q: 'I am preparing for JEE Main only right now. Should I join?', a: 'If IIT is your goal, the Advanced way of thinking should start now, not after Main. Our plan layers Advanced practice alongside your Main preparation so there is no panic rework later.' },
      { q: 'What rank can I realistically target?', a: 'That depends on your starting point, consistency, and test-taking discipline. The first month includes a diagnostic and a realistic projection based on how students with similar starting profiles have progressed.' },
      { q: 'Does PK Singh teach all subjects personally?', a: 'Yes — Physics, Chemistry and Mathematics are all covered within the mentorship, with PK Singh personally conducting the 1:1 strategy and review sessions.' },
      { q: 'What if I do not clear Advanced in my first attempt?', a: 'The plan includes honest monthly assessment. If your progress signals a gap, we re-plan earlier rather than letting you discover it on exam day.' },
      { q: 'How do I start?', a: 'Create a free account to access the lecture library and study guide, then choose Live Cohort or 1:1 Mentorship. You can talk to PK Singh before enrolling.' },
    ],
    courseName: 'IIT JEE Advanced Mentorship',
    courseDescription: 'JEE Advanced-focused mentorship by PK Singh — multi-concept problem solving, solution-process coaching and rank-targeted test cycles.',
  },

  cat: {
    slug: 'cat-mentorship',
    exam: 'CAT',
    h1: 'CAT Mentorship by PK Singh — IIM MBA Guidance from an IIM Calcutta Alumnus',
    badge: 'CAT / IIM MBA',
    lead: 'CAT is an aptitude test that can be cracked with the right plan — and PK Singh has lived the outcome you are targeting, earning his MBA from IIM Calcutta. Get 1-on-1 CAT mentorship covering VARC, DILR and Quant, with the mock-test strategy that converts preparation into a 99+ percentile.',
    heroNote: 'IIM Calcutta alumnus · VARC + DILR + Quant · Data-driven mock strategy',
    intro: [
      'Most CAT aspirants prepare by solving more questions. The ones who score 99+ prepare by analysing their own performance: which section is the anchor, which question types leak time, and how the adaptive difficulty of the actual CAT reshuffles the game. CAT mentorship is built around that analysis loop, not around question counts.',
      'Quant in CAT is deceptively simple — the arithmetic and algebra are school-level, but the pressure and the time per question are brutal. DILR rewards pattern recognition over raw speed, and VARC punishes over-reading more than it rewards vocabulary. Each section needs its own strategy, and PK Singh\'s plan builds all three deliberately, with your personal strengths mapped first.',
      'Working professionals get a plan that respects a job: weekend-heavy scheduling, a compressed high-yield syllabus, and mock tests on CAT\'s actual window. Students get more hours but the same discipline — because in CAT, consistency of mocks beats intensity of cramming.',
    ],
    pillars: [
      { title: 'Section-wise strategy', desc: 'VARC, DILR and Quant each get their own plan — built around your anchor section and your leaky ones.' },
      { title: 'Mock-test analytics', desc: 'Every mock is dissected: per-set timing, question-skipping discipline, and score vs. time trade-offs.' },
      { title: 'IIM-alumni mentorship', desc: 'Guidance from an IIM Calcutta alumnus who understands what the B-schools actually look for.' },
      { title: 'Working-professional friendly', desc: 'Weekend-heavy plans and a compressed syllabus for aspirants balancing jobs with CAT prep.' },
    ],
    includes: [
      'Complete VARC, DILR and Quant coverage with section-wise priorities',
      'High-yield syllabus plan — the 60% of topics that produce 90% of marks',
      'Weekly mocks with detailed performance analytics and error review',
      '1:1 strategy sessions on attempt order and time allocation',
      'Doubt resolution within 4 hours on 1:1 plans',
      'Profile and interview-phase guidance from an IIM alumnus',
    ],
    includesNote: 'CAT mentorship runs as a focused 4–6 month campaign timed to the exam, so the plan is intense, structured, and ends exactly when you need to peak.',
    faqs: [
      { q: 'I am a non-engineer. Can I crack CAT Quant?', a: 'Absolutely. CAT Quant is school-level arithmetic, algebra and geometry — the difficulty is in speed, not depth. The plan builds speed methodically from your current level, with shortcuts taught only after the core concepts are solid.' },
      { q: 'How many mocks should I take, and when do I start?', a: 'Typically one mock per week from month two, building to two per week in the final month. Taking mocks too early without a plan is demoralising; the schedule is designed to protect your confidence curve.' },
      { q: 'I am a working professional with limited time. Is this for me?', a: 'Yes. The plan is built for exactly that constraint — weekend-heavy scheduling, a compressed high-yield syllabus, and mocks on CAT\'s real window. Your progress is measured by quality of analysis, not hours.' },
      { q: 'Does the mentorship cover the interview / WAT round?', a: '1:1 Mentorship includes profile strategy and interview-phase guidance from an IIM alumnus. B-school calls depend on percentile plus profile, and we work on both.' },
      { q: 'How is this different from online CAT courses?', a: 'Courses give you content; mentorship gives you accountability and diagnosis. Your mocks are reviewed with you personally, your weak sets are targeted, and your attempt strategy is tuned every week.' },
      { q: 'How do I start?', a: 'Start free with the lecture library and study guide, then upgrade to Live Cohort or 1:1 Mentorship. Talk to PK Singh first if you want a plan before committing.' },
    ],
    courseName: 'CAT 1-on-1 Mentorship',
    courseDescription: 'CAT mentorship by PK Singh, IIM Calcutta alumnus — VARC, DILR and Quant strategy with mock analytics and IIM admission guidance.',
  },

  gmat: {
    slug: 'gmat-mentorship',
    exam: 'GMAT',
    h1: 'GMAT Mentorship by PK Singh — Score 700+ with a Personalized MBA Test Plan',
    badge: 'GMAT Focus Edition',
    lead: 'The GMAT is an adaptive test: every question you answer changes the difficulty of the next. That makes it the most strategy-sensitive entrance exam you will ever take — and the easiest to waste months on without a mentor who understands the scoring engine. PK Singh, an IIM Calcutta MBA, mentors working professionals to 700+ scores with a plan built around the GMAT Focus format.',
    heroNote: 'IIM alumnus · Adaptive-test strategist · Built for working professionals',
    intro: [
      'The GMAT Focus Edition tests Quantitative Reasoning, Verbal Reasoning and Data Insights. Most professionals preparing for it have two problems: time, and the illusion that more practice questions equal a better score. The GMAT rewards a tight loop of short focused study blocks, adaptive practice, and honest error analysis — exactly the loop a mentor can enforce.',
      'Data Insights is the section that separates 650 from 700. It combines quant, logic and reading speed in one question type, and it is where untutored aspirants bleed points. Our plan treats DI as a discipline of its own, with timed sets and a personal log of the exact trap patterns you fall into.',
      'Because most GMAT aspirants are working, the plan is ruthlessly time-boxed: 45–60 minutes of focused blocks on weekdays, one full adaptive mock on weekends, and a monthly 1:1 review where your score trends are compared against your target-school profile.',
    ],
    pillars: [
      { title: 'Adaptive-exam strategy', desc: 'Learn how the adaptive engine works and use it: difficulty management beats raw question counts.' },
      { title: 'Data Insights mastery', desc: 'DI drilled as its own discipline — the highest-leverage section for crossing the 700 barrier.' },
      { title: 'Time-boxed study blocks', desc: 'A schedule built for a working week: 45–60 minute focused blocks and one weekend mock.' },
      { title: 'Score-to-school mapping', desc: 'Monthly review against your target-school profile — because the right score depends on your goals.' },
    ],
    includes: [
      'Complete GMAT Focus coverage — Quant, Verbal and Data Insights',
      'Adaptive practice sets with difficulty progression',
      'Weekly full-length mocks with score trend analysis',
      '1:1 monthly strategy reviews comparing progress to target schools',
      'Error log built around the trap patterns you personally fall into',
      'Doubt resolution within 4 hours on 1:1 plans',
    ],
    includesNote: 'Whether you are targeting an Indian MBA, a European school or a US program, the plan is tuned to the score your target actually needs — not a generic 700-for-everyone template.',
    faqs: [
      { q: 'How is the GMAT Focus Edition different from the old GMAT?', a: 'The Focus Edition has three sections — Quant, Verbal and Data Insights — with shorter sections and no essay. Preparation strategies shift accordingly: DI becomes the key differentiator, which our plan is built around.' },
      { q: 'I work full-time. Can I really prepare for the GMAT?', a: 'Yes — most of our GMAT mentees are working professionals. The plan is built around 45–60 minute weekday blocks and a weekend mock, and the mentor keeps you accountable to that rhythm.' },
      { q: 'What score do I actually need for my target school?', a: 'That depends on the school, your work experience and your profile. The first month includes a target-setting session where your realistic score band is mapped against the schools you want.' },
      { q: 'How long does the preparation take?', a: 'A typical campaign is 3–5 months of consistent weekly work. The plan is compressed or extended based on your diagnostic score and target.' },
      { q: 'How quickly are doubts resolved?', a: '1:1 Mentorship students get doubts resolved within 4 hours via WhatsApp or chat. Live Cohort students get answers in the next session or within 24 hours.' },
      { q: 'How do I start?', a: 'Start free with the recorded lecture library and study guide, then upgrade to Live Cohort or 1:1 Mentorship. You can talk to PK Singh before you commit.' },
    ],
    courseName: 'GMAT 1-on-1 Mentorship',
    courseDescription: 'GMAT Focus mentorship by PK Singh, IIM alumnus — adaptive-exam strategy, Data Insights mastery and target-school score planning.',
  },

  sat: {
    slug: 'sat-mentorship',
    exam: 'SAT',
    h1: 'SAT Mentorship by PK Singh — Digital SAT Prep for Top University Admissions',
    badge: 'Digital SAT',
    lead: 'The Digital SAT is a shorter, adaptive test with a new challenge: how you manage the adaptive engine matters as much as how well you know the material. PK Singh\'s SAT mentorship prepares international and US-bound students for top university admissions with strategy-first preparation for Reading, Writing and Math.',
    heroNote: 'Bestselling author for UK & USA audiences · Adaptive-test prep · University admissions focus',
    intro: [
      'The Digital SAT is significantly different from the paper test: it is two hours instead of three, adapts question difficulty per module, and shortens reading passages while making vocabulary questions more context-driven. Students who prepare with old SAT habits lose points not from lack of ability but from misreading the new format. Our mentorship starts by removing that format risk.',
      'Math in the Digital SAT is narrower but more calculator-dependent, and the on-screen tools change how you should practice. The Reading and Writing section rewards precision reading and grammar rules over literary interpretation. Each skill is built deliberately, with the Bluebook-style interface used in practice from week one so exam day feels familiar.',
      'For international students, the SAT is often one part of a bigger admissions picture — grades, essays, extracurriculars, and English proficiency. The mentorship plans the SAT inside that picture, timing the test to application deadlines and setting score targets based on the universities you actually want.',
    ],
    pillars: [
      { title: 'Digital-format fluency', desc: 'Train on Bluebook-style adaptive practice from week one — no paper-era habits, no format shock on exam day.' },
      { title: 'Precision Reading & Writing', desc: 'Context-driven vocabulary and grammar rules taught as a system, not as intuition.' },
      { title: 'Calculator-confident Math', desc: 'Digital SAT Math drilled with the on-screen calculator and tools the real test provides.' },
      { title: 'Admissions-aligned timing', desc: 'Test dates planned around application deadlines and target-school score requirements.' },
    ],
    includes: [
      'Complete Digital SAT coverage — Reading & Writing and Math',
      'Adaptive practice sets mirroring the real module difficulty flow',
      'Full-length practice tests with score band analysis',
      'Personal study schedule built around school and application deadlines',
      'Doubt resolution within 4 hours on 1:1 plans',
      'Guidance on how the SAT fits your university application strategy',
    ],
    includesNote: 'The plan suits both students currently in school and gap-year aspirants, with intensity matched to how much time is available before the target test date.',
    faqs: [
      { q: 'How is Digital SAT prep different from the old paper SAT?', a: 'The Digital SAT is adaptive and shorter, with different question types — especially in Reading, where passages are shorter and vocabulary is context-based. Preparation must use the digital interface and adaptive practice, which is how our plan is built.' },
      { q: 'Which grade should students start preparing?', a: 'Most of our students start in Grade 10 or early Grade 11, which leaves room for retakes and for the rest of the application. The plan can also compress into a summer for late starters.' },
      { q: 'What score should I target for top universities?', a: 'Targets depend on the university list, typically 1450–1550+ for highly selective schools. The first session maps your current score band against your target list so the plan is sized correctly.' },
      { q: 'I am an international student. Does the mentorship cover more than the test?', a: 'The mentorship focuses on the SAT itself and schedules it around your application timeline. Broader admissions guidance is available in 1:1 sessions with PK Singh.' },
      { q: 'How quickly are doubts resolved?', a: '1:1 Mentorship students get doubts resolved within 4 hours via WhatsApp or chat. Live Cohort students get answers in the next session or within 24 hours.' },
      { q: 'Can I start free?', a: 'Yes. Create a free account for the recorded lecture library and study guide, then choose Live Cohort or 1:1 Mentorship. You can talk to PK Singh before enrolling.' },
    ],
    courseName: 'Digital SAT 1-on-1 Mentorship',
    courseDescription: 'Digital SAT mentorship by PK Singh — adaptive-format fluency, precision Reading & Writing, calculator-confident Math and admissions-aligned planning.',
  },
};
