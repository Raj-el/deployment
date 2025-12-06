-- Individual-contributor CSMs (US‑GWP‑001/002/004/006/009/012/015)
WITH csm_functions AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
  WHERE function_name IN (
    'Senior Enterprise CSM',
    'Mid-Level Enterprise CSM',
    'Mid-Level Mid-Market CSM',
    'Junior Mid-Market CSM',
    'SMB Team Lead',
    'Junior SMB CSM'
  )
)
INSERT INTO "RolePermissions" (job_function_id, resource_type, action, scope)
SELECT cf.job_function_id, perms.resource_type, perms.action, perms.scope
FROM csm_functions cf
JOIN (VALUES
  ('/api/v1/plans/ai',              'post',  'assigned_accounts'),
  ('/api/v1/plans/manual',          'post',  'assigned_accounts'),
  ('/api/v1/plans/edit',            'patch', 'assigned_accounts'),
  ('/api/v1/plans/outcome',         'patch', 'assigned_accounts'),
  ('/api/v1/plans/templates',       'post',  'share_success'),
  ('/api/v1/plans',                 'get',   'assigned_accounts'),
  ('/api/v1/plans/company/clients', 'get',   'assigned_accounts')
) AS perms(resource_type, action, scope)
  ON TRUE;

-- Directors / CS Managers (US‑GWP‑003/007/008/010/011/013)
WITH manager_functions AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
  WHERE function_name IN (
    'Director of Enterprise Success',
    'Director of Mid-Market Success',
    'Director of SMB Success',
    'Director of Strategic Accounts'
  )
)
INSERT INTO "RolePermissions" (job_function_id, resource_type, action, scope)
SELECT mf.job_function_id, perms.resource_type, perms.action, perms.scope
FROM manager_functions mf
JOIN (VALUES
  ('/api/v1/plans/company/clients', 'get',    'company_portfolio'),
  ('/api/v1/plans',                 'get',    'company_portfolio'),
  ('/api/v1/plans/ai',              'post',   'company_accounts'),
  ('/api/v1/plans/manual',          'post',   'company_accounts'),
  ('/api/v1/plans/edit',            'patch',  'company_accounts'),
  ('/api/v1/plans/outcome',         'patch',  'company_accounts'),
  ('/api/v1/plans/templates',       'post',   'playbook_library'),
  ('/api/v1/plans',                 'delete', 'company_accounts')
) AS perms(resource_type, action, scope)
  ON TRUE;

-- Executive read access (US‑GWP‑011)
WITH exec_function AS (
  SELECT job_function_id
  FROM "ClientJobFunctions"
  WHERE function_name = 'VP of Customer Success'
)
INSERT INTO "RolePermissions" (job_function_id, resource_type, action, scope)
SELECT ef.job_function_id, perms.resource_type, perms.action, perms.scope
FROM exec_function ef
JOIN (VALUES
  ('/api/v1/plans/company/clients', 'get', 'executive_insights'),
  ('/api/v1/plans',                 'get', 'executive_insights')
) AS perms(resource_type, action, scope)
  ON TRUE;
