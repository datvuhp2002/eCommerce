"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();

// check api key

// check permissions

// signUp
router.post("/shop/signup", accessController.signUp);

module.exports = router;
