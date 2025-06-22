const express = require('express');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const router = express.Router()

router.post("/", async (req, res) => {
    const { blogId, name, email, message } = req.body;
    try {
        const userBlog = new Comment(req.body);
        await userBlog.save()
        res.status(201).send({ message: "Comment added successfully", userBlog });

    } catch (error) {
        res.status(500).send({ message: "Server error while added comment" });
    }
})
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Server error while fetching categories" });
  }
});
module.exports = router;