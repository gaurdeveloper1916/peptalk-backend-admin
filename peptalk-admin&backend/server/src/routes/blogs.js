const express = require("express");
const multer = require("multer")
const Blog = require("../models/Blog");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("comments");
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: "Server error while fetching blogs" });
  }
});


router.get("/:id", async (req, res) => {

  try {
    const blog = await Blog.findById(req.params.id).populate('comments');
    if (!blog) return res.status(404).send({ message: "Blog not found" });

    const otherBlogs = await Blog.aggregate([
      { $match: { _id: { $ne: blog._id } } },
      { $sample: { size: 2 } }
    ])
    res.status(200).send({
      blog,
      suggested: otherBlogs
    });

  } catch (error) {
    res.status(500).send({ message: "No Data Found" });
  }
});

// Create a new blog
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).send({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).send({ message: "Server error while creating blog" });
  }
});

// Update a blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).send({ message: "Blog not found" });
    res.status(200).send({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send({ message: "Server error while updating blog" });
  }
});

// Delete a blog
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "Blog not found" });
    res.status(200).send({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send({ message: "Server error while deleting blog" });
  }
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "uploads", // optional
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
