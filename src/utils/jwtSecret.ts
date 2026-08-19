import crypto from 'crypto';

let ephemeralDevSecret: string | undefined;

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Resolve the JWT signing secret.
 *
 * Production: SUPABASE_JWT_SECRET only. If it's missing the server should
 * already have been killed by the validateEnv() guard in src/server.ts.
 *
 * Development: ephemeral random secret (invalidated on restart) so local dev
 * works without Supabase configured. Set SUPABASE_JWT_SECRET in .env for
 * stable sessions across restarts.
 */
export const resolveJwtSecret = (): string | undefined => {
  const supabaseJwt = process.env.SUPABASE_JWT_SECRET;

  if (supabaseJwt) {
    return supabaseJwt;
  }

  // Non-production only: ephemeral random secret
  if (!isProduction()) {
    if (!ephemeralDevSecret) {
      ephemeralDevSecret = crypto.randomBytes(48).toString('hex');
      console.warn(
        'WARNING: No SUPABASE_JWT_SECRET configured. Using an ephemeral dev-only secret — ' +
        'sessions will be invalidated on restart. Set SUPABASE_JWT_SECRET for stable sessions.'
      );
    }
    return ephemeralDevSecret;
  }

  // Production: should never reach here (envSecurity guard catches this first)
  return undefined;
};
