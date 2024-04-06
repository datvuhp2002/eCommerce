"use strict";
const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};
const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
};
const httpStatusCode = require("../httpStatusCode/httpStatusCode");
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status(status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = httpStatusCode.ReasonPhrases.CONFLICT,
    statusCode = httpStatusCode.StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = httpStatusCode.ReasonPhrases.CONFLICT,
    statusCode = httpStatusCode.StatusCodes.FORBIDDEN
  ) {}
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
