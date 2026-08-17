import Link from 'next/link';
import Image from 'next/image';
import SocialIcons from './SocialIcons';
import { Mail } from 'lucide-react';
import { CONTACT_CONFIG } from '@/data/site-config';

const footerLinks = {
  learn: [
    { href: '/courses', label: 'All Courses' },
    { href: '/free-videos', label: 'Free Videos' },
    { href: '/courses?subject=PHYSICS', label: 'Physics' },
    { href: '/courses?subject=CHEMISTRY', label: 'Chemistry' },
    { href: '/courses?subject=MATH', label: 'Mathematics' },
    { href: '/mentor-journey', label: "Mentor's Journey" },
    { href: '/jee-mentorship', label: 'JEE Mentorship' },
    { href: '/neet-mentorship', label: 'NEET Mentorship' },
    { href: '/iit-mentorship', label: 'IIT Mentorship' },
    { href: '/cat-mentorship', label: 'CAT Mentorship' },
    { href: '/gmat-mentorship', label: 'GMAT Mentorship' },
    { href: '/sat-mentorship', label: 'SAT Mentorship' },
  ],
  platform: [
    { href: '/#how', label: 'How It Works' },
    { href: '/about', label: 'About PK Singh' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/signup', label: 'Start Free' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/support', label: 'Support' },
  ],
};

export default function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`w-full border-t border-border-subtle bg-bg-base text-ink-muted ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/images/pk_sir_logo.jpg"
              alt="PK Singh Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover mb-4"
            />
            <p className="text-sm text-ink-muted leading-relaxed mb-5 max-w-xs">
              Premium exam mentorship from an IIT + IIM alumnus and bestselling author. JEE, NEET, SAT, CAT, GMAT.
            </p>
            <SocialIcons />
          </div>

          {/* Learn column */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-secondary mb-4">Learn</p>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-muted hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform column */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-secondary mb-4">Platform</p>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-muted hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-secondary mb-4">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="flex items-center gap-2 text-sm text-ink-muted hover:text-brand-600 transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {CONTACT_CONFIG.email}
                </a>
              </li>
              <li className="text-sm text-ink-secondary">
                <span className="font-medium text-ink-muted">Live classes:</span><br />
                {CONTACT_CONFIG.classTimings}
              </li>
              <li className="text-sm text-ink-secondary">
                <span className="font-medium text-ink-muted">Timezone:</span><br />
                {CONTACT_CONFIG.timezone}
              </li>
            </ul>
            <ul className="space-y-2 mt-5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-ink-muted hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} PK Singh Mentorship. All rights reserved.</p>
          <p className="text-ink-secondary">Built for premium results. Not affiliated with IIT or IIM institutions.</p>
        </div>
      </div>
    </footer>
  );
}
