import 'dotenv/config';
import app from './app';
import { prisma } from './config/db';
import crypto from 'crypto';
import { ensureDemoData } from './seed-demo';
import { tryAutoRestore, autoBackup } from './modules/backup/backup.controller';

const PORT = process.env.PORT || 4000;

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@pksingh.com';
  const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD not set, using default fallback. Set this env var in production.');
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
  // partially configured Supabase (helps avoid silent auth breakage).
  const validateEnv = () => {
    const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
    const hasSupabaseServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasSupabaseJwt = Boolean(process.env.SUPABASE_JWT_SECRET);

    const partialSupabase = (hasSupabaseUrl || hasSupabaseServiceKey) && !hasSupabaseJwt;
    if (process.env.NODE_ENV === 'production' && partialSupabase) {
      console.error('Fatal: Supabase is partially configured (SUPABASE_URL or SERVICE_ROLE_KEY set but SUPABASE_JWT_SECRET is missing).');
      console.error('In production this is unsafe. Please set SUPABASE_JWT_SECRET or unset Supabase envs.');
      process.exit(1);
    }

    if (partialSupabase) {
      console.warn('Warning: Supabase appears partially configured. Falling back to local JWT secret.');
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