/**
 * Startup security guards for the production environment.
 *
 * Refusing to boot on a misconfigured environment is the last line of defense
 * when defaults from `.env.example` are accidentally promoted to production.
 * These are kept in a pure module so they can be unit tested without importing
 * the full Express app.
 */

export interface EnvSnapshot {
  NODE_ENV?: string;
  LOCAL_JWT_SECRET?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_EMAIL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_JWT_SECRET?: string;
}

export type GuardFailure = { fatal: true; message: string } | { fatal: false };

const PLACEHOLDER_PASSWORDS = ['changeme_replace_in_production', 'adminpassword123'];
const PLACEHOLDER_EMAIL = 'admin@example.com';
const PLACEHOLDER_JWT_SECRETS = ['pksingh-jwt-secret-change-this-to-a-strong-random-value', 'change-me', 'changeme'];

export const checkEnvGuards = (env: EnvSnapshot): GuardFailure => {
  const isProd = env.NODE_ENV === 'production';
  const hasLocalJwt = Boolean(env.LOCAL_JWT_SECRET);
  const hasSupabaseJwt = Boolean(env.SUPABASE_JWT_SECRET);
  const hasSupabaseUrl = Boolean(env.SUPABASE_URL);
  const hasServiceKey = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
  const partialSupabase = (hasSupabaseUrl || hasServiceKey) && !hasSupabaseJwt;

  if (isProd && !hasLocalJwt && !hasSupabaseJwt) {
    return { fatal: true, message: 'Fatal: No JWT signing secret configured.' };
  }
  if (isProd && PLACEHOLDER_JWT_SECRETS.includes(env.LOCAL_JWT_SECRET || '')) {
    return { fatal: true, message: 'Fatal: LOCAL_JWT_SECRET is still a known placeholder value.' };
  }
  if (isProd && partialSupabase) {
    return { fatal: true, message: 'Fatal: Supabase partially configured (missing SUPABASE_JWT_SECRET).' };
  }
  if (isProd && PLACEHOLDER_PASSWORDS.includes(env.ADMIN_PASSWORD || '')) {
    return { fatal: true, message: 'Fatal: ADMIN_PASSWORD is still a known placeholder value.' };
  }
  if (isProd && env.ADMIN_EMAIL === PLACEHOLDER_EMAIL) {
    return { fatal: true, message: 'Fatal: ADMIN_EMAIL is still the placeholder value.' };
  }

  return { fatal: false };
};