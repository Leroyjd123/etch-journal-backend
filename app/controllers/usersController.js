const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const bcryptjs = require("bcryptjs")
const { validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")
const usersController = {}

const generatePassword = async (password) => {
  const salt = await bcryptjs.genSalt()
  return await bcryptjs.hash(password, salt)
}

usersController.register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { emailAddress, password } = req.body

  try {
    const hashedPassword = await generatePassword(password)
    const avatarID = uuidv4()

    const user = new User({
      emailAddress,
      password: hashedPassword,
      userType: "freeUser",
      avatarID,
    })

    await user.save()

    res.json({ message: "User registered successfully", userId: user._id })
  } catch (e) {
    console.error("Error in signup:", e)
    res.status(500).json({ message: "Error in signup", error: e.message })
  }
}

usersController.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { emailAddress, password } = req.body
  try {
    const user = await User.findOne({ emailAddress })
    if (!user) {
      return res.status(404).json({ message: "Invalid email" })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const tokenData = { id: user._id, userType: user.userType }
    const token = jwt.sign(tokenData, process.env.JWTAUTHKEY, {
      expiresIn: "7d",
    })

    res.json({ token: `Bearer ${token}` })
  } catch (e) {
    console.error("Error in login:", e)
    res.status(500).json({ message: "Error in login", error: e.message })
  }
}

usersController.view = async (req, res) => {
  const userID = req.user.id

  try {
    const user = await User.findById(userID)

    res.json(user)
  } catch (e) {
    console.error("Error in fetching account details:", e)
    res
      .status(500)
      .json({ message: "Error in fetching account details", error: e.message })
  }
}

usersController.update = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const userID = req.user.id
  const data = _.pick(req.body, [
    "firstName",
    "lastName",
    "gender",
    "phoneNumber",
    "avatarID",
  ])

  try {
    const user = await User.findByIdAndUpdate(userID, data, { new: true })

    res.json(user)
  } catch (e) {
    console.error("Error in updating account details:", e)
    res
      .status(500)
      .json({ message: "Error in updating account details", error: e.message })
  }
}

module.exports = usersController
