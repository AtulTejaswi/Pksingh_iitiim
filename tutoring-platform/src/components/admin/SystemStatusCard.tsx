'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Database, HardDrive, CreditCard } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';

interface HealthData {
  status?: string;
  dbConnected?: boolean;
  storage?: string;
}

type State = 'checking' | 'ok' | 'warn' | 'down';

function Pill({ state, children }: { state: State; children: React.ReactNode }) {
  const styles: Record<State, string> = {
    checking: 'bg-slate-100 text-slate-600 border-slate-200',
    ok: 'bg-green-50 text-green-700 border-green-200',
    warn: 'bg-amber-50 text-amber-700 border-amber-200',
    down: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[state]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${state === 'ok' ? 'bg-green-500' : state === 'warn' ? 'bg-amber-500' : state === 'down' ? 'bg-red-500' : 'bg-slate-400'}`} />
      {children}
    </span>
  );
}

/**
 * "Is my site OK?" card for the admin dashboard. Written for a non-technical
 * owner: it turns the raw health/config API responses into plain-English
 * status pills ("Your website is online", "Files are stored safely in the
 * cloud", ...). No jargon, no stack traces.
 */
export default function SystemStatusCard() {
  const config = usePlatformConfig();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthState, setHealthState] = useState<State>('checking');

  useEffect(() => {
    let active = true;
    apiClient
      .get('/health', { timeout: 25000 })
      .then((res) => {
        if (!active) return;
        const data = res.data as HealthData;
        setHealth(data);
        setHealthState(data?.status === 'ok' ? 'ok' : 'down');
      })
      .catch(() => {
        if (active) {
          setHealthState('down');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const dbState: State = healthState === 'down' ? 'down' : health?.dbConnected === false ? 'down' : 'ok';
  const storageState: State = healthState === 'down' ? 'down' : config.storage?.mode === 'supabase' ? 'ok' : 'warn';

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <Activity className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">System Status</h2>
          <p className="text-[10px] text-slate-500">Is my website working right now?</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" /> Website / server
          </span>
          {healthState === 'ok' && <Pill state="ok">Online</Pill>}
          {healthState === 'checking' && <Pill state="checking">Checking…</Pill>}
          {healthState === 'down' && <Pill state="down">Unreachable</Pill>}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" /> Database
          </span>
          {dbState === 'ok' && <Pill state="ok">Connected</Pill>}
          {dbState === 'down' && <Pill state="down">Not connected</Pill>}
          {healthState === 'checking' && <Pill state="checking">Checking…</Pill>}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400" /> File storage
          </span>
          {storageState === 'ok' && <Pill state="ok">Files are safe in the cloud</Pill>}
          {storageState === 'warn' && <Pill state="warn">Stored on server (see note)</Pill>}
          {storageState === 'down' && <Pill state="down">Unreachable</Pill>}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" /> Online payments
          </span>
          {config.payments?.enabled ? <Pill state="ok">Enabled</Pill> : <Pill state="warn">Turned off</Pill>}
        </div>
      </div>

      {healthState === 'down' && (
        <p className="mt-4 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
          The website&apos;s server is not responding. If this lasts more than a few minutes, see the
          &quot;If something looks wrong&quot; section of HANDOFF.md.
        </p>
      )}
      {storageState === 'warn' && healthState === 'ok' && (
        <p className="mt-4 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
          File storage is in development mode — uploaded videos are saved to the server&apos;s temporary disk and
          would be lost on the next update. Set up Supabase Storage (see DEPLOYMENT_GUIDE.md step 2) so files are
          stored permanently in the cloud.
        </p>
      )}
    </div>
  );
}
