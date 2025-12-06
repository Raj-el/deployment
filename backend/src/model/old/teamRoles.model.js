export default class TeamRole {
  constructor({ email, effective_role, company_name }) {
    this.email = email;
    this.effective_role = effective_role;
    this.company_name = company_name;
  }

  static fromRow(row) {
    if (!row) return null;
    return new TeamRole({
      email: row.email,
      effective_role: row.effective_role,
      company_name: row.company_name,
    });
  }
}
