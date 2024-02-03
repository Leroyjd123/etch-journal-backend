const User = require("../models/userModel")

const nameSchema = {
  isString: {
    errorMessage: "Invalid name format",
  },
  notEmpty: {
    errorMessage: "Required",
  }
}

const passwordSchema = {
  notEmpty: {
    errorMessage: "Password is required",
  },
  isLength: {
    options: { min: 3 },
    errorMessage: "Password should be a minimum of 3 characters",
  },
}

const emailAddressRegistrationSchema = {
  notEmpty: {
    errorMessage: "Email is required",
  },
  isEmail: {
    errorMessage: "Invalid email format",
  },
  custom: {
    options: async (value) => {
      const user = await User.findOne({ emailAddress: value })
      if (user) {
        throw new Error("Email already registered")
      }
      return true
    },
  },
}

const emailAddressLoginSchema = {
  notEmpty: {
    errorMessage: "Email is required",
  },
  isEmail: {
    errorMessage: "Invalid email format",
  },
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
  userUpdateValidationSchema
}
