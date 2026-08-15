import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'NEET Mentorship by PK Singh | MBBS Admission Guidance | 1-on-1 Coaching',
  description:
    'Personalized NEET UG mentorship from PK Singh, IIT + IIM alumnus. Biology focus, MCQ strategies, timed tests and medical career guidance. Start free.',
  keywords: [
    'NEET mentorship',
    'NEET UG coaching',
    'MBBS admission mentor',
    'NEET biology tutor',
    'best NEET mentor India',
    '1-on-1 NEET coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/neet-mentorship`,
  },
  openGraph: {
    title: 'NEET Mentorship by PK Singh | IIT + IIM Alumnus',
    description:
      'Personalized 1-on-1 NEET mentorship — biology focus, MCQ strategies, and medical career guidance.',
    url: `${SITE_URL}/neet-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/neet-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh IIT + IIM mentoring NEET preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEET Mentorship by PK Singh',
    description: 'Personalized 1-on-1 NEET mentorship from an IIT + IIM alumnus.',
    images: ['/og/neet-mentorship.jpg'],
  },
};

export default function NeetMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.neet} />
    </PublicPageShell>
  );
}
