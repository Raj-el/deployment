export default class ExpertAssignmentsModel {
    constructor(fields = {}) {
        this.assignmentId = fields.assignment_id ?? null;
        this.expertId = fields.expert_id ?? null;
        this.projectId = fields.project_id ?? null;
        this.role = fields.role ?? null;
        this.assignedAt = fields.assigned_at ?? null;
        this.assignedBy = fields.assigned_by ?? null;
        this.unassignedAt = fields.unassigned_at ?? null;
        this.unassignedBy = fields.unassigned_by ?? null;
    }            

    static fromRow(row) {            
        return row ? new ExpertAssignmentsModel(row) : null;

    }

    toJSON() {
        return { ...this };
    }
}