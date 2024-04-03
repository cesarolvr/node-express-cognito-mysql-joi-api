import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Log = db.Log;
const Journey = db.Journey;

// Utils
import { getParam } from "../utils/getParam.js";

// Services
import { isAuthenticated as isAuthenticatedService } from "../services/cognito.service.js";

// Logs
export const createLog = async (req, res) => {
  const { userInfo, accessToken } = req;
  const payload = req?.body;
  const journeyId = getParam(req?.params, "journeyid");

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

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

  const JourneyTobeEdited = await Journey.findByPk(journeyId);

  if (!JourneyTobeEdited) {
    res.status(404).send({
      message: "Journey not found.",
    });
    return;
  }

  const { userId } = JourneyTobeEdited;
  const thisJourneyBelongsToThisUser = userId === userInfo.username;

  if (thisJourneyBelongsToThisUser) {
    Log.create({
      id,
      title,
      description,
      quality: 0,
      journeyId,
    })
      .then((data) => {
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
  } else {
    res.status(401).send({
      message: "You cannot edit this Journey.",
    });
  }
};

export const getLogs = async (req, res) => {
  const journeyId = getParam(req?.params, "journeyid");
  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const JourneyTobeEdited = await Journey.findByPk(journeyId);

  if (!JourneyTobeEdited) {
    res.status(404).send({
      message: "Journey not found.",
    });
    return;
  }

  const { userId } = JourneyTobeEdited;
  const thisJourneyBelongsToThisUser = userId === userInfo.username;

  if (thisJourneyBelongsToThisUser) {
    Log.findAll({
      where: {
        journeyId,
      },
    })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while getting the logs.",
        });
      });
  } else {
    res.status(401).send({
      message: "You cannot see these logs.",
    });
  }
};

export const deleteLog = async (req, res) => {
  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const JourneyTobeEdited = await Journey.findByPk(journeyId);

  if (!JourneyTobeEdited) {
    res.status(404).send({
      message: "Journey not found.",
    });
    return;
  }

  const { userId } = JourneyTobeEdited;
  const thisJourneyBelongsToThisUser = userId === userInfo.username;

  if (thisJourneyBelongsToThisUser) {
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
            message: "Log not found",
          });
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while deleting this log.",
        });
      });
  } else {
    res.status(401).send({
      message: "You cannot delete this log.",
    });
  }
};

export const updateLog = async (req, res) => {
  const payload = req?.body;

  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const JourneyTobeEdited = await Journey.findByPk(journeyId);

  if (!JourneyTobeEdited) {
    res.status(404).send({
      message: "Journey not found.",
    });
    return;
  }

  const { userId } = JourneyTobeEdited;
  const thisJourneyBelongsToThisUser = userId === userInfo.username;

  if (!thisJourneyBelongsToThisUser) {
    res.status(401).send({
      message: "You cannot update this log.",
    });
    return;
  }

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

export const getLogById = async (req, res) => {
  const journeyId = getParam(req?.params, "journeyid");
  const logId = getParam(req?.params, "logid");

  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const JourneyTobeEdited = await Journey.findByPk(journeyId);

  if (!JourneyTobeEdited) {
    res.status(404).send({
      message: "Journey not found.",
    });
    return;
  }

  const { userId } = JourneyTobeEdited;
  const thisJourneyBelongsToThisUser = userId === userInfo.username;

  if (!thisJourneyBelongsToThisUser) {
    res.status(401).send({
      message: "You cannot see this log.",
    });
    return;
  }

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
