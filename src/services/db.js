const mongoose = require("mongoose");
const User = require("../api/v1/models/User.model");
const Otp = require("../api/v1/models/Otp.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DB_NAME);
    console.log("Connected to MongoDB");
    await Otp.deleteMany({});
    await Otp.insertMany([
      {
        email: "test@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        email: "test2@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        email: "test3@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        email: "test4@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        email: "test5@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        email: "test6@test.com",
        otp: "123456",
        expiresAt: new Date(Date.now() + 20 * 60 * 1000),
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
