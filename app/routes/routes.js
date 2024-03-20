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

import {
  createUser,
  // getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

import { signin } from "../controllers/auth.controller.js";

import { Router } from "express";

export default (app) => {
  var router = Router();

  // Auth
  router.post("/signin", signin);

  // Plans
  router.post("/plan", createPlan);
  router.get("/plans", getPlans);
  router.get("/plan/:id", getPlanById);
  router.delete("/plan/:id", deletePlan);
  router.put("/plan/:id", updatePlan);

  // Users
  router.post("/signup", createUser);
  // router.get("/users/", getUsers);
  router.get("/user/:id", getUserById);
  router.delete("/user/:id", deleteUser);
  router.put("/user/:id", updateUser);

  // Journeys
  router.post("/journey", createJourney);
  router.get("/journeys/", getJourneys);
  router.get("/journey/:id", getJourneyById);
  router.delete("/journey/:id", deleteJourney);
  router.put("/journey/:id", updateJourney);

  // Logs
  router.post("/journey/:journeyid/log", createLog);
  router.get("/journey/:journeyid/logs", getLogs);
  router.get("/journey/:journeyid/log/:logid", getLogById);
  router.delete("/journey/:journeyid/log/:logid", deleteLog);
  router.put("/journey/:journeyid/log/:logid", updateLog);

  app.use(router);
};
