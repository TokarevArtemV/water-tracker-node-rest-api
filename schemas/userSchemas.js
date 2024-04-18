import Joi from "joi";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants/regexPatterns.js";
import {
  EMAIL_ERROR_MESSAGES,
  PASSWORD_ERROR_MESSAGES,
} from "../constants/userConstants.js";

const emailField = {
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages(EMAIL_ERROR_MESSAGES),
};

const passwordField = {
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(PASSWORD_REGEX)
    .required()
    .messages(PASSWORD_ERROR_MESSAGES),
};

const authSchema = Joi.object({
  ...emailField,
  ...passwordField,
});

const userDataUpdateSchema = Joi.object({
  ...emailField,
  ...passwordField,
  oldPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(PASSWORD_REGEX)
    .required()
    .messages(PASSWORD_ERROR_MESSAGES),
  gender: Joi.string().valid("male", "female"),
  username: Joi.string().max(32),
});

const userWaterRateSchema = Joi.object({
  waterRate: Joi.number().required().min(1).max(15000),
});

const userVerifyEmailSchema = Joi.object({
  ...emailField,
});

const userTokenSchema = Joi.object({
  token: Joi.string().required(),
});

export default {
  authSchema,
  userDataUpdateSchema,
  userWaterRateSchema,
  userVerifyEmailSchema,
  userTokenSchema,
};
