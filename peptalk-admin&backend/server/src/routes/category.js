const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Server error while fetching categories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send({ message: "Category not found" });
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send({ message: "Server error while fetching category" });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).send({ message: "Server error while creating category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).send({ message: "Category not found" });
    res.status(200).send({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).send({ message: "Server error while updating category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "Category not found" });
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error while deleting category" });
  }
});

module.exports = router;
