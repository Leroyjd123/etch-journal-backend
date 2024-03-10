const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")

/**
 * Generates a hashed password using bcrypt.
 */
const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt()
  return bcrypt.hash(password, salt)
}

const generateToken = (tokenData) => {
  return jwt.sign(tokenData, process.env.JWTAUTHKEY, {
    expiresIn: "7d",
  })
}

/**
 * Handles validation errors for express requests.
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  }
  return true
}

const usersController = {}

// Registers a new user.
usersController.register = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { emailAddress, password } = req.body

  try {
    const hashedPassword = await generatePassword(password)
    const avatarId = uuidv4()

    const user = await new User({
      emailAddress,
      password: hashedPassword,
      userType: "freeUser",
      avatarId,
    }).save()

    const tokenData = { id: user._id, userType: user.userType }
    const token = generateToken(tokenData)

    res.json({ token: `Bearer ${token}` })
  } catch (error) {
    console.error("Error in signup:", error)
    res.status(500).json({ message: "Error in signup", error: error.message })
  }
}

// Authenticates a user and provides a JWT token.
usersController.login = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const { emailAddress, password } = req.body
  try {
    const user = await User.findOne({ emailAddress })
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const tokenData = { id: user._id, userType: user.userType }
    const token = generateToken(tokenData)

    res.json({ token: `Bearer ${token}` })
  } catch (error) {
    console.error("Error in login:", error)
    res.status(500).json({ message: "Error in login", error: error.message })
  }
}

// Retrieves the user's information based on their token.
usersController.view = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await User.findById(userId)
    res.json(user)
  } catch (error) {
    console.error("Error in fetching account details:", error)
    res.status(500).json({
      message: "Error in fetching account details",
      error: error.message,
    })
  }
}

// Updates user information.
usersController.update = async (req, res) => {
  if (!handleValidationErrors(req, res)) return

  const userId = req.user.id
  const data = req.body

  try {
    const user = await User.findByIdAndUpdate(userId, data, { new: true })
    res.json(user)
  } catch (error) {
    console.error("Error in updating account details:", error)
    res.status(500).json({
      message: "Error in updating account details",
      error: error.message,
    })
  }
}

module.exports = usersController
