"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://localhost:27017/shopDev`;
mongoose
  .connect(connectString)
  .then((_) => console.log("connected to MongoDB successfully"))
  .catch((err) => console.log(`Err connecting to MongoDB`));

//   dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
