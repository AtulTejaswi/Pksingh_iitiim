import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetch';

export async function GET(request: Request) {
  try {
    const res = await fetchBackend('/cron/quotes', {
      headers: { Authorization: request.headers.get('authorization') || '' },
    });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Quotes Cron Proxy Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
