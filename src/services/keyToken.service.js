"use strict";

const keyTokenModels = require("../models/keyToken.models");
const {
  Types: { ObjectId },
} = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModels.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // level xxx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModels.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static findByUserId = async (userId) => {
    return await keyTokenModels.findOne({ user: userId }).lean();
  };
  static removeKeyById = async (id) => {
    return await keyTokenModels.deleteOne({ _id: id });
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModels
      .findOne({
        refreshTokenUsed: refreshToken,
      })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModels.findOne({ refreshToken: refreshToken });
  };
  static deleteById = async (userId) => {
    return await keyTokenModels.findByIdAndDelete({ user: userId }).lean();
  };
}
module.exports = KeyTokenService;
