import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'GMAT Mentorship by PK Singh | 700+ Score | IIM Alumnus Mentor',
  description:
    'GMAT Focus mentorship from PK Singh, IIM alumnus. Adaptive-exam strategy, Data Insights mastery and target-school score planning for working professionals. Start free.',
  keywords: [
    'GMAT mentorship',
    'GMAT coaching online',
    'GMAT Focus preparation',
    'GMAT 700 score mentor',
    'best GMAT mentor India',
    '1-on-1 GMAT coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/gmat-mentorship`,
  },
  openGraph: {
    title: 'GMAT Mentorship by PK Singh | IIM Alumnus',
    description:
      'Adaptive-exam strategy, Data Insights mastery and target-school score planning — 1-on-1 GMAT mentorship.',
    url: `${SITE_URL}/gmat-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/gmat-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh IIM alumnus mentoring GMAT preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GMAT Mentorship by PK Singh',
    description: 'GMAT Focus mentorship from an IIM alumnus for working professionals.',
    images: ['/og/gmat-mentorship.jpg'],
  },
};

export default function GmatMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.gmat} />
    </PublicPageShell>
  );
}
