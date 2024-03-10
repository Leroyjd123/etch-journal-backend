const mongoose = require("mongoose")

const { Schema } = mongoose

// Define Answer Schema
const answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    entries: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

// Entries interpretation varies by inputType from the related Question
// - Radio: Single value
// - Checkbox: Multiple values
// - Textarea: Single, long answer

// Compile model from schema
const Answer = mongoose.model("Answer", answerSchema)

module.exports = Answer
