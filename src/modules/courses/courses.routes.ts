import { Router } from 'express';
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse, togglePublish, exportCourses, getPublicStats, getCourseProgress } from './courses.controller';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware';
import { adminOnly, studentOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/stats', getPublicStats);
router.get('/', optionalAuthenticate, listCourses);

// Admin only routes
router.get('/export', authenticate, adminOnly, exportCourses);
router.post('/', authenticate, adminOnly, createCourse);
router.get('/:id/progress', authenticate, studentOrAdmin, getCourseProgress);
router.get('/:id', optionalAuthenticate, getCourse);
router.put('/:id', authenticate, adminOnly, updateCourse);
router.delete('/:id', authenticate, adminOnly, deleteCourse);
router.patch('/:id/publish', authenticate, adminOnly, togglePublish);

export default router;
