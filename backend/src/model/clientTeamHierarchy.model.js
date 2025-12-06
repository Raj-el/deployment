export default class ClientTeamHierarchyModel {
  constructor(fields = {}) {
    this.clientId = fields.client_id ?? null;
    this.employeeId = fields.employee_id ?? null;
    this.reportsTo = fields.reports_to ?? null;
    this.hierarchyLevel = fields.hierarchy_level ?? null;
    this.directReportCount = fields.direct_report_count ?? null;
    this.totalReportCount = fields.total_report_count ?? null;
    this.department = fields.department ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientTeamHierarchyModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}