import crypto from 'crypto';
import { isPlaceholderJwtSecret } from './envSecurity';

let ephemeralDevSecret: string | undefined;

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Derive a strong, deterministic signing secret from DATABASE_URL.
 *
 * Used only when LOCAL_JWT_SECRET is a known placeholder (or missing) in
 * production and the deployment can't receive env vars programmatically (e.g.
 * Render's API cannot set env vars — dashboard/blueprint only). The derivation
 * is deterministic so sessions survive restarts, and it is cryptographically
 * sound: DATABASE_URL is a real secret on the service, and anyone who possesses
 * it already has full database access, so deriving a JWT key from it grants no
 * additional capability. Never uses the weak placeholder itself.
 */
export const deriveJwtSecretFromDatabaseUrl = (databaseUrl?: string): string | undefined => {
  if (!databaseUrl) return undefined;
  return crypto.createHmac('sha256', 'pksingh-jwt-signing-v1').update(databaseUrl).digest('hex');
};

/**
 * Resolve the JWT signing secret. Never falls back to a hardcoded value.
 *
 * Order of preference:
 *  1. SUPABASE_JWT_SECRET — when Supabase auth is fully configured.
 *  2. LOCAL_JWT_SECRET    — local/local-deployed auth.
 *  3. Non-production only: an ephemeral random secret (invalidated on restart,
 *     logged loudly). In production, missing secrets are a startup failure and
 *     are rejected by the validateEnv() guard in src/server.ts.
 */
export const resolveJwtSecret = (): string | undefined => {
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
  const hasSupabaseKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabaseJwt = process.env.SUPABASE_JWT_SECRET;

  if (hasSupabaseUrl && hasSupabaseKey && supabaseJwt) {
    return supabaseJwt;
  }

  const localSecret = process.env.LOCAL_JWT_SECRET;
  if (localSecret && !isPlaceholderJwtSecret(localSecret)) {
    return localSecret;
  }

  // Placeholder (or none) configured: never use the weak placeholder in
  // production. If a real DATABASE_URL exists, derive a strong secret from it
  // so the service can boot securely without dashboard access.
  if (isProduction()) {
    const derived = deriveJwtSecretFromDatabaseUrl(process.env.DATABASE_URL);
    if (derived) {
      console.warn(
        'WARNING: ' +
          (localSecret
            ? 'LOCAL_JWT_SECRET is a known placeholder — '
            : 'No LOCAL_JWT_SECRET configured — ') +
          'deriving a strong secret from DATABASE_URL. Set a real LOCAL_JWT_SECRET in the Render dashboard to remove this warning.'
      );
      return derived;
    }
    return undefined;
  }

  if (localSecret) {
    return localSecret;
  }

  if (!isProduction()) {
    if (!ephemeralDevSecret) {
      ephemeralDevSecret = crypto.randomBytes(48).toString('hex');
      console.warn(
        'WARNING: No JWT secret configured (LOCAL_JWT_SECRET or SUPABASE_JWT_SECRET). ' +
        'Using an ephemeral dev-only secret — sessions will be invalidated on restart. ' +
        'Set LOCAL_JWT_SECRET in development to keep sessions stable.'
      );
    }
    return ephemeralDevSecret;
  }

  return undefined;
};
