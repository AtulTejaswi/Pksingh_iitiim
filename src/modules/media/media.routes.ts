import { Router } from 'express';
import { uploadSingle, uploadMedia, addLink, getLessonMedia, updateMedia, deleteMedia, reorderMedia } from './media.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Student / enrolled user
router.get('/lesson/:lessonId', authenticate, getLessonMedia);

// Admin (owner) — content management
router.post('/upload', authenticate, superAdminOnly, uploadSingle, uploadMedia);
router.post('/link', authenticate, superAdminOnly, addLink);
router.post('/reorder', authenticate, superAdminOnly, reorderMedia);
router.patch('/:id', authenticate, superAdminOnly, updateMedia);
router.delete('/:id', authenticate, superAdminOnly, deleteMedia);

export default router;
