import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | PK Singh',
  description: 'Terms governing use of the PK Singh online learning platform.',
};

export default function TermsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-slate-300 text-sm leading-relaxed space-y-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: June 2026</p>

        <p>
          By using this website and creating an account, you agree to these terms. If you do not agree, please do not
          use the platform.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">Educational content</h2>
        <p>
          Course materials are for personal study only. You may not redistribute, resell, or publicly share videos,
          PDFs, or notes without written permission from PK Singh.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">Accounts</h2>
        <p>
          You are responsible for keeping your login credentials secure. Notify us immediately if you suspect
          unauthorized access to your account.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">Disclaimer</h2>
        <p>
          We strive for accuracy in all lessons, but exam outcomes depend on many factors. Content is provided &quot;as
          is&quot; without guarantee of specific rank or score results.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">Support</h2>
        <p>
          For help, see the{' '}
          <Link href="/support" className="text-sky-400 hover:text-sky-300">
            Support page
          </Link>
          .
        </p>
      </div>
    </PublicPageShell>
  );
}
