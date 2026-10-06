const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // =========================================
    // USER
    // =========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================================
    // PRODUCT
    // =========================================

    productId: {
      type: Number,
      required: true,
    },

    CardTitle: {
      type: String,
      required: true,
      trim: true,
    },

    ItemContent: {
      type: String,
      default: "",
    },

    Category: {
      type: String,
      default: "",
    },

    Price: {
      type: Number,
      required: true,
      min: 0,
    },

    Discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    Rating: {
      type: Number,
      default: 0,
    },

    Reviews: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    // =========================================
    // QUANTITY
    // =========================================

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// SAME PRODUCT CANNOT BE DUPLICATED
// FOR SAME USER
// =========================================

cartSchema.index(
  {
    userId: 1,
    productId: 1,
  },
  {
    unique: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;