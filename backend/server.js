const app = require("./app");
// const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/db");

//UncaughtExeptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("SHUTTING DOWN SERVER DUE TO UNCAUGHT EXCEPTION");
  process.exit(1);
});

//COnfig file
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//COnnect to Database
connectDatabase();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started successfully on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// UnhandledPromiseRejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to unhandledPromiseRejection`);
  server.close(() => {
    process.exit(1);
  });
});
