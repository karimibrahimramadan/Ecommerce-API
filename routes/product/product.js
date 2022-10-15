const router = require("express").Router({ mergeParams: true });
const productController = require("../../controllers/productController");
const { auth, roles } = require("../../middlewares/auth");
const multerErrorHandler = require("../../middlewares/multerErrorHandler");
const validation = require("../../middlewares/validation");
const validators = require("./productValidation");
const { upload, fileValidation } = require("../../utils/multer");
const reviewRouter = require("../review/review");

router.use("/:productId/reviews", reviewRouter);

// Create new product
router.post(
  "/",
  validation(validators.createProductValidation),
  auth([roles.admin, roles.seller]),
  productController.createProduct
);

// Update product
router.patch(
  "/:productId",
  validation(validators.updateProductValidation),
  auth([roles.admin, roles.seller]),
  productController.updateProduct
);

// Delete product
router.delete(
  "/:productId",
  auth([roles.admin, roles.seller]),
  productController.deleteProduct
);

// Get product
router.get("/:productId", productController.getProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Upload product's cover image
router.patch(
  "/:productId/upload/cover",
  upload("products/cover", fileValidation.image).single("image"),
  multerErrorHandler,
  auth(roles.admin),
  productController.uploadCoverImg
);

// Upload product's images
router.patch(
  "/:productId/upload/images",
  upload("products/images", fileValidation.image).array("image", 7),
  multerErrorHandler,
  auth(roles.admin),
  productController.uploadCoverImg
);

// Add product to whishlist
router.patch(
  "/:productId/add",
  auth(roles.user),
  productController.addToWhishlist
);

// Remove product from whishlist
router.patch(
  "/:productId/remove",
  auth(roles.user),
  productController.addToWhishlist
);

// Get random products
router.get("/random", productController.getRandomProducts);

// Add product to cart
router.patch("/:productId/cart", auth(roles.user), productController.addToCart);

// Remove product from cart
router.patch(
  "/:productId/cart/remove",
  auth(roles.user),
  productController.removeFromCart
);

module.exports = router;
