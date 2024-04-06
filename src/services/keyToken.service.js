"use strict";

const keyTokenModule = require("../models/keyToken.module");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModule.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // level xxx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModule.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
