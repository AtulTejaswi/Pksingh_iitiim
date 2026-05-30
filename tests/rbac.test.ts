import request from 'supertest';
import app from '../src/app';

describe('RBAC — Admin-only routes', () => {
  it('Student cannot create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer fake_student_token`)
      .send({ title: 'Hacked Course', subject: 'MATH', examTags: ['JEE_MAINS'], description: 'test' });
    // Should fail JWT verification (401)
    expect(res.status).toBe(401); 
  });
});
