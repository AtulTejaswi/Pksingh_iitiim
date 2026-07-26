import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://pksingh-backend.onrender.com/api';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/quotes`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ success: false, quotes: [] }, { status: 200 });
  }
}
