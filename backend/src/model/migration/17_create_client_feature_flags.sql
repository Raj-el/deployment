-- =====================================================
-- 17. CLIENT FEATURE FLAGS
-- =====================================================
-- Stores feature-level toggles so admins can control availability of
-- platform capabilities per tenant (Feature Flag Management epic).
-- References Clients + Users for accountability.
-- =====================================================

CREATE TABLE IF NOT EXISTS "ClientFeatureFlags" (
  feature_flag_id BIGSERIAL PRIMARY KEY,
  client_id       BIGINT NOT NULL REFERENCES "Clients"(client_id) ON DELETE CASCADE,
  feature_key     TEXT NOT NULL,
  feature_name    TEXT NOT NULL,
  description     TEXT,
  is_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_strategy TEXT NOT NULL DEFAULT 'full',
  target_segments JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_toggled_by BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  last_toggled_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, feature_key),
  CHECK (rollout_strategy IN ('full','percentage','beta','pilot'))
);

CREATE INDEX IF NOT EXISTS "ClientFeatureFlags_client_feature_key_idx"
  ON "ClientFeatureFlags"(client_id, feature_key);

-- Seed feature toggles for ScalePoint per the Admin Panel roadmap.
WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
)
INSERT INTO "ClientFeatureFlags" (
  client_id, feature_key, feature_name, description,
  is_enabled, rollout_strategy, target_segments, last_toggled_by, last_toggled_at
)
SELECT
  ctx.client_id,
  vals.feature_key,
  vals.feature_name,
  vals.description,
  vals.is_enabled,
  vals.rollout_strategy,
  vals.target_segments::jsonb,
  ctx.admin_user_id,
  vals.last_toggled_at
FROM ctx
JOIN (
  VALUES
    ('user_invitation_mgmt', 'User Invitation Management',
      'Enable admins to invite internal teammates by email.', TRUE, 'full', '[]', '2024-05-15 16:30:00+00'::timestamptz),
    ('access_control', 'Access Control',
      'Allow CS leaders to manage fine-grained permissions per job function.', TRUE, 'pilot', '["enterprise","mid_market"]',
      '2024-06-01 14:00:00+00'::timestamptz),
    ('glossary_mgmt', 'Glossary Management',
      'Expose centralized glossary authoring UI.', FALSE, 'beta', '["enable_on_request"]',
      '2024-06-10 10:00:00+00'::timestamptz),
    ('api_key_mgmt', 'API Key Management',
      'Show API credentials list & audit logs.', TRUE, 'percentage', '["directors","admins"]',
      '2024-06-12 09:15:00+00'::timestamptz),
    ('subscription_mgmt', 'Subscription Management',
      'Display MRR + seat usage insights to admins.', TRUE, 'full', '[]',
      '2024-06-20 18:00:00+00'::timestamptz),
    ('plans', 'Plans Access Control',
      'Master switch that gates all Get-Well Plan endpoints for a tenant.', TRUE, 'full', '[]',
      '2024-06-25 12:00:00+00'::timestamptz)
) AS vals(feature_key, feature_name, description, is_enabled, rollout_strategy, target_segments, last_toggled_at)
  ON TRUE
ON CONFLICT (client_id, feature_key) DO NOTHING;
