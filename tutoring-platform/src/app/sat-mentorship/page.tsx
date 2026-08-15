import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'SAT Mentorship by PK Singh | Digital SAT Prep | Top University Admissions',
  description:
    'Digital SAT mentorship from PK Singh, bestselling author for UK & USA audiences. Adaptive-format fluency, Reading & Writing precision and admissions-aligned planning. Start free.',
  keywords: [
    'SAT mentorship',
    'Digital SAT coaching',
    'SAT prep online',
    'SAT tutor international students',
    'best SAT mentor India',
    '1-on-1 SAT coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/sat-mentorship`,
  },
  openGraph: {
    title: 'SAT Mentorship by PK Singh | Digital SAT Prep',
    description:
      'Digital SAT mentorship — adaptive-format fluency, Reading & Writing precision and admissions-aligned planning.',
    url: `${SITE_URL}/sat-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/sat-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh mentoring Digital SAT preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAT Mentorship by PK Singh',
    description: 'Digital SAT mentorship for top university admissions.',
    images: ['/og/sat-mentorship.jpg'],
  },
};

export default function SatMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.sat} />
    </PublicPageShell>
  );
}
