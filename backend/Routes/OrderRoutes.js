const express = require("express");
const router = express.Router();

const Order = require("../Models/Order");


// =========================================
// CREATE ORDER
// =========================================

router.post("/", async (req, res) => {

  try {

    const {
      userId,
      items,
      totalAmount,
      shippingDetails
    } = req.body;


    // Basic validation
    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !shippingDetails
    ) {

      return res.status(400).json({
        message: "Order details incomplete hain"
      });

    }


    // Generate Order ID
    const orderId =
      "ORD" +
      Date.now() +
      Math.floor(Math.random() * 1000);


    const newOrder = new Order({

      orderId,

      userId,

      items,

      totalAmount,

      shippingDetails,

      orderStatus: "Order Placed"

    });


    const savedOrder =
      await newOrder.save();


    res.status(201).json({

      message: "Order successfully save ho gaya",

      order: savedOrder

    });


  } catch (error) {

    console.log(
      "Create Order Error:",
      error.message
    );

    res.status(500).json({

      message: "Order save nahi ho paya",

      error: error.message

    });

  }

});


// =========================================
// GET USER ORDERS
// =========================================

router.get("/user/:userId", async (req, res) => {

  try {

    const orders =
      await Order.find({
        userId: req.params.userId
      }).sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {

    console.log(
      "Get Orders Error:",
      error.message
    );

    res.status(500).json({

      message: "Orders fetch nahi ho paye"

    });

  }

});


module.exports = router;