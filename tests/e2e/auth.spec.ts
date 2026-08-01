import { test, expect, request } from '@playwright/test';

test.describe('Auth API E2E', () => {
  const base = process.env.E2E_API_BASE || 'http://127.0.0.1:4000/api';
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('E2E_ADMIN_PASSWORD must be set to run auth e2e tests (no hardcoded credentials allowed).');
  }

  test('login returns accessToken and user', async () => {
    const apiContext = await request.newContext();
    const res = await apiContext.post(`${base}/auth/login`, {
      data: { email: process.env.E2E_ADMIN_EMAIL || 'admin@pksingh.com', password: adminPassword },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.role).toBe('SUPER_ADMIN');
  });

  test('auth/me returns profile for valid token', async () => {
    const apiContext = await request.newContext();
    const login = await apiContext.post(`${base}/auth/login`, { data: { email: process.env.E2E_ADMIN_EMAIL || 'admin@pksingh.com', password: adminPassword } });
    const loginBody = await login.json();
    const token = loginBody.accessToken;
    const me = await apiContext.get(`${base}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    expect(me.ok()).toBeTruthy();
    const profile = await me.json();
    expect(profile.email).toBe(process.env.E2E_ADMIN_EMAIL || 'admin@pksingh.com');
    expect(profile.role).toBe('SUPER_ADMIN');
  });
});
