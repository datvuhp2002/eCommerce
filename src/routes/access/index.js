"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

// signIn
router.post("/shop/login", asyncHandler(accessController.login));

// AUTHENTICATION
router.use(authenticationV2);
// logout
router.post("/shop/logout", asyncHandler(accessController.logout));
// handle refresh token
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
module.exports = router;
