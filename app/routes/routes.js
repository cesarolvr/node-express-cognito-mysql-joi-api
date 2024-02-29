import { create, getLogs } from "../controllers/controller.js";
import { Router } from "express";

export default (app) => {
  var router = Router();

  // Create a new log
  router.post("/logs/create", create);

  // Retrieve all logs
  router.get("/logs", getLogs);

  // // Retrieve all published logs
  // router.get("/published", logs.findAllPublished);

  // // Retrieve a single log with id
  // router.get("/:id", logs.findOne);

  // // Update a log with id
  // router.put("/:id", logs.update);

  // // Delete a log with id
  // router.delete("/:id", logs.delete);

  // // Delete all logs
  // router.delete("/", logs.deleteAll);

  app.use(router);
};
