'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, Copy, Check, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ReferralInfo {
  referralCode: string;
  totalReferrals: number;
  rewardDescription: string;
}

export default function ReferralSection() {
  const { user, loading } = useAuth();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    apiClient
      .get<ReferralInfo>('/auth/referral')
      .then((res) => {
        if (!cancelled) setInfo(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Could not load your referral code. Please try again.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const shareLink = typeof window !== 'undefined' && info
    ? `${window.location.origin}/signup?ref=${encodeURIComponent(info.referralCode)}`
    : '';

  const copyReferral = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(info.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy. Please copy manually.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 bg-amber-50/50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Refer & Earn
        </h2>
        <p className="text-lg text-slate-600 mb-6">Refer a friend, both get 1 free 1:1 session</p>
        <p className="text-sm text-slate-500 mb-8">
          Share your unique referral code with friends. When they sign up, you both earn a free session.
        </p>

        {loading ? (
          <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto animate-pulse"></div>
            <div className="h-10 bg-slate-100 rounded-xl mt-4 animate-pulse"></div>
          </div>
        ) : user && info ? (
          <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <label htmlFor="referral-code" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Your Referral Code
            </label>
            <div className="flex gap-2">
              <input
                id="referral-code"
                readOnly
                value={info.referralCode}
                className="flex-1 text-center font-mono font-bold text-lg bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900"
                aria-label="Your referral code"
              />
              <button
                onClick={copyReferral}
                className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
                aria-label="Copy referral code"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {shareLink && (
              <div className="mt-4 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Share link</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareLink}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 truncate"
                    aria-label="Referral share link"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareLink);
                        toast.success('Share link copied');
                      } catch {
                        toast.error('Could not copy link.');
                      }
                    }}
                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-4">
              {info.totalReferrals > 0
                ? `${info.totalReferrals} friend${info.totalReferrals === 1 ? '' : 's'} signed up with your code.`
                : 'Share your code to start earning free sessions.'}
            </p>
          </div>
        ) : (
          <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-600 mb-4">Create a free account to get your personal referral code.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign up free to get your code
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
