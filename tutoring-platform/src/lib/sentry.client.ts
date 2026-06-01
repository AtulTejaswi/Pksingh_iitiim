import * as Sentry from '@sentry/nextjs';

export function initSentryClient() {
  try {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    Sentry.init({
      dsn,
      tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE || '0.05'),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (e) {
    // swallow errors to avoid breaking the app
    // eslint-disable-next-line no-console
    console.warn('Sentry client init failed', e);
  }
}

export default initSentryClient;
