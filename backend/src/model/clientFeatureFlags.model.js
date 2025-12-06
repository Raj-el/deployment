export default class ClientFeatureFlagsModel {
  constructor(fields = {}) {
    this.featureFlagId = fields.feature_flag_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.featureKey = fields.feature_key ?? null;
    this.featureName = fields.feature_name ?? null;
    this.description = fields.description ?? null;
    this.isEnabled = fields.is_enabled ?? null;
    this.rolloutStrategy = fields.rollout_strategy ?? null;
    this.targetSegments = fields.target_segments ?? [];
    this.lastToggledBy = fields.last_toggled_by ?? null;
    this.lastToggledAt = fields.last_toggled_at ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientFeatureFlagsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
