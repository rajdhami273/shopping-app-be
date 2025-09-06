const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/; // password should be 8 or long and at least 1 uppercase and 1 number and 1 special character

function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    return {
      message:
        "Password should be 8 or long and at least 1 uppercase and 1 number and 1 special character",
    };
  }
  return null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    return {
      message: "Invalid email address",
    };
  }
  return null;
}

module.exports = { validatePassword, validateEmail };
