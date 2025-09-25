import { Market } from "../DB/Model/market.modal.js"; 
import { createMarketValidator } from "../Utils/Validator/marketValidator.js";
// ✅ Add Market
export const addMarket = async (req, res) => {
  try {
    const { error, value } = createMarketValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }

    const market = new Market(value);
    await market.save();

    return res.status(201).json({
      status: "success",
      message: "Market added successfully",
      data: market,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Get All Markets
export const getMarkets = async (req, res) => {
  try {
    const markets = await Market.find();

    // --- Summary Calculations ---
    let totalInvestment = 0;
    let totalRevenue = 0;
    let activeMarkets = 0;

    markets.forEach((m) => {
      totalInvestment += m.investment || 0;
      totalRevenue += m.revenue || 0;
      if (m.status === "Active") {
        activeMarkets += 1;
      }
    });

    const totalProfit = totalRevenue - totalInvestment;

    return res.status(200).json({
      status: "success",
      message: "Markets fetched successfully",
      data: markets,
      summary: {
        totalInvestment: `${totalInvestment.toLocaleString()}`,
        totalRevenue: `${totalRevenue.toLocaleString()}`,
        totalProfit: `${totalProfit.toLocaleString()}`,
        activeMarkets,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Get Single Market
export const getMarketById = async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ status: "error", message: "Market not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Market fetched successfully",
      data: market,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Update Market
export const updateMarket = async (req, res) => {
  try {
    const market = await Market.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!market) {
      return res.status(404).json({ status: "error", message: "Market not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Market updated successfully",
      data: market,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Delete Market
export const deleteMarket = async (req, res) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);
    if (!market) {
      return res.status(404).json({ status: "error", message: "Market not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Market deleted successfully",
      data: market,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
