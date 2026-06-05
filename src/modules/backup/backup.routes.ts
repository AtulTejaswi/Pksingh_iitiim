import { Router } from 'express';
import {
  exportBackup,
  importBackup,
  listBackups,
  downloadBackup,
} from './backup.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(superAdminOnly);

router.post('/export', exportBackup);
router.post('/import', importBackup);
router.get('/list', listBackups);
router.get('/download/:filename', downloadBackup);

export default router;
