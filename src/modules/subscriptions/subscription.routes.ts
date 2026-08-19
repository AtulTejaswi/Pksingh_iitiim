import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createSubscription,
  verifySubscription,
  cancelSubscription,
  getUserSubscriptions,
  getSubscriptionPlans,
} from './subscription.controller';

const router = Router();

// Public route — anyone can see available plans
router.get('/plans', getSubscriptionPlans);

// Authenticated routes
router.post('/create', authenticate, createSubscription);
router.post('/verify', authenticate, verifySubscription);
router.post('/:subscriptionId/cancel', authenticate, cancelSubscription);
router.get('/my', authenticate, getUserSubscriptions);

export default router;
