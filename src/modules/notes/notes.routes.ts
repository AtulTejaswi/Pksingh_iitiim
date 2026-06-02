import { Router } from 'express';
import { getLessonNotes, createNote, updateNote, deleteNote } from './notes.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/lesson/:lessonId', authenticate, getLessonNotes);

router.post('/', authenticate, superAdminOnly, createNote);
router.put('/:id', authenticate, superAdminOnly, updateNote);
router.delete('/:id', authenticate, superAdminOnly, deleteNote);

export default router;
