import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../Controller/expense.controller.js'
const router = express.Router();

router.post("/create", createExpense);      
router.get("/get-all-expense", getExpenses);        
router.get("/get-single-expense/:id", getExpenseById); 
router.put("/update/:id", updateExpense);   
router.delete("/delete/:id", deleteExpense);

export default router;
