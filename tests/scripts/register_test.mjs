const base = (process.env.BASE || 'https://pksingh-backend.onrender.com/api').trim();

async function main(){
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testuser+ci@pksingh.com', password: 'testpassword123', fullName: 'CI Test User' }),
  });
  const text = await res.text();
  console.log('status', res.status);
  try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
}

main().catch(err=>{ console.error(err); process.exit(1); });
