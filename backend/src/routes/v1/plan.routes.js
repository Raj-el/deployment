import express from "express";
import {
  generateAIPlan,
  createManualPlan,
  createTemplate,
  editPlan,
  recordOutcome,
  getCompanyClientPlans,
  getPlanById,
  deletePlan,
} from "../../controllers/plan.controllers.js";
import { verifyAuth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/casbin.middleware.js";

const planRoutes = express.Router();

planRoutes.get(
  "/company/clients",
  verifyAuth,
  authorize("get"),
  getCompanyClientPlans
);

/**
 * Create a plan (AI or manual)
 * POST /api/v1/plans/ai/:accountId
 * POST /api/v1/plans/manual/:accountId
 */
planRoutes.post(
  "/ai/:accountId",
  verifyAuth,
  authorize("post"),
  generateAIPlan
);

planRoutes.post(
  "/manual/:accountId",
  verifyAuth,
  authorize("post"),
  createManualPlan
);

/**
 * Create template
 * POST /api/v1/plans/templates
 */
planRoutes.post(
  "/templates",
  verifyAuth,
  authorize("post"),
  createTemplate
);

/**
 * Update plan details or outcomes
 * PATCH /api/v1/plans/:planId/edit
 * PATCH /api/v1/plans/:planId/outcome
 */
planRoutes.patch(
  "/:planId/edit",
  verifyAuth,
  authorize("patch"),
  editPlan
);

planRoutes.patch(
  "/:planId/outcome",
  verifyAuth,
  authorize("patch"),
  recordOutcome
);

/**
 * Read and delete endpoints
 */
planRoutes.get("/:planId", verifyAuth, authorize("get"), getPlanById);

planRoutes.delete("/:planId", verifyAuth, authorize("delete"), deletePlan);

export default planRoutes;
