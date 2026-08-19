import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import { razorpayApiBase, razorpayKeyId, razorpayKeySecret, isPaymentsConfigured } from '../../utils/razorpay';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const createSubscriptionSchema = z.object({
  planId: z.string().uuid(),
});

const verifySubscriptionSchema = z.object({
  razorpay_subscription_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function razorpayRequest(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: unknown) {
  const keyId = razorpayKeyId();
  const keySecret = razorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const url = `${razorpayApiBase()}/v1${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.description || `Razorpay API error: ${response.status}`);
  }
  return data;
}

// ─── Create Subscription ─────────────────────────────────────────────────────

export const createSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = createSubscriptionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }

    // Get the subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: result.data.planId },
      include: { course: { select: { id: true, title: true, isFree: true } } },
    });

    if (!plan || plan.status !== 'ACTIVE') {
      res.status(404).json({ error: 'Subscription plan not found' });
      return;
    }

    if (plan.course?.isFree) {
      res.status(400).json({ error: 'Course is free — no subscription required' });
      return;
    }

    // Check if user already has an active subscription for this course
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        courseId: plan.courseId!,
        status: { in: ['ACTIVE', 'PAUSED', 'PAST_DUE'] },
      },
    });

    if (existingSub) {
      res.status(400).json({ error: 'You already have an active subscription for this course' });
      return;
    }

    // Check if payments are configured
    if (!isPaymentsConfigured()) {
      res.status(503).json({
        error: 'Online payments are not set up on this site yet. Please contact the site owner.',
      });
      return;
    }

    // Create or get Razorpay customer
    let customerId: string | undefined;
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true, fullName: true } });
    if (user) {
      // Try to find existing customer by email
      const customers = await razorpayRequest('/customers', 'POST', {
        name: user.fullName,
        email: user.email,
      }) as { id: string };
      customerId = customers.id;
    }

    // Create Razorpay subscription
    const razorpaySub = await razorpayRequest('/subscriptions', 'POST', {
      plan_id: plan.razorpayPlanId,
      customer_id: customerId,
      total_count: 12, // 12 months (or whatever interval)
      notes: { courseId: plan.courseId!, userId: req.user.id },
    }) as { id: string; status: string; current_start: number; current_end: number };

    // Create local subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        courseId: plan.courseId!,
        planId: plan.id,
        razorpaySubscriptionId: razorpaySub.id,
        razorpayCustomerId: customerId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(razorpaySub.current_start * 1000),
        currentPeriodEnd: new Date(razorpaySub.current_end * 1000),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SUBSCRIPTION_CREATED',
        details: JSON.stringify({
          subscriptionId: subscription.id,
          razorpaySubscriptionId: razorpaySub.id,
          planId: plan.id,
          courseId: plan.courseId,
        }),
      },
    });

    res.json({
      subscriptionId: subscription.id,
      razorpaySubscriptionId: razorpaySub.id,
      keyId: razorpayKeyId(),
      status: razorpaySub.status,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Verify Subscription Payment ─────────────────────────────────────────────

export const verifySubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = verifySubscriptionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }

    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = result.data;

    // Verify signature
    const body = razorpay_subscription_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret())
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ error: 'Payment verification failed — signature mismatch' });
      return;
    }

    // Find the subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        razorpaySubscriptionId: razorpay_subscription_id,
        userId: req.user.id,
      },
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    // Create enrollment if not exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: subscription.userId, courseId: subscription.courseId } },
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: subscription.userId,
          courseId: subscription.courseId,
          status: 'ACTIVE',
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SUBSCRIPTION_VERIFIED',
        details: JSON.stringify({
          subscriptionId: subscription.id,
          razorpayPaymentId: razorpay_payment_id,
        }),
      },
    });

    res.json({ message: 'Subscription verified and enrollment created' });
  } catch (err: any) {
    console.error('Subscription verification error:', err);
    res.status(500).json({ error: err?.message || 'Verification failed' });
  }
};

// ─── Cancel Subscription ─────────────────────────────────────────────────────

export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const subscriptionId = req.params.subscriptionId as string;

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: req.user.id,
      },
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (subscription.status !== 'ACTIVE' && subscription.status !== 'PAUSED') {
      res.status(400).json({ error: 'Subscription cannot be cancelled in its current state' });
      return;
    }

    // Cancel at period end (Razorpay best practice — no immediate refund)
    await razorpayRequest(`/subscriptions/${subscription.razorpaySubscriptionId}`, 'POST', {
      cancel_at_cycle_end: 1,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SUBSCRIPTION_CANCEL_REQUESTED',
        details: JSON.stringify({ subscriptionId: subscription.id }),
      },
    });

    res.json({ message: 'Subscription will be cancelled at the end of the current billing period' });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// ─── Get User Subscriptions ──────────────────────────────────────────────────

export const getUserSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
        plan: { select: { name: true, amount: true, interval: true, intervalUnit: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ subscriptions });
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// ─── Get Subscription Plans (Public) ─────────────────────────────────────────

export const getSubscriptionPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { status: 'ACTIVE' },
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
      },
      orderBy: { amount: 'asc' },
    });

    res.json({ plans });
  } catch (err) {
    console.error('Get plans error:', err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};
