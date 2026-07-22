import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | PK Singh',
  description: 'How PK Singh tutoring platform collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-slate-600 text-sm leading-relaxed space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: June 2026</p>

        <section>
          <p>
            PK Singh (&quot;we&quot;, &quot;our&quot;) operates the tutoring platform at pksingh-iitiim.vercel.app. This policy
            explains what information we collect when you browse courses, create an account, or enroll in lessons.
          </p>
          <h2 className="text-lg font-semibold text-slate-900 pt-4">Information we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account details: name, email, optional country preference.</li>
            <li>Learning activity: course enrollments and lesson completion status.</li>
            <li>Technical data: browser type and IP address for security and rate limiting.</li>
          </ul>
          <h2 className="text-lg font-semibold text-slate-900 pt-4">How we use it</h2>
          <p>
            We use your information to provide access to courses, track progress, communicate about your account,
            and improve the platform. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-lg font-semibold text-slate-900 pt-4">Data retention</h2>
          <p>
            We retain account and progress data while your account is active. You may request deletion by contacting
            support.
          </p>
          <h2 className="text-lg font-semibold text-slate-900 pt-4">Contact</h2>
          <p>
            Questions about privacy? Visit our{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-800 font-semibold">
              Support page
            </Link>
            .
          </p>
        </section>
      </div>
    </PublicPageShell>
  );
}
