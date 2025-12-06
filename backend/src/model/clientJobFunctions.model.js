export default class ClientJobFunctionsModel {
  constructor(fields = {}) {
    this.jobFunctionId = fields.job_function_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.functionName = fields.function_name ?? null;
    this.functionCategory = fields.function_category ?? null;
    this.description = fields.description ?? null;
    this.isDefault = fields.is_default ?? null;
    this.isActive = fields.is_active ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
    this.createdBy = fields.created_by ?? null;
  }

  static fromRow(row) {
    return row ? new ClientJobFunctionsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
