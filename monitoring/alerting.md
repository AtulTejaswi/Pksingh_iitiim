PagerDuty / Email Alerting (example)

1) PagerDuty: create a service and get the integration key.
2) Configure Alertmanager to forward alerts to PagerDuty using the integration key.

Minimal Alertmanager receiver example:

receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - routing_key: '<PAGERDUTY_INTEGRATION_KEY>'

route:
  group_by: ['alertname']
  receiver: 'pagerduty'

For email alerts, configure an SMTP receiver in Alertmanager and add a receiver entry.
