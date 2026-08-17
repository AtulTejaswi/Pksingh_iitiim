/**
 * Startup security guards for the production environment.
 *
 * Refusing to boot on a misconfigured environment is the last line of defense
 * when defaults from `.env.example` are accidentally promoted to production.
 * These are kept in a pure module so they can be unit tested without importing
 * the full Express app.
 *
 * Failure mode policy (important for the non-technical owner):
 *  - Silent data loss is the worst outcome. TEMPORARY OVERRIDE (2026-08-17):
 *    a missing cloud-storage config no longer hard-fails production startup —
 *    it prints a loud boot warning and the admin Dashboard shows an amber
 *    "File storage: Stored on server" card instead, so the backend can deploy
 *    before the owner finishes Supabase setup. REVERT this override (make the
 *    storage check fatal again) once SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *    + SUPABASE_JWT_SECRET are set on the host — see DEPLOYMENT_GUIDE.md.
 *    A PARTIAL storage config (exactly one of the two keys) still hard-fails,
 *    because that is almost always a copy/paste mistake.
 *  - Production requires a PostgreSQL DATABASE_URL — never a SQLite file,
 *    which would silently live on the same wiped disk.
 *  - Every message is written for a human to act on, not a stack trace.
 */

export interface EnvSnapshot {
  NODE_ENV?: string;
  LOCAL_JWT_SECRET?: string;
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
const PLACEHOLDER_JWT_SECRETS = ['pksingh-jwt-secret-change-this-to-a-strong-random-value', 'change-me', 'changeme'];

/** True when the value is a known placeholder JWT secret (not usable in prod). */
export const isPlaceholderJwtSecret = (value: string | undefined): boolean =>
  PLACEHOLDER_JWT_SECRETS.includes(value || '');

/** True when DATABASE_URL points at SQLite (never acceptable in production). */
export const isSqliteDatabaseUrl = (value: string | undefined): boolean =>
  Boolean(value && value.startsWith('file:'));

export const checkEnvGuards = (env: EnvSnapshot): GuardFailure => {
  const isProd = env.NODE_ENV === 'production';
  const hasLocalJwt = Boolean(env.LOCAL_JWT_SECRET);
  const hasSupabaseJwt = Boolean(env.SUPABASE_JWT_SECRET);
  const hasSupabaseUrl = Boolean(env.SUPABASE_URL);
  const hasServiceKey = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
  const partialSupabase = (hasSupabaseUrl || hasServiceKey) && !hasSupabaseJwt;

  // A strong secret can be derived deterministically from DATABASE_URL when no
  // real LOCAL_JWT_SECRET is configured (see jwtSecret.ts). That keeps the
  // fail-fast promise — the app never boots with a weak placeholder — while
  // allowing deployments that only have DATABASE_URL available to start.
  const canDeriveJwt = Boolean(env.DATABASE_URL) && !isSqliteDatabaseUrl(env.DATABASE_URL);
  const hasUsableLocalJwt = hasLocalJwt && !isPlaceholderJwtSecret(env.LOCAL_JWT_SECRET);
  const hasJwt = hasSupabaseJwt || hasUsableLocalJwt || canDeriveJwt;

  if (isProd && !hasJwt) {
    return {
      fatal: true,
      message: hasLocalJwt
        ? 'Fatal: LOCAL_JWT_SECRET is still a known placeholder value (and no DATABASE_URL is available to derive a strong secret).'
        : 'Fatal: No JWT signing secret configured. Set LOCAL_JWT_SECRET or the full SUPABASE_* set.',
    };
  }
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
  // TEMPORARY OVERRIDE: missing storage no longer fatals in production (see
  // header comment) — the boot warning + amber admin card keep it visible.
  // A PARTIAL config (exactly one of URL/KEY) is almost always a paste mistake
  // and still hard-fails with a message naming the missing variable.
  if (isProd && (hasSupabaseUrl !== hasServiceKey)) {
    return {
      fatal: true,
      message: hasSupabaseUrl
        ? 'Fatal: SUPABASE_SERVICE_ROLE_KEY is missing (SUPABASE_URL is set). Both are required for file storage — copy the service_role key from Supabase > Project Settings > API.'
        : 'Fatal: SUPABASE_URL is missing (SUPABASE_SERVICE_ROLE_KEY is set). Both are required for file storage — copy the Project URL from Supabase > Project Settings > API.',
    };
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
