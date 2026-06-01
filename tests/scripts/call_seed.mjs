const base = (process.env.BASE || 'https://pksingh-backend.onrender.com/api').trim();

async function attempt(){
  const res = await fetch(`${base}/auth/seed-admin`, { method: 'POST' });
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch(e) { parsed = text; }
  console.log('status', res.status, parsed);
  return res.status >=200 && res.status < 300;
}

(async ()=>{
  for (let i=0;i<60;i++){
    try{
      const ok = await attempt();
      if (ok) return process.exit(0);
    }catch(e){ console.log('err', e.message); }
    await new Promise(r=>setTimeout(r,3000));
  }
  console.error('seed endpoint never became available');
  process.exit(2);
})();
