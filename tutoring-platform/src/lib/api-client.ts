import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

// Render free tier cold-starts are slow. Fail fast after 8s and retry once so
// the UI falls through to static fallback instead of hanging for 30-60s.
const REQUEST_TIMEOUT_MS = 8000;
const MAX_RETRIES = 1;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Retry interceptor: single retry for idempotent (GET) requests that fail fast
// (network error or 5xx) — helps surface static fallback on cold starts.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as (Record<string, unknown> & { _retried?: boolean }) | undefined;
    const method = typeof config?.method === 'string' ? config.method.toLowerCase() : '';
    const status = error?.response?.status as number | undefined;
    const isIdempotent = method === 'get';
    const shouldRetry =
      !!config &&
      !config._retried &&
      isIdempotent &&
      (!status || status >= 500);

    if (shouldRetry) {
      config._retried = true;
      try {
        return await apiClient(config as never);
      } catch (retryError) {
        error = retryError;
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error && typeof error.response.data.error === 'object') {
      const errObj = error.response.data.error;
      if (errObj.formErrors || errObj.fieldErrors) {
        let msg = '';
        if (errObj.formErrors && errObj.formErrors.length > 0) {
          msg += errObj.formErrors.join(', ') + ' ';
        }
        if (errObj.fieldErrors) {
          const fieldMsgs = Object.entries(errObj.fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`);
          msg += fieldMsgs.join(' | ');
        }
        error.response.data.error = msg.trim() || 'Validation failed';
      } else {
        error.response.data.error = JSON.stringify(errObj);
      }
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const hadToken = Boolean(localStorage.getItem('access_token'));
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register' && path !== '/') {
          window.location.href = `/login?expired=true&redirect=${encodeURIComponent(path)}`;
        } else if (path === '/' && hadToken) {
          window.location.href = `/login?expired=true`;
        }
      }
    }
    return Promise.reject(error);
  }
);
