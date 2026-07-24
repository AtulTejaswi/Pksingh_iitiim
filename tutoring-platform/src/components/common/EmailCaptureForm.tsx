'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

export default function EmailCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp: whatsapp || undefined }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback: still show success to avoid blocking the user
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
        <div>
          <p className="font-bold text-emerald-800">Check your inbox!</p>
          <p className="text-sm text-emerald-600">Your free study guide is on its way. We&apos;ll also send you weekly tips.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-slate-700">Get your free study guide + weekly exam tips</p>
      <div>
        <label htmlFor="capture-name" className="sr-only">Your Name</label>
        <input
          id="capture-name"
          type="text"
          required
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
        />
      </div>
      <div>
        <label htmlFor="capture-email" className="sr-only">Email Address</label>
        <input
          id="capture-email"
          type="email"
          required
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
        />
      </div>
      <div>
        <label htmlFor="capture-whatsapp" className="sr-only">WhatsApp Number</label>
        <input
          id="capture-whatsapp"
          type="tel"
          placeholder="WhatsApp Number (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-bold py-3 px-6 hover:bg-amber-600 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" />
        Download Free Study Guide
      </button>
      <p className="text-xs text-slate-400 text-center">No spam. Unsubscribe anytime.</p>
    </form>
  );
}