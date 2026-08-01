'use client';

import React, { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function WeeklyDigestToggle() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const toggle = async () => {
    if (saving) return;
    setMessage(null);

    if (!user?.email) {
      setMessage({ type: 'error', text: 'Sign in to manage your email subscription.' });
      return;
    }

    setSaving(true);
    const next = !enabled;
    try {
      if (next) {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.fullName || user.email,
            email: user.email,
            source: 'dashboard',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage({ type: 'error', text: data.error || 'Could not subscribe right now.' });
          return;
        }
      } else {
        const res = await fetch(`/api/subscribe?email=${encodeURIComponent(user.email)}`, {
          method: 'DELETE',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage({ type: 'error', text: data.error || 'Could not unsubscribe right now.' });
          return;
        }
      }
      setEnabled(next);
      setMessage({
        type: 'ok',
        text: next ? 'Subscribed — weekly study tips will be emailed to you.' : 'Unsubscribed from weekly emails.',
      });
    } catch {
      setMessage({ type: 'error', text: 'Could not reach the server. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Weekly Study Tips</h4>
            <p className="text-xs text-slate-500 mt-1">A short email every week with exam tips and study guidance.</p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 disabled:opacity-50 ${
            enabled ? 'bg-amber-500' : 'bg-slate-300'
          }`}
          aria-label={`Weekly tips ${enabled ? 'enabled' : 'disabled'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        {message ? (
          <p className={`text-xs font-medium ${message.type === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span>Emailed to {user?.email || 'your account email'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
