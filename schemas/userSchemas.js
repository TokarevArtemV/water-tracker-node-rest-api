import Joi from "joi";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants/regexPatterns.js";
import {
  EMAIL_ERROR_MESSAGES,
  PASSWORD_ERROR_MESSAGES,
} from "../constants/userConstants.js";

const emailField = {
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    // .required()
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

//email required() ?
//всі паролі  required() ??

const userDataUpdateSchema = Joi.object({
  ...emailField,
  gender: Joi.string().valid("male", "female"),
  username: Joi.string().max(32),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(PASSWORD_REGEX)
    .messages(PASSWORD_ERROR_MESSAGES),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(PASSWORD_REGEX)
    .messages(PASSWORD_ERROR_MESSAGES),
})
  .min(1)
  .message("Body must have at least one field"); //

const userWaterRateSchema = Joi.object({
  waterRate: Joi.number().required().min(1).max(15000),
});

const userVerifyEmailSchema = Joi.object({
  ...emailField,
});

export default {
  authSchema,
  userDataUpdateSchema,
  userWaterRateSchema,
  userVerifyEmailSchema,
};
