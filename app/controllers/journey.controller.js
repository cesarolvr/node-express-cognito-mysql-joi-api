import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Journey = db.Journey;

// Journey
export const createJourney = (req, res) => {
  const payload = req?.body;

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

  Journey.create({
    id: uuidv4(),
    name,
    status: status || "IN PROGRESS",
    icon,
    type,
    isPublic: isPublic || false,
  })
    .then((data) => {
      const wasSomethingUpdated = data;
      console.log({ wasSomethingUpdated });
      if (wasSomethingUpdated) {
        res.status(200).send({
          message: `Journey created`,
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

export const getJourneys = (req, res) => {
  Journey.findAll()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the journey.",
      });
    });
};

export const deleteJourney = (req, res) => {
  // check if this user has the permission to delete this one?

  const payload = req?.body;

  const payloadChecked = Joi.object({
    id: Joi.string().required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  Journey.destroy({
    where: { id: value?.id },
  })
    .then((data) => {
      const wasSomethingUpdated = data;
      if (wasSomethingUpdated === 1) {
        res.status(200).send({
          message: "Deleted with success",
        });
      } else {
        res.status(404).send({
          message: "Journey not deleted or already deleted",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message:
          err.message || "Some error occurred while deleting this journey.",
      });
    });
};

export const updateJourney = (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    id: Joi.string().required(),
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
    where: { id: value?.id },
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

export const getJourneyById = (f) => f;
