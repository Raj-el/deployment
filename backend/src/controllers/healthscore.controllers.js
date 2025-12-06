import ClientCustomerDataDAO from "../dto/clientCustomerData.dto.js";
import ClientTeamDAO from "../dto/clientTeam.dto.js";

const pickHealthScoreFields = (customer) => ({
  accountId: customer.accountId,
  accountName: customer.accountName,
  assignedCsmId: customer.assignedCsmId,
  overallHealthScore: customer.overallHealthScore,
  financialHealthScore: customer.financialHealthScore,
  usageHealthScore: customer.usageHealthScore,
  sentimentHealthScore: customer.sentimentHealthScore,
  engagementHealthScore: customer.engagementHealthScore,
  updatedAt: customer.updatedAt,
});

const getUserContext = (req) => ({
  clientId: req.user?.client_id,
  userId: req.user?.user_id,
  type: req.user?.type,
});

const ensureCustomerAccess = (
  customer,
  { clientId, type },
  { enforceAssignment = true, assignedEmployeeId = null } = {}
) => {
  if (!customer || customer.clientId !== clientId) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    enforceAssignment &&
    type === "client_team" &&
    customer.assignedCsmId &&
    customer.assignedCsmId !== assignedEmployeeId
  ) {
    const error = new Error("You are not assigned to this account");
    error.statusCode = 403;
    throw error;
  }
};

const resolveAssignedEmployeeId = async ({ type, userId }) => {
  if (type !== "client_team" || !userId) return null;
  const [record] = await ClientTeamDAO.list({
    filters: { user_id: userId, is_active: true },
    limit: 1,
  });
  return record?.employeeId ?? null;
};

export async function getHealthScores(req, res) {
  const context = getUserContext(req);
  if (!context.clientId) {
    return res.status(403).json({ message: "User is not associated with a client tenant" });
  }

  try {
    const accountId = req.query.accountId;
    let customers = [];
    const assignedEmployeeId = await resolveAssignedEmployeeId(context);

    if (accountId) {
      const customer = await ClientCustomerDataDAO.findByAccountId(accountId);
      ensureCustomerAccess(customer, context, { assignedEmployeeId });
      customers = [customer];
    } else {
      const filters = { client_id: context.clientId };
      if (context.type === "client_team") {
        if (!assignedEmployeeId) {
          return res.status(200).json({
            count: 0,
            scope: "assigned_accounts",
            customers: [],
            message: "You are not currently assigned to any customer accounts",
          });
        }
        filters.assigned_csm_id = assignedEmployeeId;
      }

      customers = await ClientCustomerDataDAO.list({
        filters,
        limit: Number(req.query.limit) || 500,
      });
    }

    return res.status(200).json({
      count: customers.length,
      scope: context.type === "client_team" ? "assigned_accounts" : "tenant",
      customers: customers.map(pickHealthScoreFields),
      assignedEmployeeId,
    });
  } catch (error) {
    console.error("Error fetching health scores:", error);
    res
      .status(error.statusCode ?? 500)
      .json({ message: error.message || "Failed to fetch health scores" });
  }
}

export async function upsertHealthScores(req, res) {
  const context = getUserContext(req);
  if (!context.clientId) {
    return res.status(403).json({ message: "User is not associated with a client tenant" });
  }

  const { accountId } = req.params;
  if (!accountId) {
    return res.status(400).json({ message: "accountId is required" });
  }

  try {
    const assignedEmployeeId = await resolveAssignedEmployeeId(context);
    const customer = await ClientCustomerDataDAO.findByAccountId(accountId);
    ensureCustomerAccess(customer, context, { assignedEmployeeId });

    const allowedFields = {
      overallHealthScore: "overall_health_score",
      financialHealthScore: "financial_health_score",
      usageHealthScore: "usage_health_score",
      sentimentHealthScore: "sentiment_health_score",
      engagementHealthScore: "engagement_health_score",
    };

    const updates = {};
    for (const [key, column] of Object.entries(allowedFields)) {
      if (req.body[key] === undefined || req.body[key] === null) continue;
      const value = Number(req.body[key]);
      if (Number.isNaN(value)) {
        return res.status(400).json({ message: `${key} must be a number` });
      }
      updates[column] = value;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "At least one score must be provided" });
    }

    const updated = await ClientCustomerDataDAO.updateById(accountId, updates);

    res.status(200).json({
      message: "Health scores updated",
      customer: pickHealthScoreFields(updated),
    });
  } catch (error) {
    console.error("Error updating health scores:", error);
    res
      .status(error.statusCode ?? 500)
      .json({ message: error.message || "Failed to update health scores" });
  }
}

export async function getAllCustomers(req, res) {
  const context = getUserContext(req);
  if (!context.clientId) {
    return res.status(403).json({ message: "User is not associated with a client tenant" });
  }

  try {
    const filters = { client_id: context.clientId };
    const assignedEmployeeId = await resolveAssignedEmployeeId(context);
    if (context.type === "client_team") {
      if (!assignedEmployeeId) {
        return res.status(200).json({
          count: 0,
          scope: "assigned_accounts",
          customers: [],
          message: "You are not currently assigned to any customer accounts",
        });
      }
      filters.assigned_csm_id = assignedEmployeeId;
    }

    const customers = await ClientCustomerDataDAO.list({
      filters,
      limit: Number(req.query.limit) || 1000,
    });

    res.status(200).json({
      count: customers.length,
      scope: context.type === "client_team" ? "assigned_accounts" : "tenant",
      customers: customers.map((customer) => (customer.toJSON ? customer.toJSON() : customer)),
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch customers", error: error.message });
  }
}
