import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  cnicNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cnicFront: {
    type: String,
    required: false,
  },

  cnicBack: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    default: "Pakistan",
  },
  city: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);