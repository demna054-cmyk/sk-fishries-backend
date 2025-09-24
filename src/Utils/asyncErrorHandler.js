import createHttpError from "http-errors";
import constants from "./constants.js";

const asyncErrorHandler = (func) => {
  return (req, res, next) =>
    func(req, res, next).catch((error) => {
      console.log("error :>> ", error);
      let statusCode = error.status ? error.status : constants.BAD_REQUEST;
      let message =
        error || error instanceof Error ? error.message : "Server Error";
      next(createHttpError(statusCode, message));
    });
};

export default asyncErrorHandler;
