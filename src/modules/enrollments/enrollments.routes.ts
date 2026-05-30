import { Router } from 'express';
import { enroll, getMyEnrollments, listAllEnrollments, removeEnrollment } from './enrollments.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly, studentOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, studentOrAdmin, enroll);
router.get('/my', authenticate, studentOrAdmin, getMyEnrollments);

// Admin
router.get('/', authenticate, adminOnly, listAllEnrollments);
router.delete('/:id', authenticate, adminOnly, removeEnrollment);

export default router;
