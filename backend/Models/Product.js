const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true, trim: true },
  orderId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

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
    },

    customerReviews: { type: [productReviewSchema], default: [] }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;