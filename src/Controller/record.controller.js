import Record from "../DB/Model/record.modal.js"; 
import { recordValidator } from "../Utils/Validator/recordValidator.js";
// Create
import FileUpload from "../DB/Model/fileUpload.model.js"; 

export const createRecord = async (req, res) => {
  try {
    const { error } = recordValidator.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }

    let fileDoc = null;
    if (req.file) {
      fileDoc = new FileUpload({
        file: req.file.filename,   // multer se aayega
        fileType: req.file.mimetype, // e.g. image/png
        user: req.user ? req.user._id : null, // agar auth laga hua hai
      });
      await fileDoc.save();
    }

    const record = new Record({
      ...req.body,
      image: fileDoc ? fileDoc._id : null, // Reference to FileUpload
    });

    await record.save();

    res.status(201).json({
      status: "success",
      message: "Record created successfully",
      data: record,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


// Get All (with filter)
export const getRecords = async (req, res) => {
  try {
    const records = await Record.find().populate("image");

    // --- Summary calculations ---
    let totalPurchases = 0;
    let totalSales = 0;

    records.forEach((rec) => {
      if (rec.type === "purchase") {
        totalPurchases += rec.price;
      } else if (rec.type === "sale") {
        totalSales += rec.price;
      }
    });

    const netProfit = totalSales - totalPurchases;

    res.json({
      status: "success",
      message: "Records fetched successfully",
      data: records,
      summary: {
        totalPurchases: `${totalPurchases.toLocaleString()}`,
        totalSales: `${totalSales.toLocaleString()}`,
        netProfit: `${netProfit.toLocaleString()}`
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


// Get Single
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ status: "error", message: "Record not found" });
    }
    res.status(200).json({ status: "success", message: "Record fetched successfully", data: record });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Update
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ status: "error", message: "Record not found" });
    }

    res.status(200).json({ status: "success", message: "Record updated successfully", data: record });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ status: "error", message: "Record not found" });
    }

    res.status(200).json({ status: "success", message: "Record deleted successfully", data: record });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
