import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetch';

export async function GET() {
  try {
    const res = await fetchBackend('/quotes', { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ success: false, quotes: [] }, { status: 200 });
  }
}
