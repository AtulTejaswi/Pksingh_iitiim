import { Router } from 'express';
import { register, login, getMe, listUsers, promoteToAdmin, demoteFromAdmin, requestPasswordReset, resetPassword, exportUsers } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);
// Dev-only quick login removed
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected
router.get('/me', authenticate, getMe);

// Admin helpers
router.get('/users', authenticate, superAdminOnly, listUsers);
router.get('/users/export', authenticate, superAdminOnly, exportUsers);

// Admin only — promote or demote user roles
router.patch('/promote/:userId', authenticate, superAdminOnly, promoteToAdmin);
router.patch('/demote/:userId', authenticate, superAdminOnly, demoteFromAdmin);

export default router;
