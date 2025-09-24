import Truck from "../DB/Model/truck.modal.js"; 
import { truckValidation } from "../Utils/Validator/truckValidator.js";

// ✅ Add Truck
export const createTruck = async (req, res) => {
  try {
    const { error } = truckValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const exists = await Truck.findOne({ truckNo: req.body.truckNo });
    if (exists) {
      return res.status(409).json({
        status: "error",
        message: "Truck number already exists",
      });
    }

    const truck = new Truck(req.body);
    await truck.save();

    res.status(201).json({
      status: "success",
      message: "Truck created successfully",
      data: truck,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Get All Trucks (with filter + pagination)
export const getTrucks = async (req, res) => {
  try {
    const { status, driver, destination, truckNo, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (driver) filter.driver = { $regex: driver, $options: "i" };
    if (destination) filter.destination = { $regex: destination, $options: "i" };
    if (truckNo) filter.truckNo = { $regex: truckNo, $options: "i" };

    const total = await Truck.countDocuments(filter);
    const trucks = await Truck.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // --- Summary Stats ---
    const totalTrucks = await Truck.countDocuments({});
    const inUse = await Truck.countDocuments({ status: "in-use" });
    const idle = totalTrucks - inUse;
    const utilization = totalTrucks > 0 ? Math.round((inUse / totalTrucks) * 100) : 0;

    res.json({
      status: "success",
      message: "Trucks fetched successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      data: trucks,
      summary: {
        totalTrucks,
        inUse,
        idle,
        utilization: `${utilization}%`
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};


// ✅ Get Single Truck
export const getTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({
        status: "error",
        message: "Truck not found",
      });
    }
    res.json({
      status: "success",
      message: "Truck fetched successfully",
      data: truck,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Update Truck
export const updateTruck = async (req, res) => {
  try {
    const { error } = truckValidation.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) {
      return res.status(404).json({
        status: "error",
        message: "Truck not found",
      });
    }

    res.json({
      status: "success",
      message: "Truck updated successfully",
      data: truck,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Delete Truck
export const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) {
      return res.status(404).json({
        status: "error",
        message: "Truck not found",
      });
    }
    res.json({
      status: "success",
      message: "Truck deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Toggle or Set Status
export const setTruckStatus = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({
        status: "error",
        message: "Truck not found",
      });
    }

    if (req.body.status && ["idle", "in-use"].includes(req.body.status)) {
      truck.status = req.body.status;
    } else {
      truck.status = truck.status === "idle" ? "in-use" : "idle";
    }

    await truck.save();
    res.json({
      status: "success",
      message: "Truck status updated successfully",
      data: truck,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
