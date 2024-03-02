const Answer = require("../models/answerModel")
const { validationResult } = require("express-validator")

/**
 * Handles validation errors for express requests.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {boolean} True if no validation errors, otherwise false.
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  }
  return true
}

// Converts entry strings to a unique set of lowercase tags.
const tagConverter = (entries) => {
  const words = entries.flatMap(
    (entry) =>
      entry
        .replace(/[,.?!]/g, "") // Remove punctuation.
        .split(" ") // Split into words.
        .filter((word) => word.trim() !== "") // Remove empty strings.
        .map((word) => word.toLowerCase()) // Convert to lowercase.
  )
  return [...new Set(words)]
}

const answersController = {}

// Adds a single answer to the database.
answersController.addSingle = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { userId, questionId, entries, date } = req.body

  try {
    const answer = new Answer({
      userId,
      questionId,
      entries,
      date,
      tags: tagConverter(entries),
    })
    await answer.save()
    res.json(answer)
  } catch (error) {
    console.error("Error in adding answer:", error)
    res
      .status(500)
      .json({ message: "Error in adding answer", error: error.message })
  }
}

// Adds multiple answers to the database.
answersController.addMultiple = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { entryList, date } = req.body
  const userId = req.user.id

  const answersToAdd = entryList.map((entry) => ({
    ...entry,
    userId,
    date,
    tags: tagConverter(entry.entries),
  }))

  try {
    const answers = await Answer.insertMany(answersToAdd)
    res.json(answers)
  } catch (error) {
    console.error("Error in adding answers:", error)
    res
      .status(500)
      .json({ message: "Error in adding answers", error: error.message })
  }
}

// Lists all answers for a specific user.
answersController.list = async (req, res) => {
  const userId = req.user.id
  try {
    const answers = await Answer.find({ userId })
    res.json(answers)
  } catch (error) {
    console.error("Error in fetching answers:", error)
    res
      .status(500)
      .json({ message: "Error in fetching answers", error: error.message })
  }
}

module.exports = answersController
