'use client';

import React from 'react';
import { Bell, MessageCircle } from 'lucide-react';

export default function WeeklyDigestToggle() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Weekly Progress Summary</h4>
            <p className="text-xs text-slate-500 mt-1">Get a detailed progress report every Sunday via email and WhatsApp.</p>
          </div>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
            enabled ? 'bg-amber-500' : 'bg-slate-300'
          }`}
          aria-label={`Weekly digest ${enabled ? 'enabled' : 'disabled'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp digest: {enabled ? 'Active' : 'Inactive'} · Configure number in settings</span>
        </div>
      </div>
    </div>
  );
}