const jwt = require("jsonwebtoken");

function generateRefreshToken(id) {
  return jwt.sign({ user: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
}

function verifyRefreshToken(token) {
  let decoded = null;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, _decoded) => {
    if (err) {
      return;
    }
    decoded = _decoded;
  });
  return decoded;
}

function generateAccessToken(id) {
  return jwt.sign({ user: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = {
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
  verifyAccessToken,
};
