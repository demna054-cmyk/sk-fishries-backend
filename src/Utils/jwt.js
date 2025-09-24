import * as jose from "jose";
import envVars from "../Config/env-vars.js";

export const generateToken = (payload) => {
  const token = jose.SignJWT(payload, envVars.jwtSecret, {
    expiresIn: "1d",
  });
  return token;
};

export const verifyToken = (token) => {
  const decoded = jose.JWT.verify(token, envVars.jwtSecret);
  return decoded;
};
