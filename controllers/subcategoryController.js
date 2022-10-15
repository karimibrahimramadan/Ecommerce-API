const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const slugify = require("slugify");
const Product = require("../models/Product");

// @desc    Create subcategory
// @route   POST /api/v1/categories/:categoryId/subcategories <====> /api/v1/categories/:categoryId/subcategories/
// @access  Private
const createSubcategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId
      ? req.params.categoryId
      : req.body.categoryId;
    req.body.category = categoryId;
    const newSubcategory = new SubCategory(req.body);
    const savedSubcategory = await newSubcategory.save();
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subCategories: savedSubcategory._id } },
      { new: true }
    );
    res.status(201).json({
      status: "Success",
      message: "Subcategory created",
      data: savedSubcategory,
    });
  } catch (error) {
    if (error.keyValue?.name) {
      return next(
        new AppError("Subcategory with this name already exists", 400)
      );
    } else {
      return next(new AppError(error.message, 500));
    }
  }
};

// @desc    Update subcategory
// @route   PATCH /api/v1/subcategories/:subcategoryId <====> /api/v1/categories/:categoryId/subcategories/:subcategoryId
// @access  Private
const updateSubcategory = async (req, res, next) => {
  try {
    const subcategory = await SubCategory.findById(req.params.subcategoryId);
    if (!subcategory) {
      return next(new AppError("Subcategory not found", 404));
    }
    req.body.slug = slugify(req.body.name, { lower: true });
    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      req.params.subcategoryId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Subcategory updated",
      data: updatedSubcategory,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Delete subcategory
// @route   DELETE /api/v1/subcategories/:subcategoryId <====> /api/v1/categories/:categoryId/subcategories/:subcategoryId
// @access  Private
const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await SubCategory.findById(req.params.subcategoryId);
    if (!subcategory) {
      return next(new AppError("Subcategory not found", 404));
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { $pull: { subCategories: subcategory._id } },
      { new: true }
    );
    const deletedProducts = await Product.deleteMany({
      subCategory: subcategory._id,
    });
    const deletedSubcategory = await SubCategory.findByIdAndDelete(
      req.params.subcategoryId
    );
    res.status(200).json({
      status: "Success",
      message: "Subcategory deleted",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get subcategory
// @route   GET /api/v1/subcategories/:subcategoryId <====> /api/v1/categories/:categoryId/subcategories/:subcategoryId
// @access  Private
const getSubcategory = async (req, res, next) => {
  try {
    const subcategory = await SubCategory.findById(req.params.subcategoryId);
    if (!subcategory) {
      return next(new AppError("Subcategory not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: subcategory,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all subcategories
// @route   GET /api/v1/subcategories/ <====> /api/v1/categories/:categoryId/subcategories/
// @access  Private
const getAllSubcategories = async (req, res, next) => {
  try {
    const apiFeatures = new APIFeatures(SubCategory.find(), req.query)
      .search()
      .sort()
      .limitFields()
      .filter();
    const subcategories = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      data: subcategories,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// @desc    Get all subcategories of a category
// @route   GET /api/v1/categories/:categoryId/subcategories/find
// @access  Private
const getSubcategoriesOfCategory = async (req, res, next) => {
  try {
    const subcategories = await SubCategory.find({
      category: req.params.categoryId,
    });
    res.status(200).json({
      status: "Success",
      data: subcategories,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategory,
  getAllSubcategories,
  getSubcategoriesOfCategory,
};
