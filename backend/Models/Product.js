const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true
    },

    image: {
      type: String,
      required: true
    },

    Rating: {
      type: Number,
      required: true
    },

    Reviews: {
      type: Number,
      required: true
    },

    Category: {
      type: String,
      required: true
    },

    Price: {
      type: Number,
      required: true
    },

    Discount: {
      type: Number,
      required: true
    },

    CardTitle: {
      type: String,
      required: true
    },

    ItemContent: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;