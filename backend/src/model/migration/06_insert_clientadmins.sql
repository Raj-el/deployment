-- =====================================================
-- 06. POPULATE CLIENTADMINS TABLE  
-- =====================================================
-- ClientAdmins manage system settings for their client company
-- They have admin access to settings, users, integrations, etc.
-- BUT they do NOT have access to customer business data
-- Separation of duties from ClientTeam members
--
-- For ScalePoint, we create dedicated admin accounts:
-- - admin@scalepoint.com (primary admin)
-- - admin1@scalepoint.com (secondary admin)
-- - admin2@scalepoint.com (secondary admin)
--
-- Must be inserted AFTER Users and Clients tables

INSERT INTO "ClientAdmins" (
  user_id, client_id, name, is_primary, is_active,
  created_at, updated_at
) VALUES
-- Primary Admin
(
  (SELECT user_id FROM "Users" WHERE email = 'admin@scalepoint.com'),
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'ScalePoint Administrator',
  true,
  true,
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
-- Secondary Admin 1
(
  (SELECT user_id FROM "Users" WHERE email = 'admin1@scalepoint.com'),
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'ScalePoint Administrator 1',
  false,
  true,
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
),
-- Secondary Admin 2
(
  (SELECT user_id FROM "Users" WHERE email = 'admin2@scalepoint.com'),
  (SELECT client_id FROM "Clients" WHERE slug = 'scalepoint'),
  'ScalePoint Administrator 2',
  false,
  true,
  '2024-01-01 00:00:00+00',
  '2024-01-01 00:00:00+00'
);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
SELECT 
  ca.client_admin_id,
  ca.name,
  u.email,
  ca.is_primary,
  ca.is_active,
  c.name as client_name
FROM "ClientAdmins" ca
JOIN "Users" u ON ca.user_id = u.user_id
JOIN "Clients" c ON ca.client_id = c.client_id
ORDER BY ca.is_primary DESC, u.email;

-- =====================================================
-- NOTES
-- =====================================================
-- Client Admins can:
-- ✅ Manage user accounts and roles
-- ✅ Configure client settings
-- ✅ Manage integrations
-- ✅ View system usage and billing
-- ✅ Configure job functions and permissions
--
-- Client Admins CANNOT:
-- ❌ View customer account details
-- ❌ Access customer health scores
-- ❌ View customer communications
-- ❌ Access customer success metrics
--
-- This separation ensures that admins who manage
-- technical/system settings don't automatically get
-- access to sensitive customer business data.