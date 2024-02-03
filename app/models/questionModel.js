const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: [String],
    inputType: {
      type: String,
      required: true,
      enum: ["radio", "checkbox", "textarea"],
    },
    tags: [String],
  },
  { timestamps: true }
)

const Question = mongoose.model("Question", questionSchema)
module.exports = Question
