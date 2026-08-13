'use client';

import React from 'react';
import { SOCIAL_LINKS, GMAIL_CONFIG } from '@/data/site-config';
import { FaYoutube, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function SocialIcons({ className = '' }: { className?: string }) {
  const links = [
    { href: SOCIAL_LINKS.youtube, icon: FaYoutube, label: 'Visit our YouTube channel' },
    { href: SOCIAL_LINKS.instagram, icon: FaInstagram, label: 'Visit our Instagram page' },
    // Gmail compose is the primary href (works in every browser).
    // mailto:pksirpcmclasses@gmail.com is the fallback for clients with a mail app configured.
    { href: GMAIL_CONFIG.composeUrl, icon: FaEnvelope, label: 'Email us for queries' },
  ].filter((link) => link.href && link.href.length > 0);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-slate-700 hover:bg-amber-500 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300"
          aria-label={link.label}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}