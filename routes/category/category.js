const router = require("express").Router();
const categoryController = require("../../controllers/categoryController");
const { auth, roles } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./categoryValidation");
const subcategoryRouter = require("../subCategory/subCategory");

// Route ==> /api/v1/categories/:categoryId/subcategories
router.use("/:categoryId/subcategories", subcategoryRouter);

// Create new category
router.post(
  "/",
  validation(validators.createCategoryValidation),
  auth(roles.admin),
  categoryController.createCategory
);

// Update category
router.patch(
  "/:categoryId",
  validation(validators.updateCategoryValidation),
  auth(roles.admin),
  categoryController.updateCategory
);

// Delete category
router.delete(
  "/:categoryId",
  auth(roles.admin),
  categoryController.deleteCategory
);

// Get category
router.get("/:categoryId", categoryController.getCategory);

// Get all categories
router.get("/", categoryController.getAllCategories);

module.exports = router;
