// Shared admin credentials helper for dev/test scripts.
// Never hardcodes a password. Requires the real admin email/password via env.
export function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.E2E_ADMIN_EMAIL || 'admin@pksingh.com';
}

export function adminPassword() {
  const p = process.env.ADMIN_PASSWORD || process.env.E2E_ADMIN_PASSWORD;
  if (!p) {
    console.error(
      'Missing admin password. Set ADMIN_PASSWORD (or E2E_ADMIN_PASSWORD) to the real ' +
      'admin password before running this script. Hardcoded/example passwords are not accepted.'
    );
    process.exit(1);
  }
  return p;
}
