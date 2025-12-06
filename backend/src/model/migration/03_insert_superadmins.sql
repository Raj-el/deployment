-- =====================================================
-- 03. POPULATE SUPERADMINS TABLE
-- =====================================================
-- SuperAdmins are platform administrators from setucs.com
-- They have full system access across all clients
-- Must be inserted AFTER Users table is populated

INSERT INTO "SuperAdmins" (
  user_id, name, department, is_active, created_at, updated_at
) VALUES (
  (SELECT user_id FROM "Users" WHERE email = 'superadmin@setucs.com'),
  'System Owner',
  'Platform Administration',
  true,
  '2025-10-25 20:00:00+00',
  '2025-10-25 20:00:00+00'
);

-- Verification
SELECT sa.*, u.email 
FROM "SuperAdmins" sa
JOIN "Users" u ON sa.user_id = u.user_id;
