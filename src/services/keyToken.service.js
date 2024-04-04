"use strict";

const keyTokenModule = require("../models/keyToken.module");

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey, publicKey }) => {
    try {
      const tokens = await keyTokenModule.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
