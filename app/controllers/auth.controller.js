import Joi from "joi";

// Model
import db from "../models/index.js";
const User = db.User;

// Utils
import {
  signin as signinService,
  signout as signoutService,
  resetPassword as resetPasswordService,
  resetPasswordConfirmation as resetPasswordConfirmationService,
} from "../services/auth.service.js";

// Voltar token de login logo após criar o usuário já automaticamente
// Signin
export const signin = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30).required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    const result = await signinService(value?.email, value?.password);
    res.status(200).send({
      message: "Logged with success.",
      user: result,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating this user.",
    });
  }
};

export const signout = async (req, res) => {
  const { accessToken } = req;

  try {
    const result = await signoutService(accessToken);
    res.status(200).send({
      message: "Disconnected with success.",
      user: result,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while disconnecting.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    email: Joi.string().required().email(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    const result = await resetPasswordService(value?.email);
    res.status(200).send({
      message: "Confirmation code was sent.",
      user: result,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while reseting the password.",
    });
  }
};

export const resetPasswordConfirmation = async (req, res) => {
  const payload = req?.body;

  const payloadChecked = Joi.object({
    email: Joi.string().required().email(),
    code: Joi.string().required().min(6).max(6),
    newPassword: Joi.string()
      .regex(
        /^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/
      )
      .required(),
  });

  const { error, value } = payloadChecked.validate(payload);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    const result = await resetPasswordConfirmationService(
      value?.email,
      value?.newPassword,
      value?.code
    );
    res.status(200).send({
      message: "Password changed. Try sign-in.",
      user: result,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while reseting password.",
    });
  }
};
