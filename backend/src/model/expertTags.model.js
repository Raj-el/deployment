export default class ExpertTagsModel {
  constructor(fields = {}) {
    this.tagId = fields.tag_id ?? null;
    this.expertId = fields.expert_id ?? null;
    this.tag = fields.tag ?? null;
    this.tagType = fields.tag_type ?? null;
    this.proficiencyLevel = fields.proficiency_level ?? null;
  }

  static fromRow(row) {
    return row ? new ExpertTagsModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}