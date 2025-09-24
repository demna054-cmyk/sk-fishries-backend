import mongoose from "mongoose";

const chequesSchema = new mongoose.Schema(
  {
    chequeNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["given", "received"], required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "cleared"], default: "pending" },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fileUpload",
      required: false,
    },
  },
  { timestamps: true }
);

const Chequed = mongoose.model("Chequed", chequesSchema);
export default Chequed;
