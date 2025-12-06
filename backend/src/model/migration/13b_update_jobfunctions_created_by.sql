-- =====================================================
-- UPDATE EXISTING CLIENTJOBFUNCTIONS WITH CREATED_BY
-- =====================================================
-- This script updates the created_by field for job functions
-- that were already inserted without a created_by value
-- =====================================================

UPDATE "ClientJobFunctions"
SET created_by = (SELECT user_id FROM "Users" WHERE email = 'admin@scalepoint.com')
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
  AND created_by IS NULL;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check that all job functions now have created_by set
SELECT 
  job_function_id,
  function_name,
  function_category,
  created_by,
  (SELECT email FROM "Users" WHERE user_id = jf.created_by) as created_by_email,
  created_at
FROM "ClientJobFunctions" jf
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
ORDER BY 
  CASE function_category 
    WHEN 'executive' THEN 1
    WHEN 'management' THEN 2
    WHEN 'individual_contributor' THEN 3
  END,
  function_name;

-- Check for any records still missing created_by (should be 0)
SELECT 
  job_function_id,
  function_name,
  created_by
FROM "ClientJobFunctions"
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
  AND created_by IS NULL;
