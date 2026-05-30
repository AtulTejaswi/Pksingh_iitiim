import { Router } from 'express';
import { getLessonNotes, createNote, updateNote, deleteNote } from './notes.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly, studentOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/lesson/:lessonId', authenticate, studentOrAdmin, getLessonNotes);

router.post('/', authenticate, adminOnly, createNote);
router.put('/:id', authenticate, adminOnly, updateNote);
router.delete('/:id', authenticate, adminOnly, deleteNote);

export default router;
