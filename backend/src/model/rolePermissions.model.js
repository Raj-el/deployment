export default class RolePermissionsModel {
  constructor(fields = {}) {
    this.rolePermissionId = fields.role_permission_id ?? null;
    this.jobFunctionId = fields.job_function_id ?? null;
    this.resourceType = fields.resource_type ?? null;
    this.action = fields.action ?? null;
    this.scope = fields.scope ?? null;
    this.conditions = fields.conditions ?? null;
    this.createdAt = fields.created_at ?? null;
    this.createdBy = fields.created_by ?? null;
  }

  static fromRow(row) {
    return row ? new RolePermissionsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}