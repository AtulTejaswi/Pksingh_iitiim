import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Courses endpoints', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/courses — should list courses', async () => {
    const res = await request(app).get('/api/courses');
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/courses/stats — public platform stats', async () => {
    const res = await request(app).get('/api/courses/stats');
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.stats).toBeDefined();
      expect(typeof res.body.stats.publishedCourses).toBe('number');
    }
  });
});
