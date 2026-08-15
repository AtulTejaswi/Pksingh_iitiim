export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://pksingh-backend.onrender.com/api';

export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://pksingh-iitiim.vercel.app';

/**
 * Google Search Console site verification token.
 *
 * Get it from Search Console → Settings → Ownership verification → HTML tag,
 * then set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel (Production) to the
 * `content="..."` value. When unset, no verification meta tag is rendered.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';
