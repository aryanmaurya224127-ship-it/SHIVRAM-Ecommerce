const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./Models/Product");
const userRoutes = require("./Routes/UserRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const orderRoutes = require("./Routes/OrderRoutes");

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());
app.use(express.json());


// =========================================
// USER ROUTES
// =========================================

app.use("/api", userRoutes);

// =========================================
// CART ROUTES
// =========================================

app.use("/api/cart", cartRoutes);

// =========================================
// ORDER ROUTES
// =========================================

app.use("/api/orders", orderRoutes);

// =========================================
// HOME
// =========================================

app.get("/", (req, res) => {
  res.send("SHIVRAM Backend is running");
});


// =========================================
// GET ALL PRODUCTS
// =========================================

app.get("/api/products", async (req, res) => {
  try {

    const products = await Product.find().sort({
      productId: 1
    });

    res.json(products);

  } catch (error) {

    console.log(
      "Get Products Error:",
      error.message
    );

    res.status(500).json({
      message: "Products fetch nahi ho paye"
    });
  }
});


// =========================================
// GET SINGLE PRODUCT
// =========================================

app.get("/api/products/:productId", async (req, res) => {

  try {

    const productId = Number(
      req.params.productId
    );

    const product = await Product.findOne({
      productId: productId
    });

    if (!product) {

      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {

    console.log(
      "Get Single Product Error:",
      error.message
    );

    res.status(500).json({
      message: "Product fetch nahi ho paya"
    });
  }
});


// =========================================
// SERVER & MONGODB CONNECTION
// =========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => {

    console.log(
      "MongoDB Connected Successfully"
    );

    app.listen(PORT, () => {

      console.log(
        `Backend running on http://localhost:${PORT}`
      );

    });

  })

  .catch((err) => {

    console.log(
      "MongoDB Connected Error:",
      err.message
    );

  });