import type { Metadata } from 'next';
import PublicPageShell from '@/components/common/PublicPageShell';
import ExamMentorshipPage from '@/components/common/ExamMentorshipPage';
import { examPages } from '@/data/exam-pages';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'IIT Mentorship by PK Singh | Crack JEE Advanced | IIT Alumnus Mentor',
  description:
    'JEE Advanced-focused IIT mentorship from PK Singh, an IIT alumnus with AIR 1386 and IIM Calcutta MBA. Multi-concept problem solving and rank-targeted test strategy. Start free.',
  keywords: [
    'IIT mentorship',
    'JEE Advanced mentor',
    'crack JEE Advanced',
    'IIT JEE Advanced coaching',
    'IIT alumnus mentor',
    '1-on-1 IIT coaching',
  ],
  alternates: {
    canonical: `${SITE_URL}/iit-mentorship`,
  },
  openGraph: {
    title: 'IIT Mentorship by PK Singh | IIT Alumnus',
    description:
      'JEE Advanced-focused 1-on-1 mentorship — multi-concept problem solving and rank-targeted strategy.',
    url: `${SITE_URL}/iit-mentorship`,
    siteName: 'PK Singh Mentorship',
    images: [
      {
        url: '/og/iit-mentorship.jpg',
        width: 1200,
        height: 630,
        alt: 'PK Singh IIT alumnus mentoring JEE Advanced preparation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IIT Mentorship by PK Singh',
    description: 'JEE Advanced-focused mentorship from an IIT alumnus with AIR 1386.',
    images: ['/og/iit-mentorship.jpg'],
  },
};

export default function IitMentorshipPage() {
  return (
    <PublicPageShell>
      <ExamMentorshipPage exam={examPages.iit} />
    </PublicPageShell>
  );
}
