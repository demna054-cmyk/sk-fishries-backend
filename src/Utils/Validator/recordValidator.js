import Joi from "joi";

export const recordValidator = Joi.object({
  type: Joi.string().valid("purchase", "sale").required(),
  name: Joi.string().min(2).required(),
  date: Joi.date().required(),
  item: Joi.string().min(2).required(),
  weight: Joi.string().required(),
  price: Joi.number().min(0).required(),
  linkedTruck: Joi.string().optional(),
});
