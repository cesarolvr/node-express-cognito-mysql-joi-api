import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Model
import db from "../models/index.js";
const User = db.User;

// Signin
export const signin = async (req, res) => {
  try {
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

    const { email, password } = value;

    const user = await User.scope("withPassword").findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(404).send({ message: "Invalid email or password" });
    }

    // Authenticate with JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 900,
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while signin.",
    });
  }
};
