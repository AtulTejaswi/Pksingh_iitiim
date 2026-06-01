'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <span className="text-3xl font-bold text-indigo-400">404</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-gray-400 text-sm mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
}
