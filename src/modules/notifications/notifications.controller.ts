import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';

/**
 * POST /api/notifications/subscribe — Register a push subscription.
 *
 * Stores the subscription for later use with streak reminders and live class alerts.
 * Uses web-push protocol (compatible with OneSignal, Firebase, or any VAPID-compatible service).
 */
export const subscribe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { endpoint, keys } = req.body;

    if (!endpoint || typeof endpoint !== 'string') {
      res.status(400).json({ error: 'Invalid push subscription endpoint.' });
      return;
    }

    // Upsert the subscription (one per user endpoint)
    const existing = await prisma.pushSubscription.findFirst({
      where: { userId: req.user.id, endpoint },
    });

    if (existing) {
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: { keys: JSON.stringify(keys || {}), updatedAt: new Date() },
      });
    } else {
      await prisma.pushSubscription.create({
        data: {
          userId: req.user.id,
          endpoint,
          keys: JSON.stringify(keys || {}),
        },
      });
    }

    res.json({ message: 'Push subscription registered.' });
  } catch (err: any) {
    console.error('[notifications/subscribe]', err);
    res.status(500).json({ error: 'Failed to register push subscription.' });
  }
};

/**
 * DELETE /api/notifications/unsubscribe — Remove a push subscription.
 */
export const unsubscribe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { endpoint } = req.body;

    if (endpoint) {
      await prisma.pushSubscription.deleteMany({
        where: { userId: req.user.id, endpoint },
      });
    } else {
      await prisma.pushSubscription.deleteMany({
        where: { userId: req.user.id },
      });
    }

    res.json({ message: 'Push subscription removed.' });
  } catch (err: any) {
    console.error('[notifications/unsubscribe]', err);
    res.status(500).json({ error: 'Failed to remove push subscription.' });
  }
};

/**
 * GET /api/notifications/status — Check if the user has active subscriptions.
 */
export const getStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const count = await prisma.pushSubscription.count({
      where: { userId: req.user.id },
    });

    res.json({ subscribed: count > 0, count });
  } catch (err: any) {
    console.error('[notifications/getStatus]', err);
    res.status(500).json({ error: 'Failed to check notification status.' });
  }
};

/**
 * POST /api/notifications/test — Send a test notification to the current user.
 * (Admin only — for testing the push notification pipeline)
 */
export const sendTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (req.user.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Admin only.' });
      return;
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: req.user.id },
    });

    if (!subscriptions.length) {
      res.status(404).json({ error: 'No push subscriptions found. Subscribe first.' });
      return;
    }

    // In production, use web-push library to send actual notifications
    // For now, log the test notification
    console.log(`[notifications] Test notification queued for ${subscriptions.length} subscription(s)`);

    res.json({
      message: `Test notification queued for ${subscriptions.length} subscription(s).`,
      note: 'In production, this sends a real push notification via the web-push protocol.',
    });
  } catch (err: any) {
    console.error('[notifications/sendTest]', err);
    res.status(500).json({ error: 'Failed to send test notification.' });
  }
};
