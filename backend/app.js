const express = require("express");
// const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();

//COnfig file
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//Error Middleware
const errorMiddleware = require("./middleware/errors");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

//Import Routes
const productsRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/payment");

app.use("/api/v1", productsRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
