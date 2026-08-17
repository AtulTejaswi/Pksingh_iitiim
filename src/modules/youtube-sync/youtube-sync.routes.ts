import { Router } from 'express';
import { syncYouTubeChannel } from './youtube-sync.service';

const router = Router();

/**
 * Cron trigger for the YouTube channel → course sync. Protected by the same
 * shared BACKUP_CRON_TOKEN as the daily backup (GitHub Actions sends it as
 * x-backup-token), so no admin credentials are stored in CI.
 */
router.post('/sync', async (req, res) => {
  const expected = process.env.BACKUP_CRON_TOKEN;
  if (!expected) {
    res.status(503).json({
      error: 'Scheduled syncs are not configured: BACKUP_CRON_TOKEN is not set on the server.',
    });
    return;
  }
  const provided = req.headers['x-backup-token'];
  if (provided !== expected) {
    res.status(401).json({ error: 'Invalid backup token.' });
    return;
  }
  try {
    const result = await syncYouTubeChannel();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'YouTube sync failed' });
  }
});

export default router;
