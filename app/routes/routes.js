import {
  createLog,
  getLogs,
  deleteLog,
  updateLog,
} from "../controllers/controller.js";
import { Router } from "express";

export default (app) => {
  var router = Router();

  // Logs
  router.post("/logs/create", createLog);
  router.get("/logs", getLogs);
  router.delete("/logs/delete", deleteLog);
  router.put("/logs/update", updateLog);

  // router.get("/published", logs.findAllPublished);

  // // Retrieve a single log with id
  // router.get("/:id", logs.findOne);

  // // Update a log with id
  // router.put("/:id", logs.update);

  // // Delete all logs
  // router.delete("/", logs.deleteAll);

  app.use(router);
};
