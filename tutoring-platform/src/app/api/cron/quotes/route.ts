import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetch';

export async function GET() {
  try {
    // Backend mounts quotes at /api/quotes with a /cron sub-route —
    // fetchBackend already prefixes API_BASE_URL (…/api), so use /quotes/cron.
    // The cron endpoint is protected by the shared BACKUP_CRON_TOKEN, which
    // must be set on Vercel too (same value as Render + GitHub secrets) so
    // this proxy can authenticate as the scheduled job.
    const res = await fetchBackend('/quotes/cron', {
      headers: { 'x-backup-token': process.env.BACKUP_CRON_TOKEN || '' },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json(
        { success: false, error: body?.error || `Backend returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quotes Cron Proxy Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
