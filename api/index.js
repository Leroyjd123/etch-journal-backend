require("dotenv").config()
const express = require("express")
const cors = require("cors")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const { checkSchema } = require("express-validator")

// Validation schemas
const {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  userUpdateValidationSchema,
} = require("./middlewares/userValidation")
const questionValidationSchema = require("./middlewares/questionValidations")
const {
  singleAnswerValidationSchema,
  multipleAnswersValidationSchema,
} = require("./middlewares/answerValidations")

// Middleware
const userAuthentication = require("./middlewares/userAuthentication")

// Controllers
const usersController = require("./controllers/usersController")
const questionsController = require("./controllers/questionsController")
const answersController = require("./controllers/answersController")
const externalController = require("./controllers/externalController")
const metricsController = require("./controllers/metricsController")

// Database configuration
const configDB = require("../config/db")

const port = process.env.PORT || 3999
configDB()

const app = express()
app.use(express.json())
app.use(cors())

app.get(
  "/", (req, res) => {
    res.send("Hello world")
  }
)

// User routes
app.post(
  "/api/user/register",
  checkSchema(userRegisterValidationSchema),
  usersController.register
)
app.post(
  "/api/user/login",
  checkSchema(userLoginValidationSchema),
  usersController.login
)
app.get("/api/user/", userAuthentication, usersController.view)
app.put(
  "/api/user",
  checkSchema(userUpdateValidationSchema),
  userAuthentication,
  usersController.update
)

// Question routes
// app.post(
//   "/api/question/",
//   checkSchema(questionValidationSchema),
//   questionsController.add
)
app.get("/api/question/", questionsController.list)
// app.put(
//   "/api/question/:id",
//   checkSchema(questionValidationSchema),
//   questionsController.update
// )
// app.delete("/api/question/:id", questionsController.delete)
app.post("/api/questions/", questionsController.addMultiple)

// Answer routes
// app.post(
//   "/api/answer/",
//   checkSchema(singleAnswerValidationSchema),
//   answersController.addSingle
// )
app.post(
  "/api/answers/",
  userAuthentication,
  checkSchema(multipleAnswersValidationSchema),
  answersController.addMultiple
)
app.get("/api/answers/", userAuthentication, answersController.list)

// External API route
app.get("/api/quote/", externalController.getQuote)

// Metrics routes
// app.get("/api/metrics/tags", userAuthentication, metricsController.tagCount)
// app.get(
//   "/api/metrics/questions",
//   userAuthentication,
//   metricsController.topQuestions
// )
// app.get(
//   "/api/metrics/answers",
//   userAuthentication,
//   metricsController.answersDate
// )

// Server listen
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})


module.exports = app
