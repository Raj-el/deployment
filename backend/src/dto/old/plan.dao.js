import { supabase } from "../../dbConfig/dbConfig.js";
import Plan from "../model/plan.model.js";

const TABLE = "plans";

class PlanDAO {
  /** Create a new plan or template */
  static async create(planData) {
    const payload = {
      ...planData,
      author_email: planData.author_email || planData.email || null, // ✅ unified creator field
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`Failed to create plan: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Get all plans for a specific account */
  static async findByAccountId(accountId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch plans: ${error.message}`);
    return data.map((row) => Plan.fromRow(row));
  }

  /** Get all plan templates */
  static async findTemplates() {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("plan_type", "template")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch templates: ${error.message}`);
    return data.map((row) => Plan.fromRow(row));
  }

  /** Find plans authored by a list of user emails */
  static async findByAuthorEmails(emails = []) {
    if (!emails.length) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .in("author_email", emails)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch plans by author: ${error.message}`);
    return data.map((row) => Plan.fromRow(row));
  }
  /** Get all plans for multiple account IDs */
  static async findByAccountIds(accountIds = []) {
    if (!accountIds.length) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .in("account_id", accountIds)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch plans by accountIds: ${error.message}`);
    return data.map((row) => Plan.fromRow(row));
  }

  /** Update plan progress and optionally status */
  static async updateProgress(planId, progress, status = "in_progress") {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        progress,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update progress: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Assign plan to another expert or CSM */
  static async assignToExpert(planId, expertEmail) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        assigned_to: expertEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to assign plan: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Change due date */
  static async updateDueDate(planId, dueDate) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        due_date: dueDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update due date: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Mark plan complete with success or failure */
  static async markAsComplete(planId, success = true) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        status: "completed",
        progress: 100,
        success,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to mark complete: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Delete a plan or template */
  static async delete(planId) {
    const { error } = await supabase.from(TABLE).delete().eq("id", planId);

    if (error) throw new Error(`Failed to delete plan: ${error.message}`);
    return true;
  }

  /** Duplicate a template into a new plan for a specific customer */
  static async createFromTemplate(templateId, accountId, accountName, authorEmail) {
    const { data: template, error: templateError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", templateId)
      .eq("plan_type", "template")
      .single();

    if (templateError)
      throw new Error(`Template not found: ${templateError.message}`);

    const newPlan = {
      account_id: accountId,
      account_name: accountName,
      plan_type: "manual",
      title: `${template.title} (from template)`,
      summary: template.summary,
      focus_areas: template.focus_areas,
      recommendations: template.recommendations,
      assigned_to: authorEmail,
      author_email: authorEmail, // ✅ record ownership
      progress: 0,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(newPlan)
      .select()
      .single();

    if (error) throw new Error(`Failed to create plan from template: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Update editable fields of a plan */
  static async editPlan(planId, updates, editorEmail) {
    const allowedFields = [
      "title",
      "summary",
      "focus_areas",
      "recommendations",
      "due_date",
      "assigned_to",
      "status",
    ];

    const updatePayload = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updatePayload[key] = updates[key];
    }

    updatePayload.last_edited_by = editorEmail;
    updatePayload.last_edited_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .update(updatePayload)
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to edit plan: ${error.message}`);
    return Plan.fromRow(data);
  }

  /** Record improvement outcome after plan execution */
  static async recordOutcome(planId, metricOutcome, improvementNotes, editorEmail) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        metric_outcome: metricOutcome,
        improvement_notes: improvementNotes,
        success: metricOutcome === "improved",
        last_edited_by: editorEmail,
        last_edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw new Error(`Failed to record outcome: ${error.message}`);
    return Plan.fromRow(data);
  }
}

export default PlanDAO;
