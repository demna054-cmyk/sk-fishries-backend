import dotenv from "dotenv";
import * as jose from "jose";
import keyGen from "./keyGen.js";
import envVars from "../../Config/env-vars.js";
// import RefreshToken from "../../DB/Model/refresh-token.model.js";
import moment from "moment";
const envConfig = dotenv.config({ path: "../../../.env" }).parsed;
const endpoint = envConfig ? envConfig["ENDPOINT"] : "localhost";
const { publicKey, privateKey } = keyGen;

const revokedTokens = new Set();

export const tokenGen = async (user, tokenType) => {
  return await new jose.EncryptJWT({
    uid: user.id,
    userType: user.userType,
    ref: tokenType === tokenType.refresh ? user._id : "",
    tokenType: tokenType ? tokenType : "auth",
  })
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .setIssuedAt(new Date().getTime())
    .setIssuer(endpoint)
    .setAudience(endpoint)
    .setExpirationTime(tokenType === "refresh" ? "30d" : "2d")
    .encrypt(publicKey);
};

export const OtptokenGen = async (userData, verifier) => {
  return await new jose.EncryptJWT({
    userData,
    verifier,
  })
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .setIssuedAt(new Date().getTime())
    .setIssuer(endpoint)
    .setAudience(endpoint)
    .setExpirationTime("1d")
    .encrypt(publicKey);
};

export const joseJwtDecrypt = async (token, PK = privateKey) => {
  try {
    const decryptedToken = await jose.jwtDecrypt(token, PK);
    return decryptedToken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const jwtGen = async (user, tokenType) => {
  const jwtKey = jose.base64url.decode(envVars.jwtSecret);

  return await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(endpoint)
    .setAudience(endpoint)
    .setExpirationTime(tokenType === "refresh" ? "30d" : "2d")
    .sign(jwtKey);
};

export const joseJwtVerify = async (token) => {
  const jwtKey = jose.base64url.decode(envVars.jwtSecret);
  try {
    if (revokedTokens.has(token)) {
      console.log("Token has been revoked");
      return false;
    }
    // verify token
    const { payload } = await jose.jwtVerify(token, jwtKey, {
      issuer: endpoint, // issuer
      audience: endpoint, // audience
    });
    return { payload };
  } catch (e) {
    console.log("Token is invalid");
    return false;
  }
};

// * Generate Token Response
export const generateTokenResponse = (user, accessToken) => {
  const tokenType = "Bearer";
  // const refreshToken = RefreshToken.generate(user);
  const expiresIn = moment().add(envVars.jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    // refreshToken,
    expiresIn,
  };
};

export const expireToken = (token) => {
  revokedTokens.add(token);
};
