import React from 'react';
import { Video, PlayCircle, MessageCircle, BarChart3, FileText } from 'lucide-react';

export default function WhatYouGet() {
  const features = [
    {
      icon: Video,
      title: "Live Interactive Classes",
      description: "Real-time sessions with PK Singh. Ask doubts, solve problems together.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: PlayCircle,
      title: "Recorded Lecture Library",
      description: "Access all past sessions anytime. Rewatch, revise, repeat.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: MessageCircle,
      title: "Doubt Support",
      description: "Get personalized answers within 24 hours from the mentor.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Dashboard with streaks, completion analytics, and weekly reports.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: FileText,
      title: "Mock Tests & Analysis",
      description: "Exam-pattern practice tests with detailed performance breakdown.",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold tracking-wider mb-4 uppercase">
            What's Included
          </span>
          <h2 className="text-4xl font-bold text-slate-900 font-outfit mb-4">
            Everything You Need to Succeed
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                idx >= 3 ? 'lg:col-span-1' : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 font-outfit mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 font-inter leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
