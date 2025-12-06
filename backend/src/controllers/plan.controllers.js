import axios from "axios";
import ClientCustomerDataDAO from "../dto/clientCustomerData.dto.js";
import ClientTeamDAO from "../dto/clientTeam.dto.js";
import PlanDAO from "../dto/plans.dto.js";

const RAG_URL = process.env.RAG_SERVICE_URL || "http://localhost:4000";

/**
 * GET /plans/company/clients
 * Fetch all Get-Well Plans created for the current employee’s company’s customers.
 */
export async function getCompanyClientPlans(req, res) {
  try {
    const clientId = req.user?.client_id;
    const companyName = req.user?.company_name;
    const userId = req.user?.user_id;
    const userType = req.user?.type;

    if (!clientId) {
      return res
        .status(403)
        .json({ message: "User is not associated with a client tenant" });
    }

    const filters = { client_id: clientId };
    let scope = "company";
    let assignedEmployeeId = null;
    if (userType === "client_team") {
      scope = "assigned_accounts";
      if (!userId) {
        return res.status(200).json({
          message: "You are not currently assigned to any customer accounts",
          company: companyName,
          customers: [],
          plans: [],
          scope,
          assignedEmployeeId: null,
        });
      }

      const [teamRecord] = await ClientTeamDAO.list({
        filters: { user_id: userId, is_active: true },
        limit: 1,
      });
      assignedEmployeeId = teamRecord?.employeeId ?? null;
      if (!assignedEmployeeId) {
        return res.status(200).json({
          message: "You are not currently assigned to any customer accounts",
          company: companyName,
          customers: [],
          plans: [],
          scope,
          assignedEmployeeId: null,
        });
      }
      filters.assigned_csm_id = assignedEmployeeId;
    }

    const customers = await ClientCustomerDataDAO.list({
      filters,
      limit: 2000,
    });

    if (!customers?.length) {
      return res.status(200).json({
        message:
          scope === "assigned_accounts"
            ? "You are not currently assigned to any customer accounts"
            : `No customers found for client ${companyName || clientId}`,
        company: companyName,
        customers: [],
        plans: [],
        scope,
        assignedEmployeeId,
      });
    }

    // ✅ Fix: use correct key (accountId) instead of account_id
    const accountIds = customers.map((c) => c.accountId);
    console.log(
      `🔹 Found ${accountIds.length} customers for ${companyName}, fetching plans...`
    );

    const plans = await PlanDAO.findByAccountIds(accountIds);
    console.log(
      `🔹 Found ${plans?.length || 0} plans for company ${companyName}`
    );

    const response = {
      message:
        plans.length > 0
          ? `Fetched ${plans.length} plans for customers under ${companyName}`
          : scope === "assigned_accounts"
            ? "No plans found for your assigned accounts"
            : `No plans found for customers under ${companyName}`,
      company: companyName,
      customers: customers.map((customer) => ({
        accountId: customer.accountId,
        accountName: customer.accountName,
        assignedCsmId: customer.assignedCsmId,
      })),
      plans: plans.map((p) => p.toJSON()),
      scope,
      assignedEmployeeId,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error fetching company client plans:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

/**
 * POST /plans/ai/:accountId
 * Generates and saves a Get-Well Plan using the RAG service.
 */
export async function generateAIPlan(req, res) {
  try {
    const { accountId } = req.params;
    const userEmail = req.user?.email || "AI";
    const userId = req.user?.user_id;

    if (!accountId)
      return res.status(400).json({ message: "Missing accountId" });

    const customer = await ClientCustomerDataDAO.findByAccountId(accountId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.riskLevel?.toLowerCase() !== "high") {
      return res.status(200).json({
        message: `Customer ${customer.accountName} is not marked as high risk — no AI plan generated.`,
        riskLevel: customer.riskLevel,
      });
    }

    const { data: ragResponse } = await axios.post(`${RAG_URL}/generate`, {
      customer,
    });
    const plan = ragResponse.plan || {};
    if (!plan.summary)
      return res
        .status(500)
        .json({ message: "RAG service returned an empty plan" });

    const savedPlan = await PlanDAO.create({
      account_id: customer.accountId,
      account_name: customer.accountName,
      plan_type: "ai",
      title: `AI Get-Well Plan for ${customer.accountName}`,
      summary: plan.summary,
      focus_areas: plan.focusAreas || [],
      recommendations: plan.recommendations || [],
      author_email: userEmail,
      author_user_id: userId,
      assigned_to: userEmail,
      status: "pending",
    });

    return res.status(200).json({
      message: `AI plan generated and saved for ${customer.accountName}`,
      plan: savedPlan.toJSON(),
      source: "RAG",
    });
  } catch (error) {
    console.error("Error generating AI plan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /plans/manual/:accountId
 * Creates and saves a manual plan (optionally as a template).
 */
export async function createManualPlan(req, res) {
  try {
    const { accountId } = req.params;
    const {
      title,
      summary,
      focusAreas,
      actions,
      owner,
      dueDate,
      isTemplate = false,
    } = req.body;
    const userEmail = req.user?.email || owner || "CSM";
    const userId = req.user?.user_id;

    if (!accountId)
      return res.status(400).json({ message: "Missing accountId" });
    if (!title) return res.status(400).json({ message: "Missing plan title" });

    const customer = await ClientCustomerDataDAO.findByAccountId(accountId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const planData = {
      account_id: customer.accountId,
      account_name: customer.accountName,
      plan_type: isTemplate ? "template" : "manual",
      title,
      summary: summary || "Custom improvement plan",
      focus_areas: focusAreas || [],
      recommendations: actions || [],
      author_email: userEmail,
      author_user_id: userId,
      assigned_to: userEmail,
      due_date: dueDate || null,
      status: "pending",
    };

    const savedPlan = await PlanDAO.create(planData);

    if (!isTemplate) {
      try {
        await axios.post(`${RAG_URL}/memory/add`, {
          id: savedPlan.id,
          text: `${summary || title}. ${actions?.join(" ") || ""}`,
          metadata: {
            industry: customer.industry,
            region: customer.region,
            success: null,
          },
        });
      } catch (err) {
        console.warn("⚠️ Could not sync manual plan to memory:", err.message);
      }
    }

    return res.status(201).json({
      message: isTemplate
        ? `Plan template saved successfully for ${customer.accountName}`
        : `Manual plan created successfully for ${customer.accountName}`,
      plan: savedPlan.toJSON(),
    });
  } catch (error) {
    console.error("Error creating manual plan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /plans/templates
 * Creates a reusable plan template not tied to a specific customer.
 */
export async function createTemplate(req, res) {
  try {
    const { title, summary, focusAreas, recommendations } = req.body;
    const userEmail = req.user?.email || "CSM";
    const userId = req.user?.user_id;

    if (!title)
      return res.status(400).json({ message: "Missing template title" });

    const templateData = {
      plan_type: "template",
      title,
      summary,
      focus_areas: focusAreas || [],
      recommendations: recommendations || [],
      author_email: userEmail,
      author_user_id: userId,
      assigned_to: userEmail,
      status: "template",
    };

    const template = await PlanDAO.create(templateData);

    return res.status(201).json({
      message: "Template plan created successfully",
      template: template.toJSON(),
    });
  } catch (error) {
    console.error("Error creating template:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /plans/:planId/edit
 */
export async function editPlan(req, res) {
  try {
    const { planId } = req.params;
    const editorEmail = req.user?.email || "CSM";
    const updates = req.body;

    const updatedPlan = await PlanDAO.editPlan(planId, updates, editorEmail);
    res.status(200).json({
      message: `Plan ${planId} updated successfully.`,
      plan: updatedPlan.toJSON(),
    });
  } catch (error) {
    console.error("Error editing plan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /plans/:planId/outcome
 */
export async function recordOutcome(req, res) {
  try {
    const { planId } = req.params;
    const { metricOutcome, improvementNotes } = req.body;
    const editorEmail = req.user?.email || "CSM";

    if (!metricOutcome)
      return res.status(400).json({ message: "Missing metricOutcome" });

    const updated = await PlanDAO.recordOutcome(
      planId,
      metricOutcome,
      improvementNotes,
      editorEmail
    );

    const plan = updated.toJSON();
    const actions = (plan.recommendations || [])
      .map((r) => (typeof r === "string" ? r : r.action))
      .join("; ");

    const memoryText = `
Plan Summary: ${plan.summary}.
Actions Taken: ${actions || "N/A"}.
Result: ${metricOutcome}.
Notes: ${improvementNotes || "None provided."}.
`;

    try {
      await axios.post(`${RAG_URL}/memory/add`, {
        id: planId,
        text: memoryText.trim(),
        metadata: {
          success: metricOutcome === "improved",
          accountName: plan.accountName,
          industry: plan.industry,
          riskLevel: plan.riskLevel,
        },
      });
    } catch (err) {
      console.warn(
        "⚠️ Could not sync enriched outcome to memory:",
        err.message
      );
    }

    res.status(200).json({
      message: `Outcome recorded for plan ${planId}`,
      plan: updated,
    });
  } catch (error) {
    console.error("Error recording outcome:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /plans/:planId
 */
export async function getPlanById(req, res) {
  try {
    const { planId } = req.params;
    const plan = await PlanDAO.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.accountId) {
      const customer = await ClientCustomerDataDAO.findByAccountId(
        plan.accountId
      );
      const userClientId = req.user?.client_id;
      if (
        customer?.clientId &&
        userClientId &&
        customer.clientId !== userClientId
      ) {
        return res
          .status(403)
          .json({ message: "Plan does not belong to your tenant" });
      }
    }

    return res.json({ plan: plan.toJSON() });
  } catch (error) {
    console.error("Error fetching plan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /plans/:planId
 */
export async function deletePlan(req, res) {
  try {
    const { planId } = req.params;
    const plan = await PlanDAO.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.accountId) {
      const customer = await ClientCustomerDataDAO.findByAccountId(
        plan.accountId
      );
      const userClientId = req.user?.client_id;
      if (
        customer?.clientId &&
        userClientId &&
        customer.clientId !== userClientId
      ) {
        return res
          .status(403)
          .json({ message: "Plan does not belong to your tenant" });
      }
    }

    await PlanDAO.delete(planId);
    return res.json({ message: `Plan ${planId} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting plan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
