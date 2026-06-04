import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
