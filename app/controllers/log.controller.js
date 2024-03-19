import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Log = db.Log;

// Utils
import { getParam } from "../utils/getParam.js";

// Logs
export const createLog = (req, res) => {
  // check if this user has the permission to create log in this journey?

  const payload = req?.body;
  const journeyId = getParam(req?.params, "journeyid");

  const payloadChecked = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    description: Joi.string().allow("").min(3).max(140),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const { title, description } = value;

  const id = uuidv4();

  Log.create({
    id,
    title,
    description,
    quality: 0,
    journeyId,
  })
    .then((data) => {
      console.log(data);
      res.status(201).send({
        message: "Log created",
        id,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Log.",
      });
    });
};

export const getLogs = (req, res) => {
  // check if this user has the permission to get this logs?
  const journeyId = getParam(req?.params, "journeyid");

  Log.findAll({
    where: {
      journeyId,
    },
  })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Log.",
      });
    });
};

export const deleteLog = (req, res) => {
  // check if this user has the permission to delete this one?
  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  Log.destroy({
    where: { id: logId, journeyId },
  })
    .then((data) => {
      const wasSomethingUpdated = data;
      if (wasSomethingUpdated === 1) {
        res.status(200).send({
          message: "Deleted with success",
        });
      } else {
        res.status(404).send({
          message: "Log not found or already deleted",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while deleting the Log.",
      });
    });
};

export const updateLog = (req, res) => {
  const payload = req?.body;

  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  const payloadChecked = Joi.object({
    title: Joi.string().min(3).max(20),
    description: Joi.string().allow("").min(3).max(140),
    quality: Joi.number(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const validatedPayload = {
    ...value,
  };

  Log.update(validatedPayload, {
    where: { id: logId, journeyId },
  })
    .then((data) => {
      const wasSomethingUpdated = data[0];
      if (wasSomethingUpdated) {
        res.status(200).send({
          message: `Log ${logId} updated`,
        });
      } else {
        res.status(404).send({
          message: `Log not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the Log.",
      });
    });
};

export const getLogById = (req, res) => {
  // check if this user has the permission to get this logs?
  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  Log.findOne({
    where: {
      journeyId,
      id: logId,
    },
  })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({
          message: `Log not found or already deleted`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Log.",
      });
    });
};
