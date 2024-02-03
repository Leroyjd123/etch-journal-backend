const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    avatarID: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
    },
    phoneNumber: {
      type: String,
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
    journalList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal",
      },
    ],
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)
module.exports = User
