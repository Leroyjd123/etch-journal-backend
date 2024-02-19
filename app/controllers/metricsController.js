const Answer = require("../models/answerModel")
const _ = require("lodash")
const metricsController = {}
const mongoose = require("mongoose")

metricsController.tagCount = async (req, res) => {
  const userID = req.user.id

  try {
    const result = await Answer.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      { $unwind: "$tags" }, // Deconstruct the tags array
      {
        $group: {
          _id: "$tags", // Group by tags
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const response = result.map((tag) => ({ tag: tag._id, count: tag.count }))
    res.json(response) // Send the response back to the client
  } catch (error) {
    console.error("Error aggregating tags:", error)
    res
      .status(500)
      .json({ message: "Error aggregating tags", error: error.message }) // Send error response
  }
}

metricsController.topQuestions = async (req, res) => {
  const userID = req.user.id

  try {
    const result = await Answer.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      {
        $lookup: {
          from: "questions", // The collection to join with (use the actual collection name of your questions)
          localField: "questionID", // The local join field
          foreignField: "_id", // The field from the questions collection to join with
          as: "questionDetails", // The array to put the joined documents (this will be an array)
        },
      },
      // Optional: unwind the questionDetails if you are sure there's only one match or you only care about the first match
      { $unwind: "$questionDetails" },
      {
        $group: {
          _id: "$questionID",
          count: { $sum: 1 },
          label: { $first: "$questionDetails.label" }, // Take the label of the first document in the questionDetails array
          tags: { $first: "$questionDetails.tags" }, // Same for tags
        },
      },
      { $sort: { count: -1 } },
      // Optionally, project the fields to format your output
      {
        $project: {
          _id: 0,
          questionID: "$_id",
          count: 1,
          label: 1,
          tags: 1,
        },
      },
    ])

    res.json(result) // Send the response back to the client
  } catch (error) {
    console.error("Error aggregating questions:", error)
    res
      .status(500)
      .json({ message: "Error aggregating questions", error: error.message }) // Send error response
  }
}

metricsController.answersDate = async (req, res) => {
  const userID = req.user.id

  try {
    const results = await Answer.aggregate([
      {
        $match: {
          userID: new mongoose.Types.ObjectId(userID), // Ensure you match answers for a specific user
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      {
        $group: {
          _id: "$day",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          value: 1,
        },
      },
      { $sort: { day: 1 } }, // Optional: Sort by date if needed
    ])

    res.json(results)
  } catch (error) {
    console.error("Error aggregating answers by date:", error)
    res.status(500).json({
      message: "Error aggregating answers by date",
      error: error.message,
    }) // Send error response
  }
}

module.exports = metricsController
