import { adminEmail, adminPassword } from './admin_creds.mjs';

const base = (process.env.BASE || 'https://pksingh-backend.onrender.com/api').trim();

async function main(){
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail(), password: adminPassword() }),
  });
  const text = await res.text();
  console.log('status', res.status);
  try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
}

main().catch(err=>{ console.error(err); process.exit(1); });
