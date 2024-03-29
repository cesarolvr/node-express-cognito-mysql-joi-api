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
  confirmSignup,
  resendCode,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

import {
  signin,
  signout,
  resetPassword,
  resetPasswordConfirmation,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

import { Router } from "express";

export default (app) => {
  var router = Router();

  // Auth
  router.post("/signin", signin);
  router.post("/signout", signout);
  router.post("/confirm", confirmSignup);
  router.post("/resend-code", resendCode);
  router.post("/reset-password", resetPassword);
  router.post("/reset-password-confirmation", resetPasswordConfirmation);

  // Plans -> Close this routes before launch
  router.post("/plan", createPlan);
  router.get("/plans", getPlans);
  router.get("/plan/:id", getPlanById);
  router.delete("/plan/:id", deletePlan);
  router.put("/plan/:id", updatePlan);

  app.use(["/user", "/journeys", "/journey", "/signout"], authMiddleware);

  // Users
  router.post("/signup", createUser);
  router.get("/user/", getUser);
  router.delete("/user/", deleteUser);
  router.put("/user/", updateUser);

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
