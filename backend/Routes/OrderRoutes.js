
const express = require("express");
const router = express.Router();

const Order = require("../Models/Order");
const User = require("../Models/User");
const {
  authenticateToken,
  requireAdmin,
} = require("../Middleware/auth");

// =========================================
// CREATE ORDER
// =========================================
router.post("/", authenticateToken, async (req, res) => {
  let coinsDeducted = 0;
  let userIdForRollback = null;

  try {
    // User identity token se li jayegi, request body se nahi.
    const userId = req.user._id;
    const { items, totalAmount, shippingDetails } = req.body;
    const coinsToUse = Number(req.body.coinsToUse || 0);

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !Number.isFinite(Number(totalAmount)) ||
      Number(totalAmount) < 0 ||
      !shippingDetails
    ) {
      return res.status(400).json({
        message: "Order details incomplete hain",
      });
    }

    if (!Number.isInteger(coinsToUse) || coinsToUse < 0) {
      return res.status(400).json({
        message: "Coins amount valid nahi hai.",
      });
    }

    const originalAmount = Math.round(Number(totalAmount));
    const actualCoinsToUse = Math.min(coinsToUse, originalAmount);

    const orderId =
      "ORD" + Date.now() + Math.floor(Math.random() * 1000);

    if (actualCoinsToUse > 0) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          coins: { $gte: actualCoinsToUse },
        },
        {
          $inc: { coins: -actualCoinsToUse },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({
          message: "Aapke wallet mein itne coins available nahi hain.",
        });
      }

      coinsDeducted = actualCoinsToUse;
      userIdForRollback = userId;
    }

    const payableAmount = Math.max(
      0,
      originalAmount - actualCoinsToUse
    );

    const coinsEarned = Math.floor(payableAmount * 0.05);

    const newOrder = new Order({
      orderId,
      userId,
      items,
      totalAmount: payableAmount,
      originalAmount,
      coinsUsed: actualCoinsToUse,
      coinsEarned,
      shippingDetails,
      orderStatus: "Order Placed",
    });

    const savedOrder = await newOrder.save();

    if (coinsEarned > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { coins: coinsEarned },
      });
    }

    const updatedWallet = await User.findById(userId).select("coins");

    return res.status(201).json({
      message: "Order successfully save ho gaya",
      order: savedOrder,
      coinsEarned,
      coinsUsed: actualCoinsToUse,
      walletCoins: updatedWallet?.coins || 0,
      messageCoins: `${coinsEarned} SHIVRAM Coins earned; ${actualCoinsToUse} coins used.`,
    });
  } catch (error) {
    if (coinsDeducted > 0 && userIdForRollback) {
      try {
        await User.findByIdAndUpdate(userIdForRollback, {
          $inc: { coins: coinsDeducted },
        });
      } catch (rollbackError) {
        console.error("Coin rollback failed:", rollbackError.message);
      }
    }

    console.error("Create Order Error:", error.message);

    return res.status(500).json({
      message: "Order save nahi ho paya",
      error: error.message,
    });
  }
});

// =========================================
// GET USER COIN WALLET
// =========================================
router.get(
  "/wallet/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const requestedUserId = req.params.userId;
      const isAdmin = req.user.role === "admin";
      const isOwnWallet =
        req.user._id.toString() === requestedUserId;

      if (!isAdmin && !isOwnWallet) {
        return res.status(403).json({
          message: "You cannot access another user's wallet",
        });
      }

      const user = await User.findById(requestedUserId).select("coins");

      if (!user) {
        return res.status(404).json({
          message: "User nahi mila",
        });
      }

      return res.json({
        coins: user.coins || 0,
        coinValueInRupees: 1,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Wallet fetch nahi ho paya",
      });
    }
  }
);

// =========================================
// GET USER ORDERS
// =========================================
router.get(
  "/user/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const requestedUserId = req.params.userId;
      const isAdmin = req.user.role === "admin";
      const isOwnOrders =
        req.user._id.toString() === requestedUserId;

      if (!isAdmin && !isOwnOrders) {
        return res.status(403).json({
          message: "You cannot access another user's orders",
        });
      }

      const orders = await Order.find({
        userId: requestedUserId,
      }).sort({ createdAt: -1 });

      return res.json(orders);
    } catch (error) {
      console.error("Get Orders Error:", error.message);

      return res.status(500).json({
        message: "Orders fetch nahi ho paye",
      });
    }
  }
);

module.exports = router;
