import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`w-full border-t border-slate-800/50 bg-slate-800 py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Image 
            src="/images/pk_sir_logo.jpg" 
            alt="PK Singh Logo" 
            width={100} 
            height={30} 
            className="w-[100px] h-auto rounded-md bg-[#0B1A34] px-2 py-1"
          />
          <div>&copy; {new Date().getFullYear()} PK Singh. All rights reserved. Built for premium results.</div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
