import { Router } from 'express';
import { register, login, getMe, promoteToAdmin } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/me', authenticate, getMe);

// Admin only — promote a student to admin
router.patch('/promote/:userId', authenticate, adminOnly, promoteToAdmin);

export default router;
