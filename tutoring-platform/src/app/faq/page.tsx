import type { Metadata } from 'next';
import FaqSection from '@/components/common/FaqSection';
import Navbar from '@/components/student/Navbar';
import SiteFooter from '@/components/common/SiteFooter';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about PK Singh\'s mentorship — refund policy, live class timings, batch sizes, payment methods, doubt resolution, and more.',
  openGraph: {
    title: 'FAQ | PK Singh Mentorship',
    description: 'Everything you need to know before enrolling — refund policy, live class timings, batch sizes, payment methods.',
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-slate-50 to-white py-16 px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-[0.3em] mb-4">
            FAQ
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know before enrolling. Can&apos;t find an answer? Reach us at{' '}
            <a href="mailto:support@pksingh.com" className="text-amber-600 font-semibold hover:underline">
              support@pksingh.com
            </a>
          </p>
        </div>
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}