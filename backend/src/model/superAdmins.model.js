export default class SuperAdminsModel  {
  constructor(fields = {}) {
    this.superadminId = fields.superadmin_id ?? null;
    this.userId = fields.user_id ?? null;
    this.name = fields.name ?? null;
    this.department = fields.department ?? null;
    this.phone = fields.phone ?? null;
    this.isActive = fields.is_active ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

    static fromRow(row) {
        return row ? new SuperAdminsModel(row) : null;
    }

    toJSON() {
        return { ...this };
    }
}   