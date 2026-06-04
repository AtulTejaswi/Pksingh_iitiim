'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard } from 'lucide-react';

/** Shown only for logged-in admins — not on public marketing pages for guests. */
export default function AdminQuickLink() {
  const { user, loading } = useAuth();

  if (loading || !user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Link
      href="/admin/dashboard"
      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 shadow-lg shadow-blue-500/10 transition hover:bg-blue-50 hover:text-blue-800 text-sm font-medium"
      aria-label="Admin dashboard"
    >
      <LayoutDashboard className="w-3.5 h-3.5" />
      Admin
    </Link>
  );
}
