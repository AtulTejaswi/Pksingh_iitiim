import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  askDoubt,
  listMyDoubts,
  listPendingDoubts,
  resolveDoubt,
  analyzeMockTest,
  listMyMockTests,
} from './ai.controller';

const router = Router();

// ─── Doubt Resolution ─────────────────────────────────────────────────────
// Students submit doubts; TAs/tutors review flagged ones

// Submit a doubt question (any authenticated user)
router.post('/ask', authenticate, askDoubt);

// List current user's doubts
router.get('/doubts', authenticate, listMyDoubts);

// List doubts awaiting human review (TUTOR/MENTOR/INSTRUCTOR/ADMIN only)
router.get('/doubts/pending', authenticate, listPendingDoubts);

// Manually resolve a doubt (TUTOR/MENTOR/INSTRUCTOR/ADMIN only)
router.patch('/doubts/:id/resolve', authenticate, resolveDoubt);

// ─── Mock Test Analysis ───────────────────────────────────────────────────

// Submit a mock test for AI analysis
router.post('/mock-test', authenticate, analyzeMockTest);

// List current user's mock tests
router.get('/mock-tests', authenticate, listMyMockTests);

export default router;
