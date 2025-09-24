import mongoose from "mongoose";
// import admin from "firebase-admin";
import logger from "../Config/logger.js";
import envVars from "../Config/env-vars.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envVars.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert(key),
    //   });
    // }
    logger.info(`MongoDB is connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    logger.error(`MongoDb ERROR: ${error}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
