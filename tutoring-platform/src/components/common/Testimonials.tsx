'use client';

import React, { useState } from 'react';
import { Quote, Star, PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  text: string;
  role: string;
  rating: number;
  result: string;
  avatarGradient: string;
  image: string | null;
  rankCardImage?: string | null;
}

// TODO: Replace with real student data, photos, and verified results
// Set `image` to a photo path (e.g. '/images/testimonials/arjun.jpg') for real photo,
// or leave null for initials-based avatar fallback.
// Set `rankCardImage` to a scorecard/rank-card screenshot path if available.
const testimonials: Testimonial[] = [
  { 
    name: 'Arjun K.', 
    text: 'Transformed my scores completely. The clear explanations and targeted exam strategy made all the difference in my preparation journey. I felt so much more confident on test day.', 
    role: 'JEE Advanced 2024',
    rating: 5,
    result: 'AIR 847',
    avatarGradient: 'from-blue-500 to-indigo-600',
    image: null,
    rankCardImage: null
  },
  { 
    name: 'Sneha M.', 
    text: 'Best mentoring I have seen in the ed-tech space. Highly approachable and intensely focused on weaknesses. The mock test reviews were incredibly detailed and actionable.', 
    role: 'SAT 2023',
    rating: 5,
    result: 'Score: 1560',
    avatarGradient: 'from-amber-400 to-orange-500',
    image: null,
    rankCardImage: null
  },
  { 
    name: 'Rahul S.', 
    text: 'Practical techniques that helped me drastically improve my speed and accuracy. The physics concepts were broken down into manageable chunks which I finally understood.', 
    role: 'NEET 2024',
    rating: 5,
    result: 'Score: 680/720',
    avatarGradient: 'from-emerald-400 to-teal-500',
    image: null,
    rankCardImage: null
  },
  { 
    name: 'Priya D.', 
    text: 'The personalized attention is unmatched. Unlike crowded classes, here my specific doubts were resolved instantly. My chemistry fundamentals became rock solid.', 
    role: 'JEE Main 2024',
    rating: 5,
    result: '99.8 Percentile',
    avatarGradient: 'from-pink-500 to-rose-500',
    image: null,
    rankCardImage: null
  },
  { 
    name: 'Vikram T.', 
    text: 'I was struggling with calculus, but the structured approach and step-by-step problem-solving methods completely changed my perspective. Highly recommended for serious aspirants.', 
    role: 'CBSE Class 12',
    rating: 4,
    result: 'Maths: 100/100',
    avatarGradient: 'from-violet-500 to-purple-600',
    image: null,
    rankCardImage: null
  },
  { 
    name: 'Ananya J.', 
    text: 'The study materials and conceptual clarity provided were exceptional. It felt less like being tutored and more like being guided by a true mentor who cares about your success.', 
    role: 'BITSAT 2023',
    rating: 5,
    result: 'Score: 342',
    avatarGradient: 'from-cyan-400 to-blue-500',
    image: null,
    rankCardImage: null
  },
];

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4 shadow-sm">
          Student Success
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">What Our Students Achieve</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Hear directly from our students about their journey, the mentorship experience, and the results they were able to secure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {displayedTestimonials.map((t) => (
          <div 
            key={t.name} 
            className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <Quote className="w-10 h-10 text-slate-200 mb-5" />
            
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                />
              ))}
            </div>
            
            <p className="text-slate-700 mb-8 flex-grow leading-relaxed font-medium">&ldquo;{t.text}&rdquo;</p>
            
            <div className="flex items-center gap-4 mt-auto">
              {t.image ? (
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <Image src={t.image} alt={t.name} width={48} height={48} className="object-cover" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0`}>
                  {t.name[0]}
                </div>
              )}
              <div className="flex-grow min-w-0">
                <div className="text-base font-bold text-slate-900 truncate">{t.name}</div>
                <div className="text-sm text-slate-500 font-medium truncate">{t.role}</div>
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                {t.result}
              </div>
            </div>
            {t.rankCardImage && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a href={t.rankCardImage} target="_blank" rel="noopener noreferrer" className="group/rank inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  <Image src={t.rankCardImage} alt={`${t.name} rank card`} width={32} height={24} className="rounded border border-slate-200 object-cover group-hover/rank:shadow-md transition-shadow" />
                  View scorecard
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showAll && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setShowAll(true)}
            className="px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:shadow-md transition-all duration-300"
          >
            Read more student stories
          </button>
        </div>
      )}

      {/* Video Testimonial Spotlight */}
      <div className="mt-20 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)] pointer-events-none"></div>
        <div className="md:w-1/2 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-4">Spotlight</span>
          <h3 className="text-3xl font-bold mb-4 leading-tight text-white">"PK Sir changed how I approach problem solving entirely."</h3>
          <p className="text-slate-400 mb-6 text-lg">Watch how Aryan jumped from scoring 120 in mock tests to achieving a 99.9 percentile in JEE Main.</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xl">A</div>
            <div>
              <p className="font-semibold text-white">Aryan Sharma</p>
              <p className="text-xs text-blue-300">IIT Bombay, Computer Science</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full relative z-10">
          <div className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative group cursor-pointer shadow-xl">
            {/* Placeholder for video thumbnail */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <PlayCircle className="w-16 h-16 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4" /> 2:45
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
