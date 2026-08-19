import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { subscribe, unsubscribe, getStatus, sendTest } from './notifications.controller';

const router = Router();

// Register a push subscription (any authenticated user)
router.post('/subscribe', authenticate, subscribe);

// Remove a push subscription
router.delete('/unsubscribe', authenticate, unsubscribe);

// Check subscription status
router.get('/status', authenticate, getStatus);

// Send test notification (admin only)
router.post('/test', authenticate, sendTest);

export default router;
