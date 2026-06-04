import React from 'react';
const testimonials = [
  { name: 'A. Kumar', text: 'Transformed my scores — clear explanations and exam strategy.', role: 'JEE Learner' },
  { name: 'S. Mehta', text: 'Best mentoring I have seen. Approachable and focused.', role: 'SAT Student' },
  { name: 'R. Sharma', text: 'Practical techniques that helped me improve speed and accuracy.', role: 'NEET Aspirant' },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
      <div className="text-center mb-8">
        <h3 className="text-sm uppercase tracking-[0.35em] text-blue-600 font-semibold mb-2">Student Success</h3>
        <h2 className="text-2xl font-extrabold text-slate-900">What students say</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-slate-600 mb-4">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">{t.name[0]}</div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
