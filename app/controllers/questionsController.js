const Question = require("../models/questionModel")
const _ = require("lodash")
const { validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")
const questionsController = {}

questionsController.add = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, label, options, inputType, tags } = req.body

  try {
    const question = new Question({
      name,
      label,
      options,
      inputType,
      tags,
    })

    await question.save()
    res.json(question)
  } catch (e) {
    console.error("Error in creating question:", e)
    res
      .status(500)
      .json({ message: "Error in creating question", error: e.message })
  }
}

questionsController.list = async (req, res) => {
  try {
    const questions = await Question.find()

    res.json(questions)
  } catch (e) {
    console.error("Error in fetching questions:", e)
    res
      .status(500)
      .json({ message: "Error in fetching questions ", error: e.message })
  }
}

questionsController.update = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, label, options, inputType, tags } = req.body
  const id = req.params.id

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      {
        name,
        label,
        options,
        inputType,
        tags,
      },
      { new: true }
    )

    res.json(question)
  } catch (e) {
    console.error("Error in updating question:", e)
    res
      .status(500)
      .json({ message: "Error in updating question", error: e.message })
  }
}

questionsController.delete = async (req, res) => {
  const id = req.params.id

  try {
    const question = await Question.findByIdAndDelete(id)

    res.json(question)
  } catch (e) {
    console.error("Error in deleting question:", e)
    res
      .status(500)
      .json({ message: "Error in deleting question", error: e.message })
  }
}

module.exports = questionsController
