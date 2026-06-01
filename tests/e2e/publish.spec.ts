import { test, expect, request } from '@playwright/test';

test.describe('Courses Publish Flow E2E', () => {
  const base = process.env.E2E_API_BASE || 'http://localhost:4000/api';

  test('admin can create, publish, and published course appears in list', async () => {
    const apiContext = await request.newContext();

    const login = await apiContext.post(`${base}/auth/login`, {
      data: { email: 'admin@pksingh.com', password: 'adminpassword123' },
    });
    expect(login.ok()).toBeTruthy();
    const loginBody = await login.json();
    const token = loginBody.accessToken;

    const coursePayload = {
      title: `E2E Publish Test ${Date.now()}`,
      description: 'Course created by Playwright publish e2e test',
      subject: 'PHYSICS',
      examTags: ['JEE_MAINS'],
      isFree: true,
    };

    const create = await apiContext.post(`${base}/courses`, {
      data: coursePayload,
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(create.status()).toBe(201);
    const createBody = await create.json();
    const course = createBody.course;
    expect(course).toBeTruthy();
    expect(course.id).toBeTruthy();
    // default should be unpublished unless explicitly set
    expect(course.isPublished).toBe(false);

    const publishRes = await apiContext.patch(`${base}/courses/${course.id}/publish`, {
      data: { isPublished: true },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(publishRes.ok()).toBeTruthy();
    const publishBody = await publishRes.json();
    expect(publishBody.course).toBeTruthy();
    expect(publishBody.course.isPublished).toBe(true);

    const list = await apiContext.get(`${base}/courses`);
    expect(list.ok()).toBeTruthy();
    const listBody = await list.json();
    const found = listBody.courses.find((c: any) => c.id === course.id);
    expect(found).toBeTruthy();
    expect(found.isPublished).toBe(true);
  });
});
