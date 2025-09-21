const CronJob = require("cron").CronJob;

const Otp = require("../api/v1/models/Otp.model");

function deleteExpiredOtp() {
  return;
  return new CronJob(
    "*/10 * * * * *", // Run every second
    async () => {
      try {
        console.log(`[${new Date().toISOString()}] Starting OTP cleanup...`);

        const expiredOtps = await Otp.find({ expiresAt: { $lt: Date.now() } });

        if (expiredOtps.length > 0) {
          await Otp.deleteMany({ expiresAt: { $lt: Date.now() } });
          console.log(
            `[${new Date().toISOString()}] Deleted ${
              expiredOtps.length
            } expired OTPs`
          );
        } else {
          console.log(`[${new Date().toISOString()}] No expired OTPs found`);
        }
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error during OTP cleanup:`,
          error
        );
      }
    },
    null,
    true,
    "Asia/Kolkata"
  );
}

module.exports = {
  deleteExpiredOtp,
};
