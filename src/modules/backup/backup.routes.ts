import { Router } from 'express';
import {
  exportBackup,
  scheduledBackup,
  importBackup,
  listBackups,
  downloadBackup,
} from './backup.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { superAdminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Scheduled backup — protected by a shared token (BACKUP_CRON_TOKEN) instead
// of an admin login, so GitHub Actions (or any cron) can trigger a backup
// without storing admin credentials. Set BACKUP_CRON_TOKEN on the backend
// service AND as a GitHub Actions secret of the same name.
router.post('/cron', (req, res, next) => {
  const expected = process.env.BACKUP_CRON_TOKEN;
  if (!expected) {
    res.status(503).json({
      error: 'Scheduled backups are not configured: BACKUP_CRON_TOKEN is not set on the server.',
    });
    return;
  }
  const provided = req.headers['x-backup-token'];
  if (provided !== expected) {
    res.status(401).json({ error: 'Invalid backup token.' });
    return;
  }
  next();
}, scheduledBackup);

// Everything below requires an admin (owner) login.
router.use(authenticate);
router.use(superAdminOnly);

router.post('/export', exportBackup);
router.post('/import', importBackup);
router.get('/list', listBackups);
router.get('/download/:filename', downloadBackup);

export default router;
