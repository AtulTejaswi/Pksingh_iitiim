import { Router } from 'express';
import { listLessons, getLesson, createLesson, updateLesson, deleteLesson, markProgress } from './lessons.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly, studentOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticate, adminOnly, listLessons);
router.get('/:id', authenticate, studentOrAdmin, getLesson);
router.post('/:id/progress', authenticate, studentOrAdmin, markProgress);

router.post('/', authenticate, adminOnly, createLesson);
router.put('/:id', authenticate, adminOnly, updateLesson);
router.delete('/:id', authenticate, adminOnly, deleteLesson);

export default router;
