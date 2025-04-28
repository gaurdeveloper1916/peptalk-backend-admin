const mongoose = require('mongoose');
const Newsletter = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', Newsletter);