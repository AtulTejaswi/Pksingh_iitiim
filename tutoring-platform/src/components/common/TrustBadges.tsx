import React from 'react';
import { GraduationCap, Award, BookOpen, Users } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: GraduationCap, label: "IIT Alumnus" },
    { icon: Award, label: "IIM Calcutta MBA" },
    { icon: BookOpen, label: "Bestselling Author" },
    { icon: Users, label: "Global Mentor Network" },
  ];

  return (
    <section className="py-12 bg-bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          {badges.map((badge, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center justify-center md:justify-start space-x-3 bg-bg-card py-3 px-6 rounded-full shadow-warm-sm border border-border-subtle hover:shadow-warm-md transition-shadow">
                <div className="bg-brand-50 p-2 rounded-full text-brand-600 shadow-sm border border-brand-100">
                  <badge.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-ink font-sans whitespace-nowrap text-sm sm:text-base">
                  {badge.label}
                </span>
              </div>
              {/* Divider on desktop */}
              {idx < badges.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-border-subtle mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
