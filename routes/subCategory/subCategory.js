const router = require("express").Router({ mergeParams: true });
const subcategoryController = require("../../controllers/subcategoryController");
const { auth, roles } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./subCategoryValidation");
const productRouter = require("../product/product");

// Route ==> /api/v1/subcategories/:subcategoryId/products
router.use("/:subcategoryId/products", productRouter);

// Create subcategory
router.post(
  "/",
  validation(validators.createSubcategoryValidation),
  auth(roles.admin),
  subcategoryController.createSubcategory
);

// Update subcategory
router.patch(
  "/:subcategoryId",
  validation(validators.updateSubcategoryValidation),
  auth(roles.admin),
  subcategoryController.updateSubcategory
);

// Delete subcategory
router.delete(
  "/:subcategoryId",
  auth(roles.admin),
  subcategoryController.deleteSubcategory
);

// Get subcategory
router.get(
  "/:subcategoryId",
  auth(roles.admin),
  subcategoryController.getSubcategory
);

// Get all subcategories
router.get("/", auth(roles.admin), subcategoryController.getAllSubcategories);

// Get all subcategories of category
router.get(
  "/find",
  auth(roles.admin),
  subcategoryController.getSubcategoriesOfCategory
);

module.exports = router;
