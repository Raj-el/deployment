-- =====================================================
-- 23. GRANT FULL PLANS CONTROLLER ACCESS TO CLIENT-TEAM ROLES
-- =====================================================
-- Duplicates the existing Plans permissions onto every client-team
-- job function so they can list, create, edit, and delete plans.
-- Adjust the WHERE clause in the `targets` CTE if you only want to
-- scope to a specific tenant.
-- =====================================================

WITH targets AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
  -- optional scope:
  -- WHERE client_id = 1
),
plan_perms AS (
  SELECT * FROM (VALUES
    ('/api/v1/plans', 'get',       'company_portfolio'),
    ('/api/v1/plans', 'delete',    'company_accounts'),
    ('/api/v1/plans/ai', 'post',   'company_accounts'),
    ('/api/v1/plans/manual', 'post','company_accounts'),
    ('/api/v1/plans/edit', 'patch','company_accounts'),
    ('/api/v1/plans/outcome', 'patch','company_accounts'),
    ('/api/v1/plans/templates', 'post','playbook_library'),
    ('/api/v1/plans/company/clients', 'get','company_portfolio')
  ) AS perms(resource_type, action, scope)
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
  (SELECT user_id FROM "Users" WHERE email = 'admin@scalepoint.com')
FROM targets t
CROSS JOIN plan_perms p
ON CONFLICT (job_function_id, resource_type, action) DO NOTHING;
