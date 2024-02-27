const mongoose = require("mongoose")

const { Schema } = mongoose

// Define User Schema
const userSchema = new Schema(
  {
    avatarId: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ], // Email validation
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userType: {
      type: String,
      enum: ["freeUser", "subscribedUser", "admin"],
      default: "freeUser",
    },
  },
  { timestamps: true }
)

// Compile model from schema
const User = mongoose.model("User", userSchema)

module.exports = User
