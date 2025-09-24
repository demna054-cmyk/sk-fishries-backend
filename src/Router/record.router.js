import express from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} 
from "../Controller/record.controller.js";
import { handleMultipartData } from "../Utils/MultipartData.js";

const router = express.Router();

router.post("/create",handleMultipartData.single("image"), createRecord);
router.get("/get-all-record", getRecords);
router.get("/get-single-record/:id", getRecordById);
router.put("/update/:id", updateRecord);
router.delete("/delete/:id", deleteRecord);

export default router;
