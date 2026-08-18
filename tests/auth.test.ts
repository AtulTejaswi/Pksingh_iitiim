import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app';
import { hashPassword, isLegacyHash, verifyPassword } from '../src/modules/auth/auth.controller';

describe('Auth endpoints', () => {

  it('POST /api/auth/register — should reject weak password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: '123',          // too short
      fullName: 'Test User',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/auth/login — should reject wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.com',
      password: 'wrongpassword123',
    });
    expect([401, 503]).toContain(res.status);
  });

  it('POST /api/auth/login — rejects malformed body (missing password)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'someone@example.com',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/auth/login — rejects malformed body (bad email)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'whatever123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('email');
  });
});

describe('Password hashing (per-user salt)', () => {

  it('produces a salt:hash pair with a per-user random salt', () => {
    const h1 = hashPassword('s3cret-pass');
    const h2 = hashPassword('s3cret-pass');
    expect(h1).toContain(':');
    expect(isLegacyHash(h1)).toBe(false);
    // Same password, different salts — the two hashes must differ.
    expect(h1).not.toBe(h2);
  });

  it('verifies correct passwords and rejects wrong ones', () => {
    const hash = hashPassword('s3cret-pass');
    expect(verifyPassword('s3cret-pass', hash)).toBe(true);
    expect(verifyPassword('wrong-pass', hash)).toBe(false);
  });

  it('still accepts legacy fixed-salt hashes (pre-salt format, no colon)', () => {
    const legacy = crypto.scryptSync('old-password', 'local-salt', 64).toString('hex');
    expect(isLegacyHash(legacy)).toBe(true);
    expect(verifyPassword('old-password', legacy)).toBe(true);
    expect(verifyPassword('not-the-password', legacy)).toBe(false);
  });
});
