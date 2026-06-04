import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PK Singh | Mentor, Author, IITian',
    template: '%s | PK Singh',
  },
  description:
    'PK Singh is an IIT + IIM alumnus, mentor, bestselling author, and educator for JEE, NEET, SAT, CAT and GMAT aspirants.',
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
    card: 'summary',
    title: 'PK Singh | Mentor, Author, IITian',
    description: 'Premium exam mentorship from an IIT + IIM alumnus and bestselling author.',
    images: ['/images/pk_sir_logo.jpg'],
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
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-[#f8fafc]" suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
