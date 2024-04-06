"use strict";

const shopModule = require("../models/shop.module");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "0000",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1: check Email exists

    const holderShop = await shopModule.findOne({ email: email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop Already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModule.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // Public key CryptoGraphy Standards !
      console.log("Private key ===>", privateKey);
      console.log("Public key ===>", publicKey);
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });
      if (!keyStore) {
        return {
          code: "XXX",
          message: "keyStore error",
        };
      }
      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("created token success:::::", tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (err) {
    //   console.error(err);
    //   return {
    //     code: "XXX",
    //     message: err.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
