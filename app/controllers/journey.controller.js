import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Journey = db.Journey;

// Utils
import { getParam } from "../utils/getParam.js";

// Services
import { isAuthenticated as isAuthenticatedService } from "../services/cognito.service.js";

// Journey
export const createJourney = async (req, res) => {
  const payload = req?.body;
  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const payloadChecked = Joi.object({
    name: Joi.string().min(3).max(140).required(),
    status: Joi.string(),
    icon: Joi.string().allow(""),
    type: Joi.string().allow(""),
    isPublic: Joi.boolean(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const { name, status, icon, type, isPublic } = value;

  const id = uuidv4();

  Journey.create({
    id,
    name,
    status: status || "IN PROGRESS",
    icon,
    type,
    userId: userInfo.username,
    isPublic: isPublic || false,
  })
    .then((data) => {
      const wasSomethingUpdated = data;
      if (wasSomethingUpdated) {
        res.status(200).send({
          message: `Journey created`,
          id,
        });
      } else {
        res.status(404).send({
          message: `Journey not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Journey.",
      });
    });
};

export const getJourneys = async (req, res) => {
  const { userInfo, accessToken } = req;
  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  Journey.findAll({
    where: {
      userId: userInfo.username,
    },
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the journey.",
      });
    });
};

export const deleteJourney = async (req, res) => {
  const { userInfo, accessToken } = req;
  const id = getParam(req?.params, "id");

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  Journey.destroy({
    where: { id, userId: userInfo.username },
  })
    .then((data) => {
      const wasSomethingUpdated = data;
      if (wasSomethingUpdated === 1) {
        res.status(200).send({
          message: "Deleted with success",
        });
      } else {
        res.status(404).send({
          message: "Journey not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while deleting this journey.",
      });
    });
};

export const updateJourney = async (req, res) => {
  const payload = req?.body;
  const { userInfo, accessToken } = req;
  const id = getParam(req?.params, "id");

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  const payloadChecked = Joi.object({
    name: Joi.string().min(3).max(140),
    price: Joi.number(),
    duration: Joi.number(),
    trialTime: Joi.number(),
    automaticRenew: Joi.boolean(),
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

  Journey.update(validatedPayload, {
    where: { id, userId: userInfo.username },
  })
    .then((data) => {
      const wasSomethingUpdated = data[0];
      if (wasSomethingUpdated) {
        res.status(200).send({
          message: "Updated with success",
        });
      } else {
        res.status(404).send({
          message: "Journey not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting this journey.",
      });
    });
};

export const getJourneyById = async (req, res) => {
  const id = getParam(req?.params, "id");
  const { userInfo, accessToken } = req;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(400).send({
      message: "User not authenticated.",
    });

    return;
  }

  Journey.findOne({ where: { id, userId: userInfo.username } })
    .then((data) => {
      console.log("data", data);
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(204).send({
          message: "No journey found.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the journey.",
      });
    });
};
