const express = require("express");
const Inquiry = require("../models/Inquiry");
const Newsletter = require("../models/Newsletter");
const Blog = require("../models/Blog");
const Admission = require("../models/Admission");
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

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate({
            path: 'comments',
            select: 'name message'
        });
          
        res.status(200).send({blogs});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
router.get("/blogs/:id", async (req, res) => {

    try {
        const blog = await Blog.findById(req.params.id).populate({
            path: 'comments',
            select: 'name message'
        });
        if (!blog) return res.status(404).send({ message: "Blog not found" });

        const otherBlogs = await Blog.aggregate([
            { $match: { _id: { $ne: blog._id } } },
            { $sample: { size: 4 } }
        ])
        res.status(200).send({
            blog,
            suggested: otherBlogs
        });

    } catch (error) {
        res.status(500).send({ message: "No Data Found" });
    }
});

router.post("/admission", async (req, res) => {
    try {
        const {
            fullName,
            dob,
            gender,
            email,
            phone,
            address,
            education,
            occupation,
            course,
            goals,
            referral,
        } = req.body;

        const emailExists = await Admission.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const admission = new Admission({
            fullName,
            dob,
            gender,
            email,
            phone,
            address,
            education,
            occupation,
            course,
            goals,
            referral,
        });

        await admission.save();

        res.status(201).json({
            success: true,
            message: "Admission form submitted successfully!",
        });
    } catch (error) {
        console.error("Admission submission error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not submit admission form.",
        });
    }
});
module.exports = router;

