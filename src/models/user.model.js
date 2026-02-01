// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         lowercase: true,
//     },
//     // OTP fields
//     otp: { type: String },
//     otpExpires: { type: Date },

//     // Activate after OTP
//     isVerified: { type: Boolean, default: false },
// },
//     { timestamps: true }
// );

// const user = mongoose.model('user', userSchema);

// module.exports = user;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: String,
    otpExpires: Date,

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpResendCount: {
      type: Number,
      default: 0,
    },

    otpLastSentAt: Date,
  },
  { timestamps: true },
);

const user = mongoose.model("user", userSchema);

module.exports = user;
