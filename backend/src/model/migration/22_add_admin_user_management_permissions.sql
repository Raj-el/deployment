-- =====================================================
-- 22. ADD USER MANAGEMENT PERMISSIONS FOR ADMIN JOB FUNCTION
-- =====================================================
-- Ensures the tenant admin job function can call the new
-- /api/v1/admin/users endpoints (list, create, update).
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
  ('/api/v1/admin/users', 'get'),
  ('/api/v1/admin/users', 'post'),
  ('/api/v1/admin/users', 'patch')
) AS perms(resource, action)
ON CONFLICT (job_function_id, resource_type, action) DO NOTHING;
