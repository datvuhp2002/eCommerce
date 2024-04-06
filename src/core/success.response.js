"use strict";

class SuccessResponse extends Success {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
