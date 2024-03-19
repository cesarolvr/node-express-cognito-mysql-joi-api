import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Plan = db.Plan;

// Plan
export const createPlan = (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    name: Joi.string().min(3).max(140).required(),
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

  const { name, price, duration, trialTime, automaticRenew } = value;

  Plan.create({
    id: uuidv4(),
    name,
    price,
    duration,
    trialTime,
    automaticRenew: true,
  })
    .then((data) => {
      console.log(data);
      res.status(201).send({
        message: "Plan created",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Plan.",
      });
    });
};
export const getPlans = (req, res) => {
  Plan.findAll()
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
export const deletePlan = (req, res) => {
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

  Plan.destroy({
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
          message: "Plan not deleted or already deleted",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: err.message || "Some error occurred while deleting this plan.",
      });
    });
};

export const updatePlan = (req, res) => {
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

  Plan.update(validatedPayload, {
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
          message: "Plan not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting this plan.",
      });
    });
};
