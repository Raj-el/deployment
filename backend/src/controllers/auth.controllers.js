import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import ClientAdminsDAO from "../dto/clientAdmins.dto.js";
import ClientTeamDAO from "../dto/clientTeam.dto.js";
import ExpertsDAO from "../dto/experts.dto.js";
import SuperAdminsDAO from "../dto/superAdmins.dto.js";
import UsersDAO from "../dto/users.dto.js";
import { resolveUserRole } from "../casbin/userRoleResolver.js";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const INVITE_TOKEN_TTL_HOURS = Number(process.env.INVITE_TOKEN_TTL_HOURS || 48);
const APP_BASE_URL = (
  process.env.APP_BASE_URL || "https://app.example.com"
).replace(/\/$/, "");

const toSafeUser = (user) => {
  if (!user) return null;
  return {
    userId: user.userId,
    email: user.email,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    lockedUntil: user.lockedUntil,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const ensureActiveMembership = async (userId) => {
  if (!userId) return null;
  const [clientAdmin, clientTeam, expert, superAdmin] = await Promise.all([
    ClientAdminsDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
    ClientTeamDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
    ExpertsDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
    SuperAdminsDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
  ]);

  if (clientAdmin[0]) return { type: "client_admin", record: clientAdmin[0] };
  if (clientTeam[0]) return { type: "client_team", record: clientTeam[0] };
  if (expert[0]) return { type: "expert", record: expert[0] };
  if (superAdmin[0]) return { type: "superadmin", record: superAdmin[0] };
  return null;
};

const resolveUserDisplayName = async (userId) => {
  if (!userId) return null;
  const membership = await ensureActiveMembership(userId);
  const rawName = membership?.record?.name;
  const trimmed = typeof rawName === "string" ? rawName.trim() : "";
  return trimmed || null;
};

const buildInviteLink = (token) =>
  `${APP_BASE_URL}/set-password?token=${token}`;

/**
 * Send an invite link to an existing user.
 * Admins trigger this to let the user set their password.
 */
export const sendInvite = async (req, res) => {
  try {
    const actorType = req.user?.type;
    if (!actorType || !["superadmin", "client_admin"].includes(actorType)) {
      return res
        .status(403)
        .json({ error: "Only superadmins or client admins can send invites" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await UsersDAO.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({
        error: `User ${normalizedEmail} is not provisioned in the system.`,
      });
    }

    const membership = await ensureActiveMembership(user.userId);
    if (!membership) {
      return res.status(400).json({
        error:
          "User exists but is not assigned to any client team, admin role, expert pool, or superadmin group.",
      });
    }

    if (actorType === "client_admin") {
      const inviterClientId = req.user?.client_id;
      const inviteeClientId = membership.record?.clientId;
      if (
        !inviterClientId ||
        !inviteeClientId ||
        inviterClientId !== inviteeClientId
      ) {
        return res
          .status(403)
          .json({
            error: "Client admins can only invite users from their tenant.",
          });
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000
    ).toISOString();

    await UsersDAO.setPasswordResetToken(user.userId, token, expiresAt);
    await UsersDAO.updateById(user.userId, {
      is_active: true,
      email_verified: false,
      locked_until: null,
      failed_login_attempts: 0,
    });

    const inviteUrl = buildInviteLink(token);
    return res.json({
      message: `Invite link generated for ${normalizedEmail}`,
      inviteUrl,
      expiresAt,
    });
  } catch (err) {
    console.error("Error sending invite:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Accept an invite by setting a password with the provided token.
 * Returns a JWT so the user is immediately logged in after completion.
 */
export const acceptInvite = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and password are required to accept invite." });
    }

    const invitee = await UsersDAO.findByPasswordResetToken(token);
    if (!invitee) {
      return res
        .status(400)
        .json({
          error:
            "Invite link is invalid or has expired. Please request a new one.",
        });
    }

    const hashed = await bcrypt.hash(password, 10);
    await UsersDAO.updateById(invitee.userId, {
      password_hash: hashed,
      email_verified: true,
      is_active: true,
      failed_login_attempts: 0,
      locked_until: null,
      password_reset_token: null,
      password_reset_expires_at: null,
    });
    await UsersDAO.clearPasswordResetToken(invitee.userId);

    const freshUser = await UsersDAO.recordSuccessfulLogin(invitee.userId);
    const roleContext = await resolveUserRole(invitee.email);
    const displayName = await resolveUserDisplayName(freshUser.userId);
    const tokenPayload = {
      user_id: freshUser.userId,
      email: freshUser.email,
      role: roleContext.role,
      company_name: roleContext.company_name,
      subject: roleContext.subject,
      type: roleContext.type,
      client_id: roleContext.client_id,
    };

    const authToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      message: "Password set successfully. Welcome aboard!",
      token: authToken,
      user: {
        ...toSafeUser(freshUser),
        ...roleContext,
        ...(displayName ? { displayName } : {}),
      },
    });
  } catch (err) {
    console.error("Error accepting invite:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login existing user
 * - Verifies credentials
 * - Issues JWT with role + company context from team_roles
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await UsersDAO.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "User is deactivated." });
    }

    if (!user.passwordHash) {
      return res
        .status(400)
        .json({ error: "User has not completed registration yet." });
    }

    if (user.lockedUntil) {
      const lockedUntilDate = new Date(user.lockedUntil);
      if (
        !Number.isNaN(lockedUntilDate.getTime()) &&
        lockedUntilDate > new Date()
      ) {
        return res
          .status(423)
          .json({
            error: `Account locked until ${lockedUntilDate.toISOString()}`,
          });
      }
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await UsersDAO.recordFailedLogin(user.userId);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const updatedUser = await UsersDAO.recordSuccessfulLogin(user.userId);
    const roleContext = await resolveUserRole(normalizedEmail);
    const displayName = await resolveUserDisplayName(updatedUser.userId);
    const tokenPayload = {
      user_id: updatedUser.userId,
      email: updatedUser.email,
      role: roleContext.role,
      company_name: roleContext.company_name,
      subject: roleContext.subject,
      type: roleContext.type,
      client_id: roleContext.client_id,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        ...toSafeUser(updatedUser),
        ...roleContext,
        ...(displayName ? { displayName } : {}),
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get logged-in user profile
 * - Requires verifyAuth middleware
 */
export const getProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const data = await UsersDAO.findByEmail(email);
    const displayName = data ? await resolveUserDisplayName(data.userId) : null;
    // include the decoded role & company from token
    const { role, company_name, subject, type, client_id } = req.user;

    return res.json({
      user: data
        ? {
            ...toSafeUser(data),
            role: role || "guest",
            company: company_name || "unknown",
            subject,
            type,
            client_id,
            ...(displayName ? { displayName } : {}),
          }
        : null,
    });
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(400).json({ error: err.message });
  }
};
