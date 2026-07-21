import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/common/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh.netlify.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PK Singh | Mentor, Author, IITian',
    template: '%s | PK Singh',
  },
  description:
    'PK Singh is an IIT + IIM alumnus, mentor, bestselling author, and educator for JEE, NEET, SAT, CAT and GMAT aspirants.',
  keywords: ['JEE', 'NEET', 'SAT', 'CAT', 'GMAT', 'IIT', 'IIM', 'mentor', 'tutoring', 'physics', 'chemistry', 'math'],
  authors: [{ name: 'PK Singh' }],
  creator: 'PK Singh',
  publisher: 'PK Singh Academy',
  icons: {
    icon: '/images/pk_sir_logo.jpg',
  },
  openGraph: {
    title: 'PK Singh | Mentor, Author, IITian',
    description:
      'Premium mentorship for ambitious learners — Physics, Chemistry, Math and exam strategy from an IIT + IIM alumnus.',
    url: siteUrl,
    siteName: 'PK Singh',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/pk_sir_logo.jpg', width: 1200, height: 630, alt: 'PK Singh Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PK Singh | Mentor, Author, IITian',
    description: 'Premium exam mentorship from an IIT + IIM alumnus and bestselling author.',
    images: ['/images/pk_sir_logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'PK Singh',
            url: siteUrl,
            description: 'PK Singh is an IIT + IIM alumnus, mentor, bestselling author, and educator for JEE, NEET, SAT, CAT and GMAT aspirants.',
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/courses?q={search_term_string}` },
              'query-input': 'required name=search_term_string',
            },
          }),
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'PK Singh',
            description: 'IIT + IIM alumnus, mentor, bestselling author, and educator.',
            url: siteUrl,
          }),
        }} />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
