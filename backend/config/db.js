//db.js
const mongoose = require('mongoose')
const config = require('../config');
const MONGO_URI = config.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    throw new Error(error);
    //process.exit(1)
  }
}

module.exports = connectDB
