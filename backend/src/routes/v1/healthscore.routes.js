import express from "express";
import {
  getHealthScores,
  upsertHealthScores,
  getAllCustomers,
} from "../../controllers/healthscore.controllers.js";
import { verifyAuth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/casbin.middleware.js";

const healthScoreRoutes = express.Router();

healthScoreRoutes.use(verifyAuth);

healthScoreRoutes.get("/", authorize("get"), getHealthScores);
healthScoreRoutes.get("/customers", authorize("get"), getAllCustomers);
healthScoreRoutes.post("/:accountId", authorize("post"), upsertHealthScores);

export default healthScoreRoutes;
