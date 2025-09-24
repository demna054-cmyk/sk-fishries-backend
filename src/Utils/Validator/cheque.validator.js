import Joi from "joi";

// Add Cheque Validation
export const addChequeValidator = Joi.object({
  chequeNumber: Joi.string().required().messages({
    "string.empty": "Cheque number is required",
  }),
  type: Joi.string().valid("given", "received").required().messages({
    "any.only": "Type must be either given or received",
    "any.required": "Type is required",
  }),
  from: Joi.string().required().messages({
    "string.empty": "From (payer) is required",
  }),
  to: Joi.string().required().messages({
    "string.empty": "To (receiver) is required",
  }),
  amount: Joi.number().min(1).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Cheque date is required",
  }),
  status: Joi.string().valid("pending", "cleared").default("pending"),
});

// Update Status Validation
export const updateStatusValidator = Joi.object({
  status: Joi.string().valid("pending", "cleared").required().messages({
    "any.only": "Status must be either pending or cleared",
    "any.required": "Status is required",
  }),
});
