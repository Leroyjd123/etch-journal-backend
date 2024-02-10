const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    questionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    entries: {
      type: [String], //if there is a single value, it means it was a radio option, multiple means checkbox, and a single long answer means it was a textarea
      required: true,
    },
    tags: [String], //can be made to use the entries and question information for searching
  },
  { timestamps: true }
)

const Answer = mongoose.model("Answer", answerSchema)
module.exports = Answer
