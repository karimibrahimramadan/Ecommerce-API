const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    req.body.paidAt = Date.now();
    req.body.user = req.user.id;
    req.body.totalAmount =
      req.body.itemsPrice + req.body.taxPrice + req.body.shippingPrice;
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Order created",
      data: savedOrder,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Update order
// @route   PATCH /api/v1/orders/:orderId
// @access  Private
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Order updated",
      data: updatedOrder,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete order
// @route   DELETE /api/v1/orders/:orderId
// @access  Private
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    const updatedUser = await User.findByIdAndUpdate(
      order.user._id,
      { $pull: { orders: order._id } },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Order deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get order
// @route   GET /api/v1/orders/:orderId
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    res.status(201).json({
      status: "Success",
      data: order,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders/
// @access  Private
const getAllOrders = async (req, res, next) => {
  try {
    let totalAmount = 0;
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(Order.find(), req.query)
      .filter()
      .limitFields()
      .search()
      .sort()
      .pagination(resultsPerPage);
    const orders = await apiFeatures.query;
    res.status(201).json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all orders of a user
// @route   GET /api/v1/orders/:userId
// @access  Private
const getAllUsersOrders = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(
      Order.find({ user: req.params.userId }),
      req.query
    )
      .filter()
      .limitFields()
      .search()
      .sort()
      .pagination(resultsPerPage);
    const orders = await apiFeatures.query;
    res.status(201).json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/v1/orders/me
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(
      Order.find({ user: req.user.id }),
      req.query
    )
      .search()
      .sort()
      .limitFields()
      .filter()
      .pagination(resultsPerPage);
    const orders = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Process order
// @route   PATCH /api/v1/orders/:orderId/process
// @access  Private
const processOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    if (order.orderStatus === "Delivered") {
      return next(new AppError("Order is already delivered", 400));
    }
    order.orderItems.forEach(async (item) => {
      const product = await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    });
    req.body.deliveredAt = Date.now();
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Order proccessed",
      data: updatedOrder,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getAllOrders,
  getAllUsersOrders,
  getMyOrders,
  processOrder,
};
