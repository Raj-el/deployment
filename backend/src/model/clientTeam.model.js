export default class ClientTeamModel {
  constructor(fields = {}) {
    this.clientId = fields.client_id ?? null;
    this.employeeId = fields.employee_id ?? null;
    this.userId = fields.user_id ?? null;
    this.name = fields.name ?? null;
    this.email = fields.email ?? null;
    this.title = fields.title ?? null;
    this.jobFunctionId = fields.job_function_id ?? null;
    this.level = fields.level ?? null;
    this.department = fields.department ?? null;
    this.yearsOfExperience = fields.years_of_experience ?? null;
    this.location = fields.location ?? null;
    this.timezone = fields.timezone ?? null;
    this.hireDate = fields.hire_date ?? null;
    this.specialization = fields.specialization ?? null;
    this.isAccountManager = fields.is_account_manager ?? null;
    this.managerEmployeeId = fields.manager_employee_id ?? null;
    this.isActive = fields.is_active ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientTeamModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}