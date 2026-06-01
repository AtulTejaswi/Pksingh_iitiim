import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://pksingh-backend.onrender.com/api' : 'http://localhost:4000/api');

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
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Let the AuthProvider handle redirecting or state resetting
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup') && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);
