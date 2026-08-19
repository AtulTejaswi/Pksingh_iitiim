import { resolveJwtSecret } from '../src/utils/jwtSecret';

describe('resolveJwtSecret', () => {
  const realSecret = 'a-really-strong-random-secret-value';

  // Every env var that resolveJwtSecret could read. The helper scrubs all of
  // them first so each test case is hermetic and unaffected by ambient environment.
  const RELEVANT_KEYS = [
    'NODE_ENV',
    'SUPABASE_JWT_SECRET',
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

  it('returns undefined in production when no SUPABASE_JWT_SECRET is set', () => {
    const secret = withEnv({ NODE_ENV: 'production' }, () => resolveJwtSecret());
    expect(secret).toBeUndefined();
  });

  it('returns ephemeral secret in development when no SUPABASE_JWT_SECRET is set', () => {
    const secret = withEnv({ NODE_ENV: 'development' }, () => resolveJwtSecret());
    expect(secret).toBeDefined();
    expect(secret!.length).toBeGreaterThan(0);
  });

  it('ephemeral secret is consistent within the same process (cached)', () => {
    const first = withEnv({ NODE_ENV: 'development' }, () => resolveJwtSecret());
    const second = withEnv({ NODE_ENV: 'development' }, () => resolveJwtSecret());
    expect(first).toBe(second);
  });

  it('returns SUPABASE_JWT_SECRET in development when configured', () => {
    const secret = withEnv({ NODE_ENV: 'development', SUPABASE_JWT_SECRET: realSecret }, () => resolveJwtSecret());
    expect(secret).toBe(realSecret);
  });
});
