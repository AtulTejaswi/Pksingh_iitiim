import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/subscribe — email capture (Free Study Guide + Weekly Tips)
//   Proxies to the backend /api/leads so leads are persisted in the database.
//   Responds honestly: an error is returned if the lead could not be stored.
// DELETE /api/subscribe?email=... — unsubscribes an email address.
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_API = process.env.BACKEND_URL || 'https://pksingh-backend.onrender.com/api';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; whatsapp?: string; source?: string };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_API}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, whatsapp: body.whatsapp?.trim() || undefined, source: body.source || 'newsletter' }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.error || 'Could not subscribe right now.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, message: 'You are subscribed.' });
  } catch (error) {
    console.error('[/api/subscribe] Error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_API}/leads/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.error || 'Could not unsubscribe right now.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, message: 'Unsubscribed.' });
  } catch (error) {
    console.error('[/api/subscribe] Error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
