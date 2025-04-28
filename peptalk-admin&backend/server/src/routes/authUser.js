const express = require("express");

const Inquiry = require("../models/Inquiry");
const Newsletter = require("../models/Newsletter");

const router = express.Router();


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
