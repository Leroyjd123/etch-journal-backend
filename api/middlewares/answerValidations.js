// Reusable validation functions
const isNotEmpty = (value) =>
  value !== undefined && value !== null && value !== ""
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(value) // Simple regex check for MongoDB ObjectId
const isDate = (value) => !isNaN(Date.parse(value))
const isArray = (value) => Array.isArray(value) && value.length > 0

// Reusable error messages
const errorMessages = {
  required: "is required",
  invalid: "is invalid",
  mustBeArray: "must be an array",
  arrayNotEmpty: "array must not be empty",
}

// Simplified rule creation for consistency
const createValidationRule = (testFn, errorMessage) => ({
  testFn,
  errorMessage,
})

// Validation schemas
const questionIDValidation = {
  isMongoId: createValidationRule(isMongoId, `Invalid questionID`),
  notEmpty: createValidationRule(
    isNotEmpty,
    `questionID ${errorMessages.required}`
  ),
}

const dateValidation = {
  isDate: createValidationRule(isDate, `Invalid date format`),
  notEmpty: createValidationRule(isNotEmpty, `Date ${errorMessages.required}`),
}

const entriesValidation = {
  isArray: createValidationRule(
    isArray,
    `Entries ${errorMessages.mustBeArray} and ${errorMessages.arrayNotEmpty}`
  ),
}

const singleAnswerValidationSchema = {
  questionId: questionIDValidation,
  date: dateValidation,
  entries: entriesValidation,
}

const multipleAnswersValidationSchema = {
  entryList: entriesValidation,
}

module.exports = {
  singleAnswerValidationSchema,
  multipleAnswersValidationSchema,
}
