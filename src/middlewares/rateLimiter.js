const rateLimit = require("express-rate-limit");
const httpStatus = require("http-status");

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 5 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later",
  },
  statusCode: httpStatus.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  otpLimiter,
};
