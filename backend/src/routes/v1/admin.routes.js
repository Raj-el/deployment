import express from "express";
import {
  getClientUsers,
  createClientUser,
  updateClientUser,
  getSubscriptionHistory,
  addSubscriptionSnapshot,
  getFeatureFlags,
  updateFeatureFlag,
  getInstanceConfigurations,
  upsertInstanceConfiguration,
  getGlossaryTerms,
  createGlossaryTerm,
  updateGlossaryTerm,
  deleteGlossaryTerm,
  getApiKeys,
  createApiKey,
  revokeApiKey,
} from "../../controllers/admin.controllers.js";
import { verifyAuth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/casbin.middleware.js";

const adminRoutes = express.Router();

adminRoutes.use(verifyAuth);

// User management
adminRoutes.get("/users", authorize("get"), getClientUsers);
adminRoutes.post("/users", authorize("post"), createClientUser);
adminRoutes.patch("/users/:userId", authorize("patch"), updateClientUser);

// Subscription history
adminRoutes.get(
  "/subscriptions/history",
  authorize("get"),
  getSubscriptionHistory
);
adminRoutes.post(
  "/subscriptions/history",
  authorize("post"),
  addSubscriptionSnapshot
);

// Feature flags
adminRoutes.get("/feature-flags", authorize("get"), getFeatureFlags);
adminRoutes.patch(
  "/feature-flags/:featureKey",
  authorize("patch"),
  updateFeatureFlag
);

// Instance configurations
adminRoutes.get(
  "/instance-config",
  authorize("get"),
  getInstanceConfigurations
);
adminRoutes.put(
  "/instance-config/:configKey",
  authorize("patch"),
  upsertInstanceConfiguration
);

// Glossary management
adminRoutes.get("/glossary", authorize("get"), getGlossaryTerms);
adminRoutes.post("/glossary", authorize("post"), createGlossaryTerm);
adminRoutes.patch(
  "/glossary/:termId",
  authorize("patch"),
  updateGlossaryTerm
);
adminRoutes.delete(
  "/glossary/:termId",
  authorize("delete"),
  deleteGlossaryTerm
);

// API keys
adminRoutes.get("/api-keys", authorize("get"), getApiKeys);
adminRoutes.post("/api-keys", authorize("post"), createApiKey);
adminRoutes.post(
  "/api-keys/:apiKeyId/revoke",
  authorize("patch"),
  revokeApiKey
);

export default adminRoutes;
