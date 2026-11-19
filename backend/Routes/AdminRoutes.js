const express = require("express");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const User = require("../Models/User");
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
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Order status valid nahi hai.", allowedStatuses: ORDER_STATUSES });
    }
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: { orderStatus: status } },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");
    if (!order) return res.status(404).json({ message: "Order nahi mila." });
    res.json({ message: "Order status update ho gaya.", order });
  } catch (error) {
    res.status(500).json({ message: "Order status update nahi ho paya." });
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
