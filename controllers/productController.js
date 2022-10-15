const Product = require("../models/Product");
const Review = require("../models/Review");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

// @desc    Create new product
// @route   POST /api/v1/products/ <==========> /api/v1/subcategories/:subcategoryId/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const subcategoryId = req.params.subcategoryId
      ? req.params.subcategoryId
      : req.body.subcategoryId;
    req.body.seller = req.user.id;
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      subcategoryId,
      { $push: { products: savedProduct } },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Product added",
      data: savedProduct,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Update existing product
// @route   PATCH /api/v1/products/:productId <==========> /api/v1/subcategories/:subcategoryId/products/:productId
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete existing product
// @route   DELETE  /api/v1/products/:productId <==========> /api/v1/subcategories/:subcategoryId/products/:productId
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const subcategoryId = req.params.subcategoryId
      ? req.params.subcategoryId
      : req.body.subcategoryId;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    const deletedReviews = await Review.deleteMany({ product: product._id });
    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      subcategoryId,
      { $pull: { products: product } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get product
// @route   GET /api/v1/products/:productId <==========> /api/v1/subcategories/:subcategoryId/products/:productId
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all products
// @route   GET /api/v1/products/ <==========> /api/v1/subcategories/:subcategoryId/products/
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .filter()
      .limitFields()
      .search()
      .sort()
      .pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all products by a seller
// @route   GET /api/v1/products/seller/:sellerId
// @access  Public
const getProductsBySeller = async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    const resultPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(
      Product.find({ seller: sellerId }),
      req.query
    )
      .search()
      .sort()
      .filter()
      .limitFields()
      .pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Upload product's cover image
// @route   PATCH /api/v1/products/:productId/upload/cover <=> /api/v1/subcategories/:subcategoryId/products/:productId/upload/cover
// @access  Private
const uploadCoverImg = async (req, res, next) => {
  try {
    if (req.fileErr) {
      return next(new AppError("Invalid image format"));
    }
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Prduct not found", 404));
    }
    const imageURL = `${req.finalDestination}/${req.file.filename}`;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { coverImage: imageURL } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Cover image uploaded",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Upload product's images
// @route   PATCH /api/v1/products/:productId/upload/images <==========> /api/v1/subcategories/:subcategoryId/products/:productId/upload/images
// @access  Private
const uploadProductsImages = async (req, res, next) => {
  try {
    if (req.fileErr) {
      return next(new AppError("Invalid image format"));
    }
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Prduct not found", 404));
    }
    let imagesURL = [];
    req.files.forEach((file) => {
      imagesURL.push(`${req.finalDestination}/${file.filename}`);
    });
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { images: imagesURL } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product images uploaded",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Add product to user's whishlist
// @route   PATCH /api/v1/products/:productId/add <=====> /api/v1/subcategories/:subcategoryId/products/:producId/add
// @access  Private
const addToWhishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { wishList: product._id } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product added to whishlist",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Remove product from user's whishlist
// @route   PATCH /api/v1/products/:productId/remove <=====> /api/v1/subcategories/:subcategoryId/products/:producId/remove
// @access  Private
const removeFromWhishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishList: product._id } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product removed to whishlist",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get random products
// @route   GET /api/v1/products/random <======> /api/v1/subcategories/:subcategoryId/products/random
// @access  Public
const getRandomProducts = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(
      Product.aggregate(Number(process.env.RANDOM_PRODUCTS_COUNT)),
      req.query
    ).pagination(resultsPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Add product to user's cart
// @route   PATCH /api/v1/products/:productId/cart <=====> /api/v1/subcategories/:subcategoryId/products/:producId/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { cart: product._id } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product added to whishlist",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Remove product from user's cart
// @route   PATCH /api/v1/products/:productId/cart/remove <=====> /api/v1/subcategories/:subcategoryId/products/:producId/cart/remove
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { cart: product._id } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product removed to whishlist",
      data: updatedUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  getProductsBySeller,
  uploadCoverImg,
  uploadProductsImages,
  addToWhishlist,
  removeFromWhishlist,
  getRandomProducts,
  addToCart,
  removeFromCart,
};
