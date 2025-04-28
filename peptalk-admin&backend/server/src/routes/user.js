

const express = require("express");

const Inquiry = require("../models/Inquiry");
const Newsletter = require("../models/Newsletter");

const router = express.Router();


router.post('/inquiry', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, city, message } = req.body;

        // Create a new Inquiry
        const newInquiry = new Inquiry({
            fullName,
            email,
            phoneNumber,
            city,
            message
        });

        // Save to MongoDB
        await newInquiry.save();

        res.status(201).json({ success: true, message: 'Inquiry submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
router.post('/newsletter', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Create a new User
        const newUser = new Newsletter({
            name,
            email
        });

        // Save to MongoDB
        await newUser.save();

        res.status(201).json({ success: true, message: 'User saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});



module.exports = router;
