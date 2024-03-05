import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const User = db.User;

// User
export const createUser = (f) => {
  // check if this user has the permission to create log in this journey?

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

  User.create({
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
export const getUser = (f) => f;
export const deleteUser = (f) => f;
export const updateUser = (f) => f;
