import React from 'react';
import { Play, Download } from 'lucide-react';

export default function FreePreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-amber-50 rounded-3xl overflow-hidden shadow-sm border border-amber-100">
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
              <button className="flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-sm">
                <Play className="w-5 h-5 mr-2" />
                Watch Sample Lesson
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Free Study Guide
              </button>
            </div>
          </div>

          {/* Right Side: Video Placeholder */}
          <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
            <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg group bg-slate-900">
              {/* TODO: Replace with actual sample lesson video URL */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Sample Lesson"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
