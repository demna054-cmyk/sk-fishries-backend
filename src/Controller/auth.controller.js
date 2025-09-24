import fs from "fs";
import bcrypt from "bcrypt";
import CustomError from "../Utils/ResponseHandler/CustomError.js";
import { comparePassword } from "../Utils/SecuringPassword.js";
import { getFileContent, sendEmails } from "../Utils/SendEmail.js";
import {
  ChangePasswordValidator,
  completeProfileValidator,
  ForgetPasswordValidator,
  LoginValidator,
  RegisterValidator,
  ResetPasswordValidator,
  VerifyOtpValidator,
} from "../Utils/Validator/UserValidator.js";
import OTP from "../DB/Model/otp.model.js";
import User from "../DB/Model/user.model.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import constants from "../Utils/constants.js";
import moment from "moment";
import envVars from "../Config/env-vars.js";
import FileUpload from "../DB/Model/fileUpload.model.js";
import { jwtGen, expireToken } from "../Utils/AccessTokenManagement/Tokens.js";
import CashFlow from "../DB/Model/cashflow.model.js";
import Chequed from "../DB/Model/chequed.model.js";
import { Expense } from "../DB/Model/expense.model.js";
import Record from "../DB/Model/record.modal.js";
import truckModal from "../DB/Model/truck.modal.js";

/**
 * Authenticate User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const login = asyncErrorHandler(async (req, res, next) => {
  const { error } = LoginValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  const { user, accessToken } = await User.ValidateUserAndGenerateToken(
    req.body
  );
  res.status(constants.OK).json({
    data: { token: accessToken, user: user.transform() },
    success: true,
  });
});

/**
 * Register a new User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const signup = async (req, res, next) => {
  const { error } = RegisterValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    const randomOtp = Math.floor(Math.random() * 9000) + 1000;
    const verifyOtp = {
      otpKey: randomOtp,
      user: savedUser._id,
      reason: "register",
    };
    console.log("🚀 ~ signup ~ randomOtp:", randomOtp);
    await OTP.create(verifyOtp);
    const to = savedUser.email;
    let subject = "OTP for Registration";
    let template = await getFileContent("src/Static/create-user.html");
    template = template.replace("{{verification}}", randomOtp);
    template = template.replace("{{email}}", to);
    sendEmails(to, subject, template, null, (err) => {
      if (err) {
        return next(CustomError.badRequest(err.message));
      }
    });
    const tokenPayload = {
      user: {
        email: savedUser.email,
        _id: savedUser._id,
        userType: savedUser.userType,
      },
      exp: moment().add(envVars.jwtExpirationInterval, "hours").unix(),
      iat: moment().unix(),
      sub: savedUser._id,
    };
    const accessToken = await jwtGen(tokenPayload);
    return res.status(constants.CREATED).json({
      data: { user: savedUser.transform(), token: accessToken },
      success: true,
      message: "User Registered Success",
    });
  } catch (error) {
    return next(User.checkDuplication(error));
  }
};

/**
 * Verify the new User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const verifyOtp = asyncErrorHandler(async (req, res, next) => {
  const { user } = req;
  const { error } = VerifyOtpValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  // ? Find User's generated OTP
  const userOtp = await OTP.findOne({
    _id: user.otp,
    reason: req.body.otpType,
  });
  if (!userOtp) {
    return next(CustomError.badRequest(constants.NO_RECORD_FOUND));
  }

  // ? Compare User's generated OTP
  const compareOtp = await bcrypt.compare(req.body.otp, userOtp.otpKey);
  if (!compareOtp) {
    return next(CustomError.badRequest(constants.INVALID_OTP));
  }
  // ? Expire Previous Otp
  expireToken(req.bearerToken);
  // ? Update the OTP Status
  await OTP.updateOne(
    { _id: user.otp },
    { $set: { otpUsed: true } },
    { new: true }
  );
  const tokenPayload = {
    user: { email: user.email, _id: user._id, userType: user.userType },
    exp: moment().add(envVars.jwtExpirationInterval, "hours").unix(),
    iat: moment().unix(),
    sub: user._id,
  };
  // ? Generate Access Token
  const accessToken = await jwtGen(tokenPayload);
  // ? Update is_verified to true in User
  const verifiedUser = await User.findOneAndUpdate(
    { email: user.email },
    { $set: { is_verified: true, access_token: accessToken } },
    { new: true }
  );
  const message =
    req.body.otpType == "register"
      ? "User Logged In Successfully"
      : "Now, User can Reset Password.";
  return res.status(constants.CREATED).json({
    data: { user: verifiedUser.transform(), token: accessToken },
    success: true,
    message,
  });
});

/**
 * Complete the User Profile
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const completeProfile = asyncErrorHandler(async (req, res, next) => {
  const { user, file } = req;
  const { error } = completeProfileValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  if (user && !user.is_verified) {
    return next({
      statusCode: constants.UNAUTHORIZED,
      message: constants.NOT_VERIFIED,
    });
  }
  const data = Object.fromEntries(
    Object.entries(req.body).filter(
      ([_, v]) => v != null && v != "" && v != "" && v != "null"
    )
  );

  if (file) {
    fs.unlink("uploads/" + user?.image?.file, async (err) => {
      if (!err) {
        await FileUpload.deleteOne(user?.image?._id);
      }
    });
    const fileUploaded = await FileUpload.create({
      file: file.filename,
      fileType: file.mimetype,
      user: user._id,
    });
    data.image = fileUploaded._id;
  }
  data.dob = new Date(data.dob).toISOString();
  data.is_profile_completed = true;
  data.dob = new Date(data.dob).toISOString();
  const userData = await User.findByIdAndUpdate(user._id, data, { new: true })
    .populate("image")
    .select("-password");
  res.status(constants.OK).json({
    data: userData.transform(),
    success: true,
    message: "Profile Updated Successfully",
  });
});

/**
 * Get Current User Profile
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next 
 */
const getMe = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const userModel = await User.findOne({ _id: user._id })
    .populate("image")
    .select("-password");
  res.status(constants.OK).json({
    data: userModel.transform(),
    success: true,
    message: "Fetch Current User Profile Successfully",
  });
});

/**
 * Generate OTP for forget password of user
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { error } = ForgetPasswordValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  const user = await User.findOne({
    $and: [{ email: req.body.email }, { is_deleted: false }],
  });
  if (!user) {
    return next(CustomError.notFound("No User exist with this email", 404));
  }
  // * Update all old OTPs
  await OTP.updateMany(
    { user: user._id, reason: "forgetPassword", otpUsed: false },
    { $set: { otpUsed: true, expireAt: new Date() } }
  );
  const otpPayload = {
    otpKey: Math.floor(Math.random() * 9000) + 1000,
    user: user._id,
    reason: "forgetPassword",
  };
  console.log("🚀 ~ forgetPassword ~ otpPayload:", otpPayload);
  await OTP.create(otpPayload);

  const to = user.email;
  let template = await getFileContent("src/Static/ForgetPassword.html");
  template = template.replace("{{verification}}", otpPayload.otpKey);
  template = template.replace("{{email}}", to);
  sendEmails(to, "Forget Password OTP", template, null, (err) => {
    if (err) {
      return next(CustomError.badRequest(err.message));
    }
  });
  const tokenPayload = {
    user: { email: user.email, _id: user._id, userType: user.userType },
    exp: moment().add(envVars.jwtExpirationInterval, "hours").unix(),
    iat: moment().unix(),
    sub: user._id,
  };
  // ? Generate Access Token
  const accessToken = await jwtGen(tokenPayload);

  res
    .status(constants.OK)
    .json({ success: true, message: "OTP sent to email", token: accessToken });
});

/**
 * Match OTP to reset password of user
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { error } = ResetPasswordValidator.validate(req.body);
  if (error)
    return next({
      statusCode: constants.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  const { password } = req.body;
  const { user, bearerToken } = req;
  console.log("🚀 ~ resetPassword ~ user:", user);
  const userData = await User.findById(user._id);
  if (!user) {
    return next(CustomError.notFound("No User exist with this email", 404));
  }
  // TODO: Check whether the password is same to previous one
  // if(!comparePassword(userData.password, password)) {
  //   return
  // }
  // // ? Find User's generated OTP
  // const userOtp = await OTP.findById(user.otp);
  // // ? Compare User's generated OTP
  // const compareOtp = await bcrypt.compare(otp, userOtp.otpKey);
  // if (!compareOtp) {
  //   return next(CustomError.badRequest(constants.INVALID_OTP));
  // }
  // // * Update the generated OTP
  // await OTP.updateOne({ _id: userOtp._id }, { $set: { otpUsed: true } }, { new: true });

  // * Update all old OTPs
  await OTP.updateMany(
    { user: user._id, reason: "forgetPassword", otpUsed: false },
    { $set: { otpUsed: true, expireAt: new Date() } }
  );
  // ? Expire Previous Otp
  expireToken(bearerToken);
  // ? Generate New Token
  const tokenPayload = {
    user: {
      email: userData.email,
      _id: userData._id,
      userType: userData.userType,
    },
    exp: moment().add(envVars.jwtExpirationInterval, "hours").unix(),
    iat: moment().unix(),
    sub: userData._id,
  };
  // ? Generate Access Token
  const accessToken = await jwtGen(tokenPayload);

  userData.password = password;
  const savedUser = await userData.save();
  res.status(constants.OK).json({
    data: { user: savedUser.transform(), token: accessToken },
    success: true,
    message: "Reset Password Successfully",
  });
});

/**
 * change password of the current user
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { error } = ChangePasswordValidator.validate(req.body);
  if (error) {
    return next(CustomError.badRequest(error.details[0].message));
  }
  const { user } = req;
  const { old_password, new_password } = req.body;

  const userData = await User.findOne({ _id: user._id });
  if (!userData) {
    return next(CustomError.badRequest(constants.NO_RECORD_FOUND));
  }
  const isMatch = comparePassword(old_password, userData.password);
  if (!isMatch) {
    return next(CustomError.badRequest("Old Password is Incorrect"));
  }
  userData.password = new_password;
  const updatedUser = await userData.save();
  res.status(constants.OK).json({
    data: updatedUser.transform(),
    success: true,
    message: "Password Changed Successfully",
  });
});

/**
 * Expire user current Access Token
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const logout = asyncErrorHandler(async (req, res) => {
  const { bearerToken } = req;

  expireToken(bearerToken);

  res
    .status(constants.OK)
    .json({ message: "User Logout Successfully", success: true });
});

/**
 * Soft Delete User Account
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const deleteAccount = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  await User.updateOne({ _id: user._id }, { is_deleted: true }, { new: true });
  expireToken(bearerToken);
  res
    .status(constants.NO_CONTENT)
    .json({ message: "User Deleted Successfully", success: true });
});


// Home page api 

export const getDashboard = async (req, res) => {
  try {
    // Total trucks
    const totalTrucks = await truckModal.countDocuments();

    // Total purchases (all time)
    const purchasesAgg = await Record.aggregate([
      { $match: { type: "purchase" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalPurchases = purchasesAgg[0]?.total || 0;

    // Total sales (all time)
    const salesAgg = await Record.aggregate([
      { $match: { type: "sale" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalSales = salesAgg[0]?.total || 0;

    // Total expenses (all time)
    const expensesAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpenses = expensesAgg[0]?.total || 0;

    // Gross & Net profit
    const grossProfit = totalSales - totalPurchases; // sales - purchases
    const netProfit = grossProfit - totalExpenses;   // gross - expenses

    // Pending cheques (count + amount)
    const pendingChequesAgg = await Chequed.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } },
    ]);
    const pendingChequesCount = pendingChequesAgg[0]?.count || 0;
    const pendingChequesAmount = pendingChequesAgg[0]?.amount || 0;

    // Response (numbers raw — frontend can format with ₹ and commas)
    return res.status(200).json({
      status: "success",
      message: "Dashboard fetched",
      data: {
        totalTrucks,
        totalSales,
        totalPurchases,
        grossProfit,
        netProfit,
        totalExpenses,
        pendingCheques: {
          count: pendingChequesCount,
          amount: pendingChequesAmount
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export {
  login,
  signup,
  verifyOtp,
  completeProfile,
  getMe,
  forgetPassword,
  resetPassword,
  changePassword,
  logout,
  deleteAccount,
};
