const Answer = require("../models/answerModel")
const _ = require("lodash")
const { validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")
const answersController = {}

const tagConverter = (entries) => {
  const words = entries.flatMap(
    (ele) =>
      ele
        .replace(/[,.?!]/g, "") // Remove special characters
        .split(" ") // Split by space to get words
        .filter((word) => word.trim() !== "") // Remove empty strings
        .map((word) => word.toLowerCase()) // Convert to lowercase
  )

  // Use a Set to eliminate duplicates and then spread it back into an array
  return [...new Set(words)]
}

answersController.addSingle = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { userID, questionID, entries, date } = req.body

  try {
    const answer = new Answer({
      userID,
      questionID,
      entries,
      date,
    })
    answer.tags = tagConverter(entries)

    await answer.save()
    res.json(answer)
  } catch (e) {
    console.error("Error in adding answer:", e)
    res
      .status(500)
      .json({ message: "Error in adding answer", error: e.message })
  }
}

answersController.addMultiple = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { entryList, date } = req.body
  const userID = req.user.id

  const answerList = entryList.map((entry) => {
    return {
      userID,
      date,
      questionID: entry.questionID,
      entries: entry.entries,
      tags: tagConverter(entry.entries),
    }
  })

  try {
    const answers = await Answer.insertMany(answerList)
    res.json(answers)
  } catch (e) {
    console.error("Error in adding answers:", e)
    res
      .status(500)
      .json({ message: "Error in adding answers", error: e.message })
  }
}

answersController.list = async (req, res) => {
  const userID = req.user.id
  try {
    const answers = await Answer.find({ userID: userID })
    res.json(answers)
  } catch (e) {
    console.error("Error in fetching answers :", e)
    res
      .status(500)
      .json({ message: "Error in fetching answers  ", error: e.message })
  }
}

module.exports = answersController
