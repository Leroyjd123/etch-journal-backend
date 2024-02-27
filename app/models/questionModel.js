const mongoose = require("mongoose")

const { Schema } = mongoose

// Define Question Schema
const questionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    inputType: {
      type: String,
      required: true,
      enum: ["radio", "checkbox", "textarea"],
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Compile model from schema
const Question = mongoose.model("Question", questionSchema)

module.exports = Question
