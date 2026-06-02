import { Router } from 'express';
import { listLessons, getLesson, createLesson, updateLesson, deleteLesson, markProgress } from './lessons.controller';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticate, superAdminOnly, listLessons);
router.get('/:id', optionalAuthenticate, getLesson);
router.post('/:id/progress', authenticate, authenticate, markProgress);

router.post('/', authenticate, superAdminOnly, createLesson);
router.put('/:id', authenticate, superAdminOnly, updateLesson);
router.delete('/:id', authenticate, superAdminOnly, deleteLesson);

export default router;
