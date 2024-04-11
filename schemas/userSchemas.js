import Joi from "joi";

import { emailRegexp } from "../constans/user-constants.js";

export const userRegisterSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "string.pattern.base": `Incorrect e-mail format` }),
  password: Joi.string().min(6).required(),
});
