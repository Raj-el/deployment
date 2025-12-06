-- =====================================================
-- 19. CLIENT GLOSSARY TERMS
-- =====================================================
-- Enables admins to maintain a shared glossary (Glossary Management epic).
-- Ties to Clients + Users for authorship history.
-- =====================================================

CREATE TABLE IF NOT EXISTS "ClientGlossaryTerms" (
  glossary_term_id BIGSERIAL PRIMARY KEY,
  client_id        BIGINT NOT NULL REFERENCES "Clients"(client_id) ON DELETE CASCADE,
  term             TEXT NOT NULL,
  definition       TEXT NOT NULL,
  category         TEXT,
  status           TEXT NOT NULL DEFAULT 'active',
  last_reviewed_at TIMESTAMPTZ,
  created_by       BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  updated_by       BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, term),
  CHECK (status IN ('active','draft','deprecated'))
);

CREATE INDEX IF NOT EXISTS "ClientGlossaryTerms_client_id_idx"
  ON "ClientGlossaryTerms"(client_id);

-- Seed initial glossary definitions used in the Admin Panel roadmap.
WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
)
INSERT INTO "ClientGlossaryTerms" (
  client_id, term, definition, category, status,
  last_reviewed_at, created_by, updated_by, created_at, updated_at
)
SELECT
  ctx.client_id,
  vals.term,
  vals.definition,
  vals.category,
  vals.status,
  vals.last_reviewed_at,
  ctx.admin_user_id,
  ctx.admin_user_id,
  vals.timestamp,
  vals.timestamp
FROM ctx
JOIN (
  VALUES
    ('Get-Well Plan', 'A structured recovery strategy documenting risks, focus areas, and actions for at-risk customers.', 'Customer Success', 'active',
      '2024-06-10 00:00:00+00'::timestamptz, '2024-06-10 00:00:00+00'::timestamptz),
    ('Feature Flag', 'A toggle that controls whether a capability is available to specific cohorts.', 'Platform Operations', 'active',
      '2024-06-10 00:00:00+00'::timestamptz, '2024-06-10 00:00:00+00'::timestamptz),
    ('Instance Configuration', 'A set of tenant-level settings that determine automation, timezone, and compliance policies.', 'Platform Operations', 'active',
      '2024-05-20 00:00:00+00'::timestamptz, '2024-05-20 00:00:00+00'::timestamptz),
    ('Subscription Snapshot', 'Historical record capturing MRR, seats, and renewal posture for a billing period.', 'Finance', 'draft',
      '2024-05-01 00:00:00+00'::timestamptz, '2024-05-01 00:00:00+00'::timestamptz)
) AS vals(term, definition, category, status, last_reviewed_at, timestamp)
  ON TRUE
ON CONFLICT (client_id, term) DO NOTHING;
