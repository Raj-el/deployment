export default class ClientApiKeysModel {
  constructor(fields = {}) {
    this.apiKeyId = fields.api_key_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.name = fields.name ?? null;
    this.description = fields.description ?? null;
    this.hashedKey = fields.hashed_key ?? null;
    this.scopes = fields.scopes ?? [];
    this.environment = fields.environment ?? null;
    this.lastUsedAt = fields.last_used_at ?? null;
    this.createdBy = fields.created_by ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
    this.revokedAt = fields.revoked_at ?? null;
    this.revokedBy = fields.revoked_by ?? null;
  }

  static fromRow(row) {
    return row ? new ClientApiKeysModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
