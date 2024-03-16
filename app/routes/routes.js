import {
  createLog,
  getLogs,
  deleteLog,
  updateLog,
} from "../controllers/log.controller.js";

import {
  createPlan,
  getPlans,
  deletePlan,
} from "../controllers/plan.controller.js";
import { Router } from "express";

export default (app) => {
  var router = Router();

  // TODO: Change to see only the verb instead a specific action endpoints

  // Logs
  router.post("/log/create", createLog);
  router.get("/logs", getLogs);
  router.delete("/log/delete", deleteLog);
  router.put("/log/update", updateLog);

  // Plans
  router.post("/plan/", createPlan);
  router.get("/plans", getPlans);
  router.delete("/plan/", deletePlan);
  // router.put("/plan/update", updatePlan);

  // router.get("/published", logs.findAllPublished);

  // // Retrieve a single log with id
  // router.get("/:id", logs.findOne);

  // // Update a log with id
  // router.put("/:id", logs.update);

  // // Delete all logs
  // router.delete("/", logs.deleteAll);

  app.use(router);
};
