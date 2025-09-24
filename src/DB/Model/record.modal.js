import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["purchase", "sale"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    linkedTruck: {
      type: String,
      required: false,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fileUpload",
      required: false,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", recordSchema);

export default Record;
