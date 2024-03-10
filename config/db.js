const mongoose = require("mongoose")

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017"
const dbName = process.env.DB_NAME || "etchDB"


// Configures and connects to the MongoDB database.
const configDB = async () => {
  try {
    await mongoose.connect(`${dbUrl}/${dbName}`)
    console.log("Connected to the database:", dbName)
  } catch (error) {
    console.error("Error in connecting to the database:", error.message)
    process.exit(1)
  }

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection to MongoDB was disconnected")
  })
}

module.exports = configDB
