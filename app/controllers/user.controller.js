import Joi from "joi";
import AWS from "aws-sdk";

// Utils
import { getParam } from "../utils/getParam.js";

// Model
import db from "../models/index.js";
const User = db.User;

// Utils
import {
  signUp,
  confirm,
  resend,
  getUser as getCognitoUser,
  updateUser as updateCognitoUser,
  deleteUser as deleteCognitoUser,
} from "../services/auth.service.js";

// Services
import { isAuthenticated as isAuthenticatedService } from "../services/auth.service.js";

const awsConfig = {
  region: process.env.COGNITO_REGION,
};

// User
export const createUser = async (req, res) => {
  const payload = req?.body;
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
    // Create on Cognito
    const cognitoUser = await signUp({ email, password }, [
      { Name: "email", Value: email },
      { Name: "picture", Value: picture },
      { Name: "name", Value: name },
    ]);

    // Create locally
    const localUser = await User.create({
      id: cognitoUser.UserSub,
      name,
      email,
      confirmed: cognitoUser.UserConfirmed,
    });

    res.status(200).send({
      message: "Created with success.",
      user: {
        1: cognitoUser,
        2: localUser,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating this user.",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = getParam(req?.params, "id");

  const { userInfo, accessToken } = req;
  const isThisUserItSelf = id === userInfo.username;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  // COGNITO DELETION COMES HERE

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

export const updateUser = async (req, res) => {
  const payload = req?.body;
  const id = getParam(req?.params, "id");

  const { userInfo, accessToken } = req;
  const isThisUserItSelf = id === userInfo.username;

  const isAuthenticated = await isAuthenticatedService(accessToken);

  if (!isAuthenticated) {
    res.status(401).send({
      message: "User not authenticated.",
    });
    return;
  }

  // COGNITO UPDATE COMES HERE

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

  // Local update
  User.update(
    { validatedPayload },
    {
      where: { id },
    }
  )
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

export const getUser = async (req, res) => {
  const { userInfo, accessToken } = req;

  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  try {
    // Remote get
    const users = await cognitoIdentify
      .getUser({
        AccessToken: accessToken,
      })
      .promise();

    if (users.Username) {
      // Local get
      const localUser = await User.findOne({
        where: {
          id: userInfo.username,
        },
      });

      if (localUser) {
        res.status(200).send({ ...localUser, ...users });
      } else {
        res.status(200).send({ ...users });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while getting this user.",
    });
  }
};

export const confirmSignup = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
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

    if (!result?.error) {
      User.update(
        { confirmed: 1 },
        {
          where: { email: value?.email },
        }
      );
    }

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
