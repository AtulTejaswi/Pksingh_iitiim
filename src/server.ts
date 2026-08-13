import 'dotenv/config';
import app from './app';
import { prisma } from './config/db';
import crypto from 'crypto';
import { ensureDemoData } from './seed-demo';
import { tryAutoRestore, autoBackup } from './modules/backup/backup.controller';
import { checkEnvGuards } from './utils/envSecurity';

const PORT = process.env.PORT || 4000;

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin user creation. Set both in production.');
    return;
  }

  const hashPassword = (password: string): string => {
    return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashPassword(password) },
    });
    console.log(`Updated admin user password: ${email}`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      supabaseId: crypto.randomUUID(),
      email,
      fullName: 'PK Singh Admin',
      role: 'SUPER_ADMIN',
      passwordHash: hashPassword(password),
    },
  });

  console.log(`Created default admin user: ${user.email}`);
};

async function startServer() {
  // Validate environment on startup. In production, fail fast for
  // partially configured Supabase or placeholder credentials.
  const guard = checkEnvGuards(process.env as NodeJS.ProcessEnv);
  if (guard.fatal) {
    console.error(guard.message);
    console.error('Set real values via deployment environment variables before booting in production.');
    process.exit(1);
  }

  const validateEnv = () => {
    const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
    const hasSupabaseServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasSupabaseJwt = Boolean(process.env.SUPABASE_JWT_SECRET);
    const hasLocalJwt = Boolean(process.env.LOCAL_JWT_SECRET);

    const partialSupabase = (hasSupabaseUrl || hasSupabaseServiceKey) && !hasSupabaseJwt;

    // Warn if Supabase appears partially configured. (Hard failures are handled
    // by checkEnvGuards above; this path only warns for non-production.)
    if (partialSupabase) {
      console.warn('Warning: Supabase appears partially configured. Falling back to local JWT secret.');
    }

    // Warn if Razorpay is not configured (payment integration pending)
    if (!process.env.RAZORPAY_KEY_ID) {
      console.warn('Warning: RAZORPAY_KEY_ID is not set — payment endpoints will be unavailable.');
    }

    // Prevent test keys in production / live keys in development
    const razorpayKey = process.env.RAZORPAY_KEY_ID || '';
    if (razorpayKey.startsWith('rzp_test_') && process.env.NODE_ENV === 'production') {
      console.error('Fatal: RAZORPAY_KEY_ID is a test key (rzp_test_*) but NODE_ENV=production.');
      console.error('Set live key (rzp_live_*) for production.');
      process.exit(1);
    }
    if (razorpayKey.startsWith('rzp_live_') && process.env.NODE_ENV !== 'production') {
      console.error('Fatal: RAZORPAY_KEY_ID is a live key (rzp_live_*) but NODE_ENV is not production.');
      console.error('Set test key (rzp_test_*) for development.');
      process.exit(1);
    }
  };
  validateEnv();
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    // mark app as DB-connected so /health can report
    (app as any).locals.dbConnected = true;
    await ensureAdminUser();

    // Auto-restore from latest backup if DB is empty (protects against Render SQLite wipe)
    const restored = await tryAutoRestore();
    if (restored) {
      console.log('Data restored from backup');
    } else {
      await ensureDemoData();
    }

    // Create a fresh backup on every startup so we always have a fallback
    const bp = await autoBackup();
    if (bp) console.log('Startup backup saved:', bp);
  } catch (error) {
    console.error('Warning: Failed to connect to database or seed admin user. Server will run but DB features may fail:', error);
    (app as any).locals.dbConnected = false;
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();