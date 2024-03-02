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
} = require("./app/middlewares/userValidation")
const questionValidationSchema = require("./app/middlewares/questionValidations")
const {
  singleAnswerValidationSchema,
  multipleAnswersValidationSchema,
} = require("./app/middlewares/answerValidations")

// Middleware
const userAuthentication = require("./app/middlewares/userAuthentication")

// Controllers
const usersController = require("./app/controllers/usersController")
const questionsController = require("./app/controllers/questionsController")
const answersController = require("./app/controllers/answersController")
const externalController = require("./app/controllers/externalController")
const metricsController = require("./app/controllers/metricsController")

// Database configuration
const configDB = require("./config/db")

const port = process.env.PORT || 3999
configDB()

const app = express()
app.use(express.json())
app.use(cors())

// Stripe payment test route
app.post("/api/create-checkout-session", async (req, res) => {
  const { product, paymentType } = req.body // Assuming paymentType is either 'one-time' or 'subscription'

  // Define the line item based on payment type
  let lineItems = []
  if (paymentType === "one-time") {
    lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ]
  } else if (paymentType === "subscription") {
    lineItems = [
      {
        price: product.subscriptionPriceId, // Subscription price ID from Stripe dashboard
        quantity: product.quantity,
      },
    ]
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Add other methods as supported
    line_items: lineItems,
    mode: paymentType === "one-time" ? "payment" : "subscription",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  })

  res.json({ id: session.id })
})

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

// Answer routes
app.post(
  "/api/answer/",
  checkSchema(singleAnswerValidationSchema),
  answersController.addSingle
)
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

// Server listen
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
