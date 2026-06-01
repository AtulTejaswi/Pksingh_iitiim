import { Router } from 'express';

const router = Router();

// Development-only debug endpoint — returns basic auth configuration.
router.get('/status', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  const status = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || null,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET: !!process.env.SUPABASE_JWT_SECRET,
    LOCAL_JWT_SECRET: !!process.env.LOCAL_JWT_SECRET,
  };

  res.json(status);
});

export default router;
