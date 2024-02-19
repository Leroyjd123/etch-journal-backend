const axios = require("axios")
const externalController = {}

externalController.getQuote = async (req, res) => {
  try {
    const response = await axios.get(
      "https://quote-garden.onrender.com/api/v3/quotes/random"
    )
    // console.log(response.data.data)

    res.json(response.data.data)
  } catch (e) {
    console.log(e)
  }
}

module.exports = externalController
