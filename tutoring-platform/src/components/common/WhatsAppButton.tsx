'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WHATSAPP_CONFIG } from '@/data/site-config';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!WHATSAPP_CONFIG.enabled || dismissed) return null;

  return (
    <div
      className={`fixed bottom-24 right-4 z-50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative group">
        <a
          href={WHATSAPP_CONFIG.communityLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 text-white rounded-full px-5 py-3 shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300"
          aria-label="Join WhatsApp community"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">Join WhatsApp Community</span>
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}