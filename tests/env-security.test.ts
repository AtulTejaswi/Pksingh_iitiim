import { checkEnvGuards, EnvSnapshot, isSqliteDatabaseUrl } from '../src/utils/envSecurity';

describe('envSecurity startup guards', () => {
  // A fully-valid production baseline: PostgreSQL DB, strong JWT, cloud storage
  // (Supabase trio), real admin credentials. Individual tests override pieces.
  const prodEnv = (overrides: Partial<EnvSnapshot> = {}): EnvSnapshot => ({
    NODE_ENV: 'production',
    LOCAL_JWT_SECRET: 'a-really-strong-random-secret-value',
    ADMIN_PASSWORD: 'a-real-strong-password',
    ADMIN_EMAIL: 'owner@real-co.com',
    DATABASE_URL: 'postgres://user:secret@host:5432/pksingh',
    SUPABASE_URL: 'https://xyzcompany.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_service_role_key_value',
    SUPABASE_JWT_SECRET: 'a-real-supabase-jwt-secret',
    ...overrides,
  });

  it('passes when a real secret, password, email, DB, and cloud storage are set', () => {
    expect(checkEnvGuards(prodEnv()).fatal).toBe(false);
  });

  // ─── Database ─────────────────────────────────────────────────────────────
  it('fails boot in production when DATABASE_URL is missing', () => {
    const guard = checkEnvGuards(prodEnv({ DATABASE_URL: undefined }));
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('DATABASE_URL');
  });

  it('fails boot in production when DATABASE_URL is a SQLite file URL', () => {
    const guard = checkEnvGuards(prodEnv({ DATABASE_URL: 'file:./dev.db' }));
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('SQLite');
  });

  it('isSqliteDatabaseUrl detects file: URLs', () => {
    expect(isSqliteDatabaseUrl('file:./dev.db')).toBe(true);
    expect(isSqliteDatabaseUrl('postgres://u:p@h/db')).toBe(false);
    expect(isSqliteDatabaseUrl(undefined)).toBe(false);
  });

  // ─── Cloud storage (course material persistence) ─────────────────────────
  // TEMPORARY OVERRIDE: entirely-missing storage is a loud warning, not a
  // hard fail, so the backend can deploy before the owner finishes Supabase
  // setup (see envSecurity.ts header). Revert to fatal once configured.
  it('does not fail boot when cloud storage is entirely unset (loud warning instead)', () => {
    const guard = checkEnvGuards(
      prodEnv({ SUPABASE_URL: undefined, SUPABASE_SERVICE_ROLE_KEY: undefined, SUPABASE_JWT_SECRET: undefined })
    );
    expect(guard.fatal).toBe(false);
  });

  it('fails boot in production with only SUPABASE_URL (missing service role key)', () => {
    const guard = checkEnvGuards(prodEnv({ SUPABASE_SERVICE_ROLE_KEY: undefined }));
    expect(guard.fatal).toBe(true);
  });

  it('fails boot in production with only SUPABASE_SERVICE_ROLE_KEY (missing URL)', () => {
    const guard = checkEnvGuards(prodEnv({ SUPABASE_URL: undefined }));
    expect(guard.fatal).toBe(true);
  });

  it('fails boot when cloud storage is set but SUPABASE_JWT_SECRET is missing', () => {
    const guard = checkEnvGuards(prodEnv({ SUPABASE_JWT_SECRET: undefined }));
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('SUPABASE_JWT_SECRET');
  });

  // ─── Admin credentials ────────────────────────────────────────────────────
  it('fails boot when ADMIN_PASSWORD is the default value', () => {
    const guard = checkEnvGuards(prodEnv({ ADMIN_PASSWORD: 'adminpassword123' }));
    expect(guard.fatal).toBe(true);
  });

  it('fails boot when ADMIN_PASSWORD is the config-sample value', () => {
    const guard = checkEnvGuards(prodEnv({ ADMIN_PASSWORD: 'changeme_replace_in_production' }));
    expect(guard.fatal).toBe(true);
  });

  it('fails boot when ADMIN_EMAIL is the placeholder value', () => {
    const guard = checkEnvGuards(prodEnv({ ADMIN_EMAIL: 'admin@example.com' }));
    expect(guard.fatal).toBe(true);
  });

  // ─── JWT secret ───────────────────────────────────────────────────────────
  it('fails boot when LOCAL_JWT_SECRET is the .env.example placeholder', () => {
    const guard = checkEnvGuards(
      prodEnv({
        LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value',
        SUPABASE_JWT_SECRET: undefined,
        SUPABASE_URL: undefined,
        SUPABASE_SERVICE_ROLE_KEY: undefined,
        DATABASE_URL: undefined,
      })
    );
    expect(guard.fatal).toBe(true);
  });

  it('fails boot in production when no JWT secret is set', () => {
    const guard = checkEnvGuards(
      prodEnv({
        LOCAL_JWT_SECRET: undefined,
        SUPABASE_JWT_SECRET: undefined,
        DATABASE_URL: undefined,
      })
    );
    expect(guard.fatal).toBe(true);
  });

  it('still fails boot when LOCAL_JWT_SECRET is a placeholder and no derivation source exists', () => {
    const guard = checkEnvGuards(
      prodEnv({
        LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value',
        DATABASE_URL: undefined,
        SUPABASE_URL: undefined,
        SUPABASE_SERVICE_ROLE_KEY: undefined,
        SUPABASE_JWT_SECRET: undefined,
      })
    );
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('placeholder');
  });

  it('passes with a placeholder LOCAL_JWT_SECRET when cloud storage provides the JWT secret', () => {
    const guard = checkEnvGuards(prodEnv({ LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value' }));
    expect(guard.fatal).toBe(false);
  });

  // ─── Razorpay (payment gateway) ───────────────────────────────────────────
  it('passes with no Razorpay keys at all (payments simply stay off)', () => {
    const guard = checkEnvGuards(prodEnv());
    expect(guard.fatal).toBe(false);
  });

  it('fails boot when only one Razorpay key is set (partial config)', () => {
    const guard = checkEnvGuards(prodEnv({ RAZORPAY_KEY_ID: 'rzp_test_abc' }));
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('Razorpay');
  });

  it('fails boot with a test Razorpay key in production', () => {
    const guard = checkEnvGuards(
      prodEnv({ RAZORPAY_KEY_ID: 'rzp_test_abc', RAZORPAY_KEY_SECRET: 's', RAZORPAY_WEBHOOK_SECRET: 'w' })
    );
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('TEST key');
  });

  it('fails boot with a live Razorpay key outside production', () => {
    const guard = checkEnvGuards({
      NODE_ENV: 'development',
      RAZORPAY_KEY_ID: 'rzp_live_abc',
      RAZORPAY_KEY_SECRET: 's',
      RAZORPAY_WEBHOOK_SECRET: 'w',
    });
    expect(guard.fatal).toBe(true);
  });

  it('passes with a full, matching Razorpay config', () => {
    const guard = checkEnvGuards(
      prodEnv({ RAZORPAY_KEY_ID: 'rzp_live_abc', RAZORPAY_KEY_SECRET: 's', RAZORPAY_WEBHOOK_SECRET: 'w' })
    );
    expect(guard.fatal).toBe(false);
  });

  // ─── Non-production behavior ──────────────────────────────────────────────
  it('does not fail non-production on missing/placeholder values (dev convenience)', () => {
    const guard = checkEnvGuards({ NODE_ENV: 'development', ADMIN_PASSWORD: 'adminpassword123' });
    expect(guard.fatal).toBe(false);
  });
});
