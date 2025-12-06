export default class ClientAdminsModel {
  constructor(fields = {}) {
    this.clientAdminId = fields.client_admin_id ?? null;
    this.userId = fields.user_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.name = fields.name ?? null;
    this.phone = fields.phone ?? null;
    this.isPrimary = fields.is_primary ?? null;
    this.isActive = fields.is_active ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientAdminsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}