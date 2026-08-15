import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'JEE Mentorship by PK Singh | IIT + IIM Alumnus | 1-on-1 Coaching',
  description:
    'Personalized JEE Main & Advanced mentorship from PK Singh, IIT + IIM alumnus. Live classes, doubt support, mock tests and proven strategies to crack JEE. Start free.',
  keywords: [
    'JEE mentorship',
    'JEE Main coaching',
    'JEE Advanced mentor',
    'IIT JEE online mentor',
    'best JEE mentor India',
    '1-on-1 JEE coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/jee-mentorship`,
  },
  openGraph: {
    title: 'JEE Mentorship by PK Singh | IIT + IIM Alumnus',
    description:
      'Personalized 1-on-1 JEE mentorship — live classes, doubt support, and proven exam strategy.',
    url: `${SITE_URL}/jee-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/jee-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh IIT + IIM mentoring JEE preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Mentorship by PK Singh',
    description: 'Personalized 1-on-1 JEE mentorship from an IIT + IIM alumnus.',
    images: ['/og/jee-mentorship.jpg'],
  },
};

export default function JeeMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.jee} />
    </PublicPageShell>
  );
}
