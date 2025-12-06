export default class PlansModel {
  constructor(fields = {}) {
    this.id = fields.id ?? null;
    this.accountId = fields.account_id ?? null;
    this.accountName = fields.account_name ?? null;
    this.planType = fields.plan_type ?? 'ai';
    this.title = fields.title ?? null;
    this.summary = fields.summary ?? null;
    this.focusAreas = fields.focus_areas ?? [];
    this.recommendations = fields.recommendations ?? [];
    this.assignedTo = fields.assigned_to ?? null;
    this.status = fields.status ?? 'pending';
    this.progress = fields.progress ?? 0;
    this.success = fields.success ?? null;
    this.dueDate = fields.due_date ?? null;
    this.metricOutcome = fields.metric_outcome ?? 'pending';
    this.improvementNotes = fields.improvement_notes ?? null;
    this.authorEmail = fields.author_email ?? null;
    this.authorUserId = fields.author_user_id ?? null;
    this.lastEditedBy = fields.last_edited_by ?? null;
    this.lastEditedAt = fields.last_edited_at ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new PlansModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
