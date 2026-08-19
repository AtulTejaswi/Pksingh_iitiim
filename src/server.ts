import 'dotenv/config';
import app from './app';
import { prisma } from './config/db';
import { supabase } from './config/supabase';
import crypto from 'crypto';
import { ensureDemoData } from './seed-demo';
import { tryAutoRestore, autoBackup } from './modules/backup/backup.controller';
import { checkEnvGuards } from './utils/envSecurity';

const PORT = process.env.PORT || 4000;

/** Salted scrypt hash for local-only dev mode (no Supabase configured). */
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin user creation. Set both in production.');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  // Supabase Auth is the primary path in production.
  if (supabase) {
    if (!existing) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (authError && !authError.message?.includes('already registered')) {
        console.error('Failed to create admin in Supabase Auth:', authError.message);
        return;
      }
      const supabaseId = authData?.user?.id;
      if (supabaseId) {
        await prisma.user.create({
          data: {
            supabaseId,
            email,
            fullName: 'PK Singh Admin',
            role: 'SUPER_ADMIN',
          },
        });
        console.log(`Created admin user via Supabase Auth: ${email}`);
      }
    } else {
      console.log(`Admin user already exists: ${email}`);
    }
    return;
  }

  // Local-only dev fallback (no Supabase configured)
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
  // Validate environment on startup. In production, fail fast for anything
  // that would silently lose data or break the site (see envSecurity.ts).
  const guard = checkEnvGuards(process.env as NodeJS.ProcessEnv);
  if (guard.fatal) {
    console.error(guard.message);
    console.error('Set real values via deployment environment variables before booting in production.');
    process.exit(1);
  }

  if (!process.env.RAZORPAY_KEY_ID) {
    console.warn('Warning: RAZORPAY_KEY_ID is not set — payment endpoints will be unavailable (payments are off).');
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Warning: Cloud storage is not configured — running with local-disk fallback (development only).');
  }

  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    // mark app as DB-connected so /health can report
    (app as any).locals.dbConnected = true;
    await ensureAdminUser();

    // Auto-restore from latest backup if DB is empty (protects against a wiped database)
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
    if (process.env.NODE_ENV === 'production') {
      // Running a broken site in production is worse than not running at all —
      // it looks alive while quietly failing for every student.
      console.error('Fatal: Could not connect to the database (DATABASE_URL). The site will NOT start.');
      console.error('Fix DATABASE_URL to point at a working PostgreSQL database, then redeploy.');
      console.error('Detail:', error);
      process.exit(1);
    }
    console.error('Warning: Failed to connect to database or seed admin user. Server will run but DB features may fail:', error);
    (app as any).locals.dbConnected = false;
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();