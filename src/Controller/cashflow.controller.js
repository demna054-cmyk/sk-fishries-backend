import CashFlow from "../DB/Model/cashflow.model.js";  
import { addTransactionValidator } from "../Utils/Validator/cashflow.validator.js"; 

// ✅ Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { error } = addTransactionValidator.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const transaction = await CashFlow.create(req.body);

    return res.status(201).json({
      status: "success",
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ✅ Get All Transactions (with filter by type)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await CashFlow.find();

    // --- Summary Calculations ---
    let totalExpenses = 0;
    let paid = 0;
    let pending = 0;
    let overdue = 0;

    transactions.forEach((tx) => {
      totalExpenses += tx.amount || 0;

      // type/status check
      if (tx.status === "paid") {
        paid += tx.amount;
      } else if (tx.status === "pending") {
        pending += tx.amount;
      } else if (tx.status === "overdue") {
        overdue += tx.amount;
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Transactions fetched successfully",
      data: transactions,
      summary: {
        totalExpenses: `${totalExpenses.toLocaleString()}`,
        paid: `${paid.toLocaleString()}`,
        pending: `${pending.toLocaleString()}`,
        overdue: `${overdue.toLocaleString()}`
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};


// ✅ Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await CashFlow.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// ✅ Get Transaction By ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await CashFlow.findById(id);

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Update Transaction
export const updateTransaction = async (req, res) => {
  try {

    const { id } = req.params;
    const updated = await CashFlow.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Get Summary (Total Received, Paid, Net Balance)
export const getSummary = async (req, res) => {
  try {
    const transactions = await CashFlow.find();

    const totalReceived = transactions
      .filter((t) => t.type === "received")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPaid = transactions
      .filter((t) => t.type === "paid")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalReceived - totalPaid;

    return res.status(200).json({
      status: "success",
      message: "Summary fetched successfully",
      data: {
        totalReceived,
        totalPaid,
        netBalance,
        totalTransactions: transactions.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
