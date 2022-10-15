const Category = require("../models/Category");
const AppError = require("../utils/appError");
const slugify = require("slugify");
const SubCategory = require("../models/SubCategory");
const APIFeatures = require("../utils/apiFeatures");
const Product = require("../models/Product");

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json({
      status: "Success",
      message: "Category created",
      data: savedCategory,
    });
  } catch (error) {
    console.log(error.message);
    if (error.keyValue?.name) {
      return next(new AppError("Category with this name already exists", 400));
    } else {
      return next(new AppError(error.message, 500));
    }
  }
};

// @desc    Update category
// @route   PATCH /api/v1/categories/:categoryId
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
    req.body.slug = slugify(req.body.name, { lower: true });
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Category updated",
      data: updatedCategory,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:categoryId
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    const subcategories = await SubCategory.deleteMany({
      category: category._id,
    });
    subcategories.forEach(async (subcategory) => {
      await Product.findOneAndDelete({ subCategory: subcategory._id });
    });
    res.status(200).json({
      status: "Success",
      message: "Category deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get category
// @route   GET /api/v1/categories/:categoryId
// @access  Private
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: category,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all categories
// @route   GET /api/v1/categories/
// @access  Private
const getAllCategories = async (req, res, next) => {
  try {
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE);
    const apiFeatures = new APIFeatures(Category.find(), req.query)
      .search()
      .sort()
      .filter()
      .limitFields()
      .pagination(resultsPerPage);
    const categories = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: categories,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
