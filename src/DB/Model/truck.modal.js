import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    truckNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    driver: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["idle", "in-use"],
      default: "idle",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
