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
        message: "created",
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
export const deletePlan = (f) => f;
export const updatePlan = (f) => f;
