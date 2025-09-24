import express from "express";
import {
  createTruck,
  getTrucks,
  getTruck,
  updateTruck,
  deleteTruck,
  setTruckStatus,
} from "../Controller/truck.controller.js";

const router = express.Router();

// ✅ Create new truck
router.post("/create-truck", createTruck);

// ✅ Get all trucks (with optional filters)
router.get("/get-trucks", getTrucks);

// ✅ Get single truck by ID
router.get("/get-truck/:id", getTruck);

// ✅ Update truck by ID
router.put("/update-truck/:id", updateTruck);

// ✅ Delete truck by ID
router.delete("/delete-truck/:id", deleteTruck);

// ✅ Update only status of truck
router.put("/update-truck-status/:id", setTruckStatus);

export default router;