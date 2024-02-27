require("dotenv").config()
const express = require("express")
const cors = require("cors")
const stripe = require("stripe")(process.env.STRIP_PRIVATE_KEY)

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

//STRIPE PAYMENT TEST
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
