'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'sonner';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // initialize Sentry on client if configured
    try {
      // dynamic import to avoid SSR issues
      import('@/lib/sentry.client').then((m) => m.initSentryClient?.());
    } catch (e) {
      // ignore
    }
  }, []);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
