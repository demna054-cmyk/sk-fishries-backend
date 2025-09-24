import express from "express";
import {
  addMarket,
  getMarkets,
  getMarketById,
  updateMarket,
  deleteMarket,
} from "../Controller/market.controller.js";
const router = express.Router();

// POST → Add Market
router.post("/create", addMarket);

// GET → Get All Markets
router.get("/get-all-market", getMarkets);

// GET → Get Market by ID
router.get("/get-single-market/:id", getMarketById);

// PUT → Update Market
router.put("/update/:id", updateMarket);

// DELETE → Delete Market
router.delete("/delete/:id", deleteMarket);

export default router;
