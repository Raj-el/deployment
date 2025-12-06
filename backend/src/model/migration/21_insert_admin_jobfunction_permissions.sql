-- =====================================================
-- 21. ADD PLATFORM ADMIN JOB FUNCTION + PERMISSIONS
-- =====================================================
-- Creates a dedicated "Admin" job function for ScalePoint and grants it
-- access to the new /api/v1/admin endpoints (subscription history, feature
-- flags, configurations, glossary, API keys).
-- =====================================================

WITH ctx AS (
  SELECT
    c.client_id,
    u.user_id AS admin_user_id
  FROM "Clients" c
  JOIN "Users" u ON u.email = 'admin@scalepoint.com'
  WHERE c.slug = 'scalepoint'
),
inserted_admin AS (
  INSERT INTO "ClientJobFunctions" (
    client_id,
    function_name,
    function_category,
    description,
    is_default,
    is_active,
    created_by,
    created_at,
    updated_at
  )
  SELECT
    ctx.client_id,
    'Admin',
    'executive',
    'Tenant administrator with access to security, configuration, and subscription tooling.',
    false,
    true,
    ctx.admin_user_id,
    NOW(),
    NOW()
  FROM ctx
  ON CONFLICT (client_id, function_name) DO NOTHING
  RETURNING job_function_id
) SELECT 1;

-- =====================================================
-- PERMISSIONS FOR ADMIN JOB FUNCTION
-- =====================================================
WITH admin_fn AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
  WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
    AND LOWER(function_name) = 'admin'
)
INSERT INTO "RolePermissions" (job_function_id, resource_type, action, scope, created_at, created_by)
SELECT
  admin_fn.job_function_id,
  perms.resource,
  perms.action,
  'platform_admin',
  NOW(),
  (SELECT user_id FROM "Users" WHERE email = 'admin@scalepoint.com')
FROM admin_fn
CROSS JOIN (VALUES
  ('/api/v1/admin/subscriptions/history', 'get'),
  ('/api/v1/admin/subscriptions/history', 'post'),
  ('/api/v1/admin/instance-config', 'get'),
  ('/api/v1/admin/instance-config', 'patch'),
  ('/api/v1/admin/glossary', 'get'),
  ('/api/v1/admin/glossary', 'post'),
  ('/api/v1/admin/glossary', 'patch'),
  ('/api/v1/admin/glossary', 'delete'),
  ('/api/v1/admin/api-keys', 'get'),
  ('/api/v1/admin/api-keys', 'post'),
  ('/api/v1/admin/api-keys', 'patch'),
  ('/api/v1/admin/users', 'get'),
  ('/api/v1/admin/users', 'post'),
  ('/api/v1/admin/users/:userId', 'patch')
) AS perms(resource, action)
ON CONFLICT (job_function_id, resource_type, action) DO NOTHING;
