import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/common/ClientProviders";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';

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
    default: 'PK Singh | IIT + IIM Mentor, Bestselling Author',
    template: '%s | PK Singh',
  },
  description:
    'PK Singh — IIT + IIM alumnus, bestselling author and 1:1 mentor for JEE, NEET, SAT, CAT and GMAT aspirants. 10,000+ students mentored. Premium exam mentorship.',
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
    title: 'PK Singh | IIT + IIM Mentor, Bestselling Author',
    description:
      'Premium 1:1 mentorship for JEE, NEET, SAT, CAT and GMAT — from an IIT + IIM alumnus who has mentored 10,000+ students.',
    url: siteUrl,
    siteName: 'PK Singh Mentorship',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/pk_sir_logo.jpg', width: 1200, height: 630, alt: 'PK Singh — IIT + IIM Mentor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PK Singh | IIT + IIM Mentor, Bestselling Author',
    description: 'Premium exam mentorship from an IIT + IIM alumnus and bestselling author. JEE, NEET, SAT, CAT, GMAT.',
    images: ['/images/pk_sir_logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
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
      className={`${outfit.variable} ${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '247',
              bestRating: '5',
            },
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
            numberOfItems: 40,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'JEE Advanced Physics Masterclass', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 2, name: 'NEET Chemistry Bootcamp', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 3, name: 'SAT Math Excellence', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 4, name: 'CAT Quantitative Aptitude', url: `${siteUrl}/courses` },
              { '@type': 'ListItem', position: 5, name: 'GMAT Data Sufficiency', url: `${siteUrl}/courses` },
            ],
          }),
        }} />

        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
