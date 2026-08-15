import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'CAT Mentorship by PK Singh | IIM MBA Guidance | IIM Calcutta Alumnus',
  description:
    'CAT mentorship from PK Singh, IIM Calcutta alumnus. VARC, DILR and Quant strategy with mock analytics, attempt-order coaching and IIM admission guidance. Start free.',
  keywords: [
    'CAT mentorship',
    'CAT coaching online',
    'IIM MBA mentor',
    'CAT VARC DILR Quant strategy',
    'best CAT mentor India',
    '1-on-1 CAT coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/cat-mentorship`,
  },
  openGraph: {
    title: 'CAT Mentorship by PK Singh | IIM Calcutta Alumnus',
    description:
      '1-on-1 CAT mentorship — VARC, DILR and Quant strategy with mock analytics and IIM admission guidance.',
    url: `${SITE_URL}/cat-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/cat-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh IIM alumnus mentoring CAT preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAT Mentorship by PK Singh',
    description: 'CAT mentorship from an IIM Calcutta alumnus for MBA aspirants.',
    images: ['/og/cat-mentorship.jpg'],
  },
};

export default function CatMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.cat} />
    </PublicPageShell>
  );
}
