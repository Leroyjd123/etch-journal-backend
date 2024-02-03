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

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
