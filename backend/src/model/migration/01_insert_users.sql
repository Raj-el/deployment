-- =====================================================
-- POPULATE USERS TABLE - ALL SYSTEM USERS
-- =====================================================
-- This script creates user records for ALL users in the system:
--   - 1 SuperAdmin (from superadmins CSV)
--   - 30 Experts (from experts database CSV) 
--   - 50 Client Team Members (from CS team CSV)
--   - 3 Client Admins (admin@scalepoint.com, admin1@, admin2@)
--   - 2 Test Users
-- Total: 86 unique users
--
-- INVITATION FLOW:
-- Users are created with placeholder passwords that cannot be used for login.
-- To invite a user:
--   1. Generate a secure random token
--   2. UPDATE Users SET password_reset_token = 'token', 
--      password_reset_expires_at = NOW() + INTERVAL '24 hours' 
--      WHERE email = 'user@example.com'
--   3. Send invitation email with link: https://app.com/set-password?token=...
--   4. User sets password, which updates password_hash and sets email_verified = true
-- =====================================================

INSERT INTO "Users" (email, password_hash, is_active, email_verified, created_at, updated_at) VALUES
('admin@admin.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:11:01.132774+00', '2025-10-25 20:11:01.132774+00'),
('alex.rodriguez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('alexandra.williams@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('amanda.foster.sales@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('amanda.robinson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('andrew.lewis@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('andrew.miller@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('andrew.williams@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('barbara.campbell@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('betty.miller@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('betty.thomas@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('brian.thompson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('carol.davis@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('carol.gonzalez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('christopher.lee@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('christopher.martinez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('christopher.miller@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('christopher.wright@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('cynthia.adams@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('daniel.lee@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('david.anderson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('david.garcia@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('david.kim@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('dorothy.martin@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('elizabeth.garcia@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('elizabeth.hill@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('emily.chen@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('emily.hall@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('emily.white@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('helen.hill@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('james.baker@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('james.hill@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('james.wilson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('jennifer.rodriguez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('jennifer.taylor@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('jennifer.walsh@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('jessica.clark@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('jessica.perez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('jessica.wilson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('joseph.johnson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('joshua.torres@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('kevin.martinez.sales@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('kevin.robinson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('laura.martinez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('linda.martin@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('lisa.garcia@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('lisa.park@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('marcus.thompson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('maria.gonzalez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('mark.johnson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('matthew.baker@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('matthew.robinson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('melissa.moore@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('michael.anderson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('michael.chen@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('michael.park@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('michael.wang@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('michelle.rodriguez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('newuser@example.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-26 00:16:48.340422+00', '2025-10-26 00:16:48.340422+00'),
('rachel.brown@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('rachel.thompson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('rebecca.thomas@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('richard.garcia@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('robert.chen@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('robert.johnson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('ruth.anderson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('ruth.sanchez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('ryan.davis@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('sandra.rodriguez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sarah.chen@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sarah.kim@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('sarah.king@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sarah.martinez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('sharon.johnson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sharon.miller@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sharon.scott@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('sharon.taylor@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('steven.garcia@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('superadmin@setucs.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('test1@example.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:13:21.259903+00', '2025-10-25 20:13:21.259903+00'),
('thomas.anderson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 20:00:00+00', '2025-10-25 20:00:00+00'),
('thomas.nelson@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
('william.perez@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2025-10-25 07:42:30.951605+00', '2025-10-25 07:42:30.951605+00'),
-- Client Admin Users (for ScalePoint)
('admin@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),
('admin1@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),
('admin2@scalepoint.com', '$2b$10$PLACEHOLDER.HASH.CANNOT.BE.USED.FOR.LOGIN.INVITE.REQUIRED', true, false, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00');

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email LIKE '%scalepoint.com%' THEN 1 END) as scalepoint_users,
    COUNT(CASE WHEN email LIKE '%setucs.com%' THEN 1 END) as setucs_users,
    COUNT(CASE WHEN email LIKE '%example.com%' THEN 1 END) as test_users
FROM "Users";

-- =====================================================
-- EXAMPLE: SENDING AN INVITATION
-- =====================================================
-- To invite a user, generate a secure token and update their record:
/*
UPDATE "Users" 
SET 
    password_reset_token = 'securely-generated-random-token-here',
    password_reset_expires_at = NOW() + INTERVAL '24 hours'
WHERE email = 'user@example.com';

-- Send email with link: https://yourapp.com/set-password?token=securely-generated-random-token-here

-- When user completes password setup:
UPDATE "Users"
SET
    password_hash = 'new-bcrypt-hashed-password',
    email_verified = true,
    password_reset_token = NULL,
    password_reset_expires_at = NULL,
    updated_at = NOW()
WHERE email = 'user@example.com' 
  AND password_reset_token = 'securely-generated-random-token-here'
  AND password_reset_expires_at > NOW();
*/