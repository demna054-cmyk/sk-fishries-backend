import Joi from "joi";

export const truckValidation = Joi.object({
  truckNo: Joi.string().required(),
  driver: Joi.string().required(),
  capacity: Joi.string().required(),
  destination: Joi.string().required(),
  status: Joi.string().valid("idle", "in-use").optional(),
});
