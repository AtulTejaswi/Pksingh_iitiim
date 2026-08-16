import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/common/ClientProviders";
import { GOOGLE_SITE_VERIFICATION, SITE_URL } from "@/lib/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PK Singh | JEE, NEET, IIT & CAT Mentorship by an IIT + IIM Alumnus',
    template: '%s | PK Singh Mentorship',
  },
  description:
    '1-on-1 mentorship for JEE, NEET, IIT, CAT, GMAT and SAT aspirants by PK Singh, an IIT + IIM alumnus and bestselling author. Personalized strategy, live doubt support, proven results.',
  keywords: ['JEE mentor', 'NEET coaching', 'SAT preparation', 'CAT coaching', 'GMAT prep', 'IIT', 'IIM', 'PK Singh', 'exam mentorship', 'physics tutor', 'chemistry tutor', 'math tutor', 'online tutoring India'],
  authors: [{ name: 'PK Singh' }],
  creator: 'PK Singh',
  publisher: 'PK Singh Academy',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/pk_sir_logo.jpg', type: 'image/jpeg' },
    ],
    apple: '/images/pk_sir_logo.jpg',
    shortcut: '/images/pk_sir_logo.jpg',
  },
  openGraph: {
    title: 'PK Singh | JEE, NEET, IIT & CAT Mentorship by an IIT + IIM Alumnus',
    description:
      '1-on-1 mentorship for JEE, NEET, IIT, CAT, GMAT and SAT aspirants by PK Singh, an IIT + IIM alumnus and bestselling author.',
    url: siteUrl,
    siteName: 'PK Singh Mentorship',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/pk_sir_logo.jpg', width: 1024, height: 1024, alt: 'PK Singh — IIT + IIM Mentor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PK Singh | JEE, NEET, IIT & CAT Mentorship',
    description: '1-on-1 mentorship for JEE, NEET, IIT, CAT, GMAT and SAT aspirants by an IIT + IIM alumnus.',
    images: ['/images/pk_sir_logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Google Search Console ownership verification (renders only when
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is configured — see lib/config.ts).
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-ink" suppressHydrationWarning>
        {/* Skip to main content link for keyboard/screen reader users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {/* WebSite structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'PK Singh Mentorship',
            url: siteUrl,
            description: 'PK Singh is an IIT + IIM alumnus, 1:1 mentor, bestselling author, and educator for JEE, NEET, SAT, CAT and GMAT aspirants.',
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/courses?q={search_term_string}` },
              'query-input': 'required name=search_term_string',
            },
          }),
        }} />
        {/* Person structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'PK Singh',
            description: 'IIT alumnus, IIM Calcutta MBA, bestselling author, and exam mentor with 23+ years of experience.',
            url: siteUrl,
            image: `${siteUrl}/images/pk-singh-photo.jpg`,
            jobTitle: 'Academic Mentor & Author',
            alumniOf: [
              { '@type': 'EducationalOrganization', name: 'IIT' },
              { '@type': 'EducationalOrganization', name: 'IIM Calcutta' },
            ],
          }),
        }} />
        {/* EducationalOrganization structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'PK Singh Mentorship',
            url: siteUrl,
            logo: `${siteUrl}/images/pk_sir_logo.jpg`,
            description: 'Premium 1:1 and cohort-based mentorship for competitive exam aspirants (JEE, NEET, SAT, CAT, GMAT).',
            address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
          }),
        }} />
        {/* Course catalog structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'PK Singh Courses',
            description: 'Premium exam preparation courses for JEE, NEET, SAT, CAT, and GMAT.',
            url: `${siteUrl}/courses`,
            numberOfItems: 9,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'JEE Advanced Physics Masterclass', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 2, name: 'NEET Physics Complete', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 3, name: 'SAT Physics Prep', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 4, name: 'JEE Organic Chemistry', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 5, name: 'NEET Chemistry Complete', url: `${siteUrl}/courses` },
            ],
          }),
        }} />

        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
