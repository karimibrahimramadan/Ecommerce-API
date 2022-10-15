const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

// @desc    Update logged in user's profile
// @route   PATCH /api/v1/users/me/update
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Upload logged in user's profile picture
// @route   PATCH /api/v1/users/me/profile/upload
// @access  Private
const uploadProfilePic = async (req, res, next) => {
  try {
    if (req.fileErr) {
      return next(new AppError("Invalid image format"));
    }
    const imageURL = `${req.finalDestination}/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { photo: imageURL } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Profile picture uploaded",
      data: user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get logged in user's profile
// @route   GET /api/v1/users/me/profile
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "Success",
      message: "Profile",
      data: user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete logged in user's profile
// @route   PATCH /api/v1/users/me/delete
// @access  Private
const deleteMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { active: false } },
      { new: true }
    );
    if (user.role === "Seller") {
      const deletedProducts = await Product.deleteMany({ seller: user._id });
    }
    const deletedReviews = await Review.deleteMany({ user: req.user.id });
    res.status(200).json({
      status: "Success",
      message: "Profile deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get user
// @route   GET /api/v1/users/admin/find/:userId
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all users
// @route   GET /api/v1/users/admin/find
// @access  Private
const getAllUsers = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(User.find(), req.query)
      .search()
      .sort()
      .filter()
      .limitFields()
      .pagination(resultsPerPage);
    const users = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Update user
// @route   PATCH /api/v1/users/admin/find/:userId
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.parmas.userId,
      { $set: req.body },
      { new: trues }
    );
    res.status(200).json({
      status: "Success",
      message: "User updated",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/admin/delete/:userId
// @access  Private
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const updatedUser = await User.findByIdAndDelete(req.parmas.userId);
    if (user.role === "Seller") {
      const deletedProducts = await Product.deleteMany({ seller: user._id });
    }
    const deletedReviews = await Review.deleteMany({ user: req.params.userId });
    res.status(200).json({
      status: "Success",
      message: "User deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  updateMe,
  uploadProfilePic,
  getMe,
  deleteMe,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
