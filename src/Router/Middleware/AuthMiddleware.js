import User from "../../DB/Model/user.model.js";
import authModel from "../../DB/Model/user.model.js";
import {
  joseJwtDecrypt,
  joseJwtVerify,
} from "../../Utils/AccessTokenManagement/Tokens.js";
import CustomError from "../../Utils/ResponseHandler/CustomError.js";
export const AuthMiddleware = async (req, res, next) => {
  const AuthHeader =
    req.headers.authorization ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  if (!AuthHeader) {
    return next(CustomError.unauthorized());
  }
  const parts = AuthHeader.split(" ");
  try {
    if (parts.length !== 2) {
      return next(CustomError.unauthorized());
    }

    const [scheme, token] = parts;
    // token

    if (!/^Bearer$/i.test(scheme)) {
      return next(CustomError.unauthorized());
    }

    // const UserToken = await joseJwtDecrypt(token);
    const UserToken = await joseJwtVerify(token);

    const UserDetail = await User.findOne({
      _id: UserToken.payload.sub,
    }).populate("image");

    if (!UserDetail) {
      return next(CustomError.unauthorized());
    }
    // UserDetail.tokenType = UserToken.tokenType;
    req.user = UserDetail;
    req.bearerToken = token;
    return next();
  } catch (error) {
    return next(CustomError.unauthorized());
  }
};

export const NgoMiddleware = async (req, res, next) => {
  const AuthHeader =
    req.headers.authorization ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  if (!AuthHeader) {
    return next(CustomError.unauthorized());
  }
  const parts = AuthHeader.split(" ");
  try {
    if (parts.length !== 2) {
      return next(CustomError.unauthorized());
    }

    const [scheme, token] = parts;
    // token

    if (!/^Bearer$/i.test(scheme)) {
      return next(CustomError.unauthorized());
    }

    // const UserToken = await joseJwtDecrypt(token);
    const UserToken = await joseJwtVerify(token);

    const UserDetail = await User.findOne({
      _id: UserToken.payload.sub,
    }).populate("image");

    if (!UserDetail) {
      return next(CustomError.unauthorized());
    }
    if (UserDetail.userType !== "ngo") {
      return next(CustomError.unauthorized());
    }

    // UserDetail.tokenType = UserToken.tokenType;
    req.user = UserDetail;
    req.bearerToken = token;
    return next();
  } catch (error) {
    return next(CustomError.unauthorized());
  }
};

export const AdminMiddleware = async (req, res, next) => {
  const AuthHeader =
    req.headers.authorization ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  if (!AuthHeader) {
    return next(CustomError.unauthorized());
  }
  const parts = AuthHeader.split(" ");
  try {
    if (parts.length !== 2) {
      return next(CustomError.unauthorized());
    }

    const [scheme, token] = parts;
    // token

    if (!/^Bearer$/i.test(scheme)) {
      return next(CustomError.unauthorized());
    }

    // const UserToken = await joseJwtDecrypt(token);
    const UserToken = await joseJwtVerify(token);

    const UserDetail = await User.findOne({
      _id: UserToken.payload.sub,
    }).populate("image");

    if (!UserDetail) {
      return next(CustomError.unauthorized());
    }
    if (UserDetail.userType !== "admin") {
      return next(CustomError.unauthorized());
    }

    // UserDetail.tokenType = UserToken.tokenType;
    req.user = UserDetail;
    req.bearerToken = token;
    return next();
  } catch (error) {
    return next(CustomError.unauthorized());
  }
};
