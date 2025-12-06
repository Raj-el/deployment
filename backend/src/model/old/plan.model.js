export default class Plan {
  constructor(fields = {}) {
    this.id = fields.id ?? null;
    this.accountId = fields.account_id ?? null;
    this.accountName = fields.account_name ?? null;
    this.planType = fields.plan_type ?? "ai";
    this.title = fields.title ?? null;
    this.summary = fields.summary ?? null;
    this.focusAreas = fields.focus_areas ?? [];
    this.recommendations = fields.recommendations ?? [];
    this.assignedTo = fields.assigned_to ?? null;
    this.status = fields.status ?? "pending";
    this.progress = fields.progress ?? 0;
    this.success = fields.success ?? null;
    this.dueDate = fields.due_date ?? null;
    this.metricOutcome = fields.metric_outcome ?? "pending";
    this.improvementNotes = fields.improvement_notes ?? null;

    // ✅ replaced createdBy → authorEmail
    this.authorEmail = fields.author_email ?? null;

    this.lastEditedBy = fields.last_edited_by ?? null;
    this.lastEditedAt = fields.last_edited_at ?? null;
    this.createdAt = fields.created_at ?? new Date();
    this.updatedAt = fields.updated_at ?? new Date();
  }

  static fromRow(row) {
    return new Plan(row);
  }

  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      accountName: this.accountName,
      planType: this.planType,
      title: this.title,
      summary: this.summary,
      focusAreas: this.focusAreas,
      recommendations: this.recommendations,
      assignedTo: this.assignedTo,
      status: this.status,
      progress: this.progress,
      success: this.success,
      dueDate: this.dueDate,
      metricOutcome: this.metricOutcome,
      improvementNotes: this.improvementNotes,
      authorEmail: this.authorEmail,    
      lastEditedBy: this.lastEditedBy,
      lastEditedAt: this.lastEditedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
