import crypto from 'crypto';
import { Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';

const createOrderSchema = z.object({
  courseId: z.string().uuid(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

const webhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string(),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
      }),
    }),
  }),
  event_id: z.string(),
});

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const course = await prisma.course.findUnique({
    where: { id: result.data.courseId },
    select: { id: true, isFree: true, status: true },
  });

  if (!course || course.status !== 'PUBLISHED') {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  if (course.isFree) {
    res.status(400).json({ error: 'Course is free — no payment required' });
    return;
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.user.id, courseId: course.id } },
  });
  if (existing) {
    res.status(400).json({ error: 'Already enrolled in this course' });
    return;
  }

  // Look up the real price from the database (never trust client-sent price)
  // For now, use a default price — replace with actual Course.price field when added
  const amountPaise = 99900; // ₹999.00 — placeholder until price field exists

  // Create order record with Pending status
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      courseId: course.id,
      amount: amountPaise,
      currency: 'INR',
      status: 'Pending',
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user.id,
      action: 'PAYMENT_ORDER_CREATED',
      details: JSON.stringify({ orderId: order.id, amount: amountPaise, courseId: course.id }),
    },
  });

  // In production, this would call Razorpay Orders API:
  // const razorpayOrder = await razorpay.orders.create({ amount: amountPaise, currency: 'INR', receipt: order.id });
  // order.gatewayOrderId = razorpayOrder.id;
  // await prisma.order.update({ where: { id: order.id }, data: { gatewayOrderId: razorpayOrder.id, gatewayResponse: '{ redacted }' } });

  res.json({
    orderId: order.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID || '',
    // In production, include: razorpayOrder.id as gatewayOrderId
  });
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const result = verifyPaymentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'PAYMENT_VERIFY_FAILED',
        details: JSON.stringify({ razorpay_order_id, razorpay_payment_id }),
      },
    });
    res.status(400).json({ error: 'Payment verification failed — signature mismatch' });
    return;
  }

  // Find the order
  const order = await prisma.order.findFirst({
    where: { gatewayOrderId: razorpay_order_id },
  });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Mark payment as Success
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'Success',
      gatewayPaymentId: razorpay_payment_id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'Success' },
  });

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      userId: order.userId,
      courseId: order.courseId,
      status: 'ACTIVE',
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: order.userId,
      action: 'PAYMENT_SUCCESS',
      details: JSON.stringify({ orderId: order.id, paymentId: payment.id, amount: order.amount }),
    },
  });

  res.json({ message: 'Payment verified and enrollment created' });
};

export const handleWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  const rawBody = (req as any).rawBody || '';
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature) {
    res.status(400).json({ error: 'Missing webhook signature' });
    return;
  }

  // Verify webhook signature using the webhook secret (not the API key secret)
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (webhookSecret) {
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      console.warn('Webhook signature verification failed — possible tampering');
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }
  }

  const parseResult = webhookSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid webhook payload' });
    return;
  }

  const { event, payload, event_id } = parseResult.data;

  try {
    // Idempotency check: skip if this event was already processed
    const alreadyProcessed = await prisma.payment.findFirst({
      where: { gatewayResponse: event_id },
    });
    if (alreadyProcessed) {
      res.json({ status: 'already_processed' });
      return;
    }

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;

      const order = await prisma.order.findFirst({
        where: { gatewayOrderId: paymentEntity.order_id },
      });
      if (!order) {
        console.warn(`Webhook: order ${paymentEntity.order_id} not found`);
        res.status(200).json({ status: 'ignored' });
        return;
      }

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: paymentEntity.amount,
          currency: paymentEntity.currency,
          status: 'Success',
          gatewayPaymentId: paymentEntity.id,
          gatewayResponse: event_id,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'Success' },
      });

      await prisma.enrollment.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          status: 'ACTIVE',
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: order.userId,
          action: 'PAYMENT_SUCCESS',
          details: JSON.stringify({
            orderId: order.id,
            gatewayPaymentId: paymentEntity.id,
            amount: paymentEntity.amount,
            webhookEventId: event_id,
          }),
        },
      });
    }

    if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const order = await prisma.order.findFirst({
        where: { gatewayOrderId: paymentEntity.order_id },
      });
      if (order) {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: paymentEntity.amount,
            currency: paymentEntity.currency,
            status: 'Failed',
            gatewayPaymentId: paymentEntity.id,
            gatewayResponse: event_id,
          },
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'Failed' },
        });
      }
    }

    res.json({ status: 'processed' });
  } catch (dbError: any) {
    console.warn('Webhook handler DB error:', dbError.message);
    res.status(200).json({ status: 'accepted' }); // Acknowledge webhook even if DB fails
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      course: { select: { id: true, title: true } },
      payments: { select: { id: true, amount: true, status: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ orders });
};
