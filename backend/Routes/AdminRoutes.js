const express = require("express");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const User = require("../Models/User");
const StoreSettings = require("../Models/StoreSettings");
const { authenticateToken, requireAdmin } = require("../Middleware/auth");

const router = express.Router();
const ORDER_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

router.use(authenticateToken, requireAdmin);

// Coin reward percentage applies to orders placed after the setting is saved.
router.get("/settings/coin-reward", async (req, res) => {
  try {
    const settings = await StoreSettings.findOne({ key: "store" }).lean();
    res.json({ coinRewardPercentage: settings?.coinRewardPercentage ?? 5 });
  } catch (error) {
    console.error("Load coin reward settings error:", error);
    res.status(500).json({ message: "Coin reward settings load nahi ho payi." });
  }
});

router.patch("/settings/coin-reward", async (req, res) => {
  try {
    const percentage = Number(req.body.coinRewardPercentage);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 20) {
      return res.status(400).json({ message: "Reward percentage 0 se 20 ke beech hona chahiye." });
    }
    const settings = await StoreSettings.findOneAndUpdate(
      { key: "store" },
      { $set: { coinRewardPercentage: percentage }, $setOnInsert: { key: "store" } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({
      message: `Coin reward rate ${percentage}% save ho gaya. Ye sirf naye orders par apply hoga.`,
      coinRewardPercentage: settings.coinRewardPercentage,
    });
  } catch (error) {
    console.error("Save coin reward settings error:", error);
    res.status(500).json({ message: "Coin reward settings save nahi ho payi." });
  }
});


// Dashboard summary cards and recent orders.
router.get("/summary", async (req, res) => {
  try {
    const [products, users, orders, revenueResult, pendingOrders, recentOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: { $ne: "admin" } }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ orderStatus: { $nin: ["Delivered", "Cancelled"] } }),
      Order.find().sort({ createdAt: -1 }).limit(6).populate("userId", "name email").lean(),
    ]);

    res.json({
      stats: {
        products,
        customers: users,
        orders,
        revenue: revenueResult[0]?.total || 0,
        pendingOrders,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({ message: "Dashboard summary load nahi ho paya." });
  }
});

// Product management.
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 }).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Products load nahi ho paye." });
  }
});

function validateProduct(body) {
  const requiredStrings = ["image", "Category", "CardTitle", "ItemContent"];
  for (const key of requiredStrings) {
    if (typeof body[key] !== "string" || !body[key].trim()) {
      return `${key} is required.`;
    }
  }
  for (const key of ["Price", "Discount"]) {
    if (!Number.isFinite(Number(body[key])) || Number(body[key]) < 0) {
      return `${key} must be a valid non-negative number.`;
    }
  }
  if (Number(body.Discount) > 100) return "Discount 100 se zyada nahi ho sakta.";
  return null;
}

router.post("/products", async (req, res) => {
  try {
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const lastProduct = await Product.findOne().sort({ productId: -1 }).select("productId").lean();
    const productId = lastProduct ? Number(lastProduct.productId) + 1 : 1;
    const product = await Product.create({
      productId,
      image: req.body.image.trim(),
      Rating: 0,
      Reviews: 0,
      Category: req.body.Category.trim(),
      Price: Number(req.body.Price),
      Discount: Number(req.body.Discount),
      CardTitle: req.body.CardTitle.trim(),
      ItemContent: req.body.ItemContent.trim(),
      customerReviews: [],
    });
    res.status(201).json({ message: "Product add ho gaya.", product });
  } catch (error) {
    console.error("Admin create product error:", error);
    res.status(500).json({ message: "Product add nahi ho paya. Product ID conflict ho sakta hai; retry karein." });
  }
});

router.put("/products/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId)) return res.status(400).json({ message: "Invalid product ID." });
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $set: {
          image: req.body.image.trim(),
          Category: req.body.Category.trim(),
          Price: Number(req.body.Price),
          Discount: Number(req.body.Discount),
          CardTitle: req.body.CardTitle.trim(),
          ItemContent: req.body.ItemContent.trim(),
        },
      },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product nahi mila." });
    res.json({ message: "Product update ho gaya.", product });
  } catch (error) {
    console.error("Admin update product error:", error);
    res.status(500).json({ message: "Product update nahi ho paya." });
  }
});

router.delete("/products/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const product = await Product.findOneAndDelete({ productId });
    if (!product) return res.status(404).json({ message: "Product nahi mila." });
    res.json({ message: "Product delete ho gaya." });
  } catch (error) {
    res.status(500).json({ message: "Product delete nahi ho paya." });
  }
});

// Order management.
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Orders load nahi ho paye." });
  }
});

router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { status, expectedDeliveryDate } = req.body;
    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Order status valid nahi hai.", allowedStatuses: ORDER_STATUSES });
    }
    if (status === undefined && expectedDeliveryDate === undefined) {
      return res.status(400).json({ message: "Status ya expected delivery date provide karein." });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order nahi mila." });

    let parsedExpectedDate;
    if (expectedDeliveryDate !== undefined) {
      if (typeof expectedDeliveryDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(expectedDeliveryDate)) {
        return res.status(400).json({ message: "Expected delivery date valid format (YYYY-MM-DD) mein bhejein." });
      }
      parsedExpectedDate = new Date(`${expectedDeliveryDate}T12:00:00.000Z`);
      if (Number.isNaN(parsedExpectedDate.getTime()) || parsedExpectedDate.toISOString().slice(0, 10) !== expectedDeliveryDate) {
        return res.status(400).json({ message: "Expected delivery date valid nahi hai." });
      }
    }

    const nextStatus = status ?? order.orderStatus;
    if (order.orderStatus === "Cancelled" && nextStatus !== "Cancelled") {
      return res.status(409).json({ message: "Cancelled order ko dobara process nahi kiya ja sakta." });
    }
    if (order.orderStatus === "Delivered" && nextStatus !== "Delivered") {
      return res.status(409).json({ message: "Delivered order ka status reverse nahi kiya ja sakta." });
    }

    const fields = {};
    if (status !== undefined) fields.orderStatus = nextStatus;
    if (parsedExpectedDate) fields.expectedDeliveryDate = parsedExpectedDate;

    let updatedOrder;
    let coinsCreditedNow = 0;
    const hasRewardSnapshot = Number.isFinite(order.coinRewardPercentage);

    if (nextStatus === "Delivered" && hasRewardSnapshot && order.coinsCredited !== true) {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: { $ne: "Cancelled" }, coinsCredited: { $ne: true } },
        { $set: { ...fields, orderStatus: "Delivered", coinsCredited: true, coinsCreditedAt: new Date() } },
        { new: true, runValidators: true }
      );

      if (updatedOrder) {
        const reward = Math.max(0, Math.floor(Number(updatedOrder.coinsEarned) || 0));
        if (reward > 0) {
          const customer = await User.findByIdAndUpdate(
            updatedOrder.userId,
            { $inc: { coins: reward } },
            { new: true }
          );
          if (!customer) {
            await Order.updateOne(
              { _id: updatedOrder._id, coinsCredited: true },
              { $set: { coinsCredited: false }, $unset: { coinsCreditedAt: 1 } }
            );
            return res.status(404).json({ message: "Customer account nahi mila; reward credit nahi hua. Dobara try karein." });
          }
          coinsCreditedNow = reward;
        }
      } else {
        updatedOrder = await Order.findById(order._id);
      }
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id },
        { $set: fields },
        { new: true, runValidators: true }
      );
    }

    if (!updatedOrder) return res.status(404).json({ message: "Order nahi mila." });
    const populatedOrder = await Order.findById(updatedOrder._id).populate("userId", "name email phone");
    const message = coinsCreditedNow > 0
      ? `Order delivered. ${coinsCreditedNow} SHIVRAM Coins customer wallet mein credit ho gaye.`
      : nextStatus === "Delivered" && hasRewardSnapshot
        ? "Order status updated. Reward pehle hi credit ho chuka hai ya reward 0 hai."
        : "Order details update ho gayi.";
    res.json({ message, order: populatedOrder, coinsCredited: coinsCreditedNow });
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ message: "Order update nahi ho paya." });
  }
});

// Customer directory (password is never selected).
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Customers load nahi ho paye." });
  }
});

// Read-only review moderation view; customer reviews stay attached to their product.
router.get("/reviews", async (req, res) => {
  try {
    const products = await Product.find({ "customerReviews.0": { $exists: true } })
      .select("productId CardTitle customerReviews")
      .lean();
    const reviews = products.flatMap((product) =>
      (product.customerReviews || []).map((review) => ({
        ...review,
        productId: product.productId,
        productTitle: product.CardTitle,
      }))
    ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Reviews load nahi ho paye." });
  }
});

module.exports = router;
