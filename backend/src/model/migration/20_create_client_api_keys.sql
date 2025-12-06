-- =====================================================
-- 20. CLIENT API KEYS
-- =====================================================
-- Provides secure storage + auditing for tenant API credentials (API Key Management epic).
-- Uses hashed keys; raw secrets should live in vaults, not this table.
-- =====================================================

CREATE TABLE IF NOT EXISTS "ClientApiKeys" (
  api_key_id    BIGSERIAL PRIMARY KEY,
  client_id     BIGINT NOT NULL REFERENCES "Clients"(client_id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  hashed_key    TEXT NOT NULL,
  scopes        TEXT[] NOT NULL DEFAULT ARRAY['read'],
  environment   TEXT NOT NULL DEFAULT 'production',
  last_used_at  TIMESTAMPTZ,
  created_by    BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ,
  revoked_by    BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  UNIQUE (client_id, name),
  CHECK (environment IN ('production','staging','sandbox'))
);

CREATE INDEX IF NOT EXISTS "ClientApiKeys_client_id_idx"
  ON "ClientApiKeys"(client_id);

-- Seed API keys visible in the Admin Panel (hashed_key is a placeholder string).
WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
)
INSERT INTO "ClientApiKeys" (
  client_id, name, description, hashed_key, scopes, environment,
  last_used_at, created_by, created_at, updated_at
)
SELECT
  ctx.client_id,
  vals.name,
  vals.description,
  vals.hashed_key,
  vals.scopes::text[],
  vals.environment,
  vals.last_used_at,
  ctx.admin_user_id,
  vals.timestamp,
  vals.timestamp
FROM ctx
JOIN (
  VALUES
    ('RevRec Integration', 'Push ARR + churn signals into downstream RevRec system.', 'HASHED_KEY_PLACEHOLDER_REVREC',
      ARRAY['read','write','webhook'], 'production', '2024-06-18 13:22:00+00'::timestamptz, '2024-04-01 00:00:00+00'::timestamptz),
    ('Usage Warehouse Sync', 'Sync anonymized usage metrics into BI warehouse nightly.', 'HASHED_KEY_PLACEHOLDER_USAGE',
      ARRAY['read'], 'staging', '2024-06-15 06:00:00+00'::timestamptz, '2024-05-05 00:00:00+00'::timestamptz)
) AS vals(name, description, hashed_key, scopes, environment, last_used_at, timestamp)
  ON TRUE
ON CONFLICT (client_id, name) DO NOTHING;
