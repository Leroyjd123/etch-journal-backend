const Question = require("../models/questionModel")
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

const questionsController = {}

// Adds a new question to the database.
questionsController.add = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { order, name, label, options, inputType, tags } = req.body

  try {
    const question = new Question({
      order,
      name,
      label,
      options,
      inputType,
      tags,
    })

    await question.save()
    res.json(question)
  } catch (error) {
    console.error("Error in creating question:", error)
    res
      .status(500)
      .json({ message: "Error in creating question", error: error.message })
  }
}

// Lists all questions from the database.
questionsController.list = async (req, res) => {
  try {
    const questions = await Question.find()
    res.json(questions)
  } catch (error) {
    console.error("Error in fetching questions:", error)
    res
      .status(500)
      .json({ message: "Error in fetching questions", error: error.message })
  }
}

// Updates a question by its ID.
questionsController.update = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { order, name, label, options, inputType, tags } = req.body
  const id = req.params.id

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { order, name, label, options, inputType, tags },
      { new: true }
    )

    res.json(question)
  } catch (error) {
    console.error("Error in updating question:", error)
    res
      .status(500)
      .json({ message: "Error in updating question", error: error.message })
  }
}

// Deletes a question by its ID.
questionsController.delete = async (req, res) => {
  const id = req.params.id

  try {
    const question = await Question.findByIdAndDelete(id)
    res.json(question)
  } catch (error) {
    console.error("Error in deleting question:", error)
    res
      .status(500)
      .json({ message: "Error in deleting question", error: error.message })
  }
}

// Adds multiple questions to the database.
questionsController.addMultiple = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { questionList } = req.body

  try {
    const result = await Question.insertMany(questionList)
    res.json(result)
  } catch (error) {
    console.error("Error in creating questions:", error)
    res
      .status(500)
      .json({ message: "Error in creating questions", error: error.message })
  }
}

module.exports = questionsController
