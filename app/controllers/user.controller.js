import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Utils
import { getParam } from "../utils/getParam.js";

// Model
import db from "../models/index.js";
const User = db.User;

// Utils
import { signUp, confirm, resend } from "../services/auth.service.js";

// User
export const createUser = async (req, res) => {
  // check if this user has the permission to create log in this journey?
  const payload = req?.body;
  // const session = req?.session
  const payloadChecked = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .regex(
        /^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/
      )
      .required(),
    confirm_password: Joi.any().valid(Joi.ref("password")).required(),
    picture: Joi.string().uri().required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  const { name, email, password, picture } = value;

  try {
    const result = await signUp({ email, password }, [
      { Name: "email", Value: email },
      { Name: "picture", Value: picture },
      { Name: "name", Value: name },
    ]);
    res.status(200).send({
      message: "Created with success.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating this user.",
    });
  }

  // const userExists = await User.findOne({
  //   where: { email },
  // });

  // if (userExists) {
  //   return res.status(400).send({
  //     message: "This email is already used",
  //   });
  // }

  // const id = uuidv4();

  // User.create({
  //   id,
  //   username,
  //   email,
  //   password,
  // })
  //   .then((data) => {
  //     console.log("aaa", data);
  //     res.status(201).send({
  //       message: "User created",
  //       id,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || "Some error occurred while creating the Plan.",
  //     });
  //   });
};

export const deleteUser = (req, res) => {
  const id = getParam(req?.params, "id");

  const { userInfo } = req;
  const isThisUserItSelf = id === userInfo.id;

  if (!isThisUserItSelf) {
    return res.status(401).send({
      message: "You cannot delete this user",
    });
  }

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

  const { userInfo } = req;
  const isThisUserItSelf = id === userInfo.id;

  if (!isThisUserItSelf) {
    return res.status(401).send({
      message: "You cannot update this user",
    });
  }

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
  const id = getParam(req?.params, "id");

  const { userInfo } = req;
  const isThisUserItSelf = id === userInfo.id;

  if (!isThisUserItSelf) {
    return res.status(401).send({
      message: "You cannot see this user",
    });
  }

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
          message: `User not found or already deleted.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the plan.",
      });
    });
};

export const confirmSignup = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    code: Joi.string().required().min(6).max(6),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    const result = await confirm(value);
    console.log("result", result);
    res.status(200).send({
      message: `User confirmed.`,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message, error });
  }
};

export const resendCode = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    username: Joi.string().min(3).max(30).required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    const result = await resend(value);
    console.log("result", result);
    res.status(200).send({
      message: `Code resent to ${result?.CodeDeliveryDetails?.Destination}.`,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message, error });
  }
};
