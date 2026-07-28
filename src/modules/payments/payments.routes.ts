import { Router } from 'express';
import { createOrder, verifyPayment, handleWebhook, getPaymentHistory } from './payments.controller';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware';
import { paymentRateLimit } from '../../app';

const router = Router();

// Payment initiation (rate-limited)
router.post('/create-order', authenticate, paymentRateLimit, createOrder);

// Payment verification after frontend completes checkout
router.post('/verify', authenticate, verifyPayment);

// Webhook (no auth — signature-verified, rate-limited)
router.post('/webhook', optionalAuthenticate, handleWebhook);

// User's payment history
router.get('/history', authenticate, getPaymentHistory);

export default router;
