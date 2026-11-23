const express = require("express");
const crypto = require("crypto");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const User = require("../Models/User");
const StoreSettings = require("../Models/StoreSettings");
const { authenticateToken } = require("../Middleware/auth");

const router = express.Router();
const RAZORPAY_API = "https://api.razorpay.com/v1";

function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function validateShippingDetails(details) {
  if (!details || typeof details !== "object") return "Delivery address is required.";
  const fullName = String(details.fullName || "").trim();
  const phone = String(details.phone || "").trim();
  const address = String(details.address || "").trim();
  const city = String(details.city || "").trim();
  const state = String(details.state || "").trim();
  const pincode = String(details.pincode || "").trim();

  if (fullName.length < 2) return "Enter a valid full name.";
  if (!/^[6-9]\d{9}$/.test(phone)) return "Enter a valid 10-digit Indian mobile number.";
  if (address.length < 5) return "Enter a complete delivery address.";
  if (!city || !state) return "City and state are required.";
  if (!/^\d{6}$/.test(pincode)) return "Enter a valid 6-digit PIN code.";
  return null;
}

async function calculateCheckout(userId, body) {
  const validationError = validateShippingDetails(body.shippingDetails);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    const error = new Error("Your cart is empty.");
    error.status = 400;
    throw error;
  }

  const normalized = new Map();
  for (const item of body.items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      const error = new Error("One or more product quantities are invalid (1–20 allowed).");
      error.status = 400;
      throw error;
    }
    normalized.set(productId, (normalized.get(productId) || 0) + quantity);
  }

  const productIds = [...normalized.keys()];
  const products = await Product.find({ productId: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [Number(product.productId), product]));

  if (products.length !== productIds.length) {
    const error = new Error("One or more products are no longer available.");
    error.status = 400;
    throw error;
  }

  const items = productIds.map((productId) => {
    const product = productMap.get(productId);
    const quantity = normalized.get(productId);
    const listedPrice = Number(product.Price);
    const discount = Math.min(100, Math.max(0, Number(product.Discount) || 0));
    const unitPrice = Math.max(0, Math.round(listedPrice * (1 - discount / 100)));
    return {
      productId,
      title: product.CardTitle,
      image: product.image || "",
      price: unitPrice,
      quantity,
    };
  });

  const originalAmount = items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + Math.round(Number(product.Price) || 0) * item.quantity;
  }, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.max(0, originalAmount - subtotal);
  const user = await User.findById(userId).select("coins name email phone");
  if (!user) {
    const error = new Error("User account not found. Please sign in again.");
    error.status = 401;
    throw error;
  }

  const coinsToUse = Number(body.coinsToUse || 0);
  if (!Number.isInteger(coinsToUse) || coinsToUse < 0) {
    const error = new Error("Wallet coins amount is invalid.");
    error.status = 400;
    throw error;
  }
  if (coinsToUse > Number(user.coins || 0)) {
    const error = new Error("You do not have enough SHIVRAM Coins.");
    error.status = 400;
    throw error;
  }
  if (coinsToUse > subtotal) {
    const error = new Error("Wallet coins cannot exceed the order subtotal.");
    error.status = 400;
    throw error;
  }

  const payableAmount = subtotal - coinsToUse;
  const storeSettings = await StoreSettings.findOne({ key: "store" }).lean();
  const coinRewardPercentage = Number.isFinite(Number(storeSettings?.coinRewardPercentage))
    ? Math.min(20, Math.max(0, Number(storeSettings.coinRewardPercentage)))
    : 5;

  return {
    user,
    items,
    originalAmount,
    subtotal,
    discountAmount,
    coinsUsed: coinsToUse,
    payableAmount,
    coinRewardPercentage,
    coinsEarned: Math.floor(payableAmount * coinRewardPercentage / 100),
    shippingDetails: {
      fullName: String(body.shippingDetails.fullName).trim(),
      phone: String(body.shippingDetails.phone).trim(),
      address: String(body.shippingDetails.address).trim(),
      city: String(body.shippingDetails.city).trim(),
      state: String(body.shippingDetails.state).trim(),
      pincode: String(body.shippingDetails.pincode).trim(),
      paymentMethod: body.shippingDetails.paymentMethod || "",
    },
  };
}

async function saveOrder(userId, checkout, payment) {
  if (payment.razorpayPaymentId) {
    const existing = await Order.findOne({ razorpayPaymentId: payment.razorpayPaymentId });
    if (existing) {
      const currentWallet = await User.findById(userId).select("coins");
      return { order: existing, coinsEarned: existing.coinsEarned || 0, walletCoins: currentWallet?.coins || 0, alreadyCreated: true };
    }
  }

  // Redeem coins at checkout; reward coins stay pending until delivery.
  let walletUpdated = false;
  let updatedUser = checkout.user;
  try {
    if (checkout.coinsUsed > 0) {
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, coins: { $gte: checkout.coinsUsed } },
        { $inc: { coins: -checkout.coinsUsed } },
        { new: true }
      );
      if (!updatedUser) {
        const error = new Error("Wallet balance changed. Refresh checkout and try again.");
        error.status = 409;
        throw error;
      }
      walletUpdated = true;
    }

    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setUTCDate(expectedDeliveryDate.getUTCDate() + 5);
    expectedDeliveryDate.setUTCHours(12, 0, 0, 0);

    const order = await Order.create({
      orderId: `ORD${Date.now()}${crypto.randomInt(100, 999)}`,
      userId,
      items: checkout.items,
      totalAmount: checkout.payableAmount,
      originalAmount: checkout.originalAmount,
      discountAmount: checkout.discountAmount,
      coinsUsed: checkout.coinsUsed,
      coinsEarned: checkout.coinsEarned,
      coinRewardPercentage: checkout.coinRewardPercentage,
      coinsCredited: false,
      expectedDeliveryDate,
      shippingDetails: {
        ...checkout.shippingDetails,
        paymentMethod: payment.paymentMethod,
      },
      orderStatus: "Order Placed",
      paymentStatus: payment.paymentStatus,
      paymentProvider: payment.paymentProvider,
      paymentMethod: payment.paymentMethod,
      razorpayOrderId: payment.razorpayOrderId || "",
      ...(payment.razorpayPaymentId ? { razorpayPaymentId: payment.razorpayPaymentId } : {}),
      currency: "INR",
    });

    return {
      order,
      coinsEarned: checkout.coinsEarned,
      walletCoins: updatedUser?.coins ?? checkout.user?.coins ?? 0,
      alreadyCreated: false,
    };
  } catch (error) {
    if (walletUpdated) {
      await User.findByIdAndUpdate(userId, { $inc: { coins: checkout.coinsUsed } }).catch((rollbackError) => {
        console.error("Wallet rollback failed:", rollbackError.message);
      });
    }
    throw error;
  }
}

async function razorpayRequest(path, method = "GET", body) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch(`${RAZORPAY_API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.description || "Payment gateway request failed.");
    error.status = response.status >= 400 && response.status < 500 ? 400 : 502;
    throw error;
  }
  return data;
}

// Create an online payment intent. Product prices are always read from MongoDB.
router.post("/checkout/razorpay/create", authenticateToken, async (req, res) => {
  try {
    const checkout = await calculateCheckout(req.user._id, req.body);

    // Wallet can cover the complete order; no gateway call is needed.
    if (checkout.payableAmount === 0) {
      const saved = await saveOrder(req.user._id, checkout, {
        paymentStatus: "PAID",
        paymentProvider: "SHIVRAM_WALLET",
        paymentMethod: "SHIVRAM Coins",
      });
      return res.status(201).json({ success: true, completed: true, ...saved });
    }

    if (!razorpayConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Online payments are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env, or choose Cash on Delivery.",
      });
    }

    const gatewayOrder = await razorpayRequest("/orders", "POST", {
      amount: checkout.payableAmount * 100,
      currency: "INR",
      receipt: `shivram_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        itemCount: String(checkout.items.length),
      },
    });

    return res.status(201).json({
      success: true,
      completed: false,
      keyId: process.env.RAZORPAY_KEY_ID,
      gatewayOrder: {
        id: gatewayOrder.id,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency,
      },
      summary: {
        originalAmount: checkout.originalAmount,
        discountAmount: checkout.discountAmount,
        subtotal: checkout.subtotal,
        coinsUsed: checkout.coinsUsed,
        payableAmount: checkout.payableAmount,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error.message);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Unable to start payment." });
  }
});

// Verify Razorpay signature and gateway state before creating the order in MongoDB.
router.post("/checkout/razorpay/verify", authenticateToken, async (req, res) => {
  try {
    if (!razorpayConfigured()) return res.status(503).json({ message: "Razorpay is not configured." });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification details are incomplete." });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    const receivedBuffer = Buffer.from(String(razorpay_signature), "hex");
    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed." });
    }

    const [gatewayOrder, payment] = await Promise.all([
      razorpayRequest(`/orders/${encodeURIComponent(razorpay_order_id)}`),
      razorpayRequest(`/payments/${encodeURIComponent(razorpay_payment_id)}`),
    ]);
    if (String(gatewayOrder.notes?.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "This payment does not belong to your account." });
    }
    if (payment.order_id !== razorpay_order_id || payment.status !== "captured" || gatewayOrder.status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment has not been captured successfully." });
    }

    const checkout = await calculateCheckout(req.user._id, req.body);
    if (Number(gatewayOrder.amount) !== checkout.payableAmount * 100 || payment.currency !== "INR") {
      return res.status(400).json({ success: false, message: "Paid amount does not match the current order total. Contact support before retrying." });
    }

    const saved = await saveOrder(req.user._id, checkout, {
      paymentStatus: "PAID",
      paymentProvider: "RAZORPAY",
      paymentMethod: payment.method ? `Razorpay (${payment.method.toUpperCase()})` : "Razorpay",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    return res.status(201).json({ success: true, ...saved });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error.message);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Payment verification failed." });
  }
});

// Cash on Delivery does not require a payment gateway.
router.post("/checkout/cod", authenticateToken, async (req, res) => {
  try {
    const checkout = await calculateCheckout(req.user._id, req.body);
    const isFullyCoveredByCoins = checkout.payableAmount === 0;
    const saved = await saveOrder(req.user._id, checkout, {
      paymentStatus: isFullyCoveredByCoins ? "PAID" : "COD_PENDING",
      paymentProvider: isFullyCoveredByCoins ? "SHIVRAM_WALLET" : "COD",
      paymentMethod: isFullyCoveredByCoins ? "SHIVRAM Coins" : "Cash on Delivery",
    });
    return res.status(201).json({ success: true, ...saved });
  } catch (error) {
    console.error("Create COD order error:", error.message);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Unable to place COD order." });
  }
});

// Wallet balance
router.get("/wallet/:userId", authenticateToken, async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    if (req.user.role !== "admin" && String(req.user._id) !== requestedUserId) {
      return res.status(403).json({ message: "You cannot access another user's wallet." });
    }
    const user = await User.findById(requestedUserId).select("coins");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ coins: user.coins || 0, coinValueInRupees: 1 });
  } catch (error) {
    return res.status(500).json({ message: "Wallet could not be loaded." });
  }
});

// User order history
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    if (req.user.role !== "admin" && String(req.user._id) !== requestedUserId) {
      return res.status(403).json({ message: "You cannot access another user's orders." });
    }
    const orders = await Order.find({ userId: requestedUserId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({ message: "Orders could not be loaded." });
  }
});

module.exports = router;
