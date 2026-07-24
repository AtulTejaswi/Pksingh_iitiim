import React from 'react';
import { Play, Download } from 'lucide-react';

// TODO_VIDEO_URL: Replace this with the real sample lesson video URL (YouTube or direct .mp4)
const TODO_VIDEO_URL = '';

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
              <a
                href={TODO_VIDEO_URL || '#free-preview'}
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                {...(TODO_VIDEO_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
              {TODO_VIDEO_URL ? (
                TODO_VIDEO_URL.includes('youtube.com') || TODO_VIDEO_URL.includes('youtu.be') ? (
                  <iframe
                    src={TODO_VIDEO_URL}
                    title="Sample Lesson"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={TODO_VIDEO_URL}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-8">
                  <Play className="w-16 h-16 text-amber-400 mb-4 opacity-60" />
                  <p className="text-lg font-semibold text-center">Sample lesson video</p>
                  <p className="text-sm text-white/50 mt-2 text-center">Replace with real recording — set TODO_VIDEO_URL at top of this file</p>
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
