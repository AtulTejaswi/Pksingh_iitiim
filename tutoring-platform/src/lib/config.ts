export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://pksingh-backend.onrender.com/api';

export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';
