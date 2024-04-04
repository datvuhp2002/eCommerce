"use strict";

const shopModule = require("../models/shop.module");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenLevel5Service = require("./keyToken.level5.service copy");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check Email exists
      const holderShop = await shopModule.findOne({ email: email }).lean();
      if (holderShop) {
        return {
          code: "XXX",
          message: "Shop already exists",
        };
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
        // rsa thuật toán bất đối xứng
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", ///pkcs8 key
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        // Public key CryptoGraphy Standards !
        console.log("Private key ===>", privateKey);
        console.log("Public key ===>", publicKey);
        const publicKeyString = await KeyTokenLevel5Service.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "XXX",
            message: "publicKeyString error",
          };
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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
    } catch (err) {
      return {
        code: "XXX",
        message: err.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
