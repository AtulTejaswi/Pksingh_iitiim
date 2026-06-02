import { Router } from 'express';
import { enroll, getMyEnrollments, listAllEnrollments, exportEnrollments, removeEnrollment } from './enrollments.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, enroll);
router.get('/my', authenticate, getMyEnrollments);

// Admin
router.get('/', authenticate, superAdminOnly, listAllEnrollments);
router.get('/export', authenticate, superAdminOnly, exportEnrollments);
router.delete('/:id', authenticate, superAdminOnly, removeEnrollment);

export default router;
