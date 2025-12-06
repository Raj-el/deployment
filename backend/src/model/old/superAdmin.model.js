export default class SuperAdmin {
  constructor({ id, email, name }) {
    this.id = id;
    this.email = email;
    this.name = name;
  }

  static fromRow(row) {
    if (!row) return null;
    return new SuperAdmin({
      id: row.id,
      email: row.email,
      name: row.name,
    });
  }
}
