import { API_BASE_URL } from '@/lib/config';

// Render free tier cold-starts are slow. Fail fast after 8s and retry once so
// route handlers fall through to static fallbacks instead of hanging the page.
const REQUEST_TIMEOUT_MS = 8000;
const MAX_RETRIES = 1;

export async function fetchBackend(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<Response> {
  let lastError: unknown;
  const isIdempotent = !init?.method || init.method.toUpperCase() === 'GET';

  const attempts = isIdempotent ? MAX_RETRIES + 1 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const { next, ...rest } = init ?? {};
      const res = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        ...(next ? { next } : {}),
        signal: controller.signal,
      });
      if (res.status >= 500 && attempt < attempts - 1) {
        lastError = new Error(`Backend returned ${res.status}`);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt >= attempts - 1) throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}
