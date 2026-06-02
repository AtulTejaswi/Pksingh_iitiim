'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, verified } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (adminOnly) {
      // Wait until /auth/me verification finishes to avoid role-based flicker.
      if (!verified) return;
      if (user.role !== 'ADMIN') router.push('/');
      return;
    }
  }, [user, loading, verified, adminOnly, router]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-indigo-300 font-medium animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-400/40" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Access restricted</h2>
          <p className="text-gray-400 text-sm mb-5">
            {adminOnly ? 'Admin access is required to view this page.' : 'Please sign in to continue.'}
          </p>
          <button
            type="button"
            onClick={() => router.push(adminOnly ? '/' : '/login')}
            className="glow-button px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
          >
            {adminOnly ? 'Go to Dashboard' : 'Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
