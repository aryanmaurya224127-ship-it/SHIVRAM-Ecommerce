const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../Models/Cart.js");

const router = express.Router();

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing. Please login again.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

// =====================================================
// GET CART
// =====================================================

router.get("/", authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.find({
      userId: req.userId,
    }).sort({
      createdAt: 1,
    });

    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Cart fetch nahi ho paya",
    });
  }
});

// =====================================================
// ADD TO CART
// =====================================================

router.post("/", authenticateUser, async (req, res) => {
  try {
    const product = req.body;

    console.log("PRODUCT RECEIVED:", product);

    // =========================================
    // VALIDATION
    // =========================================

    if (
      product.productId === undefined ||
      !product.CardTitle ||
      product.Price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Product information is incomplete",
      });
    }

    // =========================================
    // FIND USER'S PRODUCT
    // =========================================

    const existingProduct = await Cart.findOne({
      userId: req.userId,
      productId: product.productId,
    });

    // =========================================
    // PRODUCT ALREADY EXISTS
    // =========================================

    if (existingProduct) {
      existingProduct.quantity += Number(
        product.quantity || 1
      );

      await existingProduct.save();
    }

    // =========================================
    // NEW PRODUCT
    // =========================================

    else {
      await Cart.create({
        userId: req.userId,

        productId: product.productId,
        CardTitle: product.CardTitle,
        ItemContent: product.ItemContent,
        Category: product.Category,
        Price: Number(product.Price),
        Discount: Number(product.Discount || 0),
        Rating: Number(product.Rating || 0),
        Reviews: Number(product.Reviews || 0),
        image: product.image,
        quantity: Math.max(
          1,
          Number(product.quantity || 1)
        ),
      });
    }

    // =========================================
    // RETURN USER CART
    // =========================================

    const cart = await Cart.find({
      userId: req.userId,
    }).sort({
      createdAt: 1,
    });

    res.json(cart);
  } catch (error) {
    console.error("Add Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Product cart me add nahi ho paya",
    });
  }
});

// =====================================================
// UPDATE QUANTITY
// =====================================================

router.put(
  "/:productId",
  authenticateUser,
  async (req, res) => {
    try {
      const productId = Number(req.params.productId);
      const quantity = Number(req.body.quantity);

      // =========================================
      // VALIDATION
      // =========================================

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity minimum 1 honi chahiye",
        });
      }

      // =========================================
      // FIND USER'S PRODUCT
      // =========================================

      const cartProduct = await Cart.findOne({
        userId: req.userId,
        productId,
      });

      if (!cartProduct) {
        return res.status(404).json({
          success: false,
          message: "Product cart me nahi mila",
        });
      }

      // =========================================
      // UPDATE
      // =========================================

      cartProduct.quantity = quantity;

      await cartProduct.save();

      // =========================================
      // RETURN UPDATED CART
      // =========================================

      const cart = await Cart.find({
        userId: req.userId,
      }).sort({
        createdAt: 1,
      });

      res.json(cart);
    } catch (error) {
      console.error(
        "Update Quantity Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Quantity update nahi ho payi",
      });
    }
  }
);

// =====================================================
// REMOVE FROM CART
// =====================================================

router.delete(
  "/:productId",
  authenticateUser,
  async (req, res) => {
    try {
      const productId = Number(req.params.productId);

      const deletedProduct =
        await Cart.findOneAndDelete({
          userId: req.userId,
          productId,
        });

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product cart me nahi mila",
        });
      }

      // =========================================
      // RETURN UPDATED CART
      // =========================================

      const cart = await Cart.find({
        userId: req.userId,
      }).sort({
        createdAt: 1,
      });

      res.json(cart);
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Product cart se remove nahi ho paya",
      });
    }
  }
);

// =====================================================
// CLEAR ENTIRE CART
// =====================================================

router.delete(
  "/",
  authenticateUser,
  async (req, res) => {
    try {
      await Cart.deleteMany({
        userId: req.userId,
      });

      res.json([]);
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Cart clear nahi ho paya",
      });
    }
  }
);

module.exports = router;