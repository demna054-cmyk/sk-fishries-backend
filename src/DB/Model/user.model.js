import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../../Utils/SecuringPassword.js";
import moment from "moment";
import envVars from "../../Config/env-vars.js";
import constants from "../../Utils/constants.js";
import ErrorHandler from "../../Utils/errorHandler.js";
import { jwtGen } from "../../Utils/AccessTokenManagement/Tokens.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
      required: false,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "fileUpload",
    },
    is_profile_completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "idle"],
    },
    access_token: {
      type: String,
      trim: true,
      required: false,
      default: "",
    },
    userType: {
      type: String,
      enum: ["admin", "user", "partner"],
      default: "user",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "otp",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only include createdAt
    toJSON: { getters: true },
  }
);

userSchema.index({ location: "2dsphere" });
userSchema.plugin(mongooseAutoPopulate);
userSchema.pre("save", async function (next) {
  try {
    if (
      this.location &&
      (!Array.isArray(this.location.coordinates) ||
        this.location.coordinates.length !== 2)
    ) {
      this.location = undefined; // Remove invalid location
    }
    if (!this.isModified("password")) return next();
    const hash = hashPassword(this.password, Number(envVars.saltRound));
    this.password = hash;
    return next();
  } catch (error) {
    return next(err);
  }
});

/**
 * User Model Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "full_name",
      "email",
      "phone_number",
      "image",
      "is_profile_completed",
      "is_verified",
      "status",
      "userType",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token(user) {
    const payload = {
      user: { email: user.email, _id: user._id, userType: user.userType },
      exp: moment().add(envVars.jwtExpirationInterval, "hours").unix(),
      iat: moment().unix(),
      sub: user._id,
    };
    return jwtGen(payload);
  },
  async matchPassword(password) {
    return comparePassword(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, ErrorHandler>}
   */
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ErrorHandler({
        message: constants.VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            location: "params",
            messages: "Please enter valid User ID",
          },
        ],
        status: constants.NOT_FOUND,
      });
    }
    const user = await this.findById(id).exec();
    if (!user)
      throw new ErrorHandler({
        message: constants.NO_RECORD_FOUND,
        status: constants.NOT_FOUND,
      });
    return user;
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {Object} options - User Object
   * @param options.email - User Email
   * @param options.password - User password
   * @returns { Promise<User> | ErrorHandler> }
   */
  async ValidateUserAndGenerateToken(options) {
    const { email, password } = options;
    const user = await this.findOne({ email }).populate("image");
    if (!user) {
      throw new ErrorHandler({
        message: constants.NO_RECORD_FOUND,
        status: constants.NOT_FOUND,
      });
    }
    if (!(await user.matchPassword(password))) {
      throw new ErrorHandler({
        message: constants.INVALID_CREDENTIALS,
        status: constants.UNAUTHORIZED,
      });
    }
    if (!user.is_verified) {
      throw new ErrorHandler({
        message: constants.NOT_VERIFIED,
        status: constants.UNAUTHORIZED,
      });
    }
    if (user.is_deleted || !user.is_active) {
      throw new ErrorHandler({
        message: constants.USER_DELETED,
        status: constants.UNAUTHORIZED,
      });
    }
    return {
      user: user,
      accessToken: await user.token({
        email: user.email,
        _id: user._id,
        userType: user.userType,
      }),
    };
  },

  /**
   * Return Validation Error
   * If error is a mongoose duplication key error
   *
   * @param {Error} error
   * @returns { Error | ErrorHandler }
   */
  checkDuplication(error) {
    if (
      error.code === 11000 &&
      (error.name === "BulkWriteError" || error.name === "MongoServerError")
    ) {
      const keys = Object.keys(error.keyPattern);
      // if (keys.includes("name")) {
      //   return new ErrorHandler({ message: "Name already exist", status: constants.NOT_FOUND });
      // }
      if (keys.includes("email")) {
        return new ErrorHandler({
          message: constants.EMAIL_EXIST,
          status: constants.BAD_REQUEST,
        });
      }
    }
    return error;
  },
  /**
   * Find User's Feedback by user_id and update the latest avg rating of his/her feedbacks rating
   *
   * @param {String} id - User Id
   * @returns { Promise<User> | ErrorHandler> }
   */
  // async calculateRating(id) {
  //   const feedbackList = await Feedback.find({ feedback_for: id }).select("-feedback_for -created_by -ride_id");
  //   let totalRating = 0;
  //   feedbackList.forEach((feedback) => (totalRating += parseInt(feedback.rating)));
  //   let avg = (totalRating / feedbackList.length).toFixed(1);
  //   await this.updateOne({ _id: id }, { rating: avg }, { new: true });
  // },
};

const User = mongoose.model("User", userSchema);

/**
 * @typedef User
 */

export default User;
