const express = require("express");

const Router = express.Router();

const {
  processPayment,
  sendStripeAPI,
} = require("../controllers/paymentController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

Router.route("/payment/process").post(isAuthenticatedUser, processPayment);
Router.route("/stripeapi").get(isAuthenticatedUser, sendStripeAPI);

module.exports = Router;
