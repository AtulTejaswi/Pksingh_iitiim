'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

export default function EmailCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp: whatsapp || undefined, source: 'study-guide' }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-card bg-brand-50 border border-brand-200">
        <CheckCircle2 className="w-8 h-8 text-brand-600 shrink-0" />
        <div>
          <p className="font-bold text-brand-700">You&apos;re on the list!</p>
          <p className="text-sm text-brand-600">We&apos;ll email you the study guide and weekly exam tips.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-ink-secondary">Get your free study guide + weekly exam tips</p>
      <div>
        <label htmlFor="capture-name" className="sr-only">Your Name</label>
        <input
          id="capture-name"
          type="text"
          required
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-ink"
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
          className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-ink"
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
          className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-ink"
        />
      </div>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white font-bold py-3 px-6 hover:bg-brand-500 transition-colors shadow-sm disabled:opacity-60"
      >
        <Download className="w-4 h-4" />
        {loading ? 'Subscribing…' : 'Download Free Study Guide'}
      </button>
      <p className="text-xs text-ink-muted text-center">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
