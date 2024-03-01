import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Log = db.Logs;

// User
export const createUser = (f) => f;
export const deleteUser = (f) => f;
export const getUser = (f) => f;
export const updateUser = (f) => f;

// Plan
export const createPlan = (f) => f;
export const deletePlan = (f) => f;
export const getPlan = (f) => f;
export const updatePlan = (f) => f;

// Journeys
export const createJourney = (f) => f;
export const deleteJourney = (f) => f;
export const getJourneys = (f) => f;
export const updateJourney = (f) => f;

// Logs
export const createLog = (req, res) => {
  const payload = req?.body;

  const logCreationSchema = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    description: Joi.string().allow("").min(3).max(140),
    journeyId: Joi.string().required(),
  });

  const { error, value } = logCreationSchema.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const { title, description } = value;

  Log.create({
    id: uuidv4(),
    title,
    description,
    quality: 0,
  })
    .then((data) => {
      console.log(data);
      res.status(201).send({
        message: "created",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Log.",
      });
    });
};

export const getLogs = (req, res) => {
  Log.findAll()
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
  const payload = req?.body;
  Log.destroy({
    where: { id: payload?.id },
  })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the Log.",
      });
    });
};

export const updateLog = (req, res) => {
  const payload = req?.body;

  const logUpdateSchema = Joi.object({
    id: Joi.required(),
    title: Joi.string().min(3).max(20),
    description: Joi.string().allow("").min(3).max(140),
    quality: Joi.number(),
  });

  const { error, value } = logUpdateSchema.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const validatedPayload = {
    ...value,
  };

  console.log(validatedPayload);

  Log.update(validatedPayload, {
    where: { id: value?.id },
  })
    .then((data) => {
      console.log(data);
      res.status(200).send({
        message: `log ${value.id} updated`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the Log.",
      });
    });
};

// export const findOne = (req, res) => {
//   Log.findById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found log with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving log with id " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

// export const findAllPublished = (req, res) => {
//   Log.getAllPublished((err, data) => {
//     if (err)
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving logs.",
//       });
//     else res.send(data);
//   });
// };

// export const update = (req, res) => {
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!",
//     });
//   }

//   console.log(req.body);

//   Log.updateById(req.params.id, new Log(req.body), (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found log with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error updating log with id " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

// export const deleteLog = (req, res) => {
//   Log.remove(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found log with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete log with id " + req.params.id,
//         });
//       }
//     } else res.send({ message: `Log was deleted successfully!` });
//   });
// };

// export const deleteAll = (req, res) => {
//   Log.removeAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all logs.",
//       });
//     else res.send({ message: `All logs were deleted successfully!` });
//   });
// };
