import bcrypt from "bcrypt";
import crypto from "crypto";

import ClientSubscriptionHistoryDAO from "../dto/clientSubscriptionHistory.dto.js";
import ClientFeatureFlagsDAO from "../dto/clientFeatureFlags.dto.js";
import ClientInstanceConfigurationsDAO from "../dto/clientInstanceConfigurations.dto.js";
import ClientGlossaryTermsDAO from "../dto/clientGlossaryTerms.dto.js";
import ClientApiKeysDAO from "../dto/clientApiKeys.dto.js";

import ClientAdminsDAO from "../dto/clientAdmins.dto.js";
import ClientTeamDAO from "../dto/clientTeam.dto.js";
import ClientJobFunctionsDAO from "../dto/clientJobFunctions.dto.js";
import RolePermissionsDAO from "../dto/rolePermissions.dto.js";
import UsersDAO from "../dto/users.dto.js";

function getClientContext(req, res) {
  const clientId = req.user?.client_id;
  if (!clientId) {
    res
      .status(403)
      .json({ message: "User is not associated with a client tenant" });
    return null;
  }

  return {
    clientId,
    userId: req.user?.user_id ?? null,
  };
}

const toJSON = (record) => (record?.toJSON ? record.toJSON() : record);

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const ROLE_PRIORITY = {
  client_admin: 1,
  client_team: 2,
};
const SUPPORTED_ROLE_TYPES = new Set(["client_admin", "client_team"]);
const TEMP_PASSWORD_BYTES = 16;

const toNullableString = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
};

const toOptionalBoolean = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(value);
};

const toEmployeeIdentifier = (value) => {
  if (value === undefined) return undefined;
  if (value === null) {
    const error = new Error("employeeId cannot be null");
    error.statusCode = 400;
    throw error;
  }
  const trimmed = String(value).trim();
  if (!trimmed.length) {
    const error = new Error("employeeId cannot be empty");
    error.statusCode = 400;
    throw error;
  }
  return trimmed;
};

const randomEmployeeId = () => `emp_${crypto.randomUUID()}`;

const buildUserRoleSummaries = ({
  admins = [],
  teamMembers = [],
  userMap = new Map(),
  jobFunctionMap = new Map(),
}) => {
  const summaries = new Map();

  const ensureEntry = (userId) => {
    if (!userId) return null;
    if (!summaries.has(userId)) {
      const user = userMap.get(userId) ?? null;
      summaries.set(userId, {
        userId,
        email: user?.email ?? null,
        isActive: user?.isActive ?? null,
        lastLoginAt: user?.lastLoginAt ?? null,
        primaryRole: "unassigned",
        roles: [],
        name: null,
      });
    }
    return summaries.get(userId);
  };

  const maybeUpgradePrimaryRole = (entry, role) => {
    if (!entry || !role?.isActive) return;
    const currentPriority =
      ROLE_PRIORITY[entry.primaryRole] ?? Number.POSITIVE_INFINITY;
    const nextPriority = ROLE_PRIORITY[role.type] ?? Number.POSITIVE_INFINITY;
    if (nextPriority < currentPriority) {
      entry.primaryRole = role.type;
      entry.name = role.name ?? entry.name;
    }
  };

  admins.forEach((admin) => {
    if (!admin?.userId) return;
    const entry = ensureEntry(admin.userId);
    if (!entry) return;
    const role = {
      type: "client_admin",
      clientAdminId: admin.clientAdminId,
      name: admin.name,
      phone: admin.phone,
      isPrimary: admin.isPrimary,
      isActive: admin.isActive,
      clientId: admin.clientId,
    };
    entry.roles.push(role);
    maybeUpgradePrimaryRole(entry, role);
  });

  teamMembers.forEach((member) => {
    if (!member?.userId) return;
    const entry = ensureEntry(member.userId);
    if (!entry) return;
    const jobFunction = member.jobFunctionId
      ? jobFunctionMap.get(member.jobFunctionId)
      : null;
    const role = {
      type: "client_team",
      employeeId: member.employeeId,
      name: member.name,
      email: member.email ?? entry.email,
      title: member.title,
      level: member.level,
      department: member.department,
      jobFunctionId: member.jobFunctionId,
      jobFunctionName: jobFunction?.functionName ?? null,
      jobFunctionCategory: jobFunction?.functionCategory ?? null,
      isAccountManager: member.isAccountManager,
      isActive: member.isActive,
      clientId: member.clientId,
    };
    entry.roles.push(role);
    maybeUpgradePrimaryRole(entry, role);
  });

  return Array.from(summaries.values()).sort((a, b) => {
    const left = a.name || a.email || "";
    const right = b.name || b.email || "";
    return left.localeCompare(right);
  });
};

const fetchClientUserSummaries = async (
  clientId,
  { includeInactive = false, userIds = [] } = {}
) => {
  const baseAdminFilters = { client_id: clientId };
  const baseTeamFilters = { client_id: clientId };
  if (!includeInactive) {
    baseAdminFilters.is_active = true;
    baseTeamFilters.is_active = true;
  }
  if (userIds?.length) {
    baseAdminFilters.user_id = userIds;
    baseTeamFilters.user_id = userIds;
  }

  const [admins, teamMembers] = await Promise.all([
    ClientAdminsDAO.list({ filters: baseAdminFilters, limit: 1000 }),
    ClientTeamDAO.list({ filters: baseTeamFilters, limit: 2000 }),
  ]);

  const relatedUserIds = new Set(userIds ?? []);
  admins.forEach((admin) => admin?.userId && relatedUserIds.add(admin.userId));
  teamMembers.forEach(
    (member) => member?.userId && relatedUserIds.add(member.userId)
  );

  const users = relatedUserIds.size
    ? await UsersDAO.findByIds(Array.from(relatedUserIds))
    : [];
  const userMap = new Map(users.map((user) => [user.userId, user]));

  const jobFunctionIds = Array.from(
    new Set(teamMembers.map((member) => member?.jobFunctionId).filter(Boolean))
  );
  const jobFunctionFilters = { client_id: clientId };
  if (jobFunctionIds.length)
    jobFunctionFilters.job_function_id = jobFunctionIds;
  const jobFunctions = jobFunctionIds.length
    ? await ClientJobFunctionsDAO.list({
        filters: jobFunctionFilters,
        limit: 1000,
      })
    : [];
  const jobFunctionMap = new Map(
    jobFunctions.map((jf) => [jf.jobFunctionId, jf])
  );

  return buildUserRoleSummaries({
    admins,
    teamMembers,
    userMap,
    jobFunctionMap,
  });
};

const getUserSummary = async (
  userId,
  clientId,
  { includeInactive = true } = {}
) => {
  const summaries = await fetchClientUserSummaries(clientId, {
    includeInactive,
    userIds: [userId],
  });
  return summaries[0] ?? null;
};

const ensureUserTenantIsolation = async (userId, clientId) => {
  const [[adminMatch], [teamMatch]] = await Promise.all([
    ClientAdminsDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
    ClientTeamDAO.list({
      filters: { user_id: userId, is_active: true },
      limit: 1,
    }),
  ]);

  if (adminMatch && adminMatch.clientId !== clientId) {
    const error = new Error("User is already an admin for another tenant");
    error.statusCode = 409;
    throw error;
  }

  if (teamMatch && teamMatch.clientId !== clientId) {
    const error = new Error(
      "User is already assigned to a different client team"
    );
    error.statusCode = 409;
    throw error;
  }
};

const upsertClientAdminRole = async ({ userId, clientId, payload = {} }) => {
  const [existing] = await ClientAdminsDAO.list({
    filters: { user_id: userId, client_id: clientId },
    limit: 1,
  });

  const updates = {};
  const nameValue = toNullableString(payload.name);
  if (nameValue !== undefined) updates.name = nameValue;
  const phoneValue = toNullableString(payload.phone);
  if (phoneValue !== undefined) updates.phone = phoneValue;
  const isPrimary = toOptionalBoolean(payload.isPrimaryAdmin);
  if (isPrimary !== undefined) updates.is_primary = isPrimary;
  const isActive = toOptionalBoolean(payload.isActive);
  if (isActive !== undefined) updates.is_active = isActive;

  if (existing) {
    if (!Object.keys(updates).length) return existing;
    return ClientAdminsDAO.updateById(existing.clientAdminId, updates);
  }

  if (!nameValue) {
    const error = new Error("name is required when creating a client admin");
    error.statusCode = 400;
    throw error;
  }

  return ClientAdminsDAO.create({
    client_id: clientId,
    user_id: userId,
    name: nameValue,
    phone: phoneValue ?? null,
    is_primary: isPrimary ?? false,
    is_active: isActive ?? true,
  });
};

const upsertClientTeamRole = async ({ user, clientId, payload = {} }) => {
  const [existing] = await ClientTeamDAO.list({
    filters: { user_id: user.userId, client_id: clientId },
    limit: 1,
  });

  let jobFunctionId = payload.jobFunctionId;
  if (jobFunctionId === undefined || jobFunctionId === null) {
    jobFunctionId = existing?.jobFunctionId;
  }
  const normalizedJobFunctionId = Number(jobFunctionId);
  if (!Number.isInteger(normalizedJobFunctionId)) {
    const error = new Error(
      "jobFunctionId is required for client team members"
    );
    error.statusCode = 400;
    throw error;
  }

  const jobFunction = await ClientJobFunctionsDAO.findById(
    normalizedJobFunctionId
  );
  if (!jobFunction || jobFunction.clientId !== clientId) {
    const error = new Error(
      "jobFunctionId does not belong to the current client"
    );
    error.statusCode = 400;
    throw error;
  }

  const boolAccountManager = toOptionalBoolean(payload.isAccountManager);
  const managerIdValue = toNullableString(payload.managerEmployeeId);
  const specializationValue = toNullableString(payload.specialization);
  const locationValue = toNullableString(payload.location);
  const timezoneValue = toNullableString(payload.timezone);
  const levelValue = toNullableString(payload.level);
  const deptValue = toNullableString(payload.department);
  const titleValue = toNullableString(payload.title);
  const emailValue = payload.email ? normalizeEmail(payload.email) : undefined;

  const yearsValue =
    payload.yearsOfExperience === undefined ||
    payload.yearsOfExperience === null
      ? undefined
      : Number(payload.yearsOfExperience);
  if (yearsValue !== undefined && Number.isNaN(yearsValue)) {
    const error = new Error("yearsOfExperience must be a number");
    error.statusCode = 400;
    throw error;
  }

  const isActiveValue = toOptionalBoolean(payload.isActive);

  if (existing) {
    const updates = {};
    const nameValue = toNullableString(payload.name);
    if (nameValue !== undefined) updates.name = nameValue;
    if (titleValue !== undefined) updates.title = titleValue;
    if (deptValue !== undefined) updates.department = deptValue;
    if (levelValue !== undefined) updates.level = levelValue;
    if (boolAccountManager !== undefined)
      updates.is_account_manager = boolAccountManager;
    if (managerIdValue !== undefined)
      updates.manager_employee_id = managerIdValue;
    if (specializationValue !== undefined)
      updates.specialization = specializationValue;
    if (locationValue !== undefined) updates.location = locationValue;
    if (timezoneValue !== undefined) updates.timezone = timezoneValue;
    if (yearsValue !== undefined) updates.years_of_experience = yearsValue;
    if (emailValue !== undefined) updates.email = emailValue;
    const employeeIdValue = toEmployeeIdentifier(payload.employeeId);
    if (employeeIdValue !== undefined) updates.employee_id = employeeIdValue;
    if (isActiveValue !== undefined) updates.is_active = isActiveValue;
    updates.job_function_id = normalizedJobFunctionId;

    if (!Object.keys(updates).length) return existing;
    return ClientTeamDAO.updateById(existing.employeeId, updates);
  }

  const nameValue = toNullableString(payload.name);
  if (!nameValue) {
    const error = new Error(
      "name is required when creating a client team member"
    );
    error.statusCode = 400;
    throw error;
  }

  const employeeId =
    payload.employeeId !== undefined
      ? toEmployeeIdentifier(payload.employeeId)
      : randomEmployeeId();
  const normalizedEmail = emailValue ?? normalizeEmail(user.email);

  return ClientTeamDAO.create({
    employee_id: employeeId,
    client_id: clientId,
    user_id: user.userId,
    name: nameValue,
    email: normalizedEmail,
    title: titleValue ?? null,
    department: deptValue ?? null,
    level: levelValue ?? null,
    job_function_id: normalizedJobFunctionId,
    is_account_manager: boolAccountManager ?? false,
    manager_employee_id: managerIdValue ?? null,
    specialization: specializationValue ?? null,
    location: locationValue ?? null,
    timezone: timezoneValue ?? null,
    years_of_experience: yearsValue ?? null,
    is_active: isActiveValue ?? true,
  });
};

const upsertRoleAssignment = async ({ user, clientId, roleType, payload }) => {
  if (roleType === "client_admin") {
    return upsertClientAdminRole({ userId: user.userId, clientId, payload });
  }
  if (roleType === "client_team") {
    return upsertClientTeamRole({ user, clientId, payload });
  }
  const error = new Error(`Unsupported roleType '${roleType}'`);
  error.statusCode = 400;
  throw error;
};

const PLAN_PERMISSION_MAP = (() => {
  const csmPerms = [
    {
      resource: "/api/v1/plans/ai",
      action: "post",
      scope: "assigned_accounts",
    },
    {
      resource: "/api/v1/plans/manual",
      action: "post",
      scope: "assigned_accounts",
    },
    {
      resource: "/api/v1/plans/edit",
      action: "patch",
      scope: "assigned_accounts",
    },
    {
      resource: "/api/v1/plans/outcome",
      action: "patch",
      scope: "assigned_accounts",
    },
    {
      resource: "/api/v1/plans/templates",
      action: "post",
      scope: "share_success",
    },
    { resource: "/api/v1/plans", action: "get", scope: "assigned_accounts" },
    {
      resource: "/api/v1/plans/company/clients",
      action: "get",
      scope: "assigned_accounts",
    },
  ];

  const managerPerms = [
    {
      resource: "/api/v1/plans/company/clients",
      action: "get",
      scope: "company_portfolio",
    },
    { resource: "/api/v1/plans", action: "get", scope: "company_portfolio" },
    { resource: "/api/v1/plans/ai", action: "post", scope: "company_accounts" },
    {
      resource: "/api/v1/plans/manual",
      action: "post",
      scope: "company_accounts",
    },
    {
      resource: "/api/v1/plans/edit",
      action: "patch",
      scope: "company_accounts",
    },
    {
      resource: "/api/v1/plans/outcome",
      action: "patch",
      scope: "company_accounts",
    },
    {
      resource: "/api/v1/plans/templates",
      action: "post",
      scope: "playbook_library",
    },
    { resource: "/api/v1/plans", action: "delete", scope: "company_accounts" },
  ];

  const execPerms = [
    {
      resource: "/api/v1/plans/company/clients",
      action: "get",
      scope: "executive_insights",
    },
    { resource: "/api/v1/plans", action: "get", scope: "executive_insights" },
  ];

  const map = new Map();
  [
    {
      names: [
        "senior enterprise csm",
        "mid-level enterprise csm",
        "mid-level mid-market csm",
        "junior mid-market csm",
        "smb team lead",
        "junior smb csm",
      ],
      perms: csmPerms,
    },
    {
      names: [
        "director of enterprise success",
        "director of mid-market success",
        "director of smb success",
        "director of strategic accounts",
      ],
      perms: managerPerms,
    },
    {
      names: ["vp of customer success"],
      perms: execPerms,
    },
  ].forEach(({ names, perms }) => {
    names.forEach((name) => map.set(name, perms));
  });
  return map;
})();

const PLAN_FEATURE_KEY = "plans";

async function syncPlanRolePermissions(clientId, isEnabled, actorUserId) {
  const jobFunctions = await ClientJobFunctionsDAO.list({
    filters: { client_id: clientId, is_active: true },
    limit: 500,
  });

  const operations = [];

  for (const jobFunction of jobFunctions) {
    const perms = PLAN_PERMISSION_MAP.get(
      jobFunction.functionName?.toLowerCase()
    );
    if (!perms?.length) continue;

    if (isEnabled) {
      for (const perm of perms) {
        operations.push(
          RolePermissionsDAO.upsertPermission({
            job_function_id: jobFunction.jobFunctionId,
            resource_type: perm.resource,
            action: perm.action,
            scope: perm.scope,
            created_by: actorUserId,
          })
        );
      }
    } else {
      for (const perm of perms) {
        operations.push(
          RolePermissionsDAO.deletePermission(
            jobFunction.jobFunctionId,
            perm.resource,
            perm.action
          )
        );
      }
    }
  }

  await Promise.all(operations);
}

export async function getClientUsers(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const includeInactive = req.query.includeInactive === "true";
    const users = await fetchClientUserSummaries(context.clientId, {
      includeInactive,
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching client users:", error);
    res
      .status(500)
      .json({ message: "Failed to load client users", error: error.message });
  }
}

export async function createClientUser(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ message: "A valid email address is required" });
    }

    const roleType = String(req.body.roleType || "").toLowerCase();
    if (!SUPPORTED_ROLE_TYPES.has(roleType)) {
      return res
        .status(400)
        .json({ message: "roleType must be client_admin or client_team" });
    }

    let user = await UsersDAO.findByEmail(normalizedEmail);
    if (!user) {
      const placeholder = crypto
        .randomBytes(TEMP_PASSWORD_BYTES)
        .toString("hex");
      const hashedPassword = await bcrypt.hash(placeholder, 10);
      user = await UsersDAO.create({
        email: normalizedEmail,
        password_hash: hashedPassword,
        is_active: false,
        email_verified: false,
      });
    }

    await ensureUserTenantIsolation(user.userId, context.clientId);

    await upsertRoleAssignment({
      user,
      clientId: context.clientId,
      roleType,
      payload: { ...req.body, email: normalizedEmail },
    });

    const summary = await getUserSummary(user.userId, context.clientId, {
      includeInactive: true,
    });

    res.status(201).json({
      message: "User provisioned",
      user: summary ?? { userId: user.userId, email: user.email },
    });
  } catch (error) {
    console.error("Error creating client user:", error);
    res
      .status(error.statusCode ?? 500)
      .json({ message: "Failed to create client user", error: error.message });
  }
}

export async function updateClientUser(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await UsersDAO.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleType = String(req.body.roleType || "").toLowerCase();
    if (!SUPPORTED_ROLE_TYPES.has(roleType)) {
      return res
        .status(400)
        .json({ message: "roleType must be client_admin or client_team" });
    }

    await ensureUserTenantIsolation(user.userId, context.clientId);

    await upsertRoleAssignment({
      user,
      clientId: context.clientId,
      roleType,
      payload: req.body,
    });

    const summary = await getUserSummary(user.userId, context.clientId, {
      includeInactive: true,
    });

    res.status(200).json({
      message: "User role updated",
      user: summary ?? { userId: user.userId, email: user.email },
    });
  } catch (error) {
    console.error("Error updating client user:", error);
    res
      .status(error.statusCode ?? 500)
      .json({ message: "Failed to update client user", error: error.message });
  }
}

export async function getSubscriptionHistory(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const limit = Number(req.query.limit) || 50;
    const history = await ClientSubscriptionHistoryDAO.findByClientId(
      context.clientId,
      { limit }
    );

    res.status(200).json({
      history: history.map(toJSON),
    });
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    res
      .status(500)
      .json({
        message: "Failed to load subscription history",
        error: error.message,
      });
  }
}

export async function addSubscriptionSnapshot(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const {
      periodStart,
      periodEnd,
      subscriptionTier,
      planStatus,
      seatsIncluded,
      seatsInUse,
      mrr,
      arr,
      renewalDate,
      notes,
    } = req.body;

    if (!periodStart || !periodEnd || !subscriptionTier) {
      return res
        .status(400)
        .json({
          message: "periodStart, periodEnd, and subscriptionTier are required",
        });
    }

    const snapshot = await ClientSubscriptionHistoryDAO.create({
      client_id: context.clientId,
      period_start: periodStart,
      period_end: periodEnd,
      subscription_tier: subscriptionTier,
      plan_status: planStatus || "active",
      seats_included: seatsIncluded ?? null,
      seats_in_use: seatsInUse ?? null,
      mrr: mrr ?? null,
      arr: arr ?? null,
      renewal_date: renewalDate ?? null,
      notes: notes ?? null,
      recorded_by: context.userId,
    });

    res.status(201).json({
      message: "Subscription snapshot recorded",
      snapshot: snapshot.toJSON(),
    });
  } catch (error) {
    console.error("Error creating subscription snapshot:", error);
    res
      .status(500)
      .json({
        message: "Failed to create subscription snapshot",
        error: error.message,
      });
  }
}

export async function getFeatureFlags(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const onlyEnabled = req.query.onlyEnabled === "true";
    const flags = await ClientFeatureFlagsDAO.list({
      clientId: context.clientId,
    });
    const filteredFlags = onlyEnabled
      ? flags.filter((flag) => flag.isEnabled)
      : flags;

    res.status(200).json({
      featureFlags: filteredFlags.map(toJSON),
    });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    res
      .status(500)
      .json({ message: "Failed to load feature flags", error: error.message });
  }
}

export async function updateFeatureFlag(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const { featureKey } = req.params;
    const {
      isEnabled,
      rolloutStrategy,
      targetSegments,
      featureName,
      description,
    } = req.body;

    if (typeof isEnabled !== "boolean") {
      return res
        .status(400)
        .json({ message: "isEnabled must be provided as a boolean" });
    }

    const flag = await ClientFeatureFlagsDAO.toggleFeature(
      context.clientId,
      featureKey,
      isEnabled,
      {
        userId: context.userId,
        strategy: rolloutStrategy,
        targetSegments,
        featureName,
        description,
      }
    );

    if (featureKey === PLAN_FEATURE_KEY) {
      await syncPlanRolePermissions(
        context.clientId,
        flag.isEnabled,
        context.userId
      );
    }

    res.status(200).json({
      message: "Feature flag updated",
      featureFlag: flag.toJSON(),
    });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    res
      .status(500)
      .json({ message: "Failed to update feature flag", error: error.message });
  }
}

export async function getInstanceConfigurations(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const configs = await ClientInstanceConfigurationsDAO.list({
      clientId: context.clientId,
    });

    res.status(200).json({
      configurations: configs.map(toJSON),
    });
  } catch (error) {
    console.error("Error fetching instance configurations:", error);
    res
      .status(500)
      .json({
        message: "Failed to load instance configurations",
        error: error.message,
      });
  }
}

export async function upsertInstanceConfiguration(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const { configKey } = req.params;
    const { value, description, isLocked } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: "value is required" });
    }

    const config = await ClientInstanceConfigurationsDAO.upsertByKey(
      context.clientId,
      configKey,
      value,
      {
        description,
        isLocked,
        updatedBy: context.userId,
      }
    );

    res.status(200).json({
      message: "Configuration saved",
      configuration: config.toJSON(),
    });
  } catch (error) {
    console.error("Error saving instance configuration:", error);
    res
      .status(500)
      .json({ message: "Failed to save configuration", error: error.message });
  }
}

export async function getGlossaryTerms(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const terms = await ClientGlossaryTermsDAO.list({
      clientId: context.clientId,
      limit: Number(req.query.limit) || 200,
    });

    res.status(200).json({
      glossary: terms.map(toJSON),
    });
  } catch (error) {
    console.error("Error fetching glossary terms:", error);
    res
      .status(500)
      .json({ message: "Failed to load glossary terms", error: error.message });
  }
}

export async function createGlossaryTerm(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const { term, definition, category, status = "active" } = req.body;

    if (!term || !definition) {
      return res
        .status(400)
        .json({ message: "term and definition are required" });
    }

    const record = await ClientGlossaryTermsDAO.create({
      client_id: context.clientId,
      term,
      definition,
      category: category ?? null,
      status,
      created_by: context.userId,
      updated_by: context.userId,
    });

    res.status(201).json({
      message: "Glossary term created",
      term: record.toJSON(),
    });
  } catch (error) {
    console.error("Error creating glossary term:", error);
    res
      .status(500)
      .json({
        message: "Failed to create glossary term",
        error: error.message,
      });
  }
}

export async function updateGlossaryTerm(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const termId = Number(req.params.termId);
    if (!Number.isInteger(termId)) {
      return res.status(400).json({ message: "Invalid glossary term id" });
    }

    const existing = await ClientGlossaryTermsDAO.findById(termId);
    if (!existing || existing.clientId !== context.clientId) {
      return res.status(404).json({ message: "Glossary term not found" });
    }

    const { term, definition, category, status, lastReviewedAt } = req.body;
    const updates = {};

    if (term !== undefined) updates.term = term;
    if (definition !== undefined) updates.definition = definition;
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;
    if (lastReviewedAt !== undefined) updates.last_reviewed_at = lastReviewedAt;
    updates.updated_by = context.userId;

    const updated = await ClientGlossaryTermsDAO.updateById(termId, updates);

    res.status(200).json({
      message: "Glossary term updated",
      term: updated.toJSON(),
    });
  } catch (error) {
    console.error("Error updating glossary term:", error);
    res
      .status(500)
      .json({
        message: "Failed to update glossary term",
        error: error.message,
      });
  }
}

export async function deleteGlossaryTerm(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const termId = Number(req.params.termId);
    if (!Number.isInteger(termId)) {
      return res.status(400).json({ message: "Invalid glossary term id" });
    }

    const existing = await ClientGlossaryTermsDAO.findById(termId);
    if (!existing || existing.clientId !== context.clientId) {
      return res.status(404).json({ message: "Glossary term not found" });
    }

    await ClientGlossaryTermsDAO.deleteById(termId);

    res.status(200).json({ message: "Glossary term deleted" });
  } catch (error) {
    console.error("Error deleting glossary term:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete glossary term",
        error: error.message,
      });
  }
}

export async function getApiKeys(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const includeRevoked = req.query.includeRevoked === "true";
    const keys = await ClientApiKeysDAO.list({
      clientId: context.clientId,
      includeRevoked,
    });

    res.status(200).json({
      apiKeys: keys.map(toJSON),
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res
      .status(500)
      .json({ message: "Failed to load API keys", error: error.message });
  }
}

export async function createApiKey(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const {
      name,
      description,
      hashedKey,
      scopes = ["read"],
      environment = "production",
    } = req.body;

    if (!name || !hashedKey) {
      return res
        .status(400)
        .json({ message: "name and hashedKey are required" });
    }

    const apiKey = await ClientApiKeysDAO.create({
      client_id: context.clientId,
      name,
      description: description ?? null,
      hashed_key: hashedKey,
      scopes,
      environment,
      created_by: context.userId,
    });

    res.status(201).json({
      message: "API key metadata stored",
      apiKey: apiKey.toJSON(),
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    res
      .status(500)
      .json({ message: "Failed to create API key", error: error.message });
  }
}

export async function revokeApiKey(req, res) {
  const context = getClientContext(req, res);
  if (!context) return;

  try {
    const apiKeyId = Number(req.params.apiKeyId);
    if (!Number.isInteger(apiKeyId)) {
      return res.status(400).json({ message: "Invalid API key id" });
    }

    const record = await ClientApiKeysDAO.findById(apiKeyId);
    if (!record || record.clientId !== context.clientId) {
      return res.status(404).json({ message: "API key not found" });
    }

    const revoked = await ClientApiKeysDAO.revokeById(apiKeyId, context.userId);

    res.status(200).json({
      message: "API key revoked",
      apiKey: revoked.toJSON(),
    });
  } catch (error) {
    console.error("Error revoking API key:", error);
    res
      .status(500)
      .json({ message: "Failed to revoke API key", error: error.message });
  }
}
