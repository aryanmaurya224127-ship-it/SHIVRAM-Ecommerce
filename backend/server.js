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
// CUSTOMER PRODUCT REVIEWS
// =========================================

// Return products the signed-in customer has purchased but not reviewed yet.
app.get("/api/products/review-requests/:userId", async (req, res) => {
  try {
    const Order = require("./Models/Order");
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "User ID valid nahi hai." });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    const seen = new Set();
    const requests = [];
    for (const order of orders) {
      for (const item of (order.items || [])) {
        const key = String(item.productId);
        if (seen.has(key)) continue;
        const product = await Product.findOne({ productId: item.productId }).lean();
        if (!product) continue;
        const alreadyReviewed = (product.customerReviews || []).some((review) => String(review.userId) === userId);
        seen.add(key);
        if (!alreadyReviewed) requests.push({
          productId: item.productId,
          title: item.title || product.CardTitle,
          image: item.image || product.image,
          orderId: order.orderId,
          purchasedAt: order.createdAt,
          message: `Aapne ${item.title || product.CardTitle} purchase kiya tha. Apna review share karein aur doosre customers ki help karein.`
        });
      }
    }
    res.json(requests);
  } catch (error) {
    console.error("Review requests error:", error.message);
    res.status(500).json({ message: "Review requests load nahi ho paye." });
  }
});

// Only a customer with a matching purchase can review that product.
app.post("/api/products/:productId/reviews", async (req, res) => {
  try {
    const Order = require("./Models/Order");
    const { userId, orderId, rating, comment = "" } = req.body;
    const productId = Number(req.params.productId);
    const stars = Number(rating);
    if (!mongoose.isValidObjectId(userId) || !orderId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Rating aur review details sahi bharein." });
    }
    if (String(comment).trim().length > 1000) return res.status(400).json({ message: "Review 1000 characters se chhota hona chahiye." });
    const order = await Order.findOne({ orderId, userId });
    if (!order || !(order.items || []).some((item) => Number(item.productId) === productId)) {
      return res.status(403).json({ message: "Review sirf purchased product ke liye diya ja sakta hai." });
    }
    const [product, user] = await Promise.all([Product.findOne({ productId }), require("./Models/User").findById(userId).select("name")]);
    if (!product) return res.status(404).json({ message: "Product nahi mila." });
    if (!user) return res.status(404).json({ message: "User nahi mila." });
    if ((product.customerReviews || []).some((review) => String(review.userId) === String(userId))) {
      return res.status(409).json({ message: "Aap is product ka review pehle hi de chuke hain." });
    }
    const oldCount = Math.max(0, Number(product.Reviews) || 0);
    const oldRating = Math.max(0, Number(product.Rating) || 0);
    product.customerReviews.push({ userId, userName: user.name, orderId, rating: stars, comment: String(comment).trim() });
    product.Rating = Number((((oldRating * oldCount) + stars) / (oldCount + 1)).toFixed(1));
    product.Reviews = oldCount + 1;
    await product.save();
    res.status(201).json({ message: "Thank you! Aapka review submit ho gaya.", Rating: product.Rating, Reviews: product.Reviews, review: product.customerReviews[product.customerReviews.length - 1] });
  } catch (error) {
    console.error("Submit review error:", error.message);
    res.status(500).json({ message: "Review submit nahi ho paya." });
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