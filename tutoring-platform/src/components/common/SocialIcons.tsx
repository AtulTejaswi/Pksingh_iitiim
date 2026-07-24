'use client';

import React from 'react';
import { SOCIAL_LINKS } from '@/data/site-config';
import { Globe, Video, MessageCircle, User } from 'lucide-react';

export default function SocialIcons({ className = '' }: { className?: string }) {
  const links = [
    { href: SOCIAL_LINKS.instagram, icon: Globe, label: 'Instagram' },
    { href: SOCIAL_LINKS.youtube, icon: Video, label: 'YouTube' },
    { href: SOCIAL_LINKS.linkedin, icon: User, label: 'LinkedIn' },
    { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: 'WhatsApp' },
  ];

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