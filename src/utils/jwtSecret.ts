import crypto from 'crypto';

let ephemeralDevSecret: string | undefined;

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

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
