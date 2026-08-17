'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Upload limits & platform mode, fetched once from the backend's /api/config
 * endpoint. The backend is the single source of truth (MAX_FILE_SIZE_MB and
 * ALLOWED_MIME_TYPES env vars) — the admin UI must not hardcode its own limits
 * that drift from the server (this previously showed "max 50MB" while the
 * server actually allowed 500MB, confusing the owner).
 */
export interface PlatformConfig {
  maxFileSizeMb: number;
  allowedMimeTypes: string[];
  storage: { mode: 'supabase' | 'local'; bucket: string };
  payments: { enabled: boolean };
}

export const FALLBACK_CONFIG: PlatformConfig = {
  maxFileSizeMb: 500,
  allowedMimeTypes: [
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  storage: { mode: 'local', bucket: 'media' },
  payments: { enabled: false },
};

let cached: PlatformConfig | null = null;
let inflight: Promise<PlatformConfig> | null = null;

export function fetchPlatformConfig(): Promise<PlatformConfig> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = apiClient
      .get('/config')
      .then((res) => {
        const data = res.data as Partial<PlatformConfig>;
        cached = {
          maxFileSizeMb: typeof data.maxFileSizeMb === 'number' ? data.maxFileSizeMb : FALLBACK_CONFIG.maxFileSizeMb,
          allowedMimeTypes: Array.isArray(data.allowedMimeTypes) && data.allowedMimeTypes.length > 0
            ? data.allowedMimeTypes
            : FALLBACK_CONFIG.allowedMimeTypes,
          storage: { ...FALLBACK_CONFIG.storage, ...(data.storage || {}) },
          payments: { ...FALLBACK_CONFIG.payments, ...(data.payments || {}) },
        };
        return cached;
      })
      .catch(() => FALLBACK_CONFIG)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function usePlatformConfig(): PlatformConfig {
  const [config, setConfig] = useState<PlatformConfig>(FALLBACK_CONFIG);
  useEffect(() => {
    let active = true;
    fetchPlatformConfig().then((c) => {
      if (active) setConfig(c);
    });
    return () => {
      active = false;
    };
  }, []);
  return config;
}
