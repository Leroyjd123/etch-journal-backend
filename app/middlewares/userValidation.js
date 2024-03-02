const User = require("../models/userModel")

// Utility for creating simple validation rules
const createValidationRule = (test, errorMessage) => ({ test, errorMessage })

// Common validation tests for reusability
const notEmpty = createValidationRule(
  (value) => value.trim() !== "",
  "Required"
)
const minLength = (length) =>
  createValidationRule(
    (value) => value && value.length >= length,
    `Should be a minimum of ${length} characters`
  )
const isEmail = createValidationRule(
  (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
  "Invalid email format"
)

// Custom validation for email uniqueness in registration
const isUniqueEmail = {
  options: async (value) => {
    const user = await User.findOne({ emailAddress: value })
    if (user) throw new Error("Email already registered")
    return true
  },
  errorMessage: "Email already registered",
}

// Schema definitions
const nameSchema = {
  isString: notEmpty,
  notEmpty,
}

const passwordSchema = {
  notEmpty,
  isLength: minLength(3),
}

const emailAddressRegistrationSchema = {
  notEmpty,
  isEmail,
  custom: isUniqueEmail,
}

const emailAddressLoginSchema = {
  notEmpty,
  isEmail,
}

const userRegisterValidationSchema = {
  emailAddress: emailAddressRegistrationSchema,
  password: passwordSchema,
}

const userLoginValidationSchema = {
  emailAddress: emailAddressLoginSchema,
  password: passwordSchema,
}

const userUpdateValidationSchema = {
  firstName: nameSchema,
  lastName: nameSchema,
}

module.exports = {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  userUpdateValidationSchema,
}
