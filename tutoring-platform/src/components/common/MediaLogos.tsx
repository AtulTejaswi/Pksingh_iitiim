export default function MediaLogos() {
  const stats = [
    { value: '10,000+', label: 'Students Mentored' },
    { value: '23+', label: 'Years of Experience' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '2', label: 'Bestselling Books' },
  ];

  return (
    <section className="py-10 border-y border-slate-200 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">
          Why Students Trust PK Singh
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}