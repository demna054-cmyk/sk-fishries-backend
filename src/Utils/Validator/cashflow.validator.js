import Joi from "joi";

// ✅ Add Transaction
export const addTransactionValidator = Joi.object({
  type: Joi.string().valid("paid", "received").required().messages({
    "any.only": "Type must be either paid or received",
    "any.required": "Transaction type is required",
  }),
  toFrom: Joi.string().required().messages({
    "string.empty": "To/From field is required",
  }),
  reason: Joi.string().required().messages({
    "string.empty": "Reason is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Invalid date",
    "any.required": "Date is required",
  }),
  amount: Joi.number().min(1).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
});
