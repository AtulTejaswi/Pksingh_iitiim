export default function MediaLogos() {
  const exams = ['JEE Main', 'JEE Advanced', 'NEET', 'SAT', 'CAT', 'GMAT'];

  return (
    <section className="py-10 border-y border-slate-200 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">
          Structured Preparation For
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {exams.map((exam) => (
            <span
              key={exam}
              className="px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white text-sm font-bold tracking-wide"
            >
              {exam}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
