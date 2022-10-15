const User = require("../models/User");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// @desc    Register new user
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = savedUser.getEmailJwtToken();
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/confirm-email/${token}`;
    const message = `<p>Use this email to verify your email</p><br><a href='${url}'>Verify Email</a>`;
    sendEmail(savedUser.email, message, "Verify Email");
    res.status(201).json({
      status: "Success",
      message: "User created",
      data: savedUser,
      token,
    });
  } catch (error) {
    if (error.keyValue?.email) {
      return next(new AppError("Email already exists", 400));
    } else {
      return next(new AppError(error.message, 500));
    }
  }
};

// @desc    Confirm email
// @route   GET /api/v1/auth/confirm-email/:token
// @access  Private
const confirmEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    if (user.confirmEmail) {
      return next(new AppError("Email is already verified", 400));
    }
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: { confirmEmail: true } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Email verified",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return next(new AppError("Either email or password is incorrect", 400));
    }
    if (!user.confirmEmail) {
      return next(new AppError("Please verify your email first", 400));
    }
    const token = user.getJwtToken();
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: "Success",
      message: "Logged in successfully!",
      token,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Forgot password
// @route   PATCH /api/v1/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const resetToken = user.createResetPasswordToken();
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/resetpassword/${resetToken}`;
    const message = `<p>Use this link to reset your password</p><br><a href='${url}'>Reset Password</a>`;
    sendEmail(user.email, message, "Reset Password");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetExpires: Date.now() + 15 * 60 * 1000,
        },
      },
      { new: true }
    );
    console.log(resetToken);
    console.log(hashedToken);
    res.status(200).json({
      status: "Success",
      message: "Email has been sent",
      token: resetToken,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Reset password
// @route   PATCH /api/v1/auth/resetpassword/:token
// @access  Private
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() },
    }).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const match = await user.comparePassword(password);
    if (match) {
      return next(new AppError("Use new password", 400));
    }
    const hashedPassword = await user.hashPassword(password);
    const updatedUser = await User.findOneAndUpdate(
      {
        passwordResetToken: hashedToken,
        passwordResetExpire: { $gt: Date.now() },
      },
      {
        $set: {
          password: hashedPassword,
          passwordChangedAt: Date.now(),
          passwordResetExpire: undefined,
          passwordResetToken: "",
        },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Password has been updated",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Update logged in user's password
// @route   PATCH /api/v1/auth/me/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const match = await user.comparePassword(password);
    if (!match) {
      return next(new AppError("Current password is incorrect", 401));
    }
    const isMatch = await user.comparePassword(newPassword);
    if (isMatch) {
      return next(new AppError("Use new password", 400));
    }
    const hashedPassword = await user.hashPassword(newPassword);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { password: hashedPassword, passwordChangedAt: Date.now() } },
      { new: true }
    );
    const token = user.getJwtToken();
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: "Success",
      message: "Password updated",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return next(new AppError(error.message, 500));
  }
};

// @desc    Logged out user
// @route   GET /api/v1/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res
      .cookie("access_token", "LoggedOut", { httpOnly: true })
      .status(200)
      .json({
        status: "Success",
        message: "Logged out",
      });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
module.exports = {
  signup,
  confirmEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
};
