import { Router } from 'express';
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse, togglePublish, exportCourses, getPublicStats, getCourseProgress } from './courses.controller';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/stats', getPublicStats);
router.get('/', optionalAuthenticate, listCourses);

// Admin only routes
router.get('/export', authenticate, superAdminOnly, exportCourses);
router.post('/', authenticate, superAdminOnly, createCourse);
router.get('/:id/progress', authenticate, getCourseProgress);
router.get('/:id', optionalAuthenticate, getCourse);
router.put('/:id', authenticate, superAdminOnly, updateCourse);
router.delete('/:id', authenticate, superAdminOnly, deleteCourse);
router.patch('/:id/publish', authenticate, superAdminOnly, togglePublish);

export default router;
