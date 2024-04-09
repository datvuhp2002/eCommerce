"use strict";

const shopModule = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
// service
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "0000",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};
class AccessService {
  /*
    1 - check email in db
    2 - match Password
    3 - create AT and RT and save
    4 - generate Token
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not found");
    }
    // 2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error: Authentication error");
    }
    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4 generate Token
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
    // 4
  };
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
        throw new BadRequestError("Error: keyStore error");
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

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("DelKey:::", delKey);
    return delKey;
  };

  // Checked token used?
  static handleRefreshToken = async (refreshToken) => {
    // check refresh token used?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // if it used
    if (foundToken) {
      // decode xem ai dang su dung refresh token
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log("UserId:::", userId);
      console.log("email:::", email);
      // delete
      await KeyTokenService.deleteById(userId);
      throw new ForbiddenError("Something went wrong! Please re-login");
    }
    // if it not used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered");
    // verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // check UserId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered ");
    console.log("HolderToken::::", holderToken);
    // create new token
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    console.log("Token::::", tokens);
    // Update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // used to take a new token
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
