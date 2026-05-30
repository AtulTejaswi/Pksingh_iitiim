import { Router } from 'express';
import { upload, uploadMedia, addLink, getLessonMedia, deleteMedia } from './media.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly, studentOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

// Student
router.get('/lesson/:lessonId', authenticate, studentOrAdmin, getLessonMedia);

// Admin
router.post('/upload', authenticate, adminOnly, upload.single('file'), uploadMedia);
router.post('/link', authenticate, adminOnly, addLink);
router.delete('/:id', authenticate, adminOnly, deleteMedia);

export default router;
