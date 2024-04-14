import Joi from "joi";

export const createWaterPortionSchema = Joi.object({
    waterVolume: Joi.number().max(5000).required(),
    date: Joi.date().required(),
    owner: Joi.string(),
});
