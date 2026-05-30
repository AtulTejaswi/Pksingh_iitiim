import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// JSON body limit
app.use(express.json({ limit: '10mb' }));

// Serve local uploads when running without Supabase storage
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Global rate limit: 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Auth-specific stricter rate limit
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' },
});

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import lessonsRoutes from './modules/lessons/lessons.routes';
import enrollmentsRoutes from './modules/enrollments/enrollments.routes';
import mediaRoutes from './modules/media/media.routes';
import notesRoutes from './modules/notes/notes.routes';

// Mount Routes
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/notes', notesRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
