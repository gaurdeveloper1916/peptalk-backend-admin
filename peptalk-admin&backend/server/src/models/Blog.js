const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: Object,
  coverImage: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
