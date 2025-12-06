SELECT
  jf.function_name,
  jf.function_category,
  rp.resource_type,
  rp.action,
  rp.scope
FROM "ClientJobFunctions" jf
LEFT JOIN "RolePermissions" rp
  ON rp.job_function_id = jf.job_function_id
ORDER BY
  jf.function_category,
  jf.function_name,
  rp.resource_type,
  rp.action;
