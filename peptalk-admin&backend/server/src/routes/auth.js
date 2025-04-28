const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Inquiry = require("../models/Inquiry");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Server error. Please try again later." });
  }
});

router.get('/inquiry', async (req, res) => {
  try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET API for Users
router.get('/newsletter', async (req, res) => {
  try {
      const users = await Newsletter.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json({ success: true, data: users });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
