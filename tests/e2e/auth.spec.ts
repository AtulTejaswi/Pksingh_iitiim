import { test, expect, request } from '@playwright/test';

test.describe('Auth API E2E', () => {
  const base = process.env.E2E_API_BASE || 'http://localhost:4000/api';

  test('login returns accessToken and user', async () => {
    const apiContext = await request.newContext();
    const res = await apiContext.post(`${base}/auth/login`, {
      data: { email: 'admin@pksingh.com', password: process.env.E2E_ADMIN_PASSWORD || 'adminpassword123' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.role).toBe('SUPER_ADMIN');
  });

  test('auth/me returns profile for valid token', async () => {
    const apiContext = await request.newContext();
    const login = await apiContext.post(`${base}/auth/login`, { data: { email: 'admin@pksingh.com', password: process.env.E2E_ADMIN_PASSWORD || 'adminpassword123' } });
    const loginBody = await login.json();
    const token = loginBody.accessToken;
    const me = await apiContext.get(`${base}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    expect(me.ok()).toBeTruthy();
    const profile = await me.json();
    expect(profile.email).toBe('admin@pksingh.com');
    expect(profile.role).toBe('SUPER_ADMIN');
  });
});
