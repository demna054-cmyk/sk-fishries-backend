import constants from "./constants.js";

class ErrorHandler extends Error {
  /**
   * Creates an API error.
   * @param {String} message - Error message.
   * @param {Number} statusCode - HTTP status code of error.
   **/

  /**
   * Creates an API error.
   * @param {String} message - Error message.
   * @param {Array} errors - Array of validation fields Errors.
   * @param {Number} status - HTTP status code of error.
   * @param {Boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message,
    stack,
    errors = [],
    status = constants.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.stack = stack;
  }
}

export default ErrorHandler;
