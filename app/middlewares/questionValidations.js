// Utility functions for validation
const isNotEmpty = (value) => value.trim() !== ""
const isString = (value) => typeof value === "string"
const isNumber = (value) => typeof value === "number" && !isNaN(value)
const isIn = (value, options) => options.includes(value)

// Reusable error messages
const errorMessages = {
  required: "is required",
  invalid: "is invalid",
  invalidType: "Invalid question type",
}

// Validation rule creator for reusability and simplicity
const createRule = (validationFn, errorMessage) => ({
  validationFn,
  errorMessage,
})

const questionValidationSchema = {
  order: createRule(isNumber, `Order ${errorMessages.invalid}`),
  name: [
    createRule(isNotEmpty, `Question name ${errorMessages.required}`),
    createRule(isString, `Question name ${errorMessages.invalid}`),
  ],
  label: [
    createRule(isNotEmpty, `Question label ${errorMessages.required}`),
    createRule(isString, `Question label ${errorMessages.invalid}`),
  ],
  inputType: [
    createRule(isNotEmpty, `Question type ${errorMessages.required}`),
    createRule(
      (value) => isIn(value, ["radio", "checkbox", "textarea"]),
      errorMessages.invalidType
    ),
  ],
}

module.exports = questionValidationSchema
