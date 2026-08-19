import crypto from 'crypto';

let ephemeralDevSecret: string | undefined;

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Derive a strong, deterministic signing secret from DATABASE_URL.
 *
 * Used when SUPABASE_JWT_SECRET is not configured in production. The derivation
 * is deterministic so sessions survive restarts, and cryptographically sound:
 * DATABASE_URL is already a real secret on the service, and anyone who possesses
 * it already has full database access.
 */
export const deriveJwtSecretFromDatabaseUrl = (databaseUrl?: string): string | undefined => {
  if (!databaseUrl) return undefined;
  return crypto.createHmac('sha256', 'pksingh-jwt-signing-v1').update(databaseUrl).digest('hex');
};

/**
 * Resolve the JWT signing secret.
 *
 * Order of preference:
 *  1. SUPABASE_JWT_SECRET — when Supabase auth is fully configured.
 *  2. Derived from DATABASE_URL — deterministic, survives restarts.
 *  3. Non-production only: ephemeral random secret.
 */
export const resolveJwtSecret = (): string | undefined => {
  const supabaseJwt = process.env.SUPABASE_JWT_SECRET;
  if (supabaseJwt) {
    return supabaseJwt;
  }

  // Derived from DATABASE_URL — works without Supabase
  const derived = deriveJwtSecretFromDatabaseUrl(process.env.DATABASE_URL);
  if (derived) {
    return derived;
  }

  // Non-production only: ephemeral random secret
  if (!isProduction()) {
    if (!ephemeralDevSecret) {
      ephemeralDevSecret = crypto.randomBytes(48).toString('hex');
      console.warn(
        'WARNING: No SUPABASE_JWT_SECRET or DATABASE_URL configured. Using an ephemeral ' +
        'dev-only secret — sessions will be invalidated on restart.'
      );
    }
    return ephemeralDevSecret;
  }

  return undefined;
};
