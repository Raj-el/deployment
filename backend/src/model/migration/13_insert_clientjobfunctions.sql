-- =====================================================
-- 13. POPULATE CLIENTJOBFUNCTIONS TABLE
-- =====================================================
-- ClientJobFunctions defines the job roles at ScalePoint
-- These determine what permissions each role has via RolePermissions
--
-- Categories:
-- • executive: VP level leadership
-- • management: Directors who manage teams
-- • individual_contributor: CSMs who manage accounts
--
-- Must be inserted AFTER Clients table
-- =====================================================

INSERT INTO "ClientJobFunctions" (
  client_id, function_name, function_category, description,
  is_default, is_active, created_by, created_at, updated_at
) VALUES
-- =====================================================
-- EXECUTIVE LEVEL
-- =====================================================
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'VP of Customer Success',
  'executive',
  'Executive leadership responsible for overall CS strategy, team development, and revenue retention goals. Full access to all customer data, team metrics, and strategic planning.',
  true,
  true,
  (SELECT user_id FROM "Users" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),

-- =====================================================
-- MANAGEMENT LEVEL - DIRECTORS
-- =====================================================
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Director of Enterprise Success',
  'management',
  'Manages Enterprise CSM team. Oversees high-touch enterprise accounts, strategic relationships, and team capacity planning. Access to enterprise segment metrics and team performance data.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Director of Mid-Market Success',
  'management',
  'Manages Mid-Market CSM team. Oversees growth-focused accounts, expansion strategies, and team development. Access to mid-market segment metrics and team performance data.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Director of SMB Success',
  'management',
  'Manages SMB CSM team. Oversees high-velocity SMB accounts, automation initiatives, and scalable success programs. Access to SMB segment metrics and team performance data.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Director of Strategic Accounts',
  'management',
  'Manages strategic enterprise accounts and executive relationships. Focuses on high-value accounts requiring C-level engagement. Access to strategic account metrics and executive stakeholder management tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),

-- =====================================================
-- INDIVIDUAL CONTRIBUTORS - ENTERPRISE CSMs
-- =====================================================
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Senior Enterprise CSM',
  'individual_contributor',
  'Manages 5-10 high-touch enterprise accounts. Drives strategic value, expansion, and executive relationships. Access to assigned account data, health metrics, and customer communications.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Mid-Level Enterprise CSM',
  'individual_contributor',
  'Manages 5-10 enterprise accounts. Develops enterprise customer success skills and builds strategic relationships. Access to assigned account data and standard enterprise CS tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),

-- =====================================================
-- INDIVIDUAL CONTRIBUTORS - MID-MARKET CSMs
-- =====================================================
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Mid-Level Mid-Market CSM',
  'individual_contributor',
  'Manages 20-30 mid-market accounts. Balances high-touch support with efficiency. Drives adoption, expansion, and renewal. Access to assigned account data and standard CS tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Junior Mid-Market CSM',
  'individual_contributor',
  'Manages 20-30 mid-market accounts with guidance from senior team members. Focuses on onboarding, adoption, and building CS fundamentals. Access to assigned account data and core CS tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),

-- =====================================================
-- INDIVIDUAL CONTRIBUTORS - SMB CSMs
-- =====================================================
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'SMB Team Lead',
  'individual_contributor',
  'Manages 50-60 SMB accounts with tech-touch model. Leads SMB initiatives, creates scalable programs, and mentors junior CSMs. Access to SMB account data and automation tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'Junior SMB CSM',
  'individual_contributor',
  'Manages 50-60 SMB accounts using tech-touch and digital engagement. Focuses on scaled customer success and efficient account management. Access to SMB account data and digital engagement tools.',
  true,
  true,
  (SELECT user_id FROM \"Users\" WHERE email = 'admin@scalepoint.com'),
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- List all job functions
SELECT 
  job_function_id,
  function_name,
  function_category,
  description,
  is_active,
  created_by,
  (SELECT email FROM "Users" WHERE user_id = jf.created_by) as created_by_email
FROM "ClientJobFunctions" jf
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
ORDER BY 
  CASE function_category 
    WHEN 'executive' THEN 1
    WHEN 'management' THEN 2
    WHEN 'individual_contributor' THEN 3
  END,
  function_name;

-- Count by category
SELECT 
  function_category,
  COUNT(*) as function_count
FROM "ClientJobFunctions"
WHERE client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
  AND is_active = true
GROUP BY function_category
ORDER BY 
  CASE function_category 
    WHEN 'executive' THEN 1
    WHEN 'management' THEN 2
    WHEN 'individual_contributor' THEN 3
  END;

-- =====================================================
-- NOTES
-- =====================================================
-- Job Function Categories:
--
-- EXECUTIVE (1 role):
-- • VP of Customer Success
--   → Full system access, strategic oversight
--
-- MANAGEMENT (4 roles):
-- • Director of Enterprise Success
-- • Director of Mid-Market Success
-- • Director of SMB Success
-- • Director of Strategic Accounts
--   → Team management, segment metrics, performance oversight
--
-- INDIVIDUAL CONTRIBUTORS (6 roles):
-- • Senior Enterprise CSM (5-10 accounts)
-- • Mid-Level Enterprise CSM (5-10 accounts)
-- • Mid-Level Mid-Market CSM (20-30 accounts)
-- • Junior Mid-Market CSM (20-30 accounts)
-- • SMB Team Lead (50-60 accounts)
-- • Junior SMB CSM (50-60 accounts)
--   → Direct account management, customer-facing work
--
-- Permission Scope:
-- ✅ Executive: Access to ALL accounts and team data
-- ✅ Management: Access to team members' accounts and team metrics
-- ✅ Individual Contributors: Access to ASSIGNED accounts only
--
-- Next Steps:
-- 1. Create RolePermissions to define what each function can do
-- 2. Update ClientTeam records to link job_function_id
-- 3. Use job_function_id for permission checks in application
--
-- The separation of job functions from titles allows:
-- • Clients to customize role names (e.g., "Customer Success Champion")
-- • Standard permission sets regardless of title
-- • Role-based access control without hardcoding titles
