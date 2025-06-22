const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: String,
    des: String
}, { timestamps: true })


module.exports = mongoose.model('Category', categorySchema)