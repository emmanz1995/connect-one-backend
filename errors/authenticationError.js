const CustomError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class AuthenticationError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes?.UNAUTHORIZED;
  }
}

module.exports = AuthenticationError;
