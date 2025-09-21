/**
 * Generate a 6-digit OTP (One Time Password)
 * @returns {number} 6-digit number between 100000 and 999999
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {number} 6-digit number between 100000 and 999999
 */
const generateSecureOTP = () => {
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(4);
  const randomNum = randomBytes.readUInt32BE(0);
  return 100000 + (randomNum % 900000);
};

/**
 * Generate OTP with custom length
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} OTP as string with leading zeros if needed
 */
const generateCustomOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString().padStart(length, '0');
};

/**
 * Validate OTP format
 * @param {string|number} otp - OTP to validate
 * @param {number} length - Expected length (default: 6)
 * @returns {boolean} True if valid format
 */
const validateOTPFormat = (otp, length = 6) => {
  const otpStr = otp.toString();
  return /^\d+$/.test(otpStr) && otpStr.length === length;
};

module.exports = {
  generateOTP,
  generateSecureOTP,
  generateCustomOTP,
  validateOTPFormat
};
