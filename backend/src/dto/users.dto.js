import { supabase } from '../dbConfig/dbConfig.js';
import UsersModel from '../model/users.model.js';

const TABLE = 'Users';

const FIELD_MAP = {
  userId: 'user_id',
  passwordHash: 'password_hash',
  isActive: 'is_active',
  emailVerified: 'email_verified',
  emailVerificationToken: 'email_verification_token',
  lastLoginAt: 'last_login_at',
  failedLoginAttempts: 'failed_login_attempts',
  lockedUntil: 'locked_until',
  passwordResetToken: 'password_reset_token',
  passwordResetExpiresAt: 'password_reset_expires_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const toDbPayload = (fields = {}) => {
  const payload = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    payload[FIELD_MAP[key] ?? key] = value;
  }
  return payload;
};

const mapRow = (row) => (row ? UsersModel.fromRow(row) : null);

const nowIso = () => new Date().toISOString();

class UsersDAO {
  /**
   * Retrieve every user (optionally filtered by status).
   */
  static async list({ isActive, limit = 1000 } = {}) {
    let query = supabase.from(TABLE).select('*').limit(limit);
    if (typeof isActive === 'boolean') {
      query = query.eq('is_active', isActive);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch users: ${error.message}`);
    return data.map((row) => UsersModel.fromRow(row));
  }

  static async findById(userId) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch user '${userId}': ${error.message}`);
    return mapRow(data);
  }

  static async findByEmail(email) {
    if (!email) return null;
    const normalized = String(email).trim().toLowerCase();
    if (!normalized) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', normalized)
      .maybeSingle();

    if (error)
      throw new Error(`Failed to fetch user with email '${normalized}': ${error.message}`);
    return mapRow(data);
  }


  static async findByIds(userIds = []) {
    const ids = Array.from(new Set((userIds || []).filter(Boolean)));
    if (!ids.length) return [];

    const { data, error } = await supabase.from(TABLE).select('*').in('user_id', ids);

    if (error) throw new Error(`Failed to fetch users by ids: ${error.message}`);
    return data.map(mapRow);
  }


  static async findByVerificationToken(token) {
    if (!token) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email_verification_token', token)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch verification token: ${error.message}`);
    return mapRow(data);
  }

  static async findByPasswordResetToken(token, { onlyValid = true } = {}) {
    if (!token) return null;

    let query = supabase.from(TABLE).select('*').eq('password_reset_token', token);
    if (onlyValid) {
      query = query.gte('password_reset_expires_at', nowIso());
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Failed to fetch reset token: ${error.message}`);
    return mapRow(data);
  }

  static async create(userData = {}) {
    const email = userData.email?.trim().toLowerCase();
    const passwordHash = userData.password_hash ?? userData.passwordHash;

    if (!email || !passwordHash) {
      throw new Error('Email and password hash are required to create a user');
    }

    const payload = toDbPayload({
      ...userData,
      email,
      password_hash: passwordHash,
    });

    payload.is_active ??= true;
    payload.email_verified ??= false;
    payload.failed_login_attempts ??= 0;

    const timestamp = nowIso();
    payload.created_at ??= timestamp;
    payload.updated_at ??= timestamp;

    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(userId, updates = {}) {
    if (!userId) throw new Error('User ID is required to update a user');
    const payload = toDbPayload(updates);

    if (!Object.keys(payload).length) {
      return this.findById(userId);
    }

    payload.updated_at = nowIso();

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user '${userId}': ${error.message}`);
    return mapRow(data);
  }

  static async markEmailVerified(userId) {
    if (!userId) throw new Error('User ID is required to verify email');

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        email_verified: true,
        email_verification_token: null,
        updated_at: nowIso(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to mark email verified: ${error.message}`);
    return mapRow(data);
  }

  static async setPasswordResetToken(userId, token, expiresAt) {
    if (!userId || !token) {
      throw new Error('User ID and reset token are required');
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        password_reset_token: token,
        password_reset_expires_at: expiresAt ?? null,
        updated_at: nowIso(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to set reset token: ${error.message}`);
    return mapRow(data);
  }

  static async clearPasswordResetToken(userId) {
    if (!userId) throw new Error('User ID is required');

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        password_reset_token: null,
        password_reset_expires_at: null,
        updated_at: nowIso(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to clear reset token: ${error.message}`);
    return mapRow(data);
  }

  static async recordSuccessfulLogin(userId) {
    if (!userId) throw new Error('User ID is required to record login');

    const timestamp = nowIso();
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        last_login_at: timestamp,
        failed_login_attempts: 0,
        locked_until: null,
        updated_at: timestamp,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to record login: ${error.message}`);
    return mapRow(data);
  }

  static async recordFailedLogin(
    userId,
    { lockAfter = 5, lockDurationMinutes = 15 } = {}
  ) {
    if (!userId) throw new Error('User ID is required to record failed login');

    const current = await this.findById(userId);
    if (!current) return null;

    const attempts = (current.failedLoginAttempts ?? 0) + 1;
    const payload = {
      failed_login_attempts: attempts,
      updated_at: nowIso(),
    };

    if (lockAfter && attempts >= lockAfter) {
      const lockUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000).toISOString();
      payload.locked_until = lockUntil;
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to record failed login: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(userId) {
    if (!userId) throw new Error('User ID is required to delete a user');

    const { error } = await supabase.from(TABLE).delete().eq('user_id', userId);
    if (error) throw new Error(`Failed to delete user '${userId}': ${error.message}`);
    return true;
  }
}

export default UsersDAO;
