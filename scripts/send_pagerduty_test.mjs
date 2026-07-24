import fetch from 'node-fetch';

const key = process.env.PAGERDUTY_INTEGRATION_KEY;
if (!key) {
  console.error('PAGERDUTY_INTEGRATION_KEY not set. Aborting.');
  process.exit(2);
}

const payload = {
  routing_key: key,
  event_action: 'trigger',
  payload: {
    summary: 'Test alert from PKSingh monitoring setup',
    severity: 'info',
    source: 'pksingh-monitoring',
  },
};

async function send() {
  const res = await fetch('https://events.pagerduty.com/v2/enqueue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log('PagerDuty response status:', res.status);
  console.log(text);
}

send().catch((e) => { console.error(e); process.exit(1); });
