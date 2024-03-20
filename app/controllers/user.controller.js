import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Utils
import { getParam } from "../utils/getParam.js";

// Model
import db from "../models/index.js";
const User = db.User;

// Signup
// export const signup = async (req, res) => {
//   const payload = req?.body;

//   const payloadChecked = Joi.object({
//     username: Joi.string().min(3).max(30).required(),
//     email: Joi.string().required().email({ minDomainSegments: 2 }),
//     password: Joi.string().min(8).max(30).required(),
//     confirm_password: Joi.any().valid(Joi.ref("password")).required(),
//   });

//   const { error, value } = payloadChecked.validate(payload);

//   if (error) {
//     return res.status(400).send({
//       message: error.message,
//     });
//   }

//   const validatedPayload = {
//     ...value,
//   };

//   const { name, email, password } = req.body;

//   const userExists = await db.User.findOne({
//     where: { email },
//   });

//   if (userExists) {
//     return res.status(400).send({
//       message: "This email is already used",
//     });
//   }

//   User.findAll()
//     .then((data) => {
//       console.log(data);
//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while getting the user.",
//       });
//     });
// };

// User
export const createUser = async (req, res) => {
  // check if this user has the permission to create log in this journey?

  const payload = req?.body;

  const payloadChecked = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30).required(),
    confirm_password: Joi.any().valid(Joi.ref("password")).required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const { username, email, password } = value;

  const userExists = await User.findOne({
    where: { email },
  });

  if (userExists) {
    return res.status(400).send({
      message: "This email is already used",
    });
  }

  const id = uuidv4();

  User.create({
    id,
    username,
    email,
    password,
  })
    .then((data) => {
      console.log('aaa', data);
      res.status(201).send({
        message: "User created",
        id,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Plan.",
      });
    });
};

export const deleteUser = (req, res) => {
  // check if this user has the permission to delete this one?
  const id = getParam(req?.params, "id");

  User.destroy({
    where: { id },
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
export const updateUser = (req, res) => {
  const payload = req?.body;
  const id = getParam(req?.params, "id");

  const payloadChecked = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().min(8).max(30),
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

  User.update(validatedPayload, {
    where: { id },
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

export const getUserById = (req, res) => {
  // check if this user has the permission to get this logs?
  const id = getParam(req?.params, "id");

  User.findOne({
    where: {
      id,
    },
  })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({
          message: `User not found or already deleted`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the plan.",
      });
    });
};
