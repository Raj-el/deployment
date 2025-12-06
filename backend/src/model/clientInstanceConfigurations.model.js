export default class ClientInstanceConfigurationsModel {
  constructor(fields = {}) {
    this.configId = fields.config_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.configKey = fields.config_key ?? null;
    this.configValue = fields.config_value ?? null;
    this.description = fields.description ?? null;
    this.isLocked = fields.is_locked ?? null;
    this.updatedBy = fields.updated_by ?? null;
    this.updatedAt = fields.updated_at ?? null;
    this.createdAt = fields.created_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientInstanceConfigurationsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
