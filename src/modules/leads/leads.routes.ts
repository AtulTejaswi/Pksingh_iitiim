import { Router } from 'express';
import { createLead, unsubscribe, listLeads } from './leads.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public — newsletter/study-guide capture
router.post('/', createLead);
router.delete('/:email', unsubscribe);

// Protected — admin only
router.get('/', authenticate, superAdminOnly, listLeads);

export default router;
