import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

export default {
  env: process.env.NODE_ENV,
  base_url: process.env.BASE_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_HOURS,
  mongo_uri:
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI,
  rateLimitTime: process.env.RATE_LIMIT_TIME,
  rateLimitRequest: process.env.RATE_LIMIT_REQUEST,
  saltRound: process.env.NODE_ENV === "development" ? 5 : 10,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  Level: process.env.NODE_ENV === "production" ? "error" : "debug",
  // morganConfig: process.env.NODE_ENV === "production" ? MorganProd : {},
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,

  ssl: {
    certificate:
      process.env.NODE_ENV !== "development" ? process.env.SSL_CERT : "",
    key: process.env.NODE_ENV !== "development" ? process.env.SSL_KEY : "",
    ca: process.env.NODE_ENV !== "development" ? process.env.SSL_CA : "",
  },

  host: process.env.MAIL_HOST,
  mailerPort: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },

  mainFromEmail: process.env.MAIL_FROM_ADDRESS,
  mainFromName: process.env.MAIL_FROM_NAME,
  sms: {
    account_Sid: process.env.ACCOUNT_SID,
    auth_token: process.env.AUTH_TOKEN,
  },
};
