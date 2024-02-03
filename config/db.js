const mongoose = require("mongoose")

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017"
const dbName = process.env.DB_NAME || "etchDB"

const configDB = async () => {
  try {
    await mongoose.connect(`${dbUrl}/${dbName}`)
    console.log("Connected to the database:", dbName)
  } catch (e) {
    console.error("Error in connecting to the database:", e.message)
  }
}

module.exports = configDB
