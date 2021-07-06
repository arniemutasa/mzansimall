const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
  getAdminProducts,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.route("/products").get(getProducts);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);
router
  .route("/products/create")
  .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
router.route("/review").delete(isAuthenticatedUser, deleteProductReview);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

module.exports = router;
