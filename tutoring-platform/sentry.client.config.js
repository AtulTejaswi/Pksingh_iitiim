const Sentry = require('@sentry/react');

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE || '0.05'),
});

module.exports = Sentry;
