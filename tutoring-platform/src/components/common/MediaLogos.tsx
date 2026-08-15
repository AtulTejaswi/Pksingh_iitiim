export default function MediaLogos() {
  const exams = ['JEE Main', 'JEE Advanced', 'NEET', 'SAT', 'CAT', 'GMAT'];

  return (
    <section className="py-10 border-y border-border-subtle bg-bg-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-ink-muted mb-6">
          Structured Preparation For
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {exams.map((exam) => (
            <span
              key={exam}
              className="px-5 py-2 rounded-full bg-bg-card border border-border-subtle text-ink-secondary text-sm font-bold tracking-wide"
            >
              {exam}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
