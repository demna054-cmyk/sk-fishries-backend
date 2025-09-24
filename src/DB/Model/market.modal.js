import mongoose from "mongoose";

const marketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    fishTypes: { type: [String], required: true },
    avgPrice: { type: Number, required: true },
    investment: { type: Number, required: true },
    revenue: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    lastOrder: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Market = mongoose.model("Market", marketSchema);
    