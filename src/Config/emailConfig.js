import { config } from "dotenv";
import envVars from "./env-vars.js";
config();

export const emailConfig = {
  // pool: true,
  port: envVars.mailerPort,
  // secure: true,
  host: envVars.host,
  auth: {
    user: envVars.auth.user,
    pass: envVars.auth.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
