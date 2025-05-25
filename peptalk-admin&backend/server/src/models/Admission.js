const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  education: { type: String, required: true },
  occupation: { type: String },
  course: { type: String, required: true },
  goals: { type: String },
  referral: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admission", admissionSchema);
