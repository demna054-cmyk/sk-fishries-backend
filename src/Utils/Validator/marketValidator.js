import joi from "joi";

export const createMarketValidator = joi.object({
  name: joi.string().required(),
  location: joi.string().required(),
  contactPerson: joi.string().required(),
  phone: joi.string().pattern(/^[0-9+ ]+$/).required(),
  fishTypes: joi.array().items(joi.string()).required(),
  avgPrice: joi.number().required(),
  investment: joi.number().required(),
  revenue: joi.number().required(),
  status: joi.string().valid("Active", "Inactive").default("Active"),
});
