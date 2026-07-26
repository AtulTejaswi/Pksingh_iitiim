import React from 'react';
import { Play, Download } from 'lucide-react';

const SAMPLE_LESSON_URL = '';

export default function FreePreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-amber-50 rounded-3xl overflow-hidden shadow-sm border border-amber-100 dark:text-slate-900">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Content */}
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-outfit mb-4">
              Experience the Teaching Style
            </h2>
            <p className="text-lg text-slate-700 font-inter mb-8">
              Try before you commit. Watch a free sample lesson and download our comprehensive study guide to see if this learning approach works for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={SAMPLE_LESSON_URL || '#free-preview'}
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
                {...(SAMPLE_LESSON_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Sample Lesson
              </a>
              <button className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Free Study Guide
              </button>
            </div>
          </div>

          {/* Right Side: Video Placeholder */}
          <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
            <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg group bg-slate-900">
              {SAMPLE_LESSON_URL ? (
                SAMPLE_LESSON_URL.includes('youtube.com') || SAMPLE_LESSON_URL.includes('youtu.be') ? (
                  <iframe
                    src={SAMPLE_LESSON_URL}
                    title="Sample Lesson"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={SAMPLE_LESSON_URL}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <Play className="w-16 h-16 text-amber-400 mb-4" />
                  <p className="text-lg font-semibold text-center text-white">Sample lesson preview</p>
                  <p className="text-sm text-slate-400 mt-2 text-center">A video demonstration is being prepared</p>
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
