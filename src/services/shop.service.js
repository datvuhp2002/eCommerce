"use strict";

const shopModule = require("../models/shop.module");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await shopModule.findOne({ email }).select(select).lean();
};

module.exports = { findByEmail };
