import { checkEnvGuards, EnvSnapshot } from '../src/utils/envSecurity';

describe('envSecurity startup guards', () => {
  const prodEnv = (overrides: Partial<EnvSnapshot> = {}): EnvSnapshot => ({
    NODE_ENV: 'production',
    LOCAL_JWT_SECRET: 'a-really-strong-random-secret-value',
    ADMIN_PASSWORD: 'a-real-strong-password',
    ADMIN_EMAIL: 'owner@real-co.com',
    ...overrides,
  });

  it('passes when a real secret, password, and email are set', () => {
    expect(checkEnvGuards(prodEnv()).fatal).toBe(false);
  });

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

  it('fails boot when LOCAL_JWT_SECRET is the .env.example placeholder', () => {
    const guard = checkEnvGuards(prodEnv({ LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value' }));
    expect(guard.fatal).toBe(true);
  });

  it('fails boot in production when no JWT secret is set', () => {
    const guard = checkEnvGuards(prodEnv({ LOCAL_JWT_SECRET: undefined }));
    expect(guard.fatal).toBe(true);
  });

  it('passes with a placeholder LOCAL_JWT_SECRET when DATABASE_URL can derive a strong secret', () => {
    const guard = checkEnvGuards(
      prodEnv({
        LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value',
        DATABASE_URL: 'postgres://user:secret@host:5432/pksingh',
      })
    );
    expect(guard.fatal).toBe(false);
  });

  it('passes with no LOCAL_JWT_SECRET when DATABASE_URL can derive a strong secret', () => {
    const guard = checkEnvGuards(prodEnv({ LOCAL_JWT_SECRET: undefined, DATABASE_URL: 'postgres://u:p@h/db' }));
    expect(guard.fatal).toBe(false);
  });

  it('still fails boot when LOCAL_JWT_SECRET is a placeholder and no derivation source exists', () => {
    const guard = checkEnvGuards(prodEnv({ LOCAL_JWT_SECRET: 'pksingh-jwt-secret-change-this-to-a-strong-random-value' }));
    expect(guard.fatal).toBe(true);
    expect(guard.fatal && guard.message).toContain('placeholder');
  });

  it('does not fail non-production on missing/placeholder values (dev convenience)', () => {
    const guard = checkEnvGuards({ NODE_ENV: 'development', ADMIN_PASSWORD: 'adminpassword123' });
    expect(guard.fatal).toBe(false);
  });
});