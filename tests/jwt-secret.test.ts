import { resolveJwtSecret, deriveJwtSecretFromDatabaseUrl } from '../src/utils/jwtSecret';

describe('resolveJwtSecret', () => {
  const realSecret = 'a-really-strong-random-secret-value';
  const dbUrl = 'postgres://user:supersecretpw@host:5432/pksingh';

  const RELEVANT_KEYS = [
    'NODE_ENV',
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

  it('returns SUPABASE_JWT_SECRET when configured', () => {
    const secret = withEnv({ NODE_ENV: 'production', SUPABASE_JWT_SECRET: realSecret }, () => resolveJwtSecret());
    expect(secret).toBe(realSecret);
  });

  it('derives from DATABASE_URL when no SUPABASE_JWT_SECRET is set', () => {
    const secret = withEnv({ NODE_ENV: 'production', DATABASE_URL: dbUrl }, () => resolveJwtSecret());
    expect(secret).toBeDefined();
    expect(secret).toMatch(/^[0-9a-f]{64}$/);
    // Deterministic across calls
    const again = withEnv({ NODE_ENV: 'production', DATABASE_URL: dbUrl }, () => resolveJwtSecret());
    expect(again).toBe(secret);
  });

  it('returns undefined in production when no secret or DB URL exists', () => {
    const secret = withEnv({ NODE_ENV: 'production' }, () => resolveJwtSecret());
    expect(secret).toBeUndefined();
  });

  it('returns ephemeral secret in development when nothing is set', () => {
    const secret = withEnv({ NODE_ENV: 'development' }, () => resolveJwtSecret());
    expect(secret).toBeDefined();
    expect(secret!.length).toBeGreaterThan(0);
  });

  it('returns SUPABASE_JWT_SECRET in development when configured', () => {
    const secret = withEnv({ NODE_ENV: 'development', SUPABASE_JWT_SECRET: realSecret }, () => resolveJwtSecret());
    expect(secret).toBe(realSecret);
  });

  it('deriveJwtSecretFromDatabaseUrl is deterministic and undefined without a URL', () => {
    expect(deriveJwtSecretFromDatabaseUrl(dbUrl)).toBe(deriveJwtSecretFromDatabaseUrl(dbUrl));
    expect(deriveJwtSecretFromDatabaseUrl(undefined)).toBeUndefined();
    expect(deriveJwtSecretFromDatabaseUrl('')).toBeUndefined();
  });
});
