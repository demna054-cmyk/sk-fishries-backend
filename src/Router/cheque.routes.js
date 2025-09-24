import express from "express";
import {
  addCheque,
  getCheques,
  updateChequeStatus,
  deleteCheque,
} from "../Controller/cheque.contoller.js";
import { handleMultipartData } from "../Utils/MultipartData.js";

const router = express.Router();

// ➕ Add new cheque
router.post("/create", handleMultipartData.single("image"), addCheque);

// 📥 Get all cheques (optional filter ?status=pending/cleared)
router.get("/get-all-cheques", getCheques);

// ✏️ Update cheque status
router.put("/update/:id/", updateChequeStatus);

// ❌ Delete cheque
router.delete("/delete/:id", deleteCheque);

export default router;
