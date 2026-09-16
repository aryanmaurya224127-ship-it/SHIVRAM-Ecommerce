const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");

const router = express.Router();


// ========================================
// REGISTER USER
// ========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone,  houseAreaStreet,city,state,  pincode, } = req.body;

    // Check required fields
    if ( !name || !email || !password || !phone || !houseAreaStreet || !city ||!state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
  const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone.trim(),
      houseAreaStreet: houseAreaStreet.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        houseAreaStreet: newUser.houseAreaStreet,
        city: newUser.city,
        state: newUser.state,
        pincode: newUser.pincode,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ========================================
// LOGIN USER
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check fields
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const value = identifier.trim();

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [
        { email: value.toLowerCase() },
        { phone: value },
      ],
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please register first.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Successful login
    res.json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        houseAreaStreet: user.houseAreaStreet,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});



// ========================================
// GET ALL USERS
// ========================================

router.get("/auth/users", async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalUsers: users.length,
      users,
    });

  } catch (error) {

    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Users fetch nahi ho paye",
    });
  }
});

// ================= 
// FORGOT PASSWORD 
// =================

router.post("/forgot-password", async (req, res) => {
  try {
    const {
      identifier,
      newPassword,
      confirmPassword,
    } = req.body;

    // Check fields
    if (!identifier || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [
        {
          email: identifier.trim().toLowerCase(),
        },
        {
          phone: identifier.trim(),
        },
      ],
    });

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email or phone number",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Server error while resetting password",
    });
  }
});



module.exports = router;