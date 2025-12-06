-- =====================================================
-- 02. POPULATE CLIENTS TABLE
-- =====================================================
-- Single client company: ScalePoint
-- ScalePoint has 750 customer accounts and 50 CS team members

INSERT INTO "Clients" (
  name, slug, industry, company_size, status, subscription_tier,
  subscription_start_date, subscription_end_date, monthly_recurring_revenue,
  timezone, is_active, onboarded_at, created_at, updated_at
) VALUES (
  'ScalePoint',
  'scalepoint',
  'Customer Success Software',
  'mid_market',
  'active',
  'enterprise',
  '2024-01-01',
  '2025-12-31',
  50000.00,
  'America/Los_Angeles',
  true,
  '2024-01-15 00:00:00+00',
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
);

-- Verification
SELECT * FROM "Clients";
