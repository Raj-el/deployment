-- =====================================================
-- 16. CLIENT SUBSCRIPTION HISTORY
-- =====================================================
-- Tracks historical subscription snapshots per client tenant so admins
-- can audit plan changes, seat usage, and renewal status.
-- Ties into existing Clients + Users tables for governance.
-- =====================================================

CREATE TABLE IF NOT EXISTS "ClientSubscriptionHistory" (
  subscription_history_id BIGSERIAL PRIMARY KEY,
  client_id               BIGINT NOT NULL REFERENCES "Clients"(client_id) ON DELETE CASCADE,
  period_start            DATE NOT NULL,
  period_end              DATE NOT NULL,
  subscription_tier       TEXT NOT NULL,
  plan_status             TEXT NOT NULL DEFAULT 'active',
  seats_included          INTEGER,
  seats_in_use            INTEGER,
  mrr                     NUMERIC(12,2),
  arr                     NUMERIC(12,2),
  renewal_date            DATE,
  notes                   TEXT,
  recorded_by             BIGINT REFERENCES "Users"(user_id) ON DELETE SET NULL,
  recorded_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (period_end >= period_start),
  CHECK (plan_status IN ('active','pending_renewal','churned','downgraded'))
);

CREATE INDEX IF NOT EXISTS "ClientSubscriptionHistory_client_id_idx"
  ON "ClientSubscriptionHistory"(client_id, period_start);

-- Seed subscription history for ScalePoint (uses existing Clients + Users rows).
WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
)
INSERT INTO "ClientSubscriptionHistory" (
  client_id, period_start, period_end, subscription_tier, plan_status,
  seats_included, seats_in_use, mrr, arr, renewal_date, notes, recorded_by, recorded_at
)
SELECT
  ctx.client_id,
  vals.period_start,
  vals.period_end,
  vals.subscription_tier,
  vals.plan_status,
  vals.seats_included,
  vals.seats_in_use,
  vals.mrr,
  vals.arr,
  vals.renewal_date,
  vals.notes,
  ctx.admin_user_id,
  vals.recorded_at
FROM ctx
JOIN (
  VALUES
    ('2024-01-01'::date, '2024-03-31'::date, 'enterprise', 'active', 50, 47, 50000.00, 600000.00, '2024-12-31'::date,
      'Baseline contract with enterprise support & AI planning add-on.', '2024-03-31 12:00:00+00'::timestamptz),
    ('2024-04-01'::date, '2024-06-30'::date, 'enterprise', 'pending_renewal', 60, 54, 52000.00, 624000.00, '2024-12-31'::date,
      'Expanded seats for pilot roll-out of new automation features.', '2024-06-30 12:00:00+00'::timestamptz)
) AS vals(period_start, period_end, subscription_tier, plan_status, seats_included,
          seats_in_use, mrr, arr, renewal_date, notes, recorded_at)
  ON TRUE
ON CONFLICT DO NOTHING;
