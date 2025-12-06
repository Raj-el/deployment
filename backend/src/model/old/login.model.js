export default class LoginModel {
  constructor({ email, password, created_at }) {
    this.email = email;
    this.password = password; // hashed password
    this.createdAt = created_at ? new Date(created_at) : new Date();
  }

  // Map a DB row to the domain model
  static fromRow(row) {
    if (!row) return null;
    return new LoginModel({
      email: row.email,
      password: row.password,
      created_at: row.created_at,
    });
  }

  // Return a JSON-safe representation (omit sensitive fields by default)
  toJSON({ includePassword = false } = {}) {
    const base = {
      email: this.email,
      createdAt: this.createdAt,
    };
    if (includePassword) base.password = this.password;
    return base;
  }
}
