import 'dotenv/config';
import app from './app';
import { prisma } from './config/db';
import crypto from 'crypto';

const PORT = process.env.PORT || 4000;

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@pksingh.com';
  const isProd = process.env.NODE_ENV === 'production';
  const password = process.env.ADMIN_PASSWORD || (isProd ? '' : 'adminpassword123');
  if (!password) {
    console.warn('ADMIN_PASSWORD is not set. Skipping default admin seeding in production.');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const hashPassword = (password: string): string => {
    return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
  };

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
    await ensureAdminUser();
  } catch (error) {
    console.error('Warning: Failed to connect to database or seed admin user. Server will run but DB features may fail:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
