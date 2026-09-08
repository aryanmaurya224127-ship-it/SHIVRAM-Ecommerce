
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const Product = require("./Models/Product");

const app = express();

app.use(cors());
app.use(express.json());




// Cart Schema

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true
    },

    CardTitle: {
      type: String,
      required: true
    },

    ItemContent: {
      type: String
    },

    Category: {
      type: String
    },

    Price: {
      type: Number,
      required: true
    },

    Discount: {
      type: Number,
      default: 0
    },

    Rating: {
      type: Number
    },

    Reviews: {
      type: Number
    },

    image: {
      type: String
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema);



// Home

app.get("/", (req, res) => {
  res.send("SHIVRAM Backend is running");
});


// Products

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });

    res.json(products);

  } catch (error) {
    console.log("Get Products Error:", error.message);

    res.status(500).json({
      message: "Products fetch nahi ho paye"
    });
  }
});

// Get Single Product

app.get("/api/products/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

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
    console.log("Get Single Product Error:", error.message);

    res.status(500).json({
      message: "Product fetch nahi ho paya"
    });
  }
});

// Get Cart

app.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.find().sort({ createdAt: 1 });

    res.json(cart);
  } catch (error) {
    console.log("Get Cart Error:", error.message);

    res.status(500).json({
      message: "Cart fetch nahi ho paya"
    });
  }
});


// Add To Cart

app.post("/api/cart", async (req, res) => {
   try { 
    const product = req.body; 
  console.log("PRODUCT RECEIVED:", product);

    // Check required fields
    if (
      product.productId === undefined ||
      !product.CardTitle ||
      product.Price === undefined
    ) {
      return res.status(400).json({
        message: "Product information is incomplete"
      });
    }

    // Check if product already exists in cart
    const existingProduct = await Cart.findOne({
      productId: product.productId
    });

    if (existingProduct) {
      existingProduct.quantity += 1;

      await existingProduct.save();
    } else {
      await Cart.create({
        productId: product.productId,
        CardTitle: product.CardTitle,
        ItemContent: product.ItemContent,
        Category: product.Category,
        Price: product.Price,
        Discount: product.Discount,
        Rating: product.Rating,
        Reviews: product.Reviews,
        image: product.image,
        quantity: 1
      });
    }

    // Return updated cart
    const cart = await Cart.find().sort({ createdAt: 1 });

    res.json(cart);

  } catch (error) {
    console.log("Add Cart Error:", error.message);

    res.status(500).json({
      message: "Product cart me add nahi ho paya"
    });
  }
});


// Update Cart Quantity
app.put("/api/cart/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity minimum 1 honi chahiye"
      });
    }

    const cartProduct = await Cart.findOne({
      productId: productId
    });

    if (!cartProduct) {
      return res.status(404).json({
        message: "Product cart me nahi mila"
      });
    }

    cartProduct.quantity = quantity;

    await cartProduct.save();

    const cart = await Cart.find().sort({ createdAt: 1 });

    res.json(cart);

  } catch (error) {
    console.log("Update Quantity Error:", error.message);

    res.status(500).json({
      message: "Quantity update nahi ho payi"
    });
  }
});


// Remove From Cart

app.delete("/api/cart/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const deletedProduct = await Cart.findOneAndDelete({
      productId: productId
    });

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product cart me nahi mila"
      });
    }

    // Return updated cart
    const cart = await Cart.find().sort({ createdAt: 1 });

    res.json(cart);

  } catch (error) {
    console.log("Remove Cart Error:", error.message);

    res.status(500).json({
      message: "Product cart se remove nahi ho paya"
    });
  }
});


// Clear Entire Cart


app.delete("/api/cart", async (req, res) => {
  try {
    await Cart.deleteMany({});

    res.json({
      message: "Cart successfully clear ho gaya",
      cart: []
    });

  } catch (error) {
    console.log("Clear Cart Error:", error.message);

    res.status(500).json({
      message: "Cart clear nahi ho paya"
    });
  }
});



 // Server &  Mongo Connection


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB Connected Successfully");

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
}).catch((err) => {
  console.log("MongoDB Connected Error:",err.message);
});




