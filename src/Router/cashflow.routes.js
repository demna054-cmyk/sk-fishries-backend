import express from "express";
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "../Controller/cashflow.controller.js";

const router = express.Router();

// ✅ Add Transaction
router.post("/create", addTransaction);

// ✅ Get All Transactions (with ?type=paid/received)
router.get("/get-all", getTransactions);

// ✅ Get Single Transaction by ID
router.get("/get-single/:id", getTransactionById);

// ✅ Update Transaction by ID
router.put("/update/:id", updateTransaction);

// ✅ Delete Transaction by ID
router.delete("/delete/:id", deleteTransaction);

// ✅ Get Summary (total received, total paid, net balance)
router.get("/transactions-summary", getSummary);

export default router;
