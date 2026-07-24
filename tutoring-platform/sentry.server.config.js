const Sentry = require('@sentry/nextjs');

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_RATE || process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE || '0.05'),
});

module.exports = Sentry;
