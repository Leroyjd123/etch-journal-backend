const jwt = require("jsonwebtoken")

const userAuthentication = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization token is required." })
    }

    // Attempt to extract the token value assuming "Bearer <token>" format
    const token = authHeader.split(" ")[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token format is invalid." })
    }

    // Verify the token
    const tokenData = jwt.verify(token, process.env.JWTAUTHKEY)
    req.user = tokenData

    // Proceed to the next middleware function
    next()
  } catch (error) {
    console.error("Error in user authentication:", error)

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token." })
    }

    // Handle generic errors
    res
      .status(500)
      .json({ message: "Error in authenticating user.", error: error.message })
  }
}

module.exports = userAuthentication
