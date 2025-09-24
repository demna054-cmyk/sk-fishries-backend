import Joi from "joi";

export const expenseValidator = Joi.object({
  category: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  date: Joi.date().required(),
  paymentMethod: Joi.string()
    .valid("Cash", "Bank Transfer", "Credit Card", "Cheque")
    .required(),
  vendor: Joi.string().allow("", null),
  status: Joi.string().valid("Paid", "Pending", "Overdue").default("Pending"),
  invoiceNumber: Joi.string().allow("", null),
});
