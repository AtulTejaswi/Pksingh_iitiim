'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminQuickLink() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const isAdminOrAuth = path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/signup');
    setVisible(!isAdminOrAuth);
  }, []);

  const handleClick = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    } catch (e) {
      // ignore
    }
    router.push('/login?adminQuick=1');
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-slate-950/95 px-4 py-2 text-indigo-300 shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-950/80 hover:text-white"
      aria-label="Admin Portal"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Admin Portal
    </button>
  );
}
