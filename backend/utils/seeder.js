const Product = require("../models/Product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/db");

const products = require("../data/products");

//Config file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products Deleted");

    await Product.insertMany(products);
    console.log("All products seeded");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
