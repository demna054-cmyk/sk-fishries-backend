import constants from "../../Utils/constants.js";
import ErrorHandler from "../../Utils/errorHandler.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };

  error.message = err.message;

  // * Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler({
      message,
      status: constants.BAD_REQUEST,
      errors: message,
    });
  }

  // * Handling mongoose Validation error
  if (err.name === "ValidationError") {
    const message = err.details.body.map((value) => value.message);
    error = new ErrorHandler({
      message: err.name,
      status: constants.BAD_REQUEST,
      errors: message,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    error,
    message: error.message,
    stack: error.stack,
  });
};
