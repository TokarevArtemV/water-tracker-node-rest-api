import Joi from "joi";

export const createWaterPortionSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).required(),
  date: Joi.date().required(),
});

export const updateWaterPortionSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000),
  date: Joi.date(),
}).min(1);

export const todayWaterPortionSchema = Joi.object({
  timeZone: Joi.number().required(),
});
