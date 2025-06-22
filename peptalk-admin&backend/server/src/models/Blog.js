const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: Object,
  coverImage: String,
  category: String,
  writtenBy: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
  justOne: false
});

// blogSchema.virtual('category', {
//   ref: 'Category',
//   localField: "_id",
//   foreignField: 'blog',
//   justOne: true
// })

blogSchema.set('toObject', { virtuals: true });
blogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
