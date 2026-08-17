'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DatabaseBackup, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { safeToastError, getErrorMessage } from '@/lib/safe-toast';

interface BackupInfo {
  filename: string;
  size: number;
  createdAt: string;
}

interface BackupListResponse {
  success: boolean;
  backups: BackupInfo[];
}

interface ExportResponse {
  success: boolean;
  message?: string;
  file?: string;
  cloud?: boolean;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'recently';
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * "Back up now" panel for the admin Settings page. A non-technical owner can
 * snapshot the whole site's data with one click and see the last time a
 * backup was made — no terminal, no jargon.
 */
export default function BackupPanel() {
  const [backingUp, setBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<BackupInfo | null>(null);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const refreshLastBackup = useCallback(async () => {
    try {
      const res = await apiClient.get<BackupListResponse>('/backup/list', { timeout: 25000 });
      const backups = res.data?.backups ?? [];
      setLastBackup(backups[0] ?? null);
      setListError(null);
    } catch (err) {
      setListError(getErrorMessage(err, "Couldn't check the last backup time."));
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiClient
      .get<BackupListResponse>('/backup/list', { timeout: 25000 })
      .then((res) => {
        if (!active) return;
        setLastBackup(res.data?.backups?.[0] ?? null);
        setListError(null);
      })
      .catch((err) => {
        if (active) setListError(getErrorMessage(err, "Couldn't check the last backup time."));
      });
    return () => {
      active = false;
    };
  }, []);

  const runBackup = async () => {
    if (backingUp) return;
    setBackingUp(true);
    setResult(null);
    try {
      const res = await apiClient.post<ExportResponse>('/backup/export');
      const data = res.data;
      const cloudNote = data?.cloud === false ? ' (server copy only — cloud storage not set up yet)' : '';
      const text = data?.message ?? `Backup created${cloudNote}`;
      setResult({ ok: true, text });
      toast.success('Backup complete — your data is safe.');
      await refreshLastBackup();
    } catch (err) {
      const text = getErrorMessage(err, "The backup didn't complete. Try again in a minute.");
      setResult({ ok: false, text });
      safeToastError(text);
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <DatabaseBackup className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Data Backup</h2>
          <p className="text-[10px] text-slate-500">A snapshot of all your courses, lessons, students and site content.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={runBackup}
          disabled={backingUp}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {backingUp ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Backing up…
            </>
          ) : (
            <>
              <DatabaseBackup className="w-4 h-4" /> Back up now
            </>
          )}
        </button>

        <div className="text-sm text-slate-600 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>
            Last backup:{' '}
            {lastBackup ? (
              <span className="font-semibold text-slate-900">
                {formatTime(lastBackup.createdAt)}
                <span className="text-slate-400 font-normal"> · {formatBytes(lastBackup.size)}</span>
              </span>
            ) : listError ? (
              <span className="text-amber-600 font-medium">unavailable</span>
            ) : (
              <span className="text-slate-400">checking…</span>
            )}
          </span>
        </div>
      </div>

      {result && (
        <div
          className={`mt-4 flex items-start gap-2 text-[12px] rounded-lg border p-2.5 ${
            result.ok
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{result.text}</span>
        </div>
      )}

      <p className="mt-4 text-[11px] text-slate-400">
        Automatic backups also run every night on their own. The &quot;Back up now&quot; button just makes an extra
        one whenever you want — useful before big changes like editing or deleting a course.
      </p>
    </div>
  );
}
