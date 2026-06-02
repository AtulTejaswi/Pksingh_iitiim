import { Router } from 'express';
import { upload, uploadMedia, addLink, getLessonMedia, deleteMedia } from './media.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Student
router.get('/lesson/:lessonId', authenticate, authenticate, getLessonMedia);

// Admin
router.post('/upload', authenticate, superAdminOnly, upload.single('file'), uploadMedia);
router.post('/link', authenticate, superAdminOnly, addLink);
router.delete('/:id', authenticate, superAdminOnly, deleteMedia);

export default router;
