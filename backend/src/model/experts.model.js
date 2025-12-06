export default class ExpertModel {
  constructor(fields = {}) {
    this.expertId = fields.expert_id ?? null;
    this.userId = fields.user_id ?? null;
    this.name = fields.name ?? null;
    this.email = fields.email ?? null;
    this.department = fields.department ?? null;
    this.title = fields.title ?? null;
    this.yearsOfExperience = fields.years_of_experience ?? null;
    this.expertLevel = fields.expert_level ?? null;
    this.location = fields.location ?? null;
    this.timezone = fields.time_zone ?? null;
    this.primaryExpertise = fields.primary_expertise ?? null;
    this.secondaryExpertise = fields.secondary_expertise ?? null;
    this.bio = fields.bio ?? null;
    this.hourlyRate = fields.hourly_rate ?? null;
    this.maxConcurrentAssignemnts = fields.max_concurrent_assignments ?? null;
    this.currentAssignmentCount = fields.current_assignment_count ?? null;
    this.isActive = fields.is_active ?? null;
    this.isAvailable = fields.is_available ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ExpertModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
