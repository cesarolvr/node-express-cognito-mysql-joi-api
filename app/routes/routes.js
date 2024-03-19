import {
  createLog,
  getLogs,
  getLogById,
  deleteLog,
  updateLog,
} from "../controllers/log.controller.js";

import {
  createJourney,
  getJourneys,
  getJourneyById,
  deleteJourney,
  updateJourney,
} from "../controllers/journey.controller.js";

import {
  createPlan,
  getPlans,
  getPlanById,
  deletePlan,
  updatePlan,
} from "../controllers/plan.controller.js";

import { Router } from "express";

export default (app) => {
  var router = Router();

  // TODO: Change to see only the verb instead a specific action endpoints

  // Plans
  router.post("/plan", createPlan);
  router.get("/plans", getPlans);
  router.get("/plan/:id", getPlanById);
  router.delete("/plan/:id", deletePlan);
  router.put("/plan/:id", updatePlan);

  // Journeys
  router.post("/journey", createJourney);
  router.get("/journeys/", getJourneys);
  router.get("/journey/:journeyId", getJourneyById);
  router.delete("/journey/:journeyId", deleteJourney);
  router.put("/journey/:journeyId", updateJourney);

  // Logs
  router.post("/journey/:journeyId/log", createLog);
  router.get("/journey/:journeyId/logs", getLogs);
  router.get("/journey/:journeyId/log/:id", getLogById);
  router.delete("/journey/:journeyId/log", deleteLog);
  router.put("/journey/:journeyId/log", updateLog);

  // // Retrieve a single log with id
  // router.get("/:id", logs.findOne);

  // // Update a log with id
  // router.put("/:id", logs.update);

  // // Delete all logs
  // router.delete("/", logs.deleteAll);

  app.use(router);
};
