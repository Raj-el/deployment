export default class ClientGlossaryTermsModel {
  constructor(fields = {}) {
    this.glossaryTermId = fields.glossary_term_id ?? null;
    this.clientId = fields.client_id ?? null;
    this.term = fields.term ?? null;
    this.definition = fields.definition ?? null;
    this.category = fields.category ?? null;
    this.status = fields.status ?? null;
    this.lastReviewedAt = fields.last_reviewed_at ?? null;
    this.createdBy = fields.created_by ?? null;
    this.updatedBy = fields.updated_by ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new ClientGlossaryTermsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
