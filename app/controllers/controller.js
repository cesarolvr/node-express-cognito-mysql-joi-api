import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const Log = db.Logs;

export const create = (req, res) => {
  const payload = req?.body;

  const logCreationSchema = Joi.object({
    title: Joi.string().alphanum().min(3).max(20).required(),
    description: Joi.string().min(3).max(140),
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
  })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Log.",
      });
    });
};

// export const findAll = (req, res) => {
//   const title = req.query.title;

//   Log.getAll(title, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving logs.",
//       });
//     else res.send(data);
//   });
// };

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
