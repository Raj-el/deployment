export default class Permission {
  constructor({
    id,
    company_name,
    subrole,
    feature,
    can_create,
    can_read,
    can_update,
    can_delete,
  }) {
    this.id = id;
    this.company_name = company_name;
    this.subrole = subrole;
    this.feature = feature;
    this.can_create = can_create;
    this.can_read = can_read;
    this.can_update = can_update;
    this.can_delete = can_delete;
  }

  static fromRow(row) {
    if (!row) return null;
    return new Permission({
      id: row.id,
      company_name: row.company_name,
      subrole: row.subrole,
      feature: row.feature,
      can_create: row.can_create,
      can_read: row.can_read,
      can_update: row.can_update,
      can_delete: row.can_delete,
    });
  }
}
