import request from 'supertest';
import app from '../src/app';

describe('RBAC — Admin-only routes', () => {
  it('unauthenticated user cannot create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({ title: 'Hacked Course', subject: 'MATH', description: 'test' });
    expect(res.status).toBe(401);
  });

  it('unauthenticated user cannot access backups', async () => {
    const res = await request(app).post('/api/backup/export');
    expect(res.status).toBe(401);
  });

  it('unauthenticated user cannot promote users', async () => {
    const res = await request(app).patch('/api/auth/promote/some-id');
    expect(res.status).toBe(401);
  });

  it('unauthenticated user cannot create media uploads', async () => {
    const res = await request(app).post('/api/media/upload');
    expect(res.status).toBe(401);
  });

  it('public courses list does not require auth', async () => {
    const res = await request(app).get('/api/courses');
    expect([200, 500]).toContain(res.status);
  });

  it('public stats endpoint does not require auth', async () => {
    const res = await request(app).get('/api/courses/stats');
    expect([200, 500]).toContain(res.status);
  });

  it('unauthenticated user cannot access payment create-order', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .send({ courseId: '00000000-0000-0000-0000-000000000000' });
    expect(res.status).toBe(401);
  });
});
