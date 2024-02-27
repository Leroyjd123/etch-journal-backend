const axios = require("axios")

const externalController = {}

// Fetches a random quote from the Quote Garden API.
externalController.getQuote = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://quote-garden.onrender.com/api/v3/quotes/random"
    )
    res.json(data.data)
  } catch (error) {
    console.error("Error fetching quote:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch quote", error: error.message })
  }
}

module.exports = externalController
