import mongoose from "mongoose";

const fileUploadSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "auth",
    },
  },
  {
    timestamps: true,
  },
);

const FileUpload = mongoose.model("fileUpload", fileUploadSchema);

export default FileUpload;