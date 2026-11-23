
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, "Order must contain at least one item"] },
  totalAmount: { type: Number, required: true, min: 0 },
  originalAmount: { type: Number, required: true, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  coinsEarned: { type: Number, default: 0, min: 0 },
  // Reward percentage is snapshotted when the order is placed. Older orders
  // intentionally have no percentage, so they are not credited a second time.
  coinRewardPercentage: { type: Number, min: 0, max: 20 },
  coinsCredited: { type: Boolean, default: false },
  coinsCreditedAt: { type: Date, default: null },
  expectedDeliveryDate: { type: Date },
  coinsUsed: { type: Number, default: 0, min: 0 },
  shippingDetails: {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: "" },
    pincode: { type: String, required: true, trim: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
  },
  orderStatus: {
    type: String,
    enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Order Placed",
  },
  paymentStatus: {
    type: String,
    enum: ["COD_PENDING", "PAID", "FAILED", "REFUNDED"],
    default: "COD_PENDING",
  },
  paymentProvider: { type: String, enum: ["COD", "RAZORPAY", "SHIVRAM_WALLET"], default: "COD" },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  razorpayOrderId: { type: String, default: "" },
  razorpayPaymentId: { type: String, default: undefined },
  currency: { type: String, default: "INR" },
}, { timestamps: true });

orderSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Order", orderSchema);
