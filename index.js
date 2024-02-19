require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { checkSchema } = require("express-validator")

const {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  userUpdateValidationSchema,
} = require("../backend/app/middlewares/userValidation")
const userAuthentication = require("../backend/app/middlewares/userAuthentication")
const questionValidationSchema = require("./app/middlewares/questionValidations")

const usersController = require("./app/controllers/usersController")
const questionsController = require("./app/controllers/questionsController")

const configDB = require("./config/db")
const answersController = require("./app/controllers/answersController")
const {
  singleAnswerValidationSchema,
  multipleAnswersValidationSchema,
} = require("./app/middlewares/answerValidations")
const externalController = require("./app/controllers/externalController")
const metricsController = require("./app/controllers/metricsController")
const port = process.env.PORT || 3999

configDB()

const app = express()
app.use(express.json())
app.use(cors())

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

app.post(
  "/api/question/",
  checkSchema(questionValidationSchema),
  questionsController.add
)
app.get("/api/question/", questionsController.list)
app.put(
  "/api/question/:id",
  checkSchema(questionValidationSchema),
  questionsController.update
)
app.delete("/api/question/:id", questionsController.delete)

app.post("/api/questions/", questionsController.addMultiple)

app.post(
  "/api/answer/",
  checkSchema({ singleAnswerValidationSchema }),
  answersController.addSingle
)

app.post(
  "/api/answers/",
  userAuthentication,
  checkSchema(multipleAnswersValidationSchema),
  answersController.addMultiple
)
app.get("/api/answers/", userAuthentication, answersController.list)

app.get("/api/quote/", externalController.getQuote)

app.get("/api/metrics/tags", userAuthentication, metricsController.tagCount)
app.get(
  "/api/metrics/questions",
  userAuthentication,
  metricsController.topQuestions
)
app.get(
  "/api/metrics/answers",
  userAuthentication,
  metricsController.answersDate
)

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
