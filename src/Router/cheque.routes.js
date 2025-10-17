import express from "express";
import {
  addCheque,
  getCheques,
  updateCheque,
  deleteCheque,
} from "../Controller/cheque.contoller.js";
import { handleMultipartData } from "../Utils/MultipartData.js";

const router = express.Router();

// ➕ Add new cheque
router.post("/create", handleMultipartData.single("image"), addCheque);

// 📥 Get all cheques (optional filter ?status=pending/cleared)
router.get("/get-all-cheques", getCheques);

// ✏️ Update cheque status
router.put("/update/:id/", handleMultipartData.single("image"),updateCheque);

// ❌ Delete cheque
router.delete("/delete/:id", deleteCheque);

export default router;
