//Not required as we are handling the user authentication  
// const userIDvalidation = {
//   isMongoId: {
//     errorMessage: "Invalid userID",
//   },
//   notEmpty: {
//     errorMessage: "UserID is required",
//   },
// }

const questionIDvalidation = {
  isMongoId: {
    errorMessage: "Invalid questionID",
  },
  notEmpty: {
    errorMessage: "questionID is required",
  },
}

const dateValidation = {
  isDate: {
    errorMessage: "Invalid date format",
  },
  notEmpty: {
    errorMessage: "date is required",
  },
}

const entriesValidation = {
  isArray: {
    errorMessage: "entries must be an array",
  },
  notEmpty: {
    errorMessage: "entries array must not be empty",
  },
  custom: {
    options: (value) => Array.isArray(value) && value.length > 0,
    errorMessage: "entries array must have at least one value",
  },
}

const singleAnswerValidationSchema = {
  questionID: questionIDvalidation,
  date: dateValidation,
  entries: entriesValidation,
}


const multipleAnswersValidationSchema= {
  entryList: entriesValidation,
}


module.exports = {singleAnswerValidationSchema, multipleAnswersValidationSchema}