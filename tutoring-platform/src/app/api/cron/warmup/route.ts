import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetch';

// Warm-up cron: pings the Render backend /health endpoint so the free-tier
// instance doesn't cold-start during traffic hours. Best-effort mitigation —
// Render free tier still enforces a hard monthly runtime cap.
export async function GET() {
  try {
    const res = await fetchBackend('/health');
    const ok = res.ok;
    const body = ok ? await res.json().catch(() => ({})) : {};
    return NextResponse.json({ success: ok, status: res.status, ...(body as object) });
  } catch (error) {
    console.error('Warm-up ping failed:', error);
    return NextResponse.json({ success: false, reason: 'backend_unavailable' }, { status: 503 });
  }
}