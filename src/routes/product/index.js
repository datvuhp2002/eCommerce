"use strict";
const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProduct)
);
// AUTHENTICATION
router.use(authenticationV2);
// logout
router.post("", asyncHandler(ProductController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unPublish/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

// QUERY
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));

router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishForShop)
);

module.exports = router;
