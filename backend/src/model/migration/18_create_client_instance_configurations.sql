-- =====================================================
-- 18. CLIENT INSTANCE CONFIGURATIONS
-- =====================================================
-- Stores global settings for each tenant instance (Instance Configuration epic)
-- so admins can tailor automations, timezones, and guardrails per client.
-- =====================================================

CREATE TABLE IF NOT EXISTS "ClientInstanceConfigurations" (
  config_id    BIGSERIAL PRIMARY KEY,
  client_id    BIGINT NOT NULL REFERENCES "Clients"(client_id) ON DELETE CASCADE,
  config_key   TEXT NOT NULL,
  config_value JSONB NOT NULL,
  description  TEXT,
  is_locked    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by   BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, config_key)
);

-- Seed baseline settings for ScalePoint.
WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
)
INSERT INTO "ClientInstanceConfigurations" (
  client_id, config_key, config_value, description, is_locked, updated_by, updated_at, created_at
)
SELECT
  ctx.client_id,
  vals.config_key,
  vals.config_value::jsonb,
  vals.description,
  vals.is_locked,
  ctx.admin_user_id,
  vals.timestamp,
  vals.timestamp
FROM ctx
JOIN (
  VALUES
    ('default_timezone', '{"value":"America/Los_Angeles"}', 'Primary timezone for SLA + reporting calculations.', TRUE,
      '2024-05-01 00:00:00+00'::timestamptz),
    ('ai_plan_guardrails', '{"max_runs_per_day":5,"require_high_risk":true}', 'Controls when AI plans can be generated.', FALSE,
      '2024-05-10 00:00:00+00'::timestamptz),
    ('data_retention_policy', '{"qbr_notes_days":730,"audit_logs_days":365}', 'Retention windows for sensitive data exports.', TRUE,
      '2024-05-15 00:00:00+00'::timestamptz),
    ('notification_preferences', '{"digest":"weekly","alerts":["renewal","risk_change"]}', 'Default cadence for leadership alerts.', FALSE,
      '2024-05-20 00:00:00+00'::timestamptz)
) AS vals(config_key, config_value, description, is_locked, timestamp)
  ON TRUE
ON CONFLICT (client_id, config_key) DO NOTHING;
