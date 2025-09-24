import { Expense } from "../DB/Model/expense.model.js"; 
import { expenseValidator } from "../Utils/Validator/expenseValidator.js"; 

// ✅ Create Expense
export const createExpense = async (req, res) => {
  try {
    const { error, value } = expenseValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const expense = await Expense.create(value);

    return res.status(201).json({
      status: "success",
      message: "Expense created successfully",
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ✅ Get All Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });

    // 🔹 Calculate totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const paid = expenses
      .filter((e) => e.status === "Paid")
      .reduce((sum, e) => sum + e.amount, 0);
    const pending = expenses
      .filter((e) => e.status === "Pending")
      .reduce((sum, e) => sum + e.amount, 0);
    const overdue = expenses
      .filter((e) => e.status === "Overdue")
      .reduce((sum, e) => sum + e.amount, 0);

    return res.status(200).json({
      status: "success",
      message: "Expenses fetched successfully",
      summary: {
        totalExpenses, // total amount
        paid,          // completed payments
        pending,       // awaiting payments
        overdue        // past due payments
      },
      data: expenses, // all expense records
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};


// ✅ Get Single Expense
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: "error",
        message: "Expense not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ✅ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!expense) {
      return res.status(404).json({
        status: "error",
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ✅ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: "error",
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
