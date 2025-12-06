import { supabase } from '../dbConfig/dbConfig.js';
import PlansModel from '../model/plans.model.js';

const TABLE = 'Plans';

class PlansDAO {
  static now() {
    return new Date().toISOString();
  }

  static mapRows(data = []) {
    return data.map((row) => PlansModel.fromRow(row));
  }

  static async create(planData = {}) {
    const timestamp = this.now();
    const payload = {
      ...planData,
      author_email: planData.author_email || planData.email || null,
      author_user_id: planData.author_user_id,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`Failed to create plan: ${error.message}`);
    return PlansModel.fromRow(data);
  }

  static async findByAccountId(accountId) {
    if (!accountId) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch plans: ${error.message}`);
    return this.mapRows(data);
  }

  static async findByAccountIds(accountIds = []) {
    if (!accountIds.length) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .in('account_id', accountIds)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch plans by accountIds: ${error.message}`);
    return this.mapRows(data);
  }

  static async findTemplates() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('plan_type', 'template')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch templates: ${error.message}`);
    return this.mapRows(data);
  }

  static async findByAuthorEmails(emails = []) {
    if (!emails.length) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .in('author_email', emails)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch plans by author: ${error.message}`);
    return this.mapRows(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Plan ID is required');
    if (!Object.keys(updates).length) return this.findById(id);

    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...updates, updated_at: this.now() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update plan: ${error.message}`);
    return PlansModel.fromRow(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Failed to load plan ${id}: ${error.message}`);
    return PlansModel.fromRow(data);
  }

  static async updateProgress(planId, progress, status = 'in_progress') {
    return this.updateById(planId, {
      progress,
      status,
    });
  }

  static async assignToExpert(planId, expertEmail) {
    return this.updateById(planId, {
      assigned_to: expertEmail,
    });
  }

  static async updateDueDate(planId, dueDate) {
    return this.updateById(planId, { due_date: dueDate });
  }

  static async markAsComplete(planId, success = true) {
    return this.updateById(planId, {
      status: 'completed',
      progress: 100,
      success,
    });
  }

  static async delete(planId) {
    if (!planId) throw new Error('Plan ID is required for delete');
    const { error } = await supabase.from(TABLE).delete().eq('id', planId);
    if (error) throw new Error(`Failed to delete plan: ${error.message}`);
    return true;
  }

  static async createFromTemplate(templateId, accountId, accountName, authorEmail) {
    if (!templateId) throw new Error('Template ID required');

    const { data: template, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', templateId)
      .eq('plan_type', 'template')
      .single();

    if (error) throw new Error(`Template not found: ${error.message}`);

    return this.create({
      account_id: accountId,
      account_name: accountName,
      plan_type: 'manual',
      title: `${template.title} (from template)`,
      summary: template.summary,
      focus_areas: template.focus_areas,
      recommendations: template.recommendations,
      assigned_to: authorEmail,
      author_email: authorEmail,
      progress: 0,
      status: 'pending',
    });
  }

  static async editPlan(planId, updates = {}, editorEmail) {
    if (!planId) throw new Error('Plan ID is required to edit plan');
    const allowedFields = [
      'title',
      'summary',
      'focus_areas',
      'recommendations',
      'due_date',
      'assigned_to',
      'status',
    ];

    const updatePayload = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updatePayload[key] = updates[key];
    }

    updatePayload.last_edited_by = editorEmail;
    updatePayload.last_edited_at = this.now();

    return this.updateById(planId, updatePayload);
  }

  static async recordOutcome(planId, metricOutcome, improvementNotes, editorEmail) {
    if (!planId) throw new Error('Plan ID is required to record outcome');
    const payload = {
      metric_outcome: metricOutcome,
      improvement_notes: improvementNotes,
      success: metricOutcome === 'improved',
      last_edited_by: editorEmail,
      last_edited_at: this.now(),
    };

    return this.updateById(planId, payload);
  }
}

export default PlansDAO;
