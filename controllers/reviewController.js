const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

// @desc    Create new review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Review added",
      data: savedReview,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Update review
// @route   PATCH /api/v1/products/:productId/reviews/:reviewId
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Review updated",
      data: updatedReview,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/products/:productId/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    const updatedReview = await Review.findByIdAndDelete(req.params.reviewId);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { reviews: review._id } },
      { new: true }
    );
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $pull: { reviews: review._id } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Review updated",
      data: updatedReview,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get review
// @route   GET /api/v1/products/:productId/reviews/:reviewId
// @access  Public
const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate({
      path: "user",
      select: "name photo",
    });
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: review,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all reviews on a product
// @route   GET /api/v1/products/:productId/reviews/
// @access  Public
const getAllReviews = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(
      Review.find({ product: req.params.productId }).populate({
        path: "user",
        select: "name photo",
      }),
      req.query
    )
      .search()
      .sort()
      .limitFields()
      .filter()
      .pagination(resultsPerPage);
    const reviews = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: reviews,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getAllReviews,
};
