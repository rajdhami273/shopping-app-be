require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./services/db");
const { deleteExpiredOtp } = require("./services/scheduler");
const apiRoutes = require("./api/v1/routes");

// create express app
const app = express();

// connect to database
connectDB();

// setup middleware
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({ extended: true, limit: "5mb" })); // parse urlencoded bodies, multipart/form-data
app.use(cookieParser()); // parse cookies
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// static routes
app.use(express.static(path.join(__dirname, "..", "public")));

// health check route
app.get("/health", (_, res) => {
  res.send({ message: "Server is running" });
});

// api routes
app.use("/api/v1", apiRoutes);

// delete expired otp
const deleteExpiredOtpJob = deleteExpiredOtp();
console.log("OTP cleanup scheduler started - runs every 5 minutes");

// start server
const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${port}`);
});

// stop server
const stopServer = () => {
  deleteExpiredOtpJob.stop();
  process.exit(0);
};

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
