const Answer = require("../models/answerModel")
const mongoose = require("mongoose")

const metricsController = {}

// Aggregates tag counts for a user's answers.
metricsController.tagCount = async (req, res) => {
  const userID = req.user.id

  try {
    const result = await Answer.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const response = result.map((tag) => ({ tag: tag._id, count: tag.count }))
    res.json(response)
  } catch (error) {
    console.error("Error aggregating tags:", error)
    res
      .status(500)
      .json({ message: "Error aggregating tags", error: error.message })
  }
}

// Aggregates top questions based on answer counts for a user.
metricsController.topQuestions = async (req, res) => {
  const userID = req.user.id

  try {
    const result = await Answer.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      {
        $lookup: {
          from: "questions",
          localField: "questionID",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      { $unwind: "$questionDetails" },
      {
        $group: {
          _id: "$questionID",
          count: { $sum: 1 },
          label: { $first: "$questionDetails.label" },
          tags: { $first: "$questionDetails.tags" },
        },
      },
      { $sort: { count: -1 } },
      { $project: { _id: 0, questionID: "$_id", count: 1, label: 1, tags: 1 } },
    ])

    res.json(result)
  } catch (error) {
    console.error("Error aggregating questions:", error)
    res
      .status(500)
      .json({ message: "Error aggregating questions", error: error.message })
  }
}

// Aggregates answers by date for a user.
metricsController.answersDate = async (req, res) => {
  const userID = req.user.id

  try {
    const results = await Answer.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      { $group: { _id: "$day", value: { $sum: 1 } } },
      { $project: { _id: 0, day: "$_id", value: 1 } },
      { $sort: { day: 1 } },
    ])

    res.json(results)
  } catch (error) {
    console.error("Error aggregating answers by date:", error)
    res.status(500).json({
      message: "Error aggregating answers by date",
      error: error.message,
    })
  }
}

module.exports = metricsController
