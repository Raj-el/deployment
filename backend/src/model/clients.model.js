export default class ClientsModel {
  constructor(fields = {}) {
    this.clientId = fields.client_id ?? null;
    this.name = fields.name ?? null;
    this.slug = fields.slug ?? null;
    this.industry = fields.industry ?? null;
    this.companySize = fields.company_size ?? null;
    this.status = fields.status ?? null;
    this.subscirptionTier = fields.subscription_tier ?? null;
    this.subscirptionStartDate = fields.subscription_start_date ?? null;
    this.subscriptionEndDate = fields.subscription_end_date ?? null;
    this.billingEmail = fields.billing_email ?? null;
    this.monthlyRecurringRevenue = fields.monthly_recurring_revenue ?? null;
    this.logoUrl = fields.logo_url ?? null;
    this.website = fields.website ?? null;
    this.timezone = fields.timezone ?? null;
    this.isActive = fields.is_active ?? null;
    this.onboardedAt = fields.onboarded_at ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}