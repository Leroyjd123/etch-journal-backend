const jwt = require("jsonwebtoken")

const userAuthentication = (req, res, next) => {
  try {
    const token = req.headers["authorization"]
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" })
    }

    const tokenData = jwt.verify(token.split(" ")[1], process.env.JWTAUTHKEY)
    req.user = tokenData
    console.log("t",tokenData)
    next()
  } catch (e) {
    if (e.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid or expired token" })
    } else {
      console.error("Error in user authentication:", e)
      res
        .status(500)
        .json({ message: "Error in authenticating user", error: e.message })
    }
  }
}

module.exports = userAuthentication
