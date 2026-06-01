import { Router } from 'express';
import { register, login, getMe, promoteToAdmin, demoteFromAdmin, requestPasswordReset, resetPassword, exportUsers } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);
// Temporary one-time endpoint to seed an admin if none exists
router.post('/seed-admin', (req, res) => { return require('./auth.controller').seedAdmin(req, res); });
// Dev-only quick login (local dev only)
router.post('/dev-login', (req, res) => { return require('./auth.controller').devLogin(req, res); });
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected
router.get('/me', authenticate, getMe);

// Admin helpers
router.get('/users', authenticate, adminOnly, (req, res) => { return require('./auth.controller').listUsers(req, res); });
router.get('/users/export', authenticate, adminOnly, exportUsers);

// Admin only — promote or demote user roles
router.patch('/promote/:userId', authenticate, adminOnly, promoteToAdmin);
router.patch('/demote/:userId', authenticate, adminOnly, demoteFromAdmin);

export default router;
