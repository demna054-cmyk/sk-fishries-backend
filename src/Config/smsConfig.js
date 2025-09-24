import { config } from "dotenv";
import envVars from "./env-vars";
config();

const SmSCongig = {
  Account_Sid: envVars.sms.account_Sid,
  Auth_Token: envVars.sms.auth_token,
};

export default SmSCongig;
