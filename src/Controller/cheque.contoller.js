import Chequed from "../DB/Model/chequed.model.js";
import FileUpload from "../DB/Model/fileUpload.model.js";
import { addChequeValidator, updateStatusValidator } from "../Utils/Validator/cheque.validator.js";

// ✅ Add New Cheque
export const addCheque = async (req, res) => {
  try {
    // 🔹 Validate input
    const { error } = addChequeValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { chequeNumber, type, from, to, amount, date, status } = req.body;

    // 🔹 Check duplicate chequeNumber
    const exists = await Chequed.findOne({ chequeNumber });
    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "Cheque number already exists",
      });
    }

    // 🔹 Handle image file (if uploaded)
    let fileDoc = null;
    if (req.file) {
      fileDoc = await FileUpload.create({
        file: req.file.filename,
        fileType: req.file.mimetype,
      });
    }

    // 🔹 Create cheque with optional image reference
    const cheque = await Chequed.create({
      chequeNumber,
      type,
      from,
      to,
      amount,
      date,
      status,
      image: fileDoc ? fileDoc._id : null, // reference to FileUpload
    });

    return res.status(201).json({
      status: "success",
      message: "Cheque added s uccessfully",
      data: cheque,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ✅ Get All Cheques
export const getCheques = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && ["pending", "cleared"].includes(status)) {
      query.status = status;
    }

    const cheques = await Chequed.find(query).sort({ createdAt: -1 });

    // --- Summary calculations ---
    let pendingChecks = 0;
    let pendingAmount = 0;
    let clearedAmount = 0;

    cheques.forEach((chq) => {
      if (chq.status === "pending") {
        pendingChecks += 1;
        pendingAmount += chq.amount || 0;
      } else if (chq.status === "cleared") {
        clearedAmount += chq.amount || 0;
      }
    });

    const totalChecks = cheques.length;

    return res.status(200).json({
      status: "success",
      message: "Cheques fetched successfully",
      data: cheques,
      summary: {
        pendingChecks,
        pendingAmount: `${pendingAmount.toLocaleString()}`,
        clearedAmount: `${clearedAmount.toLocaleString()}`,
        totalChecks
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


// ✅ Update Cheque Status
export const updateChequeStatus = async (req, res) => {
  try {
    // Validate input
    const { error } = updateStatusValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const cheque = await Chequed.findByIdAndUpdate(id, { status }, { new: true });

    if (!cheque) {
      return res.status(404).json({
        status: "error",
        message: "Cheque not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Cheque status updated successfully",
      data: cheque,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ✅ Delete Cheque
export const deleteCheque = async (req, res) => {
  try {
    const { id } = req.params;

    const cheque = await Chequed.findByIdAndDelete(id);

    if (!cheque) {
      return res.status(404).json({
        status: "error",
        message: "Cheque not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Cheque deleted successfully",
      data: cheque,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
