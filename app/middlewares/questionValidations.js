const questionValidationSchema = {
  order: {
    isNumber: {
      errorMessage: "invalid order",
    },
  },
  name: {
    notEmpty: {
      errorMessage: "Question name is required",
    },
    isString: {
      errorMessage: "invalid question name",
    },
  },
  label: {
    notEmpty: {
      errorMessage: "Question label is required",
    },
    isString: {
      errorMessage: "invalid question label",
    },
  },
  inputType: {
    notEmpty: {
      errorMessage: "Question type is required",
    },
    isIn: {
      options: [["radio", "checkbox", "textarea"]],
      errorMessage: "Invalid question type",
    },
  },
}

module.exports = questionValidationSchema
