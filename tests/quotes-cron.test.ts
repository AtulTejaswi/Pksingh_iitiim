import request from 'supertest';
import app from '../src/app';

const ORIGINAL_TOKEN = process.env.BACKUP_CRON_TOKEN;

const withToken = async (token: string | undefined, fn: () => Promise<void>) => {
  if (token === undefined) delete process.env.BACKUP_CRON_TOKEN;
  else process.env.BACKUP_CRON_TOKEN = token;
  try {
    await fn();
  } finally {
    if (ORIGINAL_TOKEN === undefined) delete process.env.BACKUP_CRON_TOKEN;
    else process.env.BACKUP_CRON_TOKEN = ORIGINAL_TOKEN;
  }
};

describe('Quotes cron endpoint', () => {
  it('returns 503 when BACKUP_CRON_TOKEN is not configured on the server', async () => {
    await withToken(undefined, async () => {
      const res = await request(app).get('/api/quotes/cron').set('x-backup-token', 'anything');
      expect(res.status).toBe(503);
      expect(res.body.error).toContain('BACKUP_CRON_TOKEN');
    });
  });

  it('returns 401 with a wrong token', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).get('/api/quotes/cron').set('x-backup-token', 'wrong-token');
      expect(res.status).toBe(401);
    });
  });

  it('returns 401 with no token at all', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).get('/api/quotes/cron');
      expect(res.status).toBe(401);
    });
  });

  it('accepts the correct token (DB unavailable in test env → 500, never 401/503)', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).get('/api/quotes/cron').set('x-backup-token', 'super-secret-token');
      expect([200, 500]).toContain(res.status);
    });
  });

  it('public quotes list stays open (no token required)', async () => {
    await withToken(undefined, async () => {
      const res = await request(app).get('/api/quotes');
      // DB unavailable in test env → 500 with the friendly shape; never 401/503.
      expect([200, 500]).toContain(res.status);
    });
  });
});
