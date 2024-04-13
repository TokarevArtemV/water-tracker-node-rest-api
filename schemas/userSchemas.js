import Joi from "joi";

import { emailRegexp } from "../constans/user-constants.js";

export const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `The email must be in format water@gmail.com`,
  }),
  password: Joi.string().min(8).max(64).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `The email must be in format water@gmail.com`,
  }),
  password: Joi.string().min(8).max(64).required(),
});

export const userDataUpdateSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(8).max(64),
  oldPassword: Joi.string().min(8).max(64),
  gender: Joi.string().valid("male", "female"),
  username: Joi.string().max(32),
});

export const userWaterRateSchema = Joi.object({
  waterRate: Joi.number().required().min(1).max(15000),
});

export const userVerifyEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .message("Must be a valid email")
    .required(),
});
