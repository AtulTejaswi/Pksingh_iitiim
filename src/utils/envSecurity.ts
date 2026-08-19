/**
 * Startup security guards for the production environment.
 *
 * Refusing to boot on a misconfigured environment is the last line of defense
 * when defaults from `.env.example` are accidentally promoted to production.
 * These are kept in a pure module so they can be unit tested without importing
 * the full Express app.
 *
 * Failure mode policy (important for the non-technical owner):
 *  - Silent data loss is the worst outcome. A PARTIAL Supabase config
 *    (some but not all keys) hard-fails because it's almost always a paste
 *    mistake. An entirely missing config warns loudly but allows boot with
 *    local-disk storage so the existing site stays online.
 *  - Production requires a PostgreSQL DATABASE_URL — never a SQLite file,
 *    which would silently live on the same wiped disk.
 *  - Every message is written for a human to act on, not a stack trace.
 */

export interface EnvSnapshot {
  NODE_ENV?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_EMAIL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_JWT_SECRET?: string;
  DATABASE_URL?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}

export type GuardFailure = { fatal: true; message: string } | { fatal: false };

const PLACEHOLDER_PASSWORDS = ['changeme_replace_in_production', 'adminpassword123'];
const PLACEHOLDER_EMAIL = 'admin@example.com';

/** True when DATABASE_URL points at SQLite (never acceptable in production). */
export const isSqliteDatabaseUrl = (value: string | undefined): boolean =>
  Boolean(value && value.startsWith('file:'));

export const checkEnvGuards = (env: EnvSnapshot): GuardFailure => {
  const isProd = env.NODE_ENV === 'production';

  // ─── Supabase (recommended in production) ────────────────────────────────
  // Without Supabase, file uploads land on local disk (wiped on redeploys)
  // and auth uses local JWT signing instead of Supabase Auth. A PARTIAL
  // config (some but not all keys) is almost always a paste mistake and
  // hard-fails. An entirely missing config warns loudly but allows boot.
  const hasSupabaseUrl = Boolean(env.SUPABASE_URL);
  const hasServiceKey = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
  const hasSupabaseJwt = Boolean(env.SUPABASE_JWT_SECRET);
  const supabaseCount = [hasSupabaseUrl, hasServiceKey, hasSupabaseJwt].filter(Boolean).length;

  if (isProd && supabaseCount > 0 && supabaseCount < 3) {
    const missing = [];
    if (!hasSupabaseUrl) missing.push('SUPABASE_URL');
    if (!hasServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!hasSupabaseJwt) missing.push('SUPABASE_JWT_SECRET');
    return {
      fatal: true,
      message:
        'Fatal: Supabase is partially configured. Set ALL THREE of SUPABASE_URL, ' +
        'SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_JWT_SECRET together (from Supabase ' +
        '> Project Settings > API), or remove all three. Missing: ' + missing.join(', '),
    };
  }
  // All three missing: warn but allow boot (local disk + local auth fallback).
  // This keeps the existing site running while the owner finishes Supabase setup.
  if (isProd && !hasSupabaseUrl && !hasServiceKey && !hasSupabaseJwt) {
    // Not fatal — server boots with local-disk storage and local auth.
    // Logged as a warning in server.ts.
  }

  // ─── Database ───────────────────────────────────────────────────────────
  if (isProd && !env.DATABASE_URL) {
    return {
      fatal: true,
      message:
        'Fatal: No DATABASE_URL configured. The site cannot store any data without a PostgreSQL ' +
        'database. Create a free PostgreSQL database on your host (Render blueprint provisions ' +
        'pksingh-db automatically) and set DATABASE_URL to its connection string.',
    };
  }
  if (isProd && isSqliteDatabaseUrl(env.DATABASE_URL)) {
    return {
      fatal: true,
      message:
        'Fatal: DATABASE_URL points at a SQLite file. SQLite is wiped on every redeploy on most ' +
        'hosts, so all students, courses and payments would be silently lost. Point DATABASE_URL ' +
        'at a real PostgreSQL database instead.',
    };
  }

  // ─── Admin credentials ──────────────────────────────────────────────────
  if (isProd && PLACEHOLDER_PASSWORDS.includes(env.ADMIN_PASSWORD || '')) {
    return { fatal: true, message: 'Fatal: ADMIN_PASSWORD is still a known placeholder value.' };
  }
  if (isProd && env.ADMIN_EMAIL === PLACEHOLDER_EMAIL) {
    return { fatal: true, message: 'Fatal: ADMIN_EMAIL is still the placeholder value.' };
  }

  // ─── Razorpay (payment gateway) — checked in every environment ───────────
  // Payments are optional: if none of the three keys are set, the payment
  // buttons simply stay hidden and nothing breaks. But a PARTIAL set (or a
  // test key in production) would break checkout confusingly, so we refuse to
  // boot with that. Live keys are only ever allowed in production.
  const razorpaySet = [
    Boolean(env.RAZORPAY_KEY_ID),
    Boolean(env.RAZORPAY_KEY_SECRET),
    Boolean(env.RAZORPAY_WEBHOOK_SECRET),
  ];
  const anyRazorpay = razorpaySet.some(Boolean);
  if (anyRazorpay && !razorpaySet.every(Boolean)) {
    return {
      fatal: true,
      message:
        'Fatal: Razorpay is partially configured. Set ALL THREE of RAZORPAY_KEY_ID, ' +
        'RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET together (from your Razorpay ' +
        'dashboard), or remove all three to keep payments turned off.',
    };
  }
  if ((env.RAZORPAY_KEY_ID || '').startsWith('rzp_test_') && isProd) {
    return {
      fatal: true,
      message:
        'Fatal: RAZORPAY_KEY_ID is a TEST key (rzp_test_*) but NODE_ENV is production. ' +
        'Copy the LIVE key (rzp_live_*) from the Razorpay dashboard.',
    };
  }
  if ((env.RAZORPAY_KEY_ID || '').startsWith('rzp_live_') && !isProd) {
    return {
      fatal: true,
      message:
        'Fatal: RAZORPAY_KEY_ID is a LIVE key (rzp_live_*) but NODE_ENV is not production. ' +
        'Use a test key (rzp_test_*) for development.',
    };
  }

  return { fatal: false };
};
