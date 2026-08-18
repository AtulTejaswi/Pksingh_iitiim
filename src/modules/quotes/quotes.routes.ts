import { Router } from 'express';
import { getQuotes, cronQuotes } from './quotes.controller';

const router = Router();

router.get('/', getQuotes);

// Cron trigger — protected by the same shared BACKUP_CRON_TOKEN as the daily
// backup and YouTube sync (the Vercel cron proxy sends it as x-backup-token),
// so nobody can spam the daily-quote fetcher or force outbound requests.
router.get('/cron', (req, res, next) => {
  const expected = process.env.BACKUP_CRON_TOKEN;
  if (!expected) {
    res.status(503).json({
      error: 'Quotes cron is not configured: BACKUP_CRON_TOKEN is not set on the server.',
    });
    return;
  }
  const provided = req.headers['x-backup-token'];
  if (provided !== expected) {
    res.status(401).json({ error: 'Invalid cron token.' });
    return;
  }
  next();
}, cronQuotes);

export default router;
