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

describe('Backup cron endpoint', () => {
  it('returns 503 when BACKUP_CRON_TOKEN is not configured on the server', async () => {
    await withToken(undefined, async () => {
      const res = await request(app).post('/api/backup/cron').set('x-backup-token', 'anything');
      expect(res.status).toBe(503);
      expect(res.body.error).toContain('BACKUP_CRON_TOKEN');
    });
  });

  it('returns 401 with a wrong token', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).post('/api/backup/cron').set('x-backup-token', 'wrong-token');
      expect(res.status).toBe(401);
    });
  });

  it('returns 401 with no token at all', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).post('/api/backup/cron');
      expect(res.status).toBe(401);
    });
  });

  it('accepts the correct token (DB unavailable in test env → 200 or 500, never 401/503)', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app).post('/api/backup/cron').set('x-backup-token', 'super-secret-token');
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.file).toBeDefined();
      }
    });
  });

  it('admin export still requires a login (cron token does not unlock admin routes)', async () => {
    await withToken('super-secret-token', async () => {
      const res = await request(app)
        .post('/api/backup/export')
        .set('x-backup-token', 'super-secret-token');
      expect(res.status).toBe(401);
    });
  });
});

describe('Public config endpoint', () => {
  it('returns upload limits and mode flags without auth', async () => {
    const res = await request(app).get('/api/config');
    expect(res.status).toBe(200);
    expect(typeof res.body.maxFileSizeMb).toBe('number');
    expect(Array.isArray(res.body.allowedMimeTypes)).toBe(true);
    expect(['supabase', 'local']).toContain(res.body.storage?.mode);
    expect(res.body.storage?.bucket).toBe('media');
    expect(typeof res.body.payments?.enabled).toBe('boolean');
  });
});
