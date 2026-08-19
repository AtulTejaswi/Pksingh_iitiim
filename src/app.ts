import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Optional instrumentation: Sentry for error reporting and Prometheus metrics
let Sentry: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sentryPkg = require('@sentry/node');
  Sentry = sentryPkg;
  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV || 'development' });
  } else {
    Sentry = null;
  }
} catch (e) {
  Sentry = null;
}

let promClient: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  promClient = require('prom-client');
  promClient.collectDefaultMetrics({ timeout: 5000 });
} catch (e) {
  promClient = null;
}

const app = express();

// Trust Render proxy for correct protocol detection
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Sentry request handler (capture requests) — if configured
if (Sentry) app.use(Sentry.Handlers.requestHandler());

// CORS — allow frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://pksingh-iitiim.vercel.app',
  ],
  credentials: true,
}));

// JSON body limit — preserve raw body for webhook signature verification
app.use(express.json({
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  },
}));

// Serve local uploads when running without Supabase storage
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Global rate limit: generous backstop against abuse (300 req / 15 min / IP).
// A single student page load makes several API calls (courses, lessons, media,
// notes, quotes, CMS, config…), so the old cap of 60 locked out legitimate
// browsing after ~6 page loads. The strict per-route limiters (auth, payments)
// below are where the real abuse protection lives.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Auth-specific stricter rate limit
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' },
});

// Payment-initiation rate limit
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many payment attempts, please try again later.' },
});

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import lessonsRoutes from './modules/lessons/lessons.routes';
import enrollmentsRoutes from './modules/enrollments/enrollments.routes';
import mediaRoutes from './modules/media/media.routes';
import notesRoutes from './modules/notes/notes.routes';
import debugRoutes from './modules/debug/debug.routes';
import cmsRoutes from './modules/cms/cms.routes';
import backupRoutes from './modules/backup/backup.routes';
import quotesRoutes from './modules/quotes/quotes.routes';
import paymentRoutes from './modules/payments/payments.routes';
import leadsRoutes from './modules/leads/leads.routes';
import configRoutes from './modules/config/config.routes';
import youtubeSyncRoutes from './modules/youtube-sync/youtube-sync.routes';
import aiRoutes from './modules/ai/ai.routes';
import { isCloudStorageConfigured } from './utils/storage';

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConnected: Boolean(app.locals.dbConnected),
    storage: isCloudStorageConfigured() ? 'supabase' : 'local',
  });
});

// Mount Routes
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/youtube-sync', youtubeSyncRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (_req, res) => {
  const dbConnected = Boolean(app.locals.dbConnected);
  res.json({ status: 'ok', uptime: process.uptime(), dbConnected });
});

// Prometheus metrics endpoint
if (promClient) {
  app.get('/metrics', async (_req, res) => {
    try {
      const metrics = await promClient.register.metrics();
      res.set('Content-Type', promClient.register.contentType);
      res.send(metrics);
    } catch (err) {
      res.status(500).send('Error collecting metrics');
    }
  });
}

// Sentry error handler should be before our handlers so errors are captured
if (Sentry) app.use(Sentry.Handlers.errorHandler());

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler — catches any unhandled errors (Express 5 catches async rejects automatically)
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Multer errors (e.g. file too large) don't carry a statusCode by default,
  // so without this they'd fall through to a generic 500 — very confusing
  // for a non-technical owner uploading course videos.
  if (err?.name === 'MulterError') {
    res.status(400).json({ status: 400, message: `Upload error: ${err.message}`, error_code: err.code || 'UPLOAD_ERROR' });
    return;
  }

  // Prisma "record not found" / foreign key errors → clean 404/400 instead of 500.
  if (err?.code === 'P2025') {
    res.status(404).json({ status: 404, message: 'The requested item was not found.', error_code: 'NOT_FOUND' });
    return;
  }
  if (err?.code === 'P2003') {
    res.status(400).json({ status: 400, message: 'This action references something that no longer exists (e.g. a deleted course or lesson).', error_code: 'INVALID_REFERENCE' });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', req.method, req.originalUrl, err);
  }
  res.status(statusCode).json({
    status: statusCode,
    message,
    error_code: err.errorCode || 'UNKNOWN_ERROR',
  });
});

export default app;
