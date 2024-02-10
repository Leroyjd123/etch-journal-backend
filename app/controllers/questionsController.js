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

  const { order, name, label, options, inputType, tags } = req.body
  const id = req.params.id

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      {
        order,
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

questionsController.addMultiple = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { questionList } = req.body
  console.log(questionList)
  try {
    const questions = questionList.map((question) => {
      return {
        order: question.order,
        name: question.name,
        label: question.label,
        options: question.options,
        inputType: question.inputType,
        tags: question.tags,
      }
    })

    const result = await Question.insertMany(questions)
    res.json(result)
  } catch (e) {
    console.error("Error in creating questions:", e)
    res
      .status(500)
      .json({ message: "Error in creating questions", error: e.message })
  }
}

module.exports = questionsController
