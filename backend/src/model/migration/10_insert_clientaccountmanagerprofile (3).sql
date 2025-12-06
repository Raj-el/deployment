-- =====================================================
-- 09. POPULATE CLIENTACCOUNTMANAGERPROFILE TABLE
-- =====================================================
-- ClientAccountManagerProfile tracks each CSM's portfolio capacity,
-- specialization, and account management preferences.
--
-- IMPORTANT: Only creates profiles for team members where 
-- is_account_manager = true in ClientTeam table
--
-- Must be inserted AFTER ClientTeam table is populated
-- =====================================================

INSERT INTO "ClientAccountManagerProfile" (
  client_id, employee_id, current_accounts, max_accounts,
  account_type_preference, specialization, avg_account_arr,
  total_portfolio_arr, is_accepting_accounts, last_assignment_date
) VALUES
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E001',
  5, 5, 'enterprise', 'Enterprise Technology',
  4905634.0, 24528170.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E002',
  5, 5, 'enterprise', 'Enterprise Media',
  2455117.6, 12275588.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E003',
  5, 5, 'enterprise', 'Enterprise Technology',
  3532587.8, 17662939.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E004',
  5, 5, 'enterprise', 'Enterprise Energy',
  4696875.4, 23484377.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E005',
  5, 5, 'enterprise', 'Enterprise Manufacturing',
  4353192.6, 21765963.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E006',
  5, 5, 'enterprise', 'Enterprise Technology',
  4796352.2, 23981761.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E007',
  5, 5, 'enterprise', 'Enterprise Government',
  3160120.4, 15800602.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E008',
  5, 5, 'enterprise', 'Enterprise Energy',
  3003597.2, 15017986.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E009',
  5, 5, 'enterprise', 'Enterprise Media',
  2176269.4, 10881347.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E010',
  5, 5, 'enterprise', 'Enterprise Technology',
  3381910.4, 16909552.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E011',
  5, 5, 'enterprise', 'Enterprise Retail',
  3257533.0, 16287665.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E012',
  5, 5, 'enterprise', 'Enterprise Government',
  4129043.4, 20645217.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E013',
  5, 5, 'enterprise', 'Enterprise Manufacturing',
  2293470.2, 11467351.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E014',
  5, 5, 'enterprise', 'Enterprise Education',
  4606524.4, 23032622.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E015',
  5, 5, 'enterprise', 'Enterprise Government',
  2838728.6, 14193643.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E016',
  5, 5, 'enterprise', 'Enterprise Retail',
  1981895.2, 9909476.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E017',
  5, 5, 'enterprise', 'Enterprise Telecommunications',
  1831428.6, 9157143.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E018',
  5, 5, 'enterprise', 'Enterprise Manufacturing',
  3737181.0, 18685905.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E019',
  5, 5, 'enterprise', 'Enterprise Media',
  2629839.8, 13149199.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E020',
  5, 5, 'enterprise', 'Enterprise Manufacturing',
  3944417.4, 19722087.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E021',
  5, 5, 'enterprise', 'Enterprise Manufacturing',
  4513032.6, 22565163.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E022',
  5, 5, 'enterprise', 'Enterprise Healthcare',
  1663974.0, 8319870.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E023',
  5, 5, 'enterprise', 'Enterprise Retail',
  1283384.8, 6416924.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E024',
  5, 5, 'enterprise', 'Enterprise Energy',
  1562870.8, 7814354.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E025',
  5, 5, 'enterprise', 'Enterprise Retail',
  984306.4, 4921532.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E026',
  5, 5, 'enterprise', 'Enterprise Energy',
  1175977.6, 5879888.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E027',
  5, 5, 'enterprise', 'Enterprise Energy',
  799719.4, 3998597.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E028',
  5, 5, 'enterprise', 'Enterprise Energy',
  1426086.4, 7130432.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E029',
  5, 5, 'enterprise', 'Enterprise Financial Services',
  1358549.2, 6792746.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-E030',
  5, 5, 'enterprise', 'Enterprise Technology',
  619903.6, 3099518.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M001',
  30, 30, 'mid_market', 'Mid-Market Retail',
  474718.13, 14241544.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M002',
  30, 30, 'mid_market', 'Mid-Market Technology',
  354080.07, 10622402.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M003',
  30, 30, 'mid_market', 'Mid-Market Retail',
  435774.2, 13073226.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M004',
  30, 30, 'mid_market', 'Mid-Market Education',
  303246.03, 9097381.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M005',
  30, 30, 'mid_market', 'Mid-Market Technology',
  397796.37, 11933891.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M006',
  30, 30, 'mid_market', 'Mid-Market Retail',
  249645.57, 7489367.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M007',
  30, 30, 'mid_market', 'Mid-Market Education',
  160123.6, 4803708.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M008',
  30, 30, 'mid_market', 'Mid-Market Professional Services',
  207175.47, 6215264.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M009',
  30, 30, 'mid_market', 'Mid-Market Manufacturing',
  109482.83, 3284485.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-M010',
  30, 30, 'mid_market', 'Mid-Market Manufacturing',
  71946.77, 2158403.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-S001',
  60, 60, 'smb', 'SMB Professional Services',
  46346.57, 2780794.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-S002',
  60, 60, 'smb', 'SMB High-Velocity',
  36688.83, 2201330.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-S003',
  60, 60, 'smb', 'SMB Technology Startups',
  10455.42, 627325.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-S004',
  60, 60, 'smb', 'SMB Professional Services',
  28519.02, 1711141.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'CSM-S005',
  60, 60, 'smb', 'SMB Professional Services',
  19032.92, 1141975.0, false, '2024-10-01'
),
(
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'DIR-004',
  0, 5, 'enterprise', 'Strategic Enterprise Accounts & Executive Relationships',
  0.0, 0.0, true, '2024-10-01'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Summary by account type
SELECT 
  account_type_preference,
  COUNT(*) as csm_count,
  SUM(current_accounts) as total_accounts,
  SUM(total_portfolio_arr) as total_arr,
  AVG(current_accounts) as avg_accounts_per_csm,
  AVG(total_portfolio_arr) as avg_arr_per_csm
FROM "ClientAccountManagerProfile"
GROUP BY account_type_preference
ORDER BY 
  CASE account_type_preference 
    WHEN 'enterprise' THEN 1 
    WHEN 'mid_market' THEN 2 
    WHEN 'smb' THEN 3 
  END;

-- Capacity overview
SELECT 
  account_type_preference,
  COUNT(*) as csm_count,
  SUM(current_accounts) as current_total,
  SUM(max_accounts) as max_capacity,
  ROUND(AVG(current_accounts::decimal / NULLIF(max_accounts, 0) * 100), 1) as avg_utilization_pct,
  COUNT(*) FILTER (WHERE is_accepting_accounts = false) as at_capacity_count
FROM "ClientAccountManagerProfile"
GROUP BY account_type_preference
ORDER BY 
  CASE account_type_preference 
    WHEN 'enterprise' THEN 1 
    WHEN 'mid_market' THEN 2 
    WHEN 'smb' THEN 3 
  END;

-- Specialization distribution
SELECT 
  specialization,
  COUNT(*) as csm_count,
  SUM(current_accounts) as total_accounts,
  SUM(total_portfolio_arr) as total_arr
FROM "ClientAccountManagerProfile"
GROUP BY specialization
ORDER BY total_arr DESC;

-- Top performing CSMs by portfolio value
SELECT 
  ct.name,
  ct.employee_id,
  ct.level,
  camp.account_type_preference,
  camp.current_accounts,
  camp.total_portfolio_arr,
  camp.avg_account_arr,
  CASE WHEN camp.is_accepting_accounts THEN 'Yes' ELSE 'No' END as accepting_new
FROM "ClientAccountManagerProfile" camp
JOIN "ClientTeam" ct ON camp.client_id = ct.client_id AND camp.employee_id = ct.employee_id
ORDER BY camp.total_portfolio_arr DESC
LIMIT 20;

-- Check that only account managers have profiles
SELECT 
  ct.employee_id,
  ct.name,
  ct.title,
  ct.is_account_manager,
  CASE WHEN camp.employee_id IS NOT NULL THEN 'Has Profile' ELSE 'No Profile' END as profile_status
FROM "ClientTeam" ct
LEFT JOIN "ClientAccountManagerProfile" camp 
  ON ct.client_id = camp.client_id AND ct.employee_id = camp.employee_id
WHERE ct.client_id = (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint')
ORDER BY ct.is_account_manager DESC, ct.employee_id;

-- =====================================================
-- NOTES
-- =====================================================
-- Account Type Preferences:
-- • 'enterprise' - High-touch, strategic accounts (typically 5-10 accounts max)
-- • 'mid_market' - Growth-focused accounts (typically 20-40 accounts)
-- • 'smb' - High-velocity, tech-touch accounts (typically 50-100 accounts)
--
-- Capacity Management:
-- • current_accounts: Number of active accounts currently assigned
-- • max_accounts: Maximum capacity based on segment and CSM experience
-- • is_accepting_accounts: Whether CSM can take new assignments
--
-- Important Business Rule:
-- ✅ Profiles are ONLY created for team members with is_account_manager = true
-- ✅ Directors and VPs who don't manage accounts directly have NO profile
-- ✅ Exception: DIR-004 (Director of Strategic Accounts) manages 5 strategic accounts
--
-- Uses:
-- ✅ Load balancing and capacity planning
-- ✅ New account assignment routing
-- ✅ Territory and portfolio analysis
-- ✅ Workload distribution optimization
-- ✅ Hiring and capacity forecasting
