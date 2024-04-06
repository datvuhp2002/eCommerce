"use strict";
const httpStatusCode = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = httpStatusCode.ReasonPhrases.CONFLICT,
    statusCode = httpStatusCode.StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = httpStatusCode.ReasonPhrases.BAD_REQUEST,
    statusCode = httpStatusCode.StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = httpStatusCode.ReasonPhrases.UNAUTHORIZED,
    statusCode = httpStatusCode.StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
};
