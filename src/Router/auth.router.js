import { AuthMiddleware } from "./Middleware/AuthMiddleware.js";
import {
  changePassword,
  completeProfile,
  deleteAccount,
  forgetPassword,
  getDashboard,
  getMe,
  login,
  logout,
  resetPassword,
  signup,
  verifyOtp,
} from "../Controller/auth.controller.js";
import { handleMultipartData } from "../Utils/MultipartData.js";
import { Router } from "express";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The books managing API
 */

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/register':
 *  post:
 *     summary: Create a user
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: test@test.com
 *              password:
 *                type: string
 *                default: test@1234
 */
authRouter.route("/register").post(signup);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/login':
 *  post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: test@test.com
 *              password:
 *                type: string
 *                default: Test@1234
 */
authRouter.route("/login").post(login);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/verify':
 *  post:
 *     summary: Verify User
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - otp
 *              - otpType
 */
authRouter.route("/verify").post(AuthMiddleware, verifyOtp);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/complete-profile':
 *  post:
 *     summary: Complete Profile
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - full_name
 *              - image
 *              - gender
 *              - dob
 *              - phone_number
 *              - address
 *              - country
 *              - state
 *              - city
 */
authRouter
  .route("/complete-profile")
  .post(AuthMiddleware, handleMultipartData.single("image"), completeProfile);

/** GET Methods */
/**
 * @swagger
 * '/api/v1/auth/me':
 *  get:
 *     summary: Get Me
 *     tags: [Auth]
 */
authRouter.route("/me").get(AuthMiddleware, getMe);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/forget-password':
 *  post:
 *     summary: Forget Password
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 */
authRouter.route("/forget-password").post(forgetPassword);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/reset-password':
 *  post:
 *     summary: Reset User Password
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - password
 */
authRouter.route("/reset-password").post(AuthMiddleware, resetPassword);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/change-password':
 *  post:
 *     summary: Change User Password
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - old_password
 *              - new_password
 */
authRouter.route("/change-password").put(AuthMiddleware, changePassword);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/delete-account':
 *  post:
 *     summary: Delete User Account
 *     tags: [Auth]
 */
authRouter.route("/delete-account").delete(AuthMiddleware, deleteAccount);

/** POST Methods */
/**
 * @swagger
 * '/api/v1/auth/logout':
 *  post:
 *     summary: Logout User
 *     tags: [Auth]
 */
authRouter.route("/logout").post(AuthMiddleware, logout);
authRouter.route("/get-dashbord").get(getDashboard);

export default authRouter;
