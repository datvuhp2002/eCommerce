"use strict";
const apiKeyModule = require("../models/api.module");
const crypto = require("crypto");
const findById = async (key) => {
  //   const newKey = await apiKeyModule.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });
  //   console.log(newKey);
  const objKey = await apiKeyModule.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = { findById };
