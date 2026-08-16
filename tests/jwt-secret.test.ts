import { resolveJwtSecret, deriveJwtSecretFromDatabaseUrl } from '../src/utils/jwtSecret';

describe('resolveJwtSecret', () => {
  const realSecret = 'a-really-strong-random-secret-value';
  const placeholder = 'pksingh-jwt-secret-change-this-to-a-strong-random-value';
  const dbUrl = 'postgres://user:supersecretpw@host:5432/pksingh';

  // Every env var that resolveJwtSecret / deriveJwtSecretFromDatabaseUrl could
  // read. The helper scrubs all of them first so each test case is hermetic and
  // unaffected by ambient environment (e.g. CI sets a job-level DATABASE_URL).
  const RELEVANT_KEYS = [
    'NODE_ENV',
    'LOCAL_JWT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_JWT_SECRET',
    'DATABASE_URL',
  ] as const;

  const withEnv = (env: Record<string, string | undefined>, fn: () => string | undefined): string | undefined => {
    const prev = { ...process.env };
    try {
      RELEVANT_KEYS.forEach((k) => delete process.env[k]);
      Object.entries(env).forEach(([k, v]) => {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      });
      return fn();
    } finally {
      process.env = prev;
    }
  };

  it('prefers a real LOCAL_JWT_SECRET in production', () => {
    const secret = withEnv({ NODE_ENV: 'production', LOCAL_JWT_SECRET: realSecret }, () => resolveJwtSecret());
    expect(secret).toBe(realSecret);
  });

  it('derives a strong deterministic secret from DATABASE_URL when LOCAL_JWT_SECRET is a placeholder', () => {
    const secret = withEnv(
      { NODE_ENV: 'production', LOCAL_JWT_SECRET: placeholder, DATABASE_URL: dbUrl },
      () => resolveJwtSecret()
    );
    expect(secret).toBeDefined();
    expect(secret).not.toBe(placeholder);
    expect(secret).toMatch(/^[0-9a-f]{64}$/);

    // Deterministic across calls — sessions survive restarts.
    const again = withEnv(
      { NODE_ENV: 'production', LOCAL_JWT_SECRET: placeholder, DATABASE_URL: dbUrl },
      () => resolveJwtSecret()
    );
    expect(again).toBe(secret);
  });

  it('never returns the placeholder in production', () => {
    const secret = withEnv(
      { NODE_ENV: 'production', LOCAL_JWT_SECRET: placeholder, DATABASE_URL: dbUrl },
      () => resolveJwtSecret()
    );
    expect(secret).not.toBe(placeholder);
  });

  it('derives from DATABASE_URL in production when no LOCAL_JWT_SECRET is set', () => {
    const secret = withEnv({ NODE_ENV: 'production', DATABASE_URL: dbUrl }, () => resolveJwtSecret());
    expect(secret).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns undefined in production when no secret or derivation source exists', () => {
    const secret = withEnv({ NODE_ENV: 'production', LOCAL_JWT_SECRET: placeholder }, () => resolveJwtSecret());
    expect(secret).toBeUndefined();
  });

  it('returns the local secret in development even if it is a placeholder', () => {
    const secret = withEnv({ NODE_ENV: 'development', LOCAL_JWT_SECRET: placeholder }, () => resolveJwtSecret());
    expect(secret).toBe(placeholder);
  });

  it('deriveJwtSecretFromDatabaseUrl is deterministic and undefined without a URL', () => {
    expect(deriveJwtSecretFromDatabaseUrl(dbUrl)).toBe(deriveJwtSecretFromDatabaseUrl(dbUrl));
    expect(deriveJwtSecretFromDatabaseUrl(undefined)).toBeUndefined();
    expect(deriveJwtSecretFromDatabaseUrl('')).toBeUndefined();
  });
});
