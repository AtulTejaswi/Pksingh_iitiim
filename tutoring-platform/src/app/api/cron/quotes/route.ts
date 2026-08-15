import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetch';

export async function GET(request: Request) {
  try {
    // Backend mounts quotes at /api/quotes with a /cron sub-route —
    // fetchBackend already prefixes API_BASE_URL (…/api), so use /quotes/cron.
    const res = await fetchBackend('/quotes/cron', {
      headers: { Authorization: request.headers.get('authorization') || '' },
    });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quotes Cron Proxy Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
