import mongoose from "mongoose";

const cashFlowSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paid", "received"],
      required: true,
    },
    toFrom: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

const CashFlow =
  mongoose.models.CashFlow || mongoose.model("CashFlow", cashFlowSchema);

export default CashFlow;
