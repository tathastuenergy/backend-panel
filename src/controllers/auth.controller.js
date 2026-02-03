// const httpStatus = require('http-status');
// const catchAsync = require('../utils/catchAsync');
// const { authService, userService, tokenService, emailService } = require('../services');
// const Joi = require('joi');
// const ApiError = require('../utils/ApiError');
// const { User, Cart, Payment } = require('../models');
// const { sendWelcomeEmail } = require('../services/email.service');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Use absolute path from project root, not from src
//     const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'profile-photos');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     console.log('📁 Upload destination:', uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const filename = 'profile-' + uniqueSuffix + path.extname(file.originalname);
//     console.log('📝 Generated filename:', filename);
//     cb(null, filename);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Only image files are allowed!'));
//   }
// }).single('profile_photo');

// const register = {
//   validation: {
//     body: Joi.object().keys({
//       first_name: Joi.string().required(),
//       last_name: Joi.string().required(),
//       email: Joi.string().required().email(),
//       phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
//         'string.pattern.base': 'Phone number must be between 10 and 15 digits'
//       }),
//       password: Joi.string().required().min(6),
//     }),
//   },

//   handler: async (req, res) => {
//     try {
//       // 1️⃣ Check if user already exists
//       const existingUser = await User.findOne({
//         $or: [
//           { email: req.body.email },
//           { phone: req.body.phone }
//         ]
//       });

//       if (existingUser) {
//         if (existingUser.email === req.body.email) {
//           throw new ApiError(httpStatus.BAD_REQUEST, 'Email already registered');
//         }
//         if (existingUser.phone === req.body.phone) {
//           throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already registered');
//         }
//       }

//       // 2️⃣ Create new user
//       const newUser = await new User(req.body).save();

//       // 3️⃣ Generate auth token
//       const token = await tokenService.generateAuthTokens(newUser);

//       // 4️⃣ Send welcome email
//       await sendWelcomeEmail(newUser.email, newUser.first_name);

//       console.log("User registered successfully:", req.body.email);

//       // 5️⃣ Send success response
//       return res.status(httpStatus.CREATED).send({
//         success: true,
//         message: 'User registered successfully',
//         user: {
//           _id: newUser._id,
//           first_name: newUser.first_name,
//           last_name: newUser.last_name,
//           email: newUser.email,
//           phone: newUser.phone,
//           profile_photo: newUser.profile_photo,
//         },
//         token,
//       });

//     } catch (error) {
//       console.error("❌ Registration Error:", error.message, error.stack);

//       return res
//         .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
//         .send({
//           success: false,
//           message: error.message || 'Registration failed',
//         });
//     }
//   },
// };

// const login = {
//   validation: {
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   },
//   handler: async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !(await user.isPasswordMatch(password))) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
//     }

//     const token = await tokenService.generateAuthTokens(user);
//     return res.status(httpStatus.OK).send({
//       token,
//       user: {
//         _id: user._id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         phone: user.phone,
//         profile_photo: user.profile_photo,
//       }
//     });
//   }
// };

// const getUserProfile = {
//   handler: async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const user = await User.findById(userId).select('-password');

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User Not Found"
//         });
//       }

//       // Cart items all
//       const cartItems = await Cart.find({ user_id: userId });

//       // bucket_type = true (Cart items)
//       const addToCartItem = cartItems.filter(item => item.bucket_type === true);

//       // bucket_type = false (Purchased items)
//       const payBill = cartItems.filter(item => item.bucket_type === false);

//       // Payment items
//       const paymentItems = await Payment.find({ user_id: userId }).sort({ createdAt: -1 });

//       return res.status(200).send({
//         success: true,
//         message: "Profile fetched successfully",
//         user: user,
//         cart: {
//           addToCartItem: addToCartItem,
//           payBill: payBill
//         },
//         payment: paymentItems,
//         totalSpent: paymentItems.reduce((total, payment) => total + payment.amount, 0),
//       });

//     } catch (error) {
//       console.error("Profile fetch error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Server Error",
//         error: error.message
//       });
//     }
//   }
// };

// const updateProfile = {
//   validation: {
//     body: Joi.object().keys({
//       first_name: Joi.string().optional(),
//       last_name: Joi.string().optional(),
//       email: Joi.string().email().optional(),
//       phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().messages({
//         'string.pattern.base': 'Phone number must be between 10 and 15 digits'
//       }),
//     }),
//   },
//   handler: async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const updateData = req.body;

//       // Check if email or phone already exists (excluding current user)
//       if (updateData.email || updateData.phone) {
//         const existingUser = await User.findOne({
//           _id: { $ne: userId },
//           $or: [
//             updateData.email ? { email: updateData.email } : {},
//             updateData.phone ? { phone: updateData.phone } : {}
//           ]
//         });

//         if (existingUser) {
//           if (existingUser.email === updateData.email) {
//             throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
//           }
//           if (existingUser.phone === updateData.phone) {
//             throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already in use');
//           }
//         }
//       }

//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       ).select('-password');

//       if (!updatedUser) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//       }

//       return res.status(httpStatus.OK).send({
//         success: true,
//         message: 'Profile updated successfully',
//         user: updatedUser,
//       });

//     } catch (error) {
//       console.error("Profile update error:", error);
//       return res
//         .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
//         .send({
//           success: false,
//           message: error.message || 'Profile update failed',
//         });
//     }
//   }
// };

// const updateProfilePhoto = {
//   handler: (req, res) => {
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(httpStatus.BAD_REQUEST).send({
//           success: false,
//           message: err.message || 'File upload failed',
//         });
//       }

//       try {
//         const userId = req.body.user_id || req.params.id;

//         if (!req.file) {
//           throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded');
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//           // Delete uploaded file if user not found
//           fs.unlinkSync(req.file.path);
//           throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//         }

//         // Delete old profile photo if exists
//         if (user.profile_photo) {
//           // Handle both path formats (with/without leading slash)
//           const cleanOldPath = user.profile_photo.startsWith('/')
//             ? user.profile_photo.slice(1)
//             : user.profile_photo;
//           const oldPhotoPath = path.join(__dirname, '..', '..', cleanOldPath);

//           if (fs.existsSync(oldPhotoPath)) {
//             try {
//               fs.unlinkSync(oldPhotoPath);
//               console.log("🗑️  Deleted old photo:", oldPhotoPath);
//             } catch (deleteError) {
//               console.error("❌ Error deleting old photo:", deleteError);
//             }
//           }
//         }

//         // Store path WITHOUT leading slash for consistency with static serving
//         const photoPath = `uploads/profile-photos/${req.file.filename}`;
//         user.profile_photo = photoPath;
//         await user.save();

//         console.log("✅ Profile photo updated:", photoPath);
//         console.log("📍 File location:", path.join(__dirname, '..', '..', photoPath));

//         return res.status(httpStatus.OK).send({
//           success: true,
//           message: 'Profile photo updated successfully',
//           profile_photo: photoPath,
//           user: {
//             _id: user._id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             phone: user.phone,
//             profile_photo: photoPath,
//           }
//         });

//       } catch (error) {
//         // Delete uploaded file on error
//         if (req.file) {
//           try {
//             fs.unlinkSync(req.file.path);
//           } catch (deleteError) {
//             console.error("Error deleting file:", deleteError);
//           }
//         }

//         console.error("Photo upload error:", error);
//         return res
//           .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
//           .send({
//             success: false,
//             message: error.message || 'Photo upload failed',
//           });
//       }
//     });
//   }
// };

// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.OK).send({ message: 'Reset password email sent' });
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.OK).send({ message: 'Password reset successfully' });
// });

// const sendVerificationEmail = catchAsync(async (req, res) => {
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const verifyEmail = catchAsync(async (req, res) => {
//   await authService.verifyEmail(req.query.token);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// module.exports = {
//   register,
//   login,
//   logout,
//   refreshTokens,
//   forgotPassword,
//   resetPassword,
//   sendVerificationEmail,
//   verifyEmail,
//   getUserProfile,
//   updateProfile,
//   updateProfilePhoto,
// };

const Joi = require("joi");
const httpStatus = require("http-status");
const FrontUser = require("../models/user.model");
const LoginLog = require("../models/loginLog.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { generateOtp, hashOtp } = require("../utils/otp.util");
const { tokenService, emailService } = require('../services');

// Constants
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN = 60 * 1000; // 1 minute
const MAX_RESENDS = 10;
const MAX_ATTEMPTS = 10;

/**
 * Send OTP for login
 * @route POST /api/auth/login/send-otp
 * @access Public
 */
exports.loginSendOtp = {
  validation: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    }),
  },

  handler: catchAsync(async (req, res) => {
    const { email } = req.body;

    // Find or create user
    let user = await FrontUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await FrontUser.create({ 
        email: email.toLowerCase(),
        isVerified: false 
      });
    }

    // Check resend limit
    if (user.otpResendCount >= MAX_RESENDS) {
      const resetTime = new Date(user.otpLastSentAt.getTime() + 3600000); // 1 hour
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `OTP resend limit reached. Please try again after ${resetTime.toLocaleTimeString()}`
      );
    }

    // Check cooldown period 
    // if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < OTP_COOLDOWN) {
    //   const remainingTime = Math.ceil(
    //     (OTP_COOLDOWN - (Date.now() - user.otpLastSentAt)) / 1000
    //   );
    //   throw new ApiError(
    //     httpStatus.TOO_MANY_REQUESTS,
    //     `Please wait ${remainingTime} seconds before requesting a new OTP`
    //   );
    // }

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    // Update user with OTP details
    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY);
    user.otpAttempts = 0;
    user.otpResendCount = user.otpLastSentAt ? user.otpResendCount + 1 : 1;
    user.otpLastSentAt = new Date();

    await user.save();

    // Send OTP via email
    try {
      await emailService.sendOtp(email, otp);
    } catch (error) {
      // Rollback OTP data if email fails
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to send OTP. Please try again later"
      );
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "OTP sent successfully to your email",
      data: {
        userId: user._id,
        expiresIn: OTP_EXPIRY / 1000, // in seconds
        remainingResends: MAX_RESENDS - user.otpResendCount,
      },
    });
  }),
};

/**
 * Verify OTP and login
 * @route POST /api/auth/login/verify-otp
 * @access Public
 */
exports.loginVerifyOtp = {
  validation: {
    body: Joi.object({
      userId: Joi.string().required().messages({
        "any.required": "User ID is required",
      }),
      otp: Joi.string().length(6).required().messages({
        "string.length": "OTP must be 6 digits",
        "any.required": "OTP is required",
      }),
    }),
  },

  handler: catchAsync(async (req, res) => {
    const { userId, otp } = req.body;

    // Find user
    const user = await FrontUser.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpires) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "No OTP found. Please request a new OTP"
      );
    }

    // Check attempt limit
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      // Clear OTP data
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        "Too many incorrect attempts. Please request a new OTP"
      );
    }

    // Check if OTP is expired
    if (user.otpExpires < Date.now()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "OTP has expired. Please request a new OTP"
      );
    }

    // Verify OTP
    const hashedInputOtp = hashOtp(otp);
    if (user.otp !== hashedInputOtp) {
      user.otpAttempts += 1;
      await user.save();

      const remainingAttempts = MAX_ATTEMPTS - user.otpAttempts;
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining`
      );
    }

    // OTP verified successfully - Clear OTP data and mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    user.otpResendCount = 0;
    user.otpLastSentAt = undefined;
    user.lastLoginAt = new Date();

    await user.save();

    // Generate authentication tokens
    const tokens = await tokenService.generateAuthTokens(user);

    // Log the login activity
    try {
      await LoginLog.create({
        userId: user._id,
        email: user.email,
        loginAt: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
    } catch (error) {
      // Log error but don't fail the login
      console.error("Failed to create login log:", error);
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        tokens: {
          access: tokens.access,
          refresh: tokens.refresh,
        },
      },
    });
  }),
};

/**
 * Resend OTP
 * @route POST /api/auth/login/resend-otp
 * @access Public
 */
exports.resendOtp = {
  validation: {
    body: Joi.object({
      userId: Joi.string().required().messages({
        "any.required": "User ID is required",
      }),
    }),
  },

  handler: catchAsync(async (req, res) => {
    const { userId } = req.body;

    const user = await FrontUser.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check resend limit
    if (user.otpResendCount >= MAX_RESENDS) {
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        "Maximum OTP resend limit reached. Please try again later"
      );
    }

    // Check cooldown
    // if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < OTP_COOLDOWN) {
    //   const remainingTime = Math.ceil(
    //     (OTP_COOLDOWN - (Date.now() - user.otpLastSentAt)) / 1000
    //   );
    //   throw new ApiError(
    //     httpStatus.TOO_MANY_REQUESTS,
    //     `Please wait ${remainingTime} seconds before requesting a new OTP`
    //   );
    // }

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY);
    user.otpAttempts = 0;
    user.otpResendCount += 1;
    user.otpLastSentAt = new Date();

    await user.save();

    // Send OTP
    await emailService.sendOtp(user.email, otp);

    res.status(httpStatus.OK).json({
      success: true,
      message: "OTP resent successfully",
      data: {
        expiresIn: OTP_EXPIRY / 1000,
        remainingResends: MAX_RESENDS - user.otpResendCount,
      },
    });
  }),
};

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = {
  handler: catchAsync(async (req, res) => {
    // Invalidate refresh token if using token blacklist
    if (req.body.refreshToken) {
      await tokenService.removeToken(req.body.refreshToken);
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  }),
};

/**
 * Refresh authentication tokens
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = {
  validation: {
    body: Joi.object({
      refreshToken: Joi.string().required().messages({
        "any.required": "Refresh token is required",
      }),
    }),
  },

  handler: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    const tokens = await tokenService.refreshAuthTokens(refreshToken);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        tokens,
      },
    });
  }),
};