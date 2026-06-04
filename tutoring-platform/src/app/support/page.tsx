import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import Link from 'next/link';
import { Mail, BookOpen, LogIn } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support | PK Singh',
  description: 'Get help with courses, enrollment, and your PK Singh learning account.',
};

export default function SupportPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Support</h1>
        <p className="text-slate-500 text-sm mb-10">
          Need help with courses, login, or enrollment? Start here — no account required to browse our catalog.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Browse without signing in</h2>
            <p className="text-slate-600 text-sm mb-4">
              Explore all published courses, read descriptions, and watch free preview lessons before you enroll.
            </p>
            <Link
              href="/courses"
              className="text-blue-600 text-sm font-semibold hover:text-blue-800"
            >
              View courses →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <LogIn className="w-8 h-8 text-indigo-600 mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Account & enrollment</h2>
            <p className="text-slate-600 text-sm mb-4">
              Create a free account to enroll in courses and track lesson progress. Use forgot password if you cannot
              sign in.
            </p>
            <Link href="/login" className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">
              Sign in →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2">
            <Mail className="w-8 h-8 text-emerald-600 mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Contact</h2>
            <p className="text-slate-600 text-sm">
              For mentorship inquiries or technical issues, email{' '}
              <a href="mailto:support@pksingh.com" className="text-blue-600 hover:text-blue-800">
                support@pksingh.com
              </a>{' '}
              (update this address in production to your real inbox).
            </p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
