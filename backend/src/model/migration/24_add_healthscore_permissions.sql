-- =====================================================
-- 24. HEALTH SCORE ENDPOINT PERMISSIONS FOR CLIENT TEAM
-- =====================================================
-- Grants read/write access to the new /api/v1/healthscore endpoints
-- for all client job functions (admins + CS team members).
-- =====================================================

WITH targets AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
),
perms AS (
  SELECT * FROM (VALUES
    ('/api/v1/healthscore', 'get', 'assigned_accounts'),
    ('/api/v1/healthscore/customers', 'get', 'assigned_accounts'),
    ('/api/v1/healthscore', 'post', 'assigned_accounts')
  ) AS p(resource_type, action, scope)
)
INSERT INTO "RolePermissions" (
  job_function_id,
  resource_type,
  action,
  scope,
  created_at,
  created_by
)
SELECT
  t.job_function_id,
  p.resource_type,
  p.action,
  p.scope,
  NOW(),
  NULL
FROM targets t
CROSS JOIN perms p
ON CONFLICT (job_function_id, resource_type, action) DO NOTHING;
