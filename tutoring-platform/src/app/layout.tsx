import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/common/ClientProviders";
import AdminQuickLink from '@/components/common/AdminQuickLink';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PK Singh | Mentor, Author, IITian",
  description: "PK Singh is an IIT + IIM alumnus, mentor, bestselling author, and educator for IIT, SAT, CAT and GMAT aspirants.",
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
        <ClientProviders>
          {children}
          <div className="pointer-events-none fixed bottom-4 right-4 z-50 hidden md:block">
            <AdminQuickLink />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
