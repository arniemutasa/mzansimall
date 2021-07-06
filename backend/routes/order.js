const express = require("express");

const Router = express.Router();

const {
  getAllOrders,
  getOrder,
  newOrder,
  myOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

Router.route("/admin/orders").get(
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getAllOrders
);
Router.route("/order/new").post(isAuthenticatedUser, newOrder);
Router.route("/order/:id").get(getOrder);
Router.route("/orders/me").get(isAuthenticatedUser, myOrders);
Router.route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = Router;
