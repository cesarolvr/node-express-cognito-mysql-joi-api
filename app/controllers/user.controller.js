import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

// Model
import db from "../models/index.js";
const User = db.User;

// Plan
export const createUser = (f) => f;
export const getUser = (f) => f;
export const deleteUser = (f) => f;
export const updateUser = (f) => f;
