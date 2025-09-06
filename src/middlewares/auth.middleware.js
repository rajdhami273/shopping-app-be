const { verifyAccessToken } = require("../utils/token");

const User = require("../api/v1/models/User.model");

async function authenticateToken(req, res, next) {
  const bearerToken = req.headers.authorization; // Bearer <token>
  if (!bearerToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = bearerToken.split(" ")[1];
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById(decoded.user);
  if (!user) {
    return res.status(404).json({ message: "Unauthorized" });
  }
  req.user = user;
  next();
}

module.exports = { authenticateToken };
