const mongoose = require("mongoose");
const Test = require("../api/v1/models/Test.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DB_NAME);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
