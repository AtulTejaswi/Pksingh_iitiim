import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/subscribe
// Handles email capture form submissions (Free Study Guide + Weekly Tips)
//
// TODO: Connect to a real email service (Resend, SendGrid, Mailchimp, etc.)
// TODO: Store leads in database for CRM/follow-up
// TODO: Trigger welcome email with study guide PDF attachment
// ─────────────────────────────────────────────────────────────────────────────

interface SubscribeRequest {
  name: string;
  email: string;
  whatsapp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SubscribeRequest>;

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const lead = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      whatsapp: body.whatsapp?.trim() || null,
      subscribedAt: new Date().toISOString(),
    };

    // TODO: Replace with real email service integration
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'PK Singh <noreply@pksingh.com>',
    //   to: lead.email,
    //   subject: 'Your Free Study Guide from PK Singh',
    //   html: studyGuideEmailTemplate(lead.name),
    // });

    // TODO: Store in database
    // await prisma.lead.create({ data: lead });

    console.log('[/api/subscribe] New lead captured:', lead);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your free study guide is on its way.',
    });
  } catch (error) {
    console.error('[/api/subscribe] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
