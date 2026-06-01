import { Router } from 'express';
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse, togglePublish, exportCourses } from './courses.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', listCourses);

// Admin only routes
router.get('/export', authenticate, adminOnly, exportCourses);
router.post('/', authenticate, adminOnly, createCourse);
router.get('/:id', getCourse);
router.put('/:id', authenticate, adminOnly, updateCourse);
router.delete('/:id', authenticate, adminOnly, deleteCourse);
router.patch('/:id/publish', authenticate, adminOnly, togglePublish);

export default router;
