export default class UsersModel {
  constructor(fields = {}) {
    this.userId = fields.user_id ?? null;
    this.email = fields.email ?? null;
    this.passwordHash = fields.password_hash ?? null;
    this.isActive = fields.is_active ?? null;
    this.emailVerified = fields.email_verified ?? null;
    this.emailVerificationToken = fields.email_verification_token ?? null;
    this.lastLoginAt = fields.last_login_at ?? null;
    this.failedLoginAttempts = fields.failed_login_attempts ?? null;
    this.lockedUntil = fields.locked_until ?? null;
    this.passwordResetToken = fields.password_reset_token ?? null;
    this.passwordResetExpiresAt = fields.password_reset_expires_at ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new UsersModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}