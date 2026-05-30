import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Auth endpoints', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

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
    expect(res.status).toBe(401);
  });
});
