import React from 'react';
import Navbar from '@/components/student/Navbar';
import SiteFooter from '@/components/common/SiteFooter';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
