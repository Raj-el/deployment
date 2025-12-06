export default class ClientSubscriptionHistoryModel {
  constructor(fields = {}) {
    this.subscriptionHistoryId = fields.subscription_history_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.periodStart = fields.period_start ?? null;
    this.periodEnd = fields.period_end ?? null;
    this.subscriptionTier = fields.subscription_tier ?? null;
    this.planStatus = fields.plan_status ?? null;
    this.seatsIncluded = fields.seats_included ?? null;
    this.seatsInUse = fields.seats_in_use ?? null;
    this.mrr = fields.mrr ?? null;
    this.arr = fields.arr ?? null;
    this.renewalDate = fields.renewal_date ?? null;
    this.notes = fields.notes ?? null;
    this.recordedBy = fields.recorded_by ?? null;
    this.recordedAt = fields.recorded_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientSubscriptionHistoryModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
