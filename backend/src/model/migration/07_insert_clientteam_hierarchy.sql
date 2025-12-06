-- =====================================================
-- 07. POPULATE CLIENTTEAMHIERARCHY TABLE + TRIGGERS
-- =====================================================
-- This script:
-- 1. Populates the denormalized hierarchy table for fast lookups
-- 2. Creates triggers to automatically maintain hierarchy counts
-- 3. Ensures efficient org chart queries without recursive CTEs
--
-- Must be inserted AFTER ClientTeam table is populated
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TRIGGER FUNCTION
-- =====================================================
-- This function recalculates the hierarchy when team members change

CREATE OR REPLACE FUNCTION recalculate_client_team_hierarchy()
RETURNS TRIGGER AS $$
DECLARE
  v_client_id INTEGER;
  v_employee_id VARCHAR(100);
  v_old_manager VARCHAR(100);
  v_new_manager VARCHAR(100);
BEGIN
  -- Determine which client and employee was affected
  IF TG_OP = 'DELETE' THEN
    v_client_id := OLD.client_id;
    v_employee_id := OLD.employee_id;
    v_old_manager := OLD.manager_employee_id;
    v_new_manager := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_client_id := NEW.client_id;
    v_employee_id := NEW.employee_id;
    v_old_manager := OLD.manager_employee_id;
    v_new_manager := NEW.manager_employee_id;
  ELSE -- INSERT
    v_client_id := NEW.client_id;
    v_employee_id := NEW.employee_id;
    v_old_manager := NULL;
    v_new_manager := NEW.manager_employee_id;
  END IF;

  -- Recalculate the entire hierarchy for this client
  -- (More efficient than trying to update incrementally)
  DELETE FROM "ClientTeamHierarchy" WHERE client_id = v_client_id;
  
  -- Insert fresh hierarchy data
  INSERT INTO "ClientTeamHierarchy" (
    client_id, employee_id, reports_to, hierarchy_level,
    direct_report_count, total_report_count, department, updated_at
  )
  WITH RECURSIVE hierarchy AS (
    -- Base case: employees with no manager or manager = 'CEO'
    SELECT 
      ct.client_id,
      ct.employee_id,
      ct.manager_employee_id as reports_to,
      0 as hierarchy_level,
      COALESCE(ct.specialization, ct.department) as department
    FROM "ClientTeam" ct
    WHERE ct.client_id = v_client_id
      AND (ct.manager_employee_id IS NULL OR ct.manager_employee_id = 'CEO')
      AND ct.is_active = true
    
    UNION ALL
    
    -- Recursive case: employees who report to someone in the hierarchy
    SELECT 
      ct.client_id,
      ct.employee_id,
      ct.manager_employee_id as reports_to,
      h.hierarchy_level + 1 as hierarchy_level,
      COALESCE(ct.specialization, ct.department) as department
    FROM "ClientTeam" ct
    INNER JOIN hierarchy h ON ct.manager_employee_id = h.employee_id
    WHERE ct.client_id = v_client_id
      AND ct.is_active = true
  ),
  direct_counts AS (
    SELECT 
      manager_employee_id,
      COUNT(*) as direct_count
    FROM "ClientTeam"
    WHERE client_id = v_client_id 
      AND manager_employee_id IS NOT NULL
      AND manager_employee_id != 'CEO'
      AND is_active = true
    GROUP BY manager_employee_id
  ),
  total_counts AS (
    -- Calculate total reports using recursive CTE
    WITH RECURSIVE reports AS (
      -- Direct reports
      SELECT 
        manager_employee_id as manager_id,
        employee_id,
        1 as level
      FROM "ClientTeam"
      WHERE client_id = v_client_id
        AND manager_employee_id IS NOT NULL
        AND manager_employee_id != 'CEO'
        AND is_active = true
      
      UNION ALL
      
      -- Indirect reports
      SELECT 
        r.manager_id,
        ct.employee_id,
        r.level + 1
      FROM reports r
      INNER JOIN "ClientTeam" ct ON r.employee_id = ct.manager_employee_id
      WHERE ct.client_id = v_client_id
        AND ct.is_active = true
    )
    SELECT 
      manager_id,
      COUNT(DISTINCT employee_id) as total_count
    FROM reports
    GROUP BY manager_id
  )
  SELECT 
    h.client_id,
    h.employee_id,
    h.reports_to,
    h.hierarchy_level,
    COALESCE(dc.direct_count, 0) as direct_report_count,
    COALESCE(tc.total_count, 0) as total_report_count,
    h.department,
    NOW() as updated_at
  FROM hierarchy h
  LEFT JOIN direct_counts dc ON h.employee_id = dc.manager_employee_id
  LEFT JOIN total_counts tc ON h.employee_id = tc.manager_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: CREATE TRIGGERS ON CLIENTTEAM
-- =====================================================

DROP TRIGGER IF EXISTS trigger_recalc_hierarchy_on_insert ON "ClientTeam";
CREATE TRIGGER trigger_recalc_hierarchy_on_insert
AFTER INSERT ON "ClientTeam"
FOR EACH ROW
EXECUTE FUNCTION recalculate_client_team_hierarchy();

DROP TRIGGER IF EXISTS trigger_recalc_hierarchy_on_update ON "ClientTeam";
CREATE TRIGGER trigger_recalc_hierarchy_on_update
AFTER UPDATE ON "ClientTeam"
FOR EACH ROW
WHEN (
  OLD.manager_employee_id IS DISTINCT FROM NEW.manager_employee_id OR
  OLD.is_active IS DISTINCT FROM NEW.is_active
)
EXECUTE FUNCTION recalculate_client_team_hierarchy();

DROP TRIGGER IF EXISTS trigger_recalc_hierarchy_on_delete ON "ClientTeam";
CREATE TRIGGER trigger_recalc_hierarchy_on_delete
AFTER DELETE ON "ClientTeam"
FOR EACH ROW
EXECUTE FUNCTION recalculate_client_team_hierarchy();

-- =====================================================
-- STEP 3: INITIAL POPULATION OF HIERARCHY
-- =====================================================
-- Since we already have ClientTeam data, manually populate the hierarchy

INSERT INTO "ClientTeamHierarchy" (
  client_id, employee_id, reports_to, hierarchy_level,
  direct_report_count, total_report_count, department, updated_at
)
WITH RECURSIVE hierarchy AS (
  -- Base case: top-level employees (VP who reports to CEO)
  SELECT 
    ct.client_id,
    ct.employee_id,
    ct.manager_employee_id as reports_to,
    0 as hierarchy_level,
    COALESCE(ct.specialization, ct.department) as department
  FROM "ClientTeam" ct
  WHERE (ct.manager_employee_id IS NULL OR ct.manager_employee_id = 'CEO')
    AND ct.is_active = true
  
  UNION ALL
  
  -- Recursive case: employees who report to someone
  SELECT 
    ct.client_id,
    ct.employee_id,
    ct.manager_employee_id as reports_to,
    h.hierarchy_level + 1 as hierarchy_level,
    COALESCE(ct.specialization, ct.department) as department
  FROM "ClientTeam" ct
  INNER JOIN hierarchy h ON ct.manager_employee_id = h.employee_id
  WHERE ct.is_active = true
),
direct_counts AS (
  -- Count direct reports for each manager
  SELECT 
    manager_employee_id,
    COUNT(*) as direct_count
  FROM "ClientTeam"
  WHERE manager_employee_id IS NOT NULL
    AND manager_employee_id != 'CEO'
    AND is_active = true
  GROUP BY manager_employee_id
),
total_counts AS (
  -- Calculate total reports (direct + indirect) using recursive CTE
  WITH RECURSIVE reports AS (
    -- Direct reports
    SELECT 
      manager_employee_id as manager_id,
      employee_id,
      client_id,
      1 as level
    FROM "ClientTeam"
    WHERE manager_employee_id IS NOT NULL
      AND manager_employee_id != 'CEO'
      AND is_active = true
    
    UNION ALL
    
    -- Indirect reports (reports of reports)
    SELECT 
      r.manager_id,
      ct.employee_id,
      ct.client_id,
      r.level + 1
    FROM reports r
    INNER JOIN "ClientTeam" ct ON r.employee_id = ct.manager_employee_id AND r.client_id = ct.client_id
    WHERE ct.is_active = true
      AND r.level < 10  -- Prevent infinite loops
  )
  SELECT 
    manager_id,
    COUNT(DISTINCT employee_id) as total_count
  FROM reports
  GROUP BY manager_id
)
SELECT 
  h.client_id,
  h.employee_id,
  h.reports_to,
  h.hierarchy_level,
  COALESCE(dc.direct_count, 0) as direct_report_count,
  COALESCE(tc.total_count, 0) as total_report_count,
  h.department,
  NOW() as updated_at
FROM hierarchy h
LEFT JOIN direct_counts dc ON h.employee_id = dc.manager_employee_id
LEFT JOIN total_counts tc ON h.employee_id = tc.manager_id
ORDER BY h.hierarchy_level, h.employee_id;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check hierarchy for ScalePoint
SELECT 
  cth.employee_id,
  ct.name,
  cth.reports_to,
  cth.hierarchy_level,
  cth.direct_report_count,
  cth.total_report_count,
  cth.department
FROM "ClientTeamHierarchy" cth
JOIN "ClientTeam" ct ON cth.client_id = ct.client_id AND cth.employee_id = ct.employee_id
WHERE cth.client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
ORDER BY cth.hierarchy_level, cth.employee_id;

-- Check org structure summary
SELECT 
  hierarchy_level,
  COUNT(*) as employee_count,
  SUM(direct_report_count) as total_direct_reports,
  AVG(direct_report_count) as avg_direct_reports
FROM "ClientTeamHierarchy"
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
GROUP BY hierarchy_level
ORDER BY hierarchy_level;

-- Check top-level managers and their teams
SELECT 
  cth.employee_id,
  ct.name,
  ct.title,
  cth.direct_report_count,
  cth.total_report_count
FROM "ClientTeamHierarchy" cth
JOIN "ClientTeam" ct ON cth.client_id = ct.client_id AND cth.employee_id = ct.employee_id
WHERE cth.client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
  AND cth.direct_report_count > 0
ORDER BY cth.total_report_count DESC;

-- =====================================================
-- PERFORMANCE NOTES
-- =====================================================
-- The trigger recalculates the ENTIRE hierarchy for the affected client
-- when team structure changes. This is acceptable because:
--
-- 1. Team structure changes are infrequent (not a high-write table)
-- 2. Recalculating everything is simpler and more reliable than incremental updates
-- 3. Hierarchy queries become O(1) lookups instead of O(n) recursive queries
-- 4. For large clients (1000+ employees), consider batching updates
--
-- If you need to disable triggers temporarily for bulk updates:
-- ALTER TABLE "ClientTeam" DISABLE TRIGGER trigger_recalc_hierarchy_on_update;
-- -- Do your bulk updates
-- ALTER TABLE "ClientTeam" ENABLE TRIGGER trigger_recalc_hierarchy_on_update;
-- -- Then manually refresh:
-- SELECT recalculate_client_team_hierarchy() FROM "ClientTeam" LIMIT 1;

