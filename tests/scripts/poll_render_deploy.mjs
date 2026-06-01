const token = process.env.RENDER_API_KEY || 'rnd_kaSn7HBsSzyFr2bys79kfmZiWIeK';
const serviceId = process.env.RENDER_SERVICE_ID || 'srv-d8dfh4sm0tmc73dt1gpg';
const targetCommit = process.env.TARGET_COMMIT || '63edd2748e888b30c8fad42cabb26500335523fe';

async function fetchJson(url){
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

(async ()=>{
  for (let i=0;i<60;i++){
    const data = await fetchJson(`https://api.render.com/v1/services/${serviceId}/deploys`);
    const latest = data.value && data.value[0] && data.value[0].deploy;
    if (!latest) { console.log('no deploys yet'); await new Promise(r=>setTimeout(r,3000)); continue; }
    console.log(`deploy: ${latest.commit.message} -> ${latest.status}`);
    if (latest.commit.id === targetCommit && latest.status === 'live'){
      console.log('Target deploy is live');
      process.exit(0);
    }
    await new Promise(r=>setTimeout(r,4000));
  }
  console.error('Timed out waiting for deploy');
  process.exit(2);
})();
